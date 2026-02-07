// Test AI Chatbot on Cloud with Real Data
const SUPABASE_URL = "https://zuqothviduizwcbawigy.supabase.co";
const SUPABASE_KEY = "sb_publishable_H4PqdULAqjn-xS4QcFk6GA_VWl2wdS-";
const CHAT_URL = `${SUPABASE_URL}/functions/v1/research-advisor`;

async function testAIWithRealData() {
  console.log("🧪 Testing AI Chatbot with Real Data Integration\n");
  console.log("=" .repeat(70));
  
  const testQuestions = [
    {
      question: "Tell me about UDSM's research metrics",
      expectation: "Should use real database numbers or acknowledge limited data"
    },
    {
      question: "How many partner institutions does UDSM have?",
      expectation: "Should mention 8 partners from database"
    },
    {
      question: "What is H-Index?",
      expectation: "Should explain without making up UDSM-specific numbers"
    }
  ];

  for (let i = 0; i < testQuestions.length; i++) {
    const test = testQuestions[i];
    console.log(`\n📝 Test ${i + 1}/${testQuestions.length}`);
    console.log(`Question: "${test.question}"`);
    console.log(`Expected: ${test.expectation}`);
    console.log("-".repeat(70));

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: test.question }
          ]
        }),
      });

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ERROR: ${errorText}\n`);
        
        if (response.status === 404) {
          console.error("⚠️  Edge function not found or not deployed!");
          console.error("   Deploy it with: npx supabase functions deploy research-advisor\n");
        }
        continue;
      }

      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("text/plain")) {
        // Direct Gemini response
        const text = await response.text();
        console.log("\n✅ AI Response (Gemini Direct):");
        console.log("─".repeat(70));
        console.log(text);
        console.log("─".repeat(70));
        
        // Check for mock data
        if (text.includes("156,789") || text.includes("156789")) {
          console.log("\n⚠️  WARNING: Response contains mock data '156,789'");
        }
        if (text.includes("78.4")) {
          console.log("⚠️  WARNING: Response contains mock data '78.4'");
        }
        if (text.includes("Prof. Mwangi") || text.includes("Dr. Hassan")) {
          console.log("⚠️  WARNING: Response contains fake researcher names");
        }
        if (!text.includes("156,789") && !text.includes("78.4") && !text.includes("Prof. Mwangi")) {
          console.log("\n✅ GOOD: No mock data detected!");
        }
        
      } else if (contentType?.includes("text/event-stream")) {
        // Streaming response
        console.log("\n✅ AI Response (Streaming):");
        console.log("─".repeat(70));
        
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
        
        console.log("\n" + "─".repeat(70));
        
        // Check for mock data
        if (fullResponse.includes("156,789") || fullResponse.includes("156789")) {
          console.log("\n⚠️  WARNING: Response contains mock data '156,789'");
        }
        if (fullResponse.includes("78.4")) {
          console.log("⚠️  WARNING: Response contains mock data '78.4'");
        }
        if (fullResponse.includes("Prof. Mwangi") || fullResponse.includes("Dr. Hassan")) {
          console.log("⚠️  WARNING: Response contains fake researcher names");
        }
        if (!fullResponse.includes("156,789") && !fullResponse.includes("78.4") && !fullResponse.includes("Prof. Mwangi")) {
          console.log("\n✅ GOOD: No mock data detected!");
        }
      }
      
      console.log("\n");
      
    } catch (error) {
      console.error(`❌ ERROR: ${error.message}\n`);
    }
  }

  console.log("=" .repeat(70));
  console.log("\n🎉 Testing Complete!\n");
  console.log("Summary:");
  console.log("- If you see real database numbers → ✅ Working correctly");
  console.log("- If you see 'database is being populated' → ✅ Working correctly");
  console.log("- If you see '156,789' or 'Prof. Mwangi' → ❌ Still using mock data");
  console.log("\nIf still using mock data, the edge function needs to be redeployed.");
}

testAIWithRealData();
