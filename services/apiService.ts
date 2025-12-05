import { UserAnswers, AnalysisResult, ViralAnalysisInput, ViralAnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface HistoryItem {
  id: string;
  type: 'nicho_finder' | 'viral_analyzer';
  title: string;
  created_at: string;
}

interface FullAnalysis {
  id: string;
  type: string;
  title: string;
  input: any;
  result: any;
  youtube_data?: any;
  created_at: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/api/health');
  }

  // Nicho Finder Analysis
  async analyzeNiche(answers: UserAnswers): Promise<AnalysisResult & { analysisId: string }> {
    return this.request('/api/analyze/niche', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Viral Analyzer Analysis
  async analyzeViral(input: ViralAnalysisInput): Promise<ViralAnalysisResult & { analysisId: string; youtubeData?: any }> {
    return this.request('/api/analyze/viral', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
  }

  // YouTube Search
  async searchYouTube(query: string, type?: string): Promise<any> {
    const params = new URLSearchParams({ query });
    if (type) params.append('type', type);
    return this.request(`/api/youtube/search?${params}`);
  }

  // History
  async getHistory(type?: string, limit: number = 50): Promise<HistoryItem[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', String(limit));
    return this.request(`/api/history?${params}`);
  }

  async getAnalysisById(id: string): Promise<FullAnalysis> {
    return this.request(`/api/history/${id}`);
  }

  async deleteAnalysis(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/history/${id}`, { method: 'DELETE' });
  }

  // PDF Export
  async exportPDF(type: 'nicho_finder' | 'viral_analyzer', data: any): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/export/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response.blob();
  }

  // Download PDF helper
  async downloadPDF(type: 'nicho_finder' | 'viral_analyzer', data: any, filename?: string): Promise<void> {
    const blob = await this.exportPDF(type, data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `nichofinder-${type}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const apiService = new ApiService();
export default apiService;
