// Test script for AI Chatbot with Gemini API
const SUPABASE_URL = "https://jyxoltkvmtyfbfysbknb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5eG9sdGt2bXR5ZmJmeXNia25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTYzNzEsImV4cCI6MjA4NDkzMjM3MX0.DwGUUMDCDrjXNbsPrLllWn1TSu1u9oa8Bzvb0UY6ZRo";
const CHAT_URL = `${SUPABASE_URL}/functions/v1/research-advisor`;

async function testAIChatbot() {
  console.log("🤖 Testing AI Chatbot with Gemini API...\n");
  
  const testMessage = {
    messages: [
      {
        role: "user",
        content: "What is H-Index and why is it important?"
      }
    ]
  };

  try {
    console.log("📤 Sending test message:", testMessage.messages[0].content);
    console.log("🔗 Endpoint:", CHAT_URL);
    console.log("\n⏳ Waiting for response...\n");

    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(testMessage),
    });

    console.log("📊 Response Status:", response.status, response.statusText);
    console.log("📋 Response Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("\n❌ ERROR Response:", errorText);
      
      if (response.status === 429) {
        console.error("\n⚠️  Rate limit exceeded. Please try again later.");
      } else if (response.status === 402) {
        console.error("\n⚠️  AI credits exhausted. Please add credits to continue.");
      } else if (response.status === 500) {
        console.error("\n⚠️  Server error. Check if GEMINI_API_KEY is set in Supabase secrets.");
      }
      return;
    }

    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("text/plain")) {
      // Direct Gemini response (non-streaming)
      const text = await response.text();
      console.log("\n✅ SUCCESS! AI Response (Gemini Direct):\n");
      console.log("─".repeat(60));
      console.log(text);
      console.log("─".repeat(60));
      console.log("\n🎉 Gemini AI is working correctly!");
    } else if (contentType?.includes("text/event-stream")) {
      // Streaming response (Lovable Gateway)
      console.log("\n✅ SUCCESS! Streaming response received (Lovable Gateway):\n");
      console.log("─".repeat(60));
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                process.stdout.write(content);
                fullResponse += content;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      
      console.log("\n" + "─".repeat(60));
      console.log("\n🎉 AI Chatbot is working correctly!");
    } else {
      const text = await response.text();
      console.log("\n⚠️  Unexpected content type:", contentType);
      console.log("Response:", text);
    }

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\n🔍 Troubleshooting:");
    console.error("1. Check if the edge function is deployed: supabase functions deploy research-advisor");
    console.error("2. Verify GEMINI_API_KEY is set: supabase secrets list");
    console.error("3. Check Supabase logs: supabase functions logs research-advisor");
  }
}

// Run the test
testAIChatbot();
