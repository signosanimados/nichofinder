import React, { useState } from 'react';
import Hero from './components/Hero';
import StepWizard from './components/StepWizard';
import Loading from './components/Loading';
import ResultsDashboard from './components/ResultsDashboard';
import ApiKeyInput from './components/ApiKeyInput';
import ModeSelector from './components/ModeSelector';
import ViralInput from './components/ViralInput';
import ViralResultsDashboard from './components/ViralResultsDashboard';
import { generateNicheAnalysis } from './services/geminiService';
import { generateViralAnalysis } from './services/viralAnalyzerService';
import {
  AppState,
  UserAnswers,
  AnalysisResult,
  AnalysisMode,
  ViralAnalysisInput,
  ViralAnalysisResult
} from './types';

const App: React.FC = () => {
  // Use env var if present, otherwise wait for user input
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || "");
  const [appState, setAppState] = useState<AppState>(
    process.env.API_KEY ? AppState.WELCOME : AppState.API_KEY_INPUT
  );
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode | null>(null);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viralResult, setViralResult] = useState<ViralAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setAppState(AppState.WELCOME);
  };

  const handleStart = () => {
    setAppState(AppState.MODE_SELECT);
  };

  const handleModeSelect = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    if (mode === 'nicho_finder') {
      setAppState(AppState.FORM);
    } else {
      setAppState(AppState.VIRAL_INPUT);
    }
  };

  const handleFormComplete = async (answers: UserAnswers) => {
    setAppState(AppState.LOADING);
    try {
      const analysisData = await generateNicheAnalysis(answers, apiKey);
      setResult(analysisData);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleViralAnalysis = async (input: ViralAnalysisInput) => {
    setAppState(AppState.LOADING);
    try {
      const analysisData = await generateViralAnalysis(input, apiKey);
      setViralResult(analysisData);
      setAppState(AppState.VIRAL_RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleBackToModeSelect = () => {
    setAppState(AppState.MODE_SELECT);
  };

  const handleReset = () => {
    setAppState(AppState.MODE_SELECT);
    setResult(null);
    setViralResult(null);
    setError(null);
    setAnalysisMode(null);
  };

  return (
    <div className="antialiased text-slate-50 bg-slate-900 min-h-screen">
      {appState === AppState.API_KEY_INPUT && (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      )}

      {appState === AppState.WELCOME && (
        <Hero onStart={handleStart} />
      )}

      {appState === AppState.MODE_SELECT && (
        <ModeSelector onSelectMode={handleModeSelect} />
      )}

      {appState === AppState.FORM && (
        <StepWizard onComplete={handleFormComplete} />
      )}

      {appState === AppState.VIRAL_INPUT && (
        <ViralInput onComplete={handleViralAnalysis} onBack={handleBackToModeSelect} />
      )}

      {appState === AppState.LOADING && (
        <Loading />
      )}

      {appState === AppState.RESULTS && result && (
        <ResultsDashboard data={result} onReset={handleReset} />
      )}

      {appState === AppState.VIRAL_RESULTS && viralResult && (
        <ViralResultsDashboard data={viralResult} onReset={handleReset} />
      )}

      {appState === AppState.ERROR && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-full bg-red-500/10 mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
          <p className="text-gray-400 mb-6 max-w-md">{error || "Não conseguimos gerar sua análise. Verifique sua chave de API ou tente novamente."}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
