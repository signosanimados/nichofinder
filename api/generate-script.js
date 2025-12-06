const SCRIPT_PROMPT = `
Você é um Roteirista Especialista em vídeos curtos virais para YouTube, TikTok e Reels.
Sua função é criar roteiros envolventes que prendem a atenção do início ao fim.

ESTRUTURA OBRIGATÓRIA DO ROTEIRO:
1. GANCHO VIRAL (primeiros 3-5 segundos) - Uma frase impactante que prende imediatamente
2. DESENVOLVIMENTO - Construa a narrativa de forma envolvente
3. PLOT TWIST (quando aplicável) - Uma reviravolta ou revelação surpreendente
4. DESENVOLVIMENTO 2 - Continue após o plot twist
5. CONCLUSÃO REFLEXIVA - Um final marcante e memorável
6. CTA (Call-to-Action) - Uma chamada para ação clara

REGRAS DE CENA:
- Cada cena deve ter NO MÁXIMO 8 segundos
- Se uma parte do roteiro precisar de mais de 8 segundos, DIVIDA em múltiplas cenas
- Cada cena DEVE ter pelo menos uma sugestão visual (imagem/b-roll/vídeo)
- Se uma cena tiver mais de 8 segundos, DEVE ter múltiplas sugestões visuais

DICAS PARA VIRALIZAÇÃO:
- Começo impactante que gera curiosidade
- Linguagem natural e conversacional
- Emoção: faça o espectador sentir algo
- Valor: ensine algo ou entretenha genuinamente
- Retenção: mantenha promessas feitas no gancho

Responda SEMPRE em JSON VÁLIDO seguindo a estrutura solicitada.
`;

const DURATION_CONFIG = {
  '30s': { totalSeconds: 30, minScenes: 4, maxScenes: 6 },
  '60s': { totalSeconds: 60, minScenes: 8, maxScenes: 12 },
  '90s': { totalSeconds: 90, minScenes: 12, maxScenes: 16 },
  '3min': { totalSeconds: 180, minScenes: 20, maxScenes: 30 },
  '5min': { totalSeconds: 300, minScenes: 35, maxScenes: 50 },
  '10min': { totalSeconds: 600, minScenes: 70, maxScenes: 100 }
};

export default async function handler(req, res) {
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
    const { videoIdea, duration, language, apiKey: openaiKey } = req.body;

    if (!videoIdea || !duration) {
      return res.status(400).json({ error: 'Missing videoIdea or duration' });
    }

    const openaiApiKey = openaiKey || process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(400).json({ error: 'OpenAI API Key nao fornecida.' });
    }

    const config = DURATION_CONFIG[duration] || DURATION_CONFIG['60s'];
    const langText = language === 'en' ? 'English' : 'Português do Brasil';

    const prompt = `
      ${SCRIPT_PROMPT}

      INFORMAÇÕES DO VÍDEO:
      - Título: "${videoIdea.titulo}"
      - Descrição: "${videoIdea.descricao_curta}"
      - Motivo do sucesso: "${videoIdea.por_que_funciona}"
      - Formato sugerido: "${videoIdea.formato_sugerido}"
      - Duração alvo: ${duration} (${config.totalSeconds} segundos)

      Idioma da resposta: ${langText}

      Gere um roteiro COMPLETO no seguinte formato JSON:
      {
        "titulo_video": "string (título otimizado para o vídeo)",
        "duracao_total": "${duration}",
        "resumo_roteiro": "string (resumo em 2-3 frases do que será abordado)",
        "cenas": [
          {
            "numero": 1,
            "tipo": "gancho",
            "duracao_segundos": number (máximo 8),
            "texto_narração": "string (o que será falado/narrado)",
            "visuais": [
              {
                "descricao": "string (descrição detalhada do visual)",
                "tipo": "imagem|video|b-roll",
                "sugestao_busca": "string (termo para buscar em banco de imagens/vídeos)"
              }
            ],
            "dica_edicao": "string (dica de edição para esta cena, opcional)"
          }
        ],
        "dicas_gerais": [
          "string (dicas de produção e edição)"
        ],
        "musica_sugerida": "string (estilo de música de fundo sugerido)"
      }

      REGRAS IMPORTANTES:
      1. Cada cena deve ter NO MÁXIMO 8 segundos de duração
      2. Se precisar de mais tempo, CRIE MÚLTIPLAS CENAS
      3. A soma total das durações deve ser aproximadamente ${config.totalSeconds} segundos
      4. Gere entre ${config.minScenes} e ${config.maxScenes} cenas
      5. Para cenas longas (6-8 segundos), inclua 2 ou mais sugestões visuais
      6. O gancho deve ser IMPACTANTE e GERAR CURIOSIDADE
      7. Inclua um plot_twist se fizer sentido para o tema
      8. O final deve ser REFLEXIVO e MEMORÁVEL
      9. O CTA deve ser CLARO e MOTIVADOR
      10. Cada cena deve ter pelo menos 1 visual, cenas mais longas precisam de mais

      Tipos de cena disponíveis: "gancho", "desenvolvimento", "plot_twist", "climax", "conclusao", "cta"
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um roteirista especialista em vídeos virais. Crie roteiros envolventes com cenas de até 8 segundos cada. Responda em JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices[0]?.message?.content;
    const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (error) {
    console.error('Script generation error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
