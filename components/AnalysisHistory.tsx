import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Target,
  TrendingUp,
  Trash2,
  Eye,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface HistoryItem {
  id: string;
  type: 'nicho_finder' | 'viral_analyzer';
  title: string;
  created_at: string;
}

interface AnalysisHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnalysis: (analysis: any) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ isOpen, onClose, onSelectAnalysis }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'nicho_finder' | 'viral_analyzer'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, filter]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const type = filter === 'all' ? undefined : filter;
      const items = await apiService.getHistory(type);
      setHistory(items);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: string) => {
    try {
      const analysis = await apiService.getAnalysisById(id);
      onSelectAnalysis(analysis);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiService.deleteAnalysis(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <History className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Histórico de Análises</h2>
                <p className="text-sm text-gray-400">{history.length} análises salvas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 p-4 border-b border-slate-800">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'nicho_finder', label: 'Nicho Finder' },
              { id: 'viral_analyzer', label: 'Viral Analyzer' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[50vh] p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-red-400">{error}</p>
                <button
                  onClick={loadHistory}
                  className="mt-4 text-sm text-purple-400 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-400">Nenhuma análise encontrada</p>
                <p className="text-sm text-gray-500 mt-2">
                  Suas análises aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'viral_analyzer'
                            ? 'bg-orange-500/10'
                            : 'bg-purple-500/10'
                        }`}>
                          {item.type === 'viral_analyzer' ? (
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                          ) : (
                            <Target className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Ver análise"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          {deletingId === item.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalysisHistory;
