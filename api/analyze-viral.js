const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

const VIRAL_PROMPT = `
Você é um Agente Especialista em Tendências Virais do YouTube.
Sua função é analisar dados REAIS do YouTube que serão fornecidos abaixo, identificando padrões, oportunidades e tendências.

VOCÊ RECEBERÁ DADOS REAIS DO YOUTUBE incluindo:
- Vídeos em trending
- Estatísticas reais (views, likes, comentários)
- Títulos que estão funcionando
- Tags populares
- Informações de canais

Sua tarefa é analisar esses dados e extrair insights acionáveis.

REGRAS IMPORTANTES:
- Use os dados REAIS fornecidos como base da sua análise
- Identifique padrões nos títulos dos vídeos em alta
- Analise as estatísticas para identificar o que está funcionando
- Não invente dados - use apenas o que foi fornecido
- Gere insights baseados em evidências reais

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
    const { input, apiKey: openaiKey, youtubeApiKey } = req.body;

    if (!input || !input.type) {
      return res.status(400).json({ error: 'Missing input type' });
    }

    const openaiApiKey = openaiKey || process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(400).json({ error: 'OpenAI API Key nao fornecida.' });
    }

    const ytApiKey = youtubeApiKey || process.env.YOUTUBE_API_KEY;
    if (!ytApiKey) {
      return res.status(400).json({ error: 'YouTube API Key nao fornecida.' });
    }

    // Fetch real YouTube data based on input type
    let youtubeData = {};
    const regionCode = input.language === 'en' ? 'US' : 'BR';

    try {
      // Always get trending videos
      youtubeData.trending = await fetchTrendingVideos(ytApiKey, regionCode);

      // Get search results based on type
      if (input.type === 'niche' || input.type === 'keyword') {
        youtubeData.searchResults = await searchVideos(ytApiKey, input.value, regionCode);
      } else if (input.type === 'channel') {
        youtubeData.channel = await searchChannel(ytApiKey, input.value);
      } else if (input.type === 'trend') {
        youtubeData.searchResults = await searchVideos(ytApiKey, input.value, regionCode);
      }
    } catch (ytError) {
      console.error('YouTube API error:', ytError);
      // Continue with partial data if YouTube API fails
    }

    // Build context from YouTube data
    const youtubeContext = buildYouTubeContext(youtubeData, input);

    const typeDescriptions = {
      niche: `Analise o nicho "${input.value}" no YouTube.`,
      channel: `Analise o canal "${input.value}" e identifique os padrões de sucesso.`,
      keyword: `Analise a palavra-chave "${input.value}" e descubra oportunidades.`,
      trend: `Analise a tendência "${input.value}" que está surgindo.`,
      trending_now: `Analise o que está viralizando agora no YouTube.`
    };

    const prompt = `
      ${VIRAL_PROMPT}

      ===== DADOS REAIS DO YOUTUBE =====
      ${youtubeContext}
      ===== FIM DOS DADOS =====

      ${typeDescriptions[input.type] || typeDescriptions.niche}

      Idioma da resposta: ${input.language === 'en' ? 'English' : 'Português do Brasil'}

      Com base nos dados REAIS do YouTube acima, gere uma análise COMPLETA no seguinte formato JSON:
      {
        "idioma_saida": "${input.language}",
        "resumo_executivo": "string (análise clara baseada nos dados reais)",
        "dados_youtube_analisados": {
          "total_videos_analisados": number,
          "media_views": number,
          "video_mais_visto": "string"
        },
        "oportunidades_tendencia": [
          {
            "titulo": "string",
            "descricao": "string",
            "por_que_pode_viralizar": "string (baseado nos dados reais)",
            "urgencia": "alta|media|baixa"
          }
        ],
        "formatos_funcionando": [
          {
            "nome": "string",
            "descricao": "string",
            "potencial_no_nicho": "alto|medio|baixo",
            "exemplos": ["string (exemplos reais dos dados)"]
          }
        ],
        "padroes_titulos": [
          {
            "tipo_gatilho": "string",
            "descricao": "string",
            "exemplos": ["string (títulos reais dos dados)"]
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
      - Use os dados REAIS do YouTube na sua análise
      - Cite exemplos reais de títulos e vídeos quando possível
      - Gere pelo menos 5 oportunidades de tendência
      - Gere pelo menos 4 formatos funcionando
      - Gere pelo menos 5 títulos virais prontos
      - Gere pelo menos 8 ideias de vídeos
      - O calendário deve ter exatamente 7 dias
      - Gere pelo menos 4 micro-nichos
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
          { role: 'system', content: 'Você é um especialista em tendências virais do YouTube. Analise os dados reais fornecidos e responda em JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
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

    // Include raw YouTube data in response for reference
    data.youtube_raw_data = {
      trending_count: youtubeData.trending?.length || 0,
      search_results_count: youtubeData.searchResults?.length || 0,
      channel_found: !!youtubeData.channel
    };

    return res.status(200).json(data);

  } catch (error) {
    console.error('Viral analysis error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

// Build context string from YouTube data
function buildYouTubeContext(data, input) {
  let context = '';

  if (data.trending && data.trending.length > 0) {
    context += `\n## VÍDEOS EM TRENDING NO YOUTUBE (${data.trending.length} vídeos):\n`;
    data.trending.forEach((video, i) => {
      context += `${i + 1}. "${video.title}" - Canal: ${video.channelTitle}\n`;
      context += `   Views: ${formatNumber(video.viewCount)} | Likes: ${formatNumber(video.likeCount)} | Comentários: ${formatNumber(video.commentCount)}\n`;
      if (video.tags && video.tags.length > 0) {
        context += `   Tags: ${video.tags.join(', ')}\n`;
      }
    });
  }

  if (data.searchResults && data.searchResults.length > 0) {
    context += `\n## VÍDEOS ENCONTRADOS PARA "${input.value}" (${data.searchResults.length} vídeos):\n`;
    data.searchResults.forEach((video, i) => {
      context += `${i + 1}. "${video.title}" - Canal: ${video.channelTitle}\n`;
      context += `   Views: ${formatNumber(video.viewCount)} | Likes: ${formatNumber(video.likeCount)}\n`;
      if (video.tags && video.tags.length > 0) {
        context += `   Tags: ${video.tags.slice(0, 5).join(', ')}\n`;
      }
    });
  }

  if (data.channel) {
    context += `\n## DADOS DO CANAL "${data.channel.title}":\n`;
    context += `Inscritos: ${formatNumber(data.channel.subscriberCount)}\n`;
    context += `Total de vídeos: ${data.channel.videoCount}\n`;
    context += `Total de views: ${formatNumber(data.channel.viewCount)}\n`;
    if (data.channel.recentVideos && data.channel.recentVideos.length > 0) {
      context += `\nÚltimos vídeos do canal:\n`;
      data.channel.recentVideos.forEach((video, i) => {
        context += `  ${i + 1}. "${video.title}" - ${formatNumber(video.viewCount)} views\n`;
      });
    }
  }

  if (!context) {
    context = 'Não foi possível obter dados do YouTube. Gere análise baseada no seu conhecimento.';
  }

  return context;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// YouTube API Functions
async function fetchTrendingVideos(apiKey, regionCode) {
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${regionCode}&maxResults=25&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch trending videos');
  }

  const data = await response.json();

  return data.items?.map(video => ({
    id: video.id,
    title: video.snippet?.title,
    channelTitle: video.snippet?.channelTitle,
    tags: video.snippet?.tags?.slice(0, 10) || [],
    viewCount: parseInt(video.statistics?.viewCount || 0),
    likeCount: parseInt(video.statistics?.likeCount || 0),
    commentCount: parseInt(video.statistics?.commentCount || 0)
  })) || [];
}

async function searchVideos(apiKey, query, regionCode) {
  const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=viewCount&regionCode=${regionCode}&maxResults=20&key=${apiKey}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'Failed to search videos');
  }

  const searchData = await searchResponse.json();
  const videoIds = searchData.items?.map(item => item.id.videoId).join(',');

  if (!videoIds) return [];

  const statsUrl = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
  const statsResponse = await fetch(statsUrl);
  if (!statsResponse.ok) return [];

  const statsData = await statsResponse.json();

  return statsData.items?.map(video => ({
    id: video.id,
    title: video.snippet?.title,
    channelTitle: video.snippet?.channelTitle,
    tags: video.snippet?.tags?.slice(0, 10) || [],
    viewCount: parseInt(video.statistics?.viewCount || 0),
    likeCount: parseInt(video.statistics?.likeCount || 0),
    commentCount: parseInt(video.statistics?.commentCount || 0)
  })) || [];
}

async function searchChannel(apiKey, query) {
  const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${apiKey}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) return null;

  const searchData = await searchResponse.json();
  const channelId = searchData.items?.[0]?.id?.channelId;

  if (!channelId) return null;

  const channelUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  const channelResponse = await fetch(channelUrl);
  if (!channelResponse.ok) return null;

  const channelData = await channelResponse.json();
  const channel = channelData.items?.[0];
  if (!channel) return null;

  // Get recent videos
  const videosUrl = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10&key=${apiKey}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  const videoIds = videosData.items?.map(v => v.id.videoId).join(',');
  let recentVideos = [];

  if (videoIds) {
    const statsUrl = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    recentVideos = statsData.items?.map(video => ({
      title: video.snippet?.title,
      viewCount: parseInt(video.statistics?.viewCount || 0)
    })) || [];
  }

  return {
    title: channel.snippet?.title,
    subscriberCount: parseInt(channel.statistics?.subscriberCount || 0),
    videoCount: parseInt(channel.statistics?.videoCount || 0),
    viewCount: parseInt(channel.statistics?.viewCount || 0),
    recentVideos
  };
}
