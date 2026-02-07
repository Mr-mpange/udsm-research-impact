// List available Gemini models with your API key
const GEMINI_API_KEY = "AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA";

async function listModels() {
  console.log("🔍 Checking available Gemini models with your API key...\n");
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ERROR: ${errorText}`);
      console.error("\n⚠️  Your API key might be invalid or restricted.");
      console.error("Get a new key from: https://aistudio.google.com/app/apikey");
      return;
    }

    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.log("❌ No models available with this API key.");
      console.log("\n⚠️  Your API key might be restricted or invalid.");
      console.log("Get a new key from: https://aistudio.google.com/app/apikey");
      return;
    }

    console.log(`✅ Found ${data.models.length} available models:\n`);
    
    data.models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Supported: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log();
    });
    
    console.log("\n💡 Recommended model to use:");
    const flashModel = data.models.find(m => m.name.includes('flash'));
    if (flashModel) {
      console.log(`   ${flashModel.name}`);
    } else {
      console.log(`   ${data.models[0].name}`);
    }
    
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
  }
}

listModels();
