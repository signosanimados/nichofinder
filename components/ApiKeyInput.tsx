import React, { useState } from 'react';
import { Key, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiKeyInputProps {
  onSubmit: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-900 text-slate-50 relative overflow-hidden">
       {/* Background matching Hero */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-800/50 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Key className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Configurar API Key</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Para usar o Nicho Finder, insira sua chave da API da OpenAI.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">OpenAI API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Ex: sk-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Começar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Sua chave é armazenada localmente e usada apenas para comunicar com a OpenAI.
        </p>
      </motion.div>
    </div>
  );
};

export default ApiKeyInput;