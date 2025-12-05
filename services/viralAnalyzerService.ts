import { GoogleGenAI, Type } from "@google/genai";
import { VIRAL_SYSTEM_INSTRUCTION } from "../constants";
import { ViralAnalysisInput, ViralAnalysisResult } from "../types";

const getPromptForInputType = (input: ViralAnalysisInput): string => {
  const typeDescriptions: Record<string, string> = {
    niche: `Analise o nicho "${input.value}" no YouTube.`,
    channel: `Analise o canal "${input.value}" e identifique os padrões de sucesso.`,
    keyword: `Analise a palavra-chave "${input.value}" e descubra oportunidades.`,
    trend: `Analise a tendência "${input.value}" que está surgindo.`,
    trending_now: `Analise o que está viralizando agora no YouTube globalmente e no Brasil.`,
  };

  return `
    {{idioma_saida}} = "${input.language}"

    ${typeDescriptions[input.type] || typeDescriptions.niche}

    ${input.type !== 'trending_now' ? `Termo/Assunto analisado: ${input.value}` : ''}

    Gere uma análise COMPLETA e PROFUNDA seguindo estritamente o formato JSON solicitado.

    LEMBRE-SE:
    1. Resumo Executivo: O que exatamente está acontecendo neste nicho/tendência?
    2. Oportunidades de Tendência: Liste 5-7 oportunidades explicando por que podem viralizar AGORA.
    3. Formatos que Funcionam: Liste os formatos com maior potencial (listas, histórias, POV, react, etc.)
    4. Padrões de Títulos: Identifique gatilhos psicológicos e gere 5 títulos prontos e virais.
    5. Padrões de Thumbnails: Cores, composição, expressões, elementos visuais.
    6. 10+ Ideias de Vídeos: Com título, descrição e por que funciona.
    7. Calendário de 7 dias: Tema, formato, título e objetivo para cada dia.
    8. Micro-nichos Promissores: Subnichos emergentes com potencial.
    9. Conclusão Estratégica: Caminho mais promissor, foco, formato para testar primeiro.
  `;
};

export const generateViralAnalysis = async (
  input: ViralAnalysisInput,
  apiKey?: string
): Promise<ViralAnalysisResult> => {
  const key = apiKey || process.env.API_KEY;

  if (!key) {
    throw new Error("API Key is missing. Please provide a valid Google Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const prompt = getPromptForInputType(input);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: VIRAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idioma_saida: { type: Type.STRING },
            resumo_executivo: { type: Type.STRING },
            oportunidades_tendencia: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  por_que_pode_viralizar: { type: Type.STRING },
                  urgencia: { type: Type.STRING, enum: ["alta", "media", "baixa"] }
                },
                required: ["titulo", "descricao", "por_que_pode_viralizar", "urgencia"]
              }
            },
            formatos_funcionando: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  potencial_no_nicho: { type: Type.STRING, enum: ["alto", "medio", "baixo"] },
                  exemplos: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["nome", "descricao", "potencial_no_nicho", "exemplos"]
              }
            },
            padroes_titulos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tipo_gatilho: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  exemplos: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["tipo_gatilho", "descricao", "exemplos"]
              }
            },
            titulos_virais_prontos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  por_que_funciona: { type: Type.STRING }
                },
                required: ["titulo", "por_que_funciona"]
              }
            },
            padroes_thumbnails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  elemento: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  dica_pratica: { type: Type.STRING }
                },
                required: ["elemento", "descricao", "dica_pratica"]
              }
            },
            ideias_videos_virais: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  descricao_curta: { type: Type.STRING },
                  por_que_funciona: { type: Type.STRING },
                  formato_sugerido: { type: Type.STRING }
                },
                required: ["titulo", "descricao_curta", "por_que_funciona", "formato_sugerido"]
              }
            },
            calendario_conteudo: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dia: { type: Type.NUMBER },
                  tema: { type: Type.STRING },
                  formato: { type: Type.STRING },
                  titulo_sugerido: { type: Type.STRING },
                  objetivo: { type: Type.STRING }
                },
                required: ["dia", "tema", "formato", "titulo_sugerido", "objetivo"]
              }
            },
            micro_nichos_promissores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  potencial_crescimento: { type: Type.STRING, enum: ["explosivo", "alto", "moderado"] },
                  competicao: { type: Type.STRING, enum: ["baixa", "media", "alta"] }
                },
                required: ["nome", "descricao", "potencial_crescimento", "competicao"]
              }
            },
            conclusao_estrategica: {
              type: Type.OBJECT,
              properties: {
                caminho_mais_promissor: { type: Type.STRING },
                onde_focar: { type: Type.STRING },
                formato_para_testar_primeiro: { type: Type.STRING },
                proximos_passos: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["caminho_mais_promissor", "onde_focar", "formato_para_testar_primeiro", "proximos_passos"]
            }
          },
          required: [
            "idioma_saida",
            "resumo_executivo",
            "oportunidades_tendencia",
            "formatos_funcionando",
            "padroes_titulos",
            "titulos_virais_prontos",
            "padroes_thumbnails",
            "ideias_videos_virais",
            "calendario_conteudo",
            "micro_nichos_promissores",
            "conclusao_estrategica"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ViralAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
