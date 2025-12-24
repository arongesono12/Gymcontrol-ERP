
// Mock Gemini Service - Replace with real implementation if API key available
import { GoogleGenerativeAI } from "@google/genai";
import { DashboardStats } from '../types';

export const getGymInsights = async (stats: DashboardStats, prompt: string): Promise<string> => {
  console.log("Generating insights for:", stats);
  // Simulated response for now
  return "El gimnasio muestra un crecimiento del 15% en membresías activas. Se recomienda promocionar planes trimestrales.";
};
