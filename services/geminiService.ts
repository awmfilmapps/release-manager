
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLegalSummary = async (legalText: string) => {
  if (!navigator.onLine) {
    return "Offline: Legal summary unavailable. Please connect to the internet to use AI features.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following model release legal text into simple, easy-to-understand bullet points for a model to read before signing. Focus on what rights they are giving away and what they get in return. Keep it friendly but accurate. \n\nLegal Text: ${legalText}`,
      config: {
        systemInstruction: "You are a legal assistant specializing in photography and creative media contracts."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate summary at this time.";
  }
};
