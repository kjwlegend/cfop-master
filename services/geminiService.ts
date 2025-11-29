import { GoogleGenAI } from "@google/genai";
import { Algorithm } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAICoachingTip = async (algo: Algorithm) => {
  try {
    const prompt = `
      You are a world-class speedcubing coach.
      Analyze the following Rubik's Cube algorithm:
      
      Name: ${algo.name}
      Category: ${algo.category}
      Notation: ${algo.notation}
      
      Provide a short, punchy response (max 100 words) formatted in Markdown covering:
      1. **Finger Tricks**: How to execute it smoothly (e.g., "Use left index for U'").
      2. **Recognition**: How to spot this case quickly.
      3. **Mnemonic/Tip**: A quick way to remember it.
      
      Keep it practical for a speedcuber.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not fetch AI coaching tips at this time. Please check your API key.";
  }
};
