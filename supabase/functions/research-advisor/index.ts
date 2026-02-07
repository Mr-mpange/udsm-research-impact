// Supabase Edge Function - Runs in Deno runtime
// Note: IDE may show errors for Deno imports - this is normal
// The code works correctly when deployed to Supabase Edge Functions
// @ts-ignore - Deno runtime types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - Deno runtime types
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
// @ts-ignore - Deno runtime types
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fetch real data from database
async function fetchRealData(supabaseClient: any) {
  try {
    // Fetch publications count and stats
    const { data: publications, error: pubError } = await supabaseClient
      .from('researcher_publications')
      .select('*');
    
    // Fetch partner institutions
    const { data: partners, error: partnerError } = await supabaseClient
      .from('partner_institutions')
      .select('*, collaboration_partnerships(*)');
    
    // Fetch user profiles count
    const { count: userCount } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Calculate real metrics
    const totalPublications = publications?.length || 0;
    const totalCitations = publications?.reduce((sum: number, pub: any) => sum + (pub.citations || 0), 0) || 0;
    const avgCitations = totalPublications > 0 ? Math.round(totalCitations / totalPublications) : 0;
    const totalPartners = partners?.length || 0;
    const activeResearchers = userCount || 0;
    
    return {
      totalPublications,
      totalCitations,
      avgCitations,
      totalPartners,
      activeResearchers,
      topPartners: partners?.slice(0, 5).map((p: any) => p.name) || [],
      hasData: totalPublications > 0 || totalPartners > 0
    };
  } catch (error) {
    console.error('Error fetching real data:', error);
    return { hasData: false };
  }
}

function buildSystemPrompt(realData: any) {
  const basePrompt = `You are a helpful research advisor AI assistant for the University of Dar es Salaam (UDSM). Your role is to help researchers understand and improve their academic work.

Guidelines:
- Be conversational and friendly, like talking to a colleague
- Keep responses concise (2-3 paragraphs max)
- Use simple language, avoid jargon unless necessary
- Focus on being helpful and encouraging
- IMPORTANT: Use ONLY the real data provided below. DO NOT make up statistics or numbers.`;

  if (realData.hasData) {
    return `${basePrompt}

REAL UDSM DATA (Use this information when relevant):
- Total Publications in Database: ${realData.totalPublications}
- Total Citations: ${realData.totalCitations}
- Average Citations per Paper: ${realData.avgCitations}
- Active Researchers: ${realData.activeResearchers}
- Partner Institutions: ${realData.totalPartners}
- Top Partners: ${realData.topPartners.join(', ')}

When users ask about UDSM metrics, use ONLY these real numbers. If you don't have specific data, acknowledge it and offer general advice instead of making up numbers.

You can help with:
- Explaining research metrics (H-Index, citations, impact factor)
- Suggesting strategies to improve research visibility
- Understanding publication trends
- General academic career advice
- Research best practices

Respond naturally as if you're having a conversation with a researcher colleague.`;
  } else {
    return `${basePrompt}

NOTE: The database currently has limited data. When discussing UDSM-specific metrics, acknowledge that the system is being populated and offer general research advice instead of specific numbers.

You can help with:
- Explaining research metrics (H-Index, citations, impact factor)
- Suggesting strategies to improve research visibility
- Understanding publication trends
- General academic career advice
- Research best practices

Respond naturally as if you're having a conversation with a researcher colleague.`;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Initialize Supabase client to fetch real data
    // @ts-ignore - Deno runtime environment variable
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    // @ts-ignore - Deno runtime environment variable
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabaseClient = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Fetch real data from database
    const realData = await fetchRealData(supabaseClient);
    
    // Build system prompt with real data
    const systemPrompt = buildSystemPrompt(realData);
    
    // Try Gemini first, fallback to Lovable
    // @ts-ignore - Deno runtime environment variable
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    // @ts-ignore - Deno runtime environment variable
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!GEMINI_API_KEY && !LOVABLE_API_KEY) {
      throw new Error("No API key configured. Please set GEMINI_API_KEY or LOVABLE_API_KEY");
    }

    let response;

    if (GEMINI_API_KEY) {
      // Use Google Gemini API with streaming
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Build conversation history
      let conversationText = systemPrompt + "\n\n";
      
      messages.forEach((msg: any) => {
        if (msg.role === "user") {
          conversationText += `User: ${msg.content}\n\n`;
        } else if (msg.role === "assistant") {
          conversationText += `Assistant: ${msg.content}\n\n`;
        }
      });
      
      conversationText += "Assistant:";

      try {
        const result = await model.generateContent(conversationText);
        const text = result.response.text();
        
        // Convert to SSE format for streaming
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // Send the response as chunks to simulate streaming
            const words = text.split(' ');
            let currentChunk = '';
            
            for (let i = 0; i < words.length; i++) {
              currentChunk += (i > 0 ? ' ' : '') + words[i];
              
              // Send chunk every few words
              if (i % 3 === 0 || i === words.length - 1) {
                const sseData = `data: ${JSON.stringify({
                  choices: [{
                    delta: { content: currentChunk }
                  }]
                })}\n\n`;
                controller.enqueue(encoder.encode(sseData));
                currentChunk = '';
              }
            }
            
            // Send done signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      } catch (error: any) {
        console.error("Gemini API error:", error);
        throw new Error(`Gemini API error: ${error.message}`);
      }
    } else {
      // Use Lovable Gateway
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Research advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
