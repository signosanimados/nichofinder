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
