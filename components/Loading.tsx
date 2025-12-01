import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const MESSAGES = [
  "Analisando seus interesses...",
  "Conectando com demandas do mercado...",
  "Calculando potencial de monetização...",
  "Encontrando o nicho perfeito...",
  "Gerando plano de ação..."
];

const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-b-2 border-purple-500 opacity-20 scale-150"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-r-2 border-pink-500 opacity-20 scale-125"
        />
        <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl relative z-10 border border-slate-700">
          <BrainCircuit className="w-16 h-16 text-purple-400" />
        </div>
      </div>
      
      <div className="mt-12 h-8 text-center">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-medium text-gray-300"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;