// ============ NICHO FINDER TYPES ============
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

// ============ VIRAL ANALYZER TYPES ============
export type ViralInputType = 'niche' | 'channel' | 'videos' | 'trend' | 'keyword' | 'trending_now';

export interface ViralAnalysisInput {
  type: ViralInputType;
  value: string;
  language: 'pt-br' | 'en';
}

export interface TrendOpportunity {
  titulo: string;
  descricao: string;
  por_que_pode_viralizar: string;
  urgencia: 'alta' | 'media' | 'baixa';
}

export interface ViralFormat {
  nome: string;
  descricao: string;
  potencial_no_nicho: 'alto' | 'medio' | 'baixo';
  exemplos: string[];
}

export interface TitlePattern {
  tipo_gatilho: string;
  descricao: string;
  exemplos: string[];
}

export interface ViralTitle {
  titulo: string;
  por_que_funciona: string;
}

export interface ThumbnailPattern {
  elemento: string;
  descricao: string;
  dica_pratica: string;
}

export interface VideoIdea {
  titulo: string;
  descricao_curta: string;
  por_que_funciona: string;
  formato_sugerido: string;
}

export interface ContentCalendarDay {
  dia: number;
  tema: string;
  formato: string;
  titulo_sugerido: string;
  objetivo: string;
}

export interface MicroNiche {
  nome: string;
  descricao: string;
  potencial_crescimento: 'explosivo' | 'alto' | 'moderado';
  competicao: 'baixa' | 'media' | 'alta';
}

export interface StrategicConclusion {
  caminho_mais_promissor: string;
  onde_focar: string;
  formato_para_testar_primeiro: string;
  proximos_passos: string[];
}

export interface ViralAnalysisResult {
  idioma_saida: string;
  resumo_executivo: string;
  oportunidades_tendencia: TrendOpportunity[];
  formatos_funcionando: ViralFormat[];
  padroes_titulos: TitlePattern[];
  titulos_virais_prontos: ViralTitle[];
  padroes_thumbnails: ThumbnailPattern[];
  ideias_videos_virais: VideoIdea[];
  calendario_conteudo: ContentCalendarDay[];
  micro_nichos_promissores: MicroNiche[];
  conclusao_estrategica: StrategicConclusion;
}

// ============ APP STATE ============
export type AnalysisMode = 'nicho_finder' | 'viral_analyzer';

export enum AppState {
  API_KEY_INPUT = 'API_KEY_INPUT',
  WELCOME = 'WELCOME',
  MODE_SELECT = 'MODE_SELECT',
  FORM = 'FORM',
  VIRAL_INPUT = 'VIRAL_INPUT',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  VIRAL_RESULTS = 'VIRAL_RESULTS',
  ERROR = 'ERROR'
}
