// tmp/minimal.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function run() {
    console.log("Key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent("Say hi");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Error Status:", e.status);
        console.error("Error Message:", e.message);
        if (e.response) {
            console.error("Error Response Data:", await e.response.text());
        }
    }
}
run();
