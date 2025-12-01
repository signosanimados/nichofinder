import React from 'react';
import { Target, Heart, Briefcase, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-purple-300 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
          AI-Powered YouTube Strategist
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Encontre seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Nicho de Ouro</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          O método <strong>Nicho Finder</strong> usa Inteligência Artificial para cruzar o que você ama, suas habilidades, demandas do mercado e potencial financeiro.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12 mb-12">
            {[
                { icon: Heart, label: "Paixão", color: "text-rose-400" },
                { icon: Target, label: "Habilidade", color: "text-blue-400" },
                { icon: Briefcase, label: "Demanda", color: "text-amber-400" },
                { icon: DollarSign, label: "Lucro", color: "text-emerald-400" },
            ].map((item, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                    <span className="font-semibold text-gray-200">{item.label}</span>
                </motion.div>
            ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 ring-offset-slate-900"
        >
          Começar Análise Gratuita
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;