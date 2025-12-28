const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateClaimQuestions(itemName, description) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY missing, using default questions");
      return [
        "Where did you lose the item?",
        "What unique features does it have?",
        "When did you last see it?"
      ];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are verifying ownership of a lost item.
Item: ${itemName}
Description: ${description}

Generate 3 short verification questions.
Do NOT ask for phone number or email.
`;

    const result = await model.generateContent(prompt);

    // Ensure we have text
    const text = result?.response?.text?.() || "";

    // Split into lines and filter out empty strings
    const questions = text
      .split("\n")
      .map(q => q.trim())
      .filter(q => q);

    // Return either generated questions or fallback
    if (questions.length === 0) {
      return [
        "Where did you lose the item?",
        "What unique features does it have?",
        "When did you last see it?"
      ];
    }

    // Only return first 3 questions
    return questions.slice(0, 3);
  } catch (err) {
    console.error("Gemini generateClaimQuestions error:", err);
    return [
      "Where did you lose the item?",
      "What unique features does it have?",
      "When did you last see it?"
    ];
  }
}

module.exports = { generateClaimQuestions };
