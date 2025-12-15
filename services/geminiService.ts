import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlan, MeasurementUnit } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

// Schema for structured output
const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the exercise" },
    sets: { type: Type.INTEGER, description: "Number of sets" },
    reps: { type: Type.INTEGER, description: "Number of repetitions per set" },
    weight: { type: Type.NUMBER, description: "Recommended starting weight" },
    tutorialUrl: { type: Type.STRING, description: "A placeholder URL for an image (use https://picsum.photos/200/200) or a YouTube search query link." },
    notes: { type: Type.STRING, description: "Short tip on form" }
  },
  required: ["name", "sets", "reps", "weight"]
};

const planSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A cool, 80s action movie style name for the workout plan" },
    description: { type: Type.STRING, description: "A short, hype-filled description" },
    exercises: {
      type: Type.ARRAY,
      items: exerciseSchema
    }
  },
  required: ["name", "description", "exercises"]
};

export const generateWorkoutPlan = async (focus: string, difficulty: string): Promise<WorkoutPlan | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Create a workout plan focusing on ${focus}. Difficulty level: ${difficulty}. 
    Make the plan name and description sound like it's from an 80s action movie or aerobics video.
    For tutorialUrl, please provide a valid https://picsum.photos/200/300 url with a random seed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    // Map to our internal type and add IDs
    const plan: WorkoutPlan = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: Date.now(),
      exercises: data.exercises.map((ex: any) => ({
        ...ex,
        id: uuidv4(),
        unit: MeasurementUnit.KG // Defaulting to KG for generated plans
      }))
    };

    return plan;

  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};
