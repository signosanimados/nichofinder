import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `
Você é um CONSULTOR ESPECIALISTA em criação de canais do YouTube e trabalha com a metodologia chamada NICHO FINDER.

O objetivo do NICHO FINDER é descobrir os melhores nichos de canal do YouTube para uma pessoa, combinando quatro dimensões principais:
1) O que a pessoa AMA (interesses, temas favoritos, tipo de conteúdo que gosta)
2) No que ela é BOA (habilidades, talentos, experiências)
3) O que o MERCADO / PÚBLICO PRECISA (problemas e dores que o conteúdo pode resolver)
4) Pelo que ela pode ser PAGA (temas com potencial real de monetização)

TAREFAS:
1) Faça um RESUMO do perfil.
2) Sugira de 3 a 5 NICHOS DE CANAL DO YOUTUBE altamente específicos.
3) Escolha APENAS 1 dos nichos como "Nicho NICHO FINDER Principal".
4) Crie um MINI PLANO DE AÇÃO para os próximos 7 dias para o nicho principal.

Responda em português do Brasil. Responda SEMPRE em JSON VÁLIDO.
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
    const { answers, apiKey: userApiKey } = req.body;

    if (!answers || !answers.passion || !answers.skill || !answers.market || !answers.monetization) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    const prompt = `
      ${SYSTEM_PROMPT}

      Respostas do usuário:
      - Paixão/Interesses: ${answers.passion}
      - Habilidades/Talentos: ${answers.skill}
      - Mercado/Público: ${answers.market}
      - Monetização Desejada: ${answers.monetization}

      Gere a análise completa no seguinte formato JSON:
      {
        "idioma_saida": "pt-br",
        "resumo_perfil": "string",
        "nichos_sugeridos": [
          {
            "nome_do_nicho": "string",
            "descricao_do_nicho": "string",
            "por_que_enquadra_no_perfil": "string",
            "publico_alvo_detalhado": "string",
            "tipo_de_conteudo": "string",
            "dificuldade_de_crescimento": "baixa|media|alta",
            "potencial_de_monetizacao": "baixo|medio|alto",
            "ideias_de_video_iniciais": ["string"],
            "ideias_de_produtos_futuros": ["string"]
          }
        ],
        "nicho_nicho_finder_principal": {
          "nome_do_nicho": "string",
          "explicacao": "string",
          "plano_de_acao_7_dias": ["string"]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (error) {
    console.error('Niche analysis error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
