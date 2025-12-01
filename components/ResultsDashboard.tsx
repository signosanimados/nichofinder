import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, NicheSuggestion } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Play, 
  Box, 
  ChevronRight, 
  Award,
  BarChart3,
  Users
} from 'lucide-react';

interface ResultsDashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset }) => {
  const [selectedNicheIndex, setSelectedNicheIndex] = useState<number>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const selectedNiche = data.nichos_sugeridos[selectedNicheIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 overflow-x-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
           <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
               Seu Relatório Nicho Finder
             </h1>
             <button onClick={onReset} className="text-sm text-gray-500 hover:text-white underline">
               Começar de novo
             </button>
           </div>
           
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Resumo do Perfil</h3>
             <p className="text-lg leading-relaxed text-slate-200">{data.resumo_perfil}</p>
           </div>
        </motion.div>

        {/* Main Winner Niche */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nicho Principal Recomendado</h2>
                <p className="text-yellow-400/80 text-sm font-medium">A MELHOR OPORTUNIDADE</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">{data.nicho_nicho_finder_principal.nome_do_nicho}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {data.nicho_nicho_finder_principal.explicacao}
                </p>
              </div>
              
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-400 fill-current" />
                  Plano de 7 Dias
                </h4>
                <ul className="space-y-3">
                  {data.nicho_nicho_finder_principal.plano_de_acao_7_dias.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono border border-slate-700">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Suggestions Tabs */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-purple-400" />
            Explorar Outras Opções
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {data.nichos_sugeridos.map((niche, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedNicheIndex(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedNicheIndex === idx
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50'
                    : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {niche.nome_do_nicho}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNicheIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
            >
              <div className="p-6 md:p-8 space-y-8">
                {/* Intro Section */}
                <div className="border-b border-slate-800 pb-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{selectedNiche.nome_do_nicho}</h2>
                    <p className="text-gray-300 leading-relaxed">{selectedNiche.descricao_do_nicho}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                        <span className="text-xs font-mono text-gray-500 uppercase">Dificuldade</span>
                        <div className="flex items-center gap-2">
                            <BarChart3 className={`w-5 h-5 ${
                                selectedNiche.dificuldade_de_crescimento === 'alta' ? 'text-red-400' : 
                                selectedNiche.dificuldade_de_crescimento === 'media' ? 'text-yellow-400' : 'text-green-400'
                            }`} />
                            <span className="capitalize font-semibold">{selectedNiche.dificuldade_de_crescimento}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                        <span className="text-xs font-mono text-gray-500 uppercase">Monetização</span>
                        <div className="flex items-center gap-2">
                            <DollarSign className={`w-5 h-5 ${
                                selectedNiche.potencial_de_monetizacao === 'alto' ? 'text-emerald-400' : 
                                selectedNiche.potencial_de_monetizacao === 'medio' ? 'text-blue-400' : 'text-slate-400'
                            }`} />
                            <span className="capitalize font-semibold">{selectedNiche.potencial_de_monetizacao}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                        <span className="text-xs font-mono text-gray-500 uppercase">Encaixe no Perfil</span>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            <span className="text-sm text-gray-300 truncate">Ver análise abaixo</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-purple-300 mb-2">Por que combina com você?</h4>
                            <p className="text-sm text-gray-400">{selectedNiche.por_que_enquadra_no_perfil}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-300 mb-2">Público-Alvo</h4>
                            <p className="text-sm text-gray-400">{selectedNiche.publico_alvo_detalhado}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-300 mb-2">Formato do Conteúdo</h4>
                            <p className="text-sm text-gray-400">{selectedNiche.tipo_de_conteudo}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Play className="w-4 h-4 text-red-500 fill-current" />
                                Ideias de Vídeo
                            </h4>
                            <ul className="space-y-2">
                                {selectedNiche.ideias_de_video_iniciais.slice(0, 5).map((idea, i) => (
                                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                        <ChevronRight className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                                        <span>{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Box className="w-4 h-4 text-emerald-500" />
                                Produtos Futuros
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedNiche.ideias_de_produtos_futuros.map((prod, i) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                                        {prod}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsDashboard;