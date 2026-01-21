const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

async function list() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const names = data.models ? data.models.map(m => m.name) : ['ERROR: ' + JSON.stringify(data)];
        fs.writeFileSync('models_names.txt', names.join('\n'));
    } catch (e) {
        fs.writeFileSync('models_names.txt', 'FETCH ERROR: ' + e.message);
    }
}
list();
