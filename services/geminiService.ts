
import { GoogleGenAI, Type } from "@google/genai";
import { DrugAnalysis, SafetyCheckResult } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a medicine image for authenticity and extracts details.
 */
export const analyzeMedicineImage = async (base64Image: string): Promise<DrugAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction: "You are Hygeia, a medical safety AI. Analyze this medicine package image for authenticity. Inspect typography, alignment, holographic elements (if visible), and packaging quality. Identify drug name, manufacturer, and ingredients. Be precise and conservative in your assessment.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          manufacturer: { type: Type.STRING },
          activeIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING }
              }
            }
          },
          drugFamily: { type: Type.STRING },
          authenticityStatus: { type: Type.STRING, description: "AUTHENTIC, COUNTERFEIT, or SUSPICIOUS" },
          confidenceScore: { type: Type.NUMBER, description: "Value between 0 and 1" },
          authenticityReasoning: { type: Type.STRING },
          sideEffects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                effect: { type: Type.STRING },
                severity: { type: Type.STRING }
              }
            }
          }
        },
        required: ["name", "manufacturer", "activeIngredients", "drugFamily", "authenticityStatus", "confidenceScore", "authenticityReasoning", "sideEffects"]
      }
    }
  });

  // Access the .text property directly
  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text);
};

// Aliases for compatibility with different pages
export const analyzeAuthenticity = analyzeMedicineImage;

/**
 * Checks for allergy conflicts between a drug and user's allergy profile.
 * Supports passing either a drug name string or a DrugAnalysis object.
 */
export const checkAllergySafety = async (drugOrName: any, userAllergies: string[]): Promise<SafetyCheckResult> => {
  const drugName = typeof drugOrName === 'string' ? drugOrName : (drugOrName as DrugAnalysis).name;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Drug to check: "${drugName}". User known allergies: [${userAllergies.join(", ")}].`,
    config: {
      systemInstruction: "You are Hygeia, a medical safety expert. Map the drug to its active ingredients and chemical family. Check for specific allergy conflicts or cross-reactivity with the user's profile. Determine safety status: SAFE, CAUTION (potential risk or limited data), or RISK (clear contraindication).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, description: "SAFE, CAUTION, or RISK" },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          drugDetails: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              family: { type: Type.STRING }
            }
          }
        },
        required: ["status", "warnings", "explanation", "drugDetails"]
      }
    }
  });

  // Access the .text property directly
  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text);
};

// Alias for compatibility
export const checkAllergyAndDrug = checkAllergySafety;
