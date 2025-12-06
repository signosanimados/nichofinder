import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Clock,
  Film,
  Image,
  Video,
  Scissors,
  Music,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  MessageSquare,
  Sparkles,
  Target
} from 'lucide-react';
import { ScriptResult as ScriptResultType } from '../types';
import { apiService } from '../services/apiService';

interface ScriptResultProps {
  script: ScriptResultType;
  onBack: () => void;
  onNewScript: () => void;
}

const sceneTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  gancho: { label: 'GANCHO VIRAL', color: 'bg-red-500', icon: <Zap className="w-4 h-4" /> },
  desenvolvimento: { label: 'DESENVOLVIMENTO', color: 'bg-blue-500', icon: <Film className="w-4 h-4" /> },
  plot_twist: { label: 'PLOT TWIST', color: 'bg-purple-500', icon: <Sparkles className="w-4 h-4" /> },
  climax: { label: 'CLIMAX', color: 'bg-orange-500', icon: <Target className="w-4 h-4" /> },
  conclusao: { label: 'CONCLUSAO', color: 'bg-green-500', icon: <MessageSquare className="w-4 h-4" /> },
  cta: { label: 'CALL TO ACTION', color: 'bg-yellow-500', icon: <Target className="w-4 h-4" /> },
};

const visualTypeIcons: Record<string, React.ReactNode> = {
  imagem: <Image className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  'b-roll': <Film className="w-4 h-4" />,
};

const ScriptResultComponent: React.FC<ScriptResultProps> = ({ script, onBack, onNewScript }) => {
  const [expandedScenes, setExpandedScenes] = useState<Set<number>>(new Set([0, 1, 2]));

  const toggleScene = (index: number) => {
    const newExpanded = new Set(expandedScenes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedScenes(newExpanded);
  };

  const expandAll = () => {
    setExpandedScenes(new Set(script.cenas.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedScenes(new Set());
  };

  const handleDownloadPDF = () => {
    apiService.downloadScriptPDF(script);
  };

  const totalDuration = script.cenas?.reduce((sum, cena) => sum + cena.duracao_segundos, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex gap-3">
            <button
              onClick={onNewScript}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Novo Roteiro
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
          </div>
        </motion.div>

        {/* Title and Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/50 to-slate-800/50 border border-purple-500/30 rounded-2xl p-6 mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{script.titulo_video}</h1>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>{script.duracao_total}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Film className="w-5 h-5 text-purple-400" />
              <span>{script.cenas?.length || 0} cenas</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>{totalDuration}s total</span>
            </div>
          </div>

          <p className="text-slate-400">{script.resumo_roteiro}</p>
        </motion.div>

        {/* Expand/Collapse All */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={expandAll}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Expandir todas
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Recolher todas
          </button>
        </div>

        {/* Scenes */}
        <div className="space-y-4">
          {script.cenas?.map((cena, index) => {
            const config = sceneTypeConfig[cena.tipo] || {
              label: cena.tipo.toUpperCase(),
              color: 'bg-slate-500',
              icon: <Film className="w-4 h-4" />
            };
            const isExpanded = expandedScenes.has(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
              >
                {/* Scene Header */}
                <button
                  onClick={() => toggleScene(index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-sm">
                      {cena.numero}
                    </span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.color} text-white text-xs font-medium`}>
                      {config.icon}
                      {config.label}
                    </div>
                    <span className="text-slate-400 text-sm">{cena.duracao_segundos}s</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {/* Scene Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-700"
                    >
                      <div className="p-4 space-y-4">
                        {/* Narration */}
                        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
                            <MessageSquare className="w-4 h-4" />
                            NARRACAO / FALA
                          </div>
                          <p className="text-white leading-relaxed">{cena.texto_narração}</p>
                        </div>

                        {/* Visuals */}
                        {cena.visuais && cena.visuais.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
                              <Image className="w-4 h-4" />
                              SUGESTOES VISUAIS ({cena.visuais.length})
                            </div>
                            <div className="grid gap-3">
                              {cena.visuais.map((visual, vIndex) => (
                                <div
                                  key={vIndex}
                                  className="bg-green-900/20 border border-green-500/30 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                      {visualTypeIcons[visual.tipo] || <Image className="w-3 h-3" />}
                                      {visual.tipo.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-sm mb-2">{visual.descricao}</p>
                                  <p className="text-slate-500 text-xs">
                                    Buscar: <span className="text-green-400">"{visual.sugestao_busca}"</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Edit Tip */}
                        {cena.dica_edicao && (
                          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-1">
                              <Scissors className="w-4 h-4" />
                              DICA DE EDICAO
                            </div>
                            <p className="text-slate-300 text-sm">{cena.dica_edicao}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Tips Section */}
        {script.dicas_gerais && script.dicas_gerais.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Dicas de Producao
            </div>
            <ul className="space-y-2">
              {script.dicas_gerais.map((dica, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <span className="text-purple-400 mt-1">-</span>
                  {dica}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Music Suggestion */}
        {script.musica_sugerida && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Musica sugerida:</span>
              <span className="text-slate-300">{script.musica_sugerida}</span>
            </div>
          </motion.div>
        )}

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
          >
            <Download className="w-5 h-5" />
            Baixar Roteiro em PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScriptResultComponent;
