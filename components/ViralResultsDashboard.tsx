import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  Type,
  Image,
  Video,
  Calendar,
  Layers,
  Target,
  ChevronRight,
  ArrowUpRight,
  Flame,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { ViralAnalysisResult } from '../types';

interface ViralResultsDashboardProps {
  data: ViralAnalysisResult;
  onReset: () => void;
}

type TabId = 'overview' | 'opportunities' | 'formats' | 'titles' | 'thumbnails' | 'ideas' | 'calendar' | 'microniches' | 'strategy';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Resumo', icon: TrendingUp },
  { id: 'opportunities', label: 'Oportunidades', icon: Zap },
  { id: 'formats', label: 'Formatos', icon: Layers },
  { id: 'titles', label: 'Títulos', icon: Type },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'ideas', label: 'Ideias', icon: Video },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'microniches', label: 'Micro-nichos', icon: Layers },
  { id: 'strategy', label: 'Estratégia', icon: Target }
];

const ViralResultsDashboard: React.FC<ViralResultsDashboardProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [copiedTitle, setCopiedTitle] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(index);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const urgencyColors = {
    alta: 'text-red-400 bg-red-500/10 border-red-500/20',
    media: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    baixa: 'text-green-400 bg-green-500/10 border-green-500/20'
  };

  const potentialColors = {
    alto: 'text-emerald-400',
    medio: 'text-blue-400',
    baixo: 'text-gray-400',
    explosivo: 'text-red-400',
    moderado: 'text-yellow-400'
  };

  const competitionColors = {
    baixa: 'text-green-400',
    media: 'text-yellow-400',
    alta: 'text-red-400'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Análise de Tendências Virais</h1>
                <p className="text-sm text-gray-400">Relatório completo gerado por IA</p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Nova análise
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Flame className="w-6 h-6 text-orange-500" />
                    Resumo Executivo
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {data.resumo_executivo}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-orange-400">{data.oportunidades_tendencia.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Oportunidades</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-purple-400">{data.formatos_funcionando.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Formatos</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-emerald-400">{data.ideias_videos_virais.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Ideias de Vídeo</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-blue-400">{data.micro_nichos_promissores.length}</div>
                    <div className="text-sm text-gray-400 mt-1">Micro-nichos</div>
                  </div>
                </div>
              </div>
            )}

            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Oportunidades de Tendência</h2>
                {data.oportunidades_tendencia.map((opp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{opp.titulo}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${urgencyColors[opp.urgencia]}`}>
                            {opp.urgencia === 'alta' ? 'Urgente' : opp.urgencia === 'media' ? 'Moderada' : 'Baixa'}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-3">{opp.descricao}</p>
                        <div className="flex items-start gap-2 text-sm">
                          <ArrowUpRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-orange-300">{opp.por_que_pode_viralizar}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Formats Tab */}
            {activeTab === 'formats' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Formatos que Estão Funcionando</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.formatos_funcionando.map((format, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{format.nome}</h3>
                        <span className={`text-sm font-medium ${potentialColors[format.potencial_no_nicho]}`}>
                          Potencial {format.potencial_no_nicho}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">{format.descricao}</p>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Exemplos:</p>
                        {format.exemplos.map((ex, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <ChevronRight className="w-4 h-4 text-purple-400" />
                            {ex}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Titles Tab */}
            {activeTab === 'titles' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Padrões de Títulos Virais</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.padroes_titulos.map((pattern, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">{pattern.tipo_gatilho}</h3>
                        <p className="text-gray-400 mb-4">{pattern.descricao}</p>
                        <div className="space-y-2">
                          {pattern.exemplos.map((ex, i) => (
                            <div key={i} className="text-sm text-gray-300 bg-slate-800/50 px-3 py-2 rounded-lg">
                              "{ex}"
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Títulos Prontos para Usar
                  </h3>
                  <div className="space-y-3">
                    {data.titulos_virais_prontos.map((title, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{title.titulo}</p>
                          <p className="text-sm text-gray-500 mt-1">{title.por_que_funciona}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(title.titulo, idx)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          {copiedTitle === idx ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnails Tab */}
            {activeTab === 'thumbnails' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Padrões Visuais de Thumbnail</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.padroes_thumbnails.map((pattern, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                      <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg w-fit mb-4">
                        <Image className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{pattern.elemento}</h3>
                      <p className="text-gray-400 text-sm mb-3">{pattern.descricao}</p>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                        <p className="text-sm text-purple-300">
                          <strong>Dica:</strong> {pattern.dica_pratica}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Ideas Tab */}
            {activeTab === 'ideas' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Ideias de Vídeos com Alto Potencial Viral</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.ideias_videos_virais.map((idea, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-orange-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 flex-shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{idea.titulo}</h3>
                          <p className="text-sm text-gray-400 mb-3">{idea.descricao_curta}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-slate-800 rounded-full text-gray-300">
                              {idea.formato_sugerido}
                            </span>
                          </div>
                          <p className="text-xs text-orange-400 mt-3">
                            <Zap className="w-3 h-3 inline mr-1" />
                            {idea.por_que_funciona}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Calendário de Conteúdo - 7 Dias</h2>
                <div className="space-y-3">
                  {data.calendario_conteudo.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-white">D{day.dia}</span>
                        </div>
                        <div className="flex-1 md:min-w-[200px]">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Tema</p>
                          <p className="font-semibold text-white">{day.tema}</p>
                        </div>
                      </div>
                      <div className="flex-1 md:border-l md:border-slate-800 md:pl-4">
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Formato</p>
                            <p className="text-sm text-gray-300">{day.formato}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500">Título Sugerido</p>
                            <p className="text-sm text-purple-300">{day.titulo_sugerido}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <p className="text-xs text-gray-500">{day.objetivo}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Microniches Tab */}
            {activeTab === 'microniches' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Micro-nichos Promissores</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.micro_nichos_promissores.map((niche, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">{niche.nome}</h3>
                      <p className="text-sm text-gray-400 mb-4">{niche.descricao}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Crescimento</p>
                          <p className={`font-medium ${potentialColors[niche.potencial_crescimento]}`}>
                            {niche.potencial_crescimento}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Competição</p>
                          <p className={`font-medium ${competitionColors[niche.competicao]}`}>
                            {niche.competicao}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Tab */}
            {activeTab === 'strategy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Conclusão Estratégica</h2>

                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-emerald-400 uppercase tracking-wider mb-2">Caminho Mais Promissor</p>
                      <p className="text-lg font-semibold text-white">
                        {data.conclusao_estrategica.caminho_mais_promissor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-400 uppercase tracking-wider mb-2">Onde Focar</p>
                      <p className="text-lg font-semibold text-white">
                        {data.conclusao_estrategica.onde_focar}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-400 uppercase tracking-wider mb-2">Formato para Testar Primeiro</p>
                      <p className="text-lg font-semibold text-white">
                        {data.conclusao_estrategica.formato_para_testar_primeiro}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Próximos Passos
                  </h3>
                  <ul className="space-y-3">
                    {data.conclusao_estrategica.proximos_passos.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViralResultsDashboard;
