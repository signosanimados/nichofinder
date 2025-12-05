import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import StepWizard from './components/StepWizard';
import Loading from './components/Loading';
import ResultsDashboard from './components/ResultsDashboard';
import ModeSelector from './components/ModeSelector';
import ViralInput from './components/ViralInput';
import ViralResultsDashboard from './components/ViralResultsDashboard';
import AnalysisHistory from './components/AnalysisHistory';
import { apiService } from './services/apiService';
import {
  AppState,
  UserAnswers,
  AnalysisResult,
  AnalysisMode,
  ViralAnalysisInput,
  ViralAnalysisResult
} from './types';
import { History } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viralResult, setViralResult] = useState<ViralAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiService.healthCheck();
        setBackendAvailable(true);
      } catch {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

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
      const analysisData = await apiService.analyzeNiche(answers);
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
      const analysisData = await apiService.analyzeViral(input);
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

  const handleSelectFromHistory = (analysis: any) => {
    if (analysis.type === 'nicho_finder') {
      setResult(analysis.result);
      setAppState(AppState.RESULTS);
    } else {
      setViralResult(analysis.result);
      setAppState(AppState.VIRAL_RESULTS);
    }
  };

  // Show backend status warning if not available
  if (backendAvailable === false) {
    return (
      <div className="antialiased text-slate-50 bg-slate-900 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="p-4 rounded-full bg-yellow-500/10 mb-4 inline-block">
            <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Backend não disponível</h2>
          <p className="text-gray-400 mb-6">
            O servidor backend não está rodando. Por favor, inicie o servidor:
          </p>
          <div className="bg-slate-800 rounded-lg p-4 text-left font-mono text-sm text-gray-300 mb-6">
            <p>cd server</p>
            <p>npm install</p>
            <p>cp .env.example .env</p>
            <p># Edite .env com suas API keys</p>
            <p>npm run dev</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Loading state while checking backend
  if (backendAvailable === null) {
    return (
      <div className="antialiased text-slate-50 bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="antialiased text-slate-50 bg-slate-900 min-h-screen">
      {/* History Button - Fixed */}
      {appState !== AppState.LOADING && (
        <button
          onClick={() => setHistoryOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full shadow-lg z-40 transition-colors"
          title="Histórico de análises"
        >
          <History className="w-6 h-6 text-purple-400" />
        </button>
      )}

      {/* History Modal */}
      <AnalysisHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectAnalysis={handleSelectFromHistory}
      />

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
