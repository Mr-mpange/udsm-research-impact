// Test if Gemini API key is valid
const GEMINI_API_KEY = "AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA";

async function testGeminiKey() {
  console.log("🔑 Testing Gemini API Key with different models...\n");
  
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  
  for (const model of models) {
    console.log(`Testing model: ${model}`);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Say hello" }] }]
          }),
        }
      );

      console.log(`  Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`  ✅ SUCCESS! Response: ${text}\n`);
        return model;
      } else {
        const errorText = await response.text();
        console.log(`  ❌ Failed: ${JSON.parse(errorText).error.message}\n`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log("\n⚠️  None of the models worked. Your API key might be invalid.");
  console.log("Get a new key from: https://aistudio.google.com/app/apikey");
}

testGeminiKey();
