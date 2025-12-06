import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, FileText, Zap, Film, Timer } from 'lucide-react';
import { VideoIdea, VideoDuration } from '../types';

interface ScriptDurationSelectorProps {
  videoIdea: VideoIdea;
  onSelectDuration: (duration: VideoDuration) => void;
  onBack: () => void;
}

const durations: { value: VideoDuration; label: string; description: string; icon: React.ReactNode }[] = [
  { value: '30s', label: '30 segundos', description: 'Shorts / Reels rapidos', icon: <Zap className="w-5 h-5" /> },
  { value: '60s', label: '1 minuto', description: 'TikTok / Reels padrao', icon: <Timer className="w-5 h-5" /> },
  { value: '90s', label: '1:30 minutos', description: 'Shorts estendidos', icon: <Clock className="w-5 h-5" /> },
  { value: '3min', label: '3 minutos', description: 'Video curto YouTube', icon: <Film className="w-5 h-5" /> },
  { value: '5min', label: '5 minutos', description: 'Video medio', icon: <Film className="w-5 h-5" /> },
  { value: '10min', label: '10 minutos', description: 'Video completo', icon: <FileText className="w-5 h-5" /> },
];

const ScriptDurationSelector: React.FC<ScriptDurationSelectorProps> = ({ videoIdea, onSelectDuration, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para ideias
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Gerar Roteiro</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Selecione a duracao do video para gerar um roteiro completo com sugestoes visuais
          </p>
        </motion.div>

        {/* Video Idea Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <h3 className="text-sm font-medium text-purple-400 mb-2">Ideia selecionada:</h3>
          <h2 className="text-xl font-bold text-white mb-2">{videoIdea.titulo}</h2>
          <p className="text-slate-400 text-sm mb-3">{videoIdea.descricao_curta}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              {videoIdea.formato_sugerido}
            </span>
          </div>
        </motion.div>

        {/* Duration Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Escolha a duracao do video:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {durations.map((duration, index) => (
              <motion.button
                key={duration.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDuration(duration.value)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500 rounded-xl p-5 text-left transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                    {duration.icon}
                  </div>
                  <span className="text-xl font-bold text-white">{duration.label}</span>
                </div>
                <p className="text-sm text-slate-400">{duration.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg"
        >
          <h4 className="text-sm font-medium text-slate-300 mb-2">O roteiro vai incluir:</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>- Gancho viral para os primeiros segundos</li>
            <li>- Desenvolvimento envolvente da narrativa</li>
            <li>- Plot twist quando aplicavel</li>
            <li>- Final reflexivo e memoravel</li>
            <li>- Sugestoes de imagens/videos para cada cena</li>
            <li>- Call-to-action otimizado</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ScriptDurationSelector;
