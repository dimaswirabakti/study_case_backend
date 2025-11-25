import { GoogleGenAI } from "@google/genai";
import { CreateMenuInput } from "../schemas/menuSchema";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

type MenuForAnalysis = Pick<CreateMenuInput, "name" | "category" | "price">;

export const generateMenuInsights = async (menus: MenuForAnalysis[]) => {
  if (!apiKey) return "Fitur AI tidak aktif (API Key missing).";
  if (menus.length === 0) {
    return "Data menu kosong, tidak ada yang bisa dianalisis.";
  }
  try {
    const dataSummary = menus.map((menu) => ({
      name: menu.name,
      category: menu.category,
      price: menu.price,
    }));

    const prompt = `
      Bertindaklah sebagai Data Analyst Restoran profesional.
      Analisis data menu berikut (JSON): ${JSON.stringify(dataSummary)}

      Berikan "Menu Insights" dalam satu paragraf singkat (Bahasa Indonesia) yang mencakup:
      1. Dominasi kategori.
      2. Rentang harga.
      3. Rekomendasi strategi promosi.
      
      Langsung ke inti analisis tanpa bertele-tele.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text || "Tidak ada output dari Gemini AI.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Analisis AI sedang tidak tersedia (Error Provider).";
  }
};
