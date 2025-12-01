export interface UserAnswers {
  passion: string;
  skill: string;
  market: string;
  monetization: string;
}

export interface NicheSuggestion {
  nome_do_nicho: string;
  descricao_do_nicho: string;
  por_que_enquadra_no_perfil: string;
  publico_alvo_detalhado: string;
  tipo_de_conteudo: string;
  dificuldade_de_crescimento: 'baixa' | 'media' | 'alta';
  potencial_de_monetizacao: 'baixo' | 'medio' | 'alto';
  ideias_de_video_iniciais: string[];
  ideias_de_produtos_futuros: string[];
}

export interface MainNiche {
  nome_do_nicho: string;
  explicacao: string;
  plano_de_acao_7_dias: string[];
}

export interface AnalysisResult {
  idioma_saida: string;
  resumo_perfil: string;
  nichos_sugeridos: NicheSuggestion[];
  nicho_nicho_finder_principal: MainNiche;
}

export enum AppState {
  API_KEY_INPUT = 'API_KEY_INPUT',
  WELCOME = 'WELCOME',
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}