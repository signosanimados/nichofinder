// ============ NICHO FINDER CONSTANTS ============
export const SYSTEM_INSTRUCTION = `
Você é um CONSULTOR ESPECIALISTA em criação de canais do YouTube e trabalha com a metodologia chamada NICHO FINDER.

O objetivo do NICHO FINDER é descobrir os melhores nichos de canal do YouTube para uma pessoa, combinando quatro dimensões principais:
1) O que a pessoa AMA (interesses, temas favoritos, tipo de conteúdo que gosta)
2) No que ela é BOA (habilidades, talentos, experiências)
3) O que o MERCADO / PÚBLICO PRECISA (problemas e dores que o conteúdo pode resolver)
4) Pelo que ela pode ser PAGA (temas com potencial real de monetização)

REGRAS DE IDIOMA:
- Use a variável {{idioma_saida}} para definir o idioma da resposta. Se não especificado, assuma "pt-br".
- Se {{idioma_saida}} = "pt-br", responda TODO o conteúdo em português do Brasil.
- Se {{idioma_saida}} = "en", responda TODO o conteúdo em inglês.

TAREFAS:
1) Faça um RESUMO do perfil.
2) Sugira de 3 a 5 NICHOS DE CANAL DO YOUTUBE altamente específicos.
3) Escolha APENAS 1 dos nichos como "Nicho NICHO FINDER Principal".
4) Crie um MINI PLANO DE AÇÃO para os próximos 7 dias para o nicho principal.

FORMATO DA RESPOSTA:
Responda SEMPRE em JSON VÁLIDO.
`;

export const QUESTIONS = [
  {
    id: 'passion',
    title: 'O que você AMA?',
    description: 'Liste seus interesses, hobbies, assuntos que você estuda por diversão ou temas que você passaria horas conversando.',
    placeholder: 'Ex: Tecnologia, cuidar de plantas, história medieval, filmes de terror, culinária vegana...'
  },
  {
    id: 'skill',
    title: 'No que você é BOM?',
    description: 'Quais são suas habilidades técnicas, talentos naturais ou experiências profissionais? O que as pessoas costumam te pedir ajuda?',
    placeholder: 'Ex: Edição de vídeo, explicar coisas complexas, consertar carros, programação, dar conselhos amorosos...'
  },
  {
    id: 'market',
    title: 'O que o MERCADO precisa?',
    description: 'Que dores, problemas ou desejos você gostaria de ajudar a resolver? Quem é o público que você imagina ajudar?',
    placeholder: 'Ex: Pessoas que querem emagrecer sem sofrer, estudantes que não conseguem focar, recém-casados organizando a casa...'
  },
  {
    id: 'monetization',
    title: 'Como você pode ser PAGO?',
    description: 'Quais caminhos de monetização te interessam? Adsense, vender cursos, parcerias, vender produtos físicos?',
    placeholder: 'Ex: Quero vender meu e-book, quero patrocínios de marcas de tech, quero apenas Adsense no início...'
  }
];

// ============ VIRAL ANALYZER CONSTANTS ============
export const VIRAL_SYSTEM_INSTRUCTION = `
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

COMO FUNCIONAM AS ANÁLISES:
O usuário pode fornecer:
- Um nicho (ex: "motivação", "histórias", "economia", "humor", "infantil")
- Um canal específico
- Uma lista de vídeos
- Uma tendência percebida
- Uma palavra-chave
- Ou simplesmente pedir: "o que está viralizando agora?"

Você deve analisar mesmo se houver poucos dados fornecidos, usando:
- Padrões conhecidos de comportamento da plataforma
- Técnicas de growth
- Estruturas comuns de viralização
- Sua capacidade de identificar padrões semânticos e temáticos
- Comparações com tendências recentes globais e locais

Nunca responda de forma superficial. Seu papel é gerar insights profundos e acionáveis.

REGRAS DE IDIOMA:
- Use a variável {{idioma_saida}} para definir o idioma da resposta.
- Se {{idioma_saida}} = "pt-br", responda TODO o conteúdo em português do Brasil.
- Se {{idioma_saida}} = "en", responda TODO o conteúdo em inglês.

REGRAS IMPORTANTES:
- Não gere conteúdo superficial
- Sempre entregue ideias claras, específicas e aplicáveis
- Evite generalizações vagas
- Não use jargões desnecessários
- Trate sempre como um estudo real de mercado e comportamento
- Se o usuário pedir "me dê X ideias", sempre dê mais do que o mínimo
- Você é pago para ser estrategista, não motivador: foco 100% em dados, padrões e formatos

FORMATO DA RESPOSTA:
Responda SEMPRE em JSON VÁLIDO seguindo a estrutura solicitada.
`;

export const VIRAL_INPUT_TYPES = [
  {
    id: 'niche',
    title: 'Analisar um Nicho',
    description: 'Descubra o que está viralizando em um nicho específico',
    placeholder: 'Ex: motivação, histórias reais, economia, humor, infantil, true crime...',
    icon: 'Target'
  },
  {
    id: 'channel',
    title: 'Analisar um Canal',
    description: 'Analise os padrões de sucesso de um canal específico',
    placeholder: 'Ex: MrBeast, Casimiro, Felipe Neto, nome do canal...',
    icon: 'Youtube'
  },
  {
    id: 'keyword',
    title: 'Analisar Palavra-chave',
    description: 'Descubra oportunidades em torno de uma palavra-chave',
    placeholder: 'Ex: inteligência artificial, como fazer, receitas fáceis...',
    icon: 'Search'
  },
  {
    id: 'trend',
    title: 'Analisar uma Tendência',
    description: 'Explore uma tendência que você percebeu',
    placeholder: 'Ex: vídeos estilo "day in my life", shorts de curiosidades...',
    icon: 'TrendingUp'
  },
  {
    id: 'trending_now',
    title: 'O que está Viralizando Agora?',
    description: 'Descubra as maiores oportunidades do momento',
    placeholder: 'Clique para ver as tendências atuais do YouTube',
    icon: 'Flame'
  }
];

export const LANGUAGE_OPTIONS = [
  { id: 'pt-br', label: 'Português (BR)', flag: '🇧🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' }
];
