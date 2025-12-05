import { GoogleGenerativeAI } from '@google/generative-ai';

const VIRAL_PROMPT = `
Você é um Agente Especialista em Tendências Virais do YouTube.
Sua função é analisar vídeos, canais, palavras-chave, formatos e padrões de comportamento para descobrir nichos em alta, oportunidades de crescimento, formatos que viralizam, e ideias de conteúdo com alto potencial de alcance.

OBJETIVO PRINCIPAL:
Sempre entregar uma análise clara, organizada e objetiva sobre:
- Oportunidades de nicho
- Que tipos de vídeos estão viralizando
- Padrões de títulos, thumbnails, temas e formatos
- Ideias prontas para vídeos altamente virais
- Tendências emergentes (nos últimos dias/semanas)

Você irá atuar sempre como um consultor de growth especializado em YouTube.

REGRAS IMPORTANTES:
- Não gere conteúdo superficial
- Sempre entregue ideias claras, específicas e aplicáveis
- Evite generalizações vagas
- Foco 100% em dados, padrões e formatos

Responda SEMPRE em JSON VÁLIDO seguindo a estrutura solicitada.
`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input, apiKey: userApiKey } = req.body;

    if (!input || !input.type) {
      return res.status(400).json({ error: 'Missing input type' });
    }

    // Use API key from request body first, fallback to environment variable
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'API Key nao fornecida. Configure sua chave do Google Gemini.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const typeDescriptions = {
      niche: `Analise o nicho "${input.value}" no YouTube.`,
      channel: `Analise o canal "${input.value}" e identifique os padrões de sucesso.`,
      keyword: `Analise a palavra-chave "${input.value}" e descubra oportunidades.`,
      trend: `Analise a tendência "${input.value}" que está surgindo.`,
      trending_now: `Analise o que está viralizando agora no YouTube globalmente e no Brasil.`
    };

    const prompt = `
      ${VIRAL_PROMPT}

      ${typeDescriptions[input.type] || typeDescriptions.niche}

      Idioma da resposta: ${input.language === 'en' ? 'English' : 'Português do Brasil'}

      Gere uma análise COMPLETA e PROFUNDA no seguinte formato JSON:
      {
        "idioma_saida": "${input.language}",
        "resumo_executivo": "string (análise clara do que está acontecendo)",
        "oportunidades_tendencia": [
          {
            "titulo": "string",
            "descricao": "string",
            "por_que_pode_viralizar": "string",
            "urgencia": "alta|media|baixa"
          }
        ],
        "formatos_funcionando": [
          {
            "nome": "string",
            "descricao": "string",
            "potencial_no_nicho": "alto|medio|baixo",
            "exemplos": ["string"]
          }
        ],
        "padroes_titulos": [
          {
            "tipo_gatilho": "string",
            "descricao": "string",
            "exemplos": ["string"]
          }
        ],
        "titulos_virais_prontos": [
          {
            "titulo": "string",
            "por_que_funciona": "string"
          }
        ],
        "padroes_thumbnails": [
          {
            "elemento": "string",
            "descricao": "string",
            "dica_pratica": "string"
          }
        ],
        "ideias_videos_virais": [
          {
            "titulo": "string",
            "descricao_curta": "string",
            "por_que_funciona": "string",
            "formato_sugerido": "string"
          }
        ],
        "calendario_conteudo": [
          {
            "dia": 1,
            "tema": "string",
            "formato": "string",
            "titulo_sugerido": "string",
            "objetivo": "string"
          }
        ],
        "micro_nichos_promissores": [
          {
            "nome": "string",
            "descricao": "string",
            "potencial_crescimento": "explosivo|alto|moderado",
            "competicao": "baixa|media|alta"
          }
        ],
        "conclusao_estrategica": {
          "caminho_mais_promissor": "string",
          "onde_focar": "string",
          "formato_para_testar_primeiro": "string",
          "proximos_passos": ["string"]
        }
      }

      IMPORTANTE:
      - Gere pelo menos 5-7 oportunidades de tendência
      - Gere pelo menos 4-5 formatos funcionando
      - Gere pelo menos 5 títulos virais prontos
      - Gere pelo menos 10 ideias de vídeos
      - O calendário deve ter exatamente 7 dias
      - Gere pelo menos 4-5 micro-nichos
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (error) {
    console.error('Viral analysis error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
