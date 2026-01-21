const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read API key from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
        console.log("Available Models:");
        result.models.forEach((m) => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Error listing models:", error);

        // Try fallback with direct fetch if SDK listModels fails or is unsupported
        console.log("\nAttempting direct fetch of models list...");
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();
            if (data.models) {
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name} (Supports generateContent)`);
                    }
                });
            } else {
                console.log("No models returned:", data);
            }
        } catch (fetchError) {
            console.error("Direct fetch failed:", fetchError);
        }
    }
}

listModels();
