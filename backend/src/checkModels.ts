import dotenv from "dotenv";

dotenv.config();

async function checkAvailableGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is not set in backend .env");
    process.exit(1);
  }

  console.log("🔍 Querying Google Gemini API for available models with your API key...\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ API returned status ${response.status}:`, errText);
      return;
    }

    const data = (await response.json()) as any;
    if (data.models && Array.isArray(data.models)) {
      console.log(`✅ Found ${data.models.length} accessible models for your API key:\n`);
      const generateModels = data.models
        .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m: any) => m.name.replace("models/", ""));

      console.log("--- Supported generateContent Models ---");
      generateModels.forEach((m: string) => console.log(` - ${m}`));
    } else {
      console.log("Response:", data);
    }
  } catch (err: any) {
    console.error("❌ Failed to query models:", err.message);
  }
}

checkAvailableGeminiModels();
