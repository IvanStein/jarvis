// tmp/list-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct "listModels" in the basic SDK, 
        // but we can try common ones.
        console.log("Key starts with:", process.env.GEMINI_API_KEY.substring(0, 5));
        
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`Model ${m} works!`);
                return;
            } catch (err) {
                console.log(`Model ${m} failed:`, err.status || err.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

list();
