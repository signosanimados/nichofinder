import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { UserAnswers, AnalysisResult } from "../types";

export const generateNicheAnalysis = async (answers: UserAnswers, apiKey?: string): Promise<AnalysisResult> => {
  const key = apiKey || process.env.API_KEY;

  if (!key) {
    throw new Error("API Key is missing. Please provide a valid Google Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const prompt = `
    {{idioma_saida}} = "pt-br"
    
    {{respostas_usuario}}
    Paixão/Interesses: ${answers.passion}
    Habilidades/Talentos: ${answers.skill}
    Mercado/Público: ${answers.market}
    Monetização Desejada: ${answers.monetization}
    
    Gere a análise completa seguindo estritamente o formato JSON solicitado nas instruções do sistema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idioma_saida: { type: Type.STRING },
            resumo_perfil: { type: Type.STRING },
            nichos_sugeridos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome_do_nicho: { type: Type.STRING },
                  descricao_do_nicho: { type: Type.STRING },
                  por_que_enquadra_no_perfil: { type: Type.STRING },
                  publico_alvo_detalhado: { type: Type.STRING },
                  tipo_de_conteudo: { type: Type.STRING },
                  dificuldade_de_crescimento: { type: Type.STRING, enum: ["baixa", "media", "alta"] },
                  potencial_de_monetizacao: { type: Type.STRING, enum: ["baixo", "medio", "alto"] },
                  ideias_de_video_iniciais: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  ideias_de_produtos_futuros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: [
                    "nome_do_nicho", "descricao_do_nicho", "por_que_enquadra_no_perfil",
                    "publico_alvo_detalhado", "tipo_de_conteudo", "dificuldade_de_crescimento",
                    "potencial_de_monetizacao", "ideias_de_video_iniciais", "ideias_de_produtos_futuros"
                ]
              }
            },
            nicho_nicho_finder_principal: {
              type: Type.OBJECT,
              properties: {
                nome_do_nicho: { type: Type.STRING },
                explicacao: { type: Type.STRING },
                plano_de_acao_7_dias: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["nome_do_nicho", "explicacao", "plano_de_acao_7_dias"]
            }
          },
          required: ["idioma_saida", "resumo_perfil", "nichos_sugeridos", "nicho_nicho_finder_principal"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};