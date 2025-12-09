import { GoogleGenAI, Type } from "@google/genai";
import { CreateTimerInput } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateTimerFromPrompt = async (prompt: string): Promise<CreateTimerInput> => {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a cooking timer for: "${prompt}". 
      Return a JSON object.
      IMPORTANT: Content must be in Simplified Chinese (简体中文).
      Structure:
      - 'name': Title.
      - 'phases': Array of steps.
      Each phase must include:
      - 'name': Instruction.
      - 'durationSeconds': Integer.
      - 'ingredients': List of ingredients needed specifically for this step (name, amount, unit).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  durationSeconds: { type: Type.INTEGER },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                       type: Type.OBJECT,
                       properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.NUMBER },
                          unit: { type: Type.STRING }
                       }
                    }
                  }
                },
                required: ["name", "durationSeconds"]
              }
            }
          },
          required: ["name", "phases"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as CreateTimerInput;
    return data;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};