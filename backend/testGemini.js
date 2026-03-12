require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello in one word");
    console.log("✅ API works! Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error.message.substring(0, 300));
  }
}

test();