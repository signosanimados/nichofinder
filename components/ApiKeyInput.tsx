import React, { useState } from 'react';
import { Key, ArrowRight, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiKeyInputProps {
  onSubmit: (openaiKey: string, youtubeKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [youtubeKey, setYoutubeKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey.trim() && youtubeKey.trim()) {
      onSubmit(openaiKey.trim(), youtubeKey.trim());
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
        <div className="flex justify-center gap-4 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Key className="w-8 h-8 text-purple-400" />
          </div>
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Youtube className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Configurar API Keys</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Configure suas chaves para usar o Nicho Finder com dados reais do YouTube.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                Criar chave OpenAI
              </a>
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
              YouTube Data API Key
            </label>
            <input
              type="password"
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                Criar chave YouTube
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={!openaiKey.trim() || !youtubeKey.trim()}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Comecar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Suas chaves sao armazenadas localmente no seu navegador.
        </p>
      </motion.div>
    </div>
  );
};

export default ApiKeyInput;
