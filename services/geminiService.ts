
import { GoogleGenAI, Type } from "@google/genai";
import { Member, Payment, DashboardStats } from "../types";

export const getGymInsights = async (stats: DashboardStats, query: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Eres un asistente experto en gestión de gimnasios. 
    Analizas los datos financieros y de membresía para dar recomendaciones estratégicas.
    Datos actuales:
    - Miembros totales: ${stats.totalMembers}
    - Miembros activos: ${stats.activeMembers}
    - Ingresos Mensuales: ${stats.monthlyRevenue} XAF
    - Ingresos Diarios (hoy): ${stats.dailyRevenue} XAF
    
    Responde de forma concisa y profesional en español, refiriéndote siempre a la moneda XAF.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Access .text property directly as it's a getter
    return response.text || "No pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con el asistente inteligente.";
  }
};
