import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { AnalysisMode } from '../types';

interface ModeSelectorProps {
  onSelectMode: (mode: AnalysisMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  const modes = [
    {
      id: 'nicho_finder' as AnalysisMode,
      title: 'Nicho Finder',
      subtitle: 'Descubra seu Nicho de Ouro',
      description: 'Combine suas paixões, habilidades e oportunidades de mercado para encontrar o nicho perfeito para seu canal.',
      icon: Target,
      gradient: 'from-purple-600 to-pink-600',
      bgGlow: 'purple',
      features: ['Análise personalizada', 'Plano de 7 dias', 'Ideias de monetização']
    },
    {
      id: 'viral_analyzer' as AnalysisMode,
      title: 'Viral Analyzer',
      subtitle: 'Descubra Tendências Virais',
      description: 'Analise nichos, canais ou palavras-chave para descobrir o que está viralizando e como replicar o sucesso.',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-600',
      bgGlow: 'orange',
      features: ['Tendências em tempo real', 'Padrões de títulos', 'Calendário de conteúdo']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-purple-300 mb-6">
          <Sparkles className="w-4 h-4" />
          Escolha sua Ferramenta
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          O que você quer descobrir?
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Duas ferramentas poderosas para dominar o YouTube. Escolha a que melhor atende sua necessidade agora.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">
        {modes.map((mode, idx) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(mode.id)}
            className="group relative text-left"
          >
            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${mode.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />

            <div className="relative bg-slate-900/90 border border-slate-700 group-hover:border-slate-500 p-8 rounded-2xl transition-all h-full">
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${mode.gradient} mb-6`}>
                <mode.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{mode.subtitle}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{mode.title}</h2>
                </div>

                <p className="text-gray-400 leading-relaxed">{mode.description}</p>

                {/* Features */}
                <ul className="space-y-2 pt-2">
                  {mode.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${mode.gradient} font-semibold pt-4`}>
                  <span>Começar agora</span>
                  <ArrowRight className={`w-5 h-5 text-${mode.bgGlow}-500 group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
