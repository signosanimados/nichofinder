import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Youtube,
  Search,
  TrendingUp,
  Flame,
  ArrowRight,
  ArrowLeft,
  Globe
} from 'lucide-react';
import { VIRAL_INPUT_TYPES, LANGUAGE_OPTIONS } from '../constants';
import { ViralAnalysisInput, ViralInputType } from '../types';

interface ViralInputProps {
  onComplete: (input: ViralAnalysisInput) => void;
  onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Target,
  Youtube,
  Search,
  TrendingUp,
  Flame
};

const ViralInput: React.FC<ViralInputProps> = ({ onComplete, onBack }) => {
  const [selectedType, setSelectedType] = useState<ViralInputType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<'pt-br' | 'en'>('pt-br');

  const selectedTypeInfo = VIRAL_INPUT_TYPES.find(t => t.id === selectedType);

  const handleSubmit = () => {
    if (selectedType === 'trending_now') {
      onComplete({
        type: selectedType,
        value: 'trending',
        language
      });
    } else if (selectedType && inputValue.trim()) {
      onComplete({
        type: selectedType,
        value: inputValue.trim(),
        language
      });
    }
  };

  const canSubmit = selectedType === 'trending_now' || (selectedType && inputValue.trim().length >= 2);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-slate-900">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-400 mb-4">
            <TrendingUp className="w-4 h-4" />
            Viral Analyzer
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            O que você quer analisar?
          </h1>
          <p className="text-gray-400">
            Escolha o tipo de análise e deixe a IA descobrir as oportunidades
          </p>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8"
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as 'pt-br' | 'en')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                language === lang.id
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {VIRAL_INPUT_TYPES.map((type, idx) => {
            const Icon = iconMap[type.icon];
            const isSelected = selectedType === type.id;

            return (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => {
                  setSelectedType(type.id as ViralInputType);
                  if (type.id === 'trending_now') {
                    setInputValue('');
                  }
                }}
                className={`group relative p-5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500'
                    : 'bg-slate-800/50 border border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className={`inline-flex p-2 rounded-lg mb-3 ${
                  isSelected ? 'bg-orange-500' : 'bg-slate-700 group-hover:bg-slate-600'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{type.title}</h3>
                <p className="text-sm text-gray-400">{type.description}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Input Field */}
        <AnimatePresence>
          {selectedType && selectedType !== 'trending_now' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {selectedTypeInfo?.title}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedTypeInfo?.placeholder}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Now Message */}
        <AnimatePresence>
          {selectedType === 'trending_now' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
                <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Pronto para descobrir as tendências!
                </h3>
                <p className="text-gray-400">
                  A IA vai analisar o que está viralizando agora no YouTube globalmente e no Brasil.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              canSubmit
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/25'
                : 'bg-slate-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Analisar Tendências
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ViralInput;
