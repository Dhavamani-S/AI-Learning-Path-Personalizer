const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTopicsForField = async (targetField, experience, masteryLevel) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite", // ✅ 1500 requests/day instead of 20
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0.3,
      }
    });

    const prompt = `Generate exactly 6 learning topics for "${targetField}" ordered from beginner to advanced as a JSON array.
Topic 1-2 must have "level":["Beginner"]
Topic 3-4 must have "level":["Intermediate"]  
Topic 5-6 must have "level":["Advanced"]
Each object must have exactly these fields:
{"field":"${targetField.toLowerCase()}","topic":"string","subtopics":["a","b","c","d"],"level":["Beginner"],"keywords":["${targetField.toLowerCase()}"],"weight":8,"duration":"2 hrs"}
Return ONLY the JSON array, nothing else. No explanation, no markdown.`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), 40000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);

    const text = result.response.text();
    console.log("Raw Gemini response:", text.substring(0, 300));

    let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const startIndex = clean.indexOf("[");
    const endIndex = clean.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON array found in response");
    }

    clean = clean.substring(startIndex, endIndex + 1);
    const topics = JSON.parse(clean);

    console.log(`✅ Gemini generated ${topics.length} topics for "${targetField}"`);
    return topics;

  } catch (error) {
    const msg = error.message || "";
    console.error("Gemini error:", msg.substring(0, 200));

    if (msg.includes("429")) {
      console.error("❌ Quota exceeded");
      throw new Error("QUOTA_EXCEEDED");
    }

    if (msg === "TIMEOUT") {
      console.error("❌ Gemini timeout");
      throw new Error("TIMEOUT");
    }

    throw new Error("GENERATION_FAILED");
  }
};

module.exports = { generateTopicsForField };