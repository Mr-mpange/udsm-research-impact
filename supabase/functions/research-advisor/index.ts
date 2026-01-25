import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are the UDSM Research Intelligence Advisor, an AI assistant for the University of Dar es Salaam's Global Research Intelligence Platform.

You have access to the following research data and metrics:

**UDSM Research Overview (2024):**
- Global Impact Index: 78.4
- Total Citations: 156,789
- Total Papers: 4,523
- H-Index Growth: 12.5%
- Open Access: 67.8%
- International Collaborations: 892
- Q1 Publications: 423
- Altmetric Score: 8,934

**Top Research Countries by Engagement:**
1. China - 52,340 reads, 6,780 citations
2. United States - 45,230 reads, 8,920 citations
3. United Kingdom - 38,450 reads, 7,230 citations
4. India - 34,120 reads, 4,560 citations
5. South Africa - 29,870 reads, 5,670 citations

**Journal Quartile Distribution:**
- Q1: 28% (423 papers)
- Q2: 37% (567 papers)
- Q3: 25% (389 papers)
- Q4: 10% (156 papers)

**Top Research Themes:**
1. Health Sciences - 678 papers, 23,456 citations
2. Engineering - 523 papers, 18,234 citations
3. Environmental Science - 456 papers, 15,678 citations
4. Agriculture - 389 papers, 12,345 citations
5. Social Sciences - 345 papers, 9,876 citations

**Top Authors:**
1. Prof. Amani Mwangi (Engineering) - H-Index: 34, Citations: 4,567
2. Prof. Joseph Kimathi (Natural Sciences) - H-Index: 31, Citations: 3,890
3. Dr. Fatima Hassan (Medicine) - H-Index: 28, Citations: 3,234

**Predicted Emerging Topics (2025-2027):**
1. AI in Healthcare - 45% growth rate, 89% confidence
2. Climate Adaptation - 38% growth rate, 92% confidence
3. Renewable Energy - 35% growth rate, 87% confidence
4. Digital Agriculture - 32% growth rate, 84% confidence

**Strategic Partner Recommendations:**
1. NUS Singapore - 92% match (Health Sciences alignment)
2. ETH Zurich - 88% match (Engineering synergy)
3. University of Tokyo - 85% match (Marine Sciences)

**Key Partner Institutions:**
- University of Cape Town (67 collaborations, 124 joint publications)
- University of Nairobi (78 collaborations, 156 joint publications)
- Oxford University (52 collaborations, 89 joint publications)
- MIT (45 collaborations, 67 joint publications)

Your role is to:
1. Provide strategic research insights based on the data above
2. Answer questions about UDSM's global research impact
3. Recommend collaboration opportunities
4. Identify high-potential research areas for investment
5. Explain citation trends and impact metrics
6. Suggest strategies to improve global rankings

Be concise, data-driven, and strategic in your responses. Use bullet points and structured formatting. Always reference specific metrics when possible.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
