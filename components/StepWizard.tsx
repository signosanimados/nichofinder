import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { QUESTIONS } from '../constants';
import { UserAnswers } from '../types';

interface StepWizardProps {
  onComplete: (answers: UserAnswers) => void;
}

const StepWizard: React.FC<StepWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({
    passion: '',
    skill: '',
    market: '',
    monetization: ''
  });

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const field = QUESTIONS[currentStep].id as keyof UserAnswers;
    setAnswers(prev => ({ ...prev, [field]: e.target.value }));
  };

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const isCurrentEmpty = answers[currentQuestion.id as keyof UserAnswers].trim().length < 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono uppercase tracking-widest">
            <span>Passo {currentStep + 1} de {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-400 mb-6">{currentQuestion.description}</p>
            
            <textarea
              className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-lg"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id as keyof UserAnswers]}
              onChange={handleChange}
              autoFocus
            />

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors ${currentStep === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>

              <button
                onClick={handleNext}
                disabled={isCurrentEmpty}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  isCurrentEmpty 
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-slate-900 hover:bg-purple-50'
                }`}
              >
                {currentStep === QUESTIONS.length - 1 ? 'Finalizar Análise' : 'Próximo'}
                {currentStep === QUESTIONS.length - 1 ? <Check className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StepWizard;