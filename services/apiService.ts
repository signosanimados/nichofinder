import { UserAnswers, AnalysisResult, ViralAnalysisInput, ViralAnalysisResult } from '../types';

// In Vercel, API routes are at /api/*, no base URL needed
// Locally with the Express server, it's at http://localhost:3001/api/*
const isVercel = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE_URL = isVercel ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

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

// Local storage for history (since Vercel serverless is stateless)
const HISTORY_KEY = 'nichofinder_history';

function getLocalHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalHistory(item: HistoryItem & { result: any; input: any }) {
  try {
    const history = getLocalHistory();
    const fullHistory = JSON.parse(localStorage.getItem(HISTORY_KEY + '_full') || '[]');

    history.unshift({
      id: item.id,
      type: item.type,
      title: item.title,
      created_at: item.created_at
    });

    fullHistory.unshift(item);

    // Keep only last 50 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    localStorage.setItem(HISTORY_KEY + '_full', JSON.stringify(fullHistory.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save to history:', e);
  }
}

function getFullAnalysisFromLocal(id: string): FullAnalysis | null {
  try {
    const fullHistory = JSON.parse(localStorage.getItem(HISTORY_KEY + '_full') || '[]');
    return fullHistory.find((item: FullAnalysis) => item.id === id) || null;
  } catch {
    return null;
  }
}

function deleteFromLocalHistory(id: string) {
  try {
    const history = getLocalHistory().filter(item => item.id !== id);
    const fullHistory = JSON.parse(localStorage.getItem(HISTORY_KEY + '_full') || '[]')
      .filter((item: FullAnalysis) => item.id !== id);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    localStorage.setItem(HISTORY_KEY + '_full', JSON.stringify(fullHistory));
  } catch (e) {
    console.warn('Failed to delete from history:', e);
  }
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
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
  async analyzeNiche(answers: UserAnswers): Promise<AnalysisResult & { analysisId?: string }> {
    // Use Vercel endpoint format
    const result = await this.request<AnalysisResult>('/api/analyze-niche', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });

    // Save to local history
    const id = crypto.randomUUID();
    saveToLocalHistory({
      id,
      type: 'nicho_finder',
      title: `Nicho: ${result.nicho_nicho_finder_principal?.nome_do_nicho || 'Análise'}`,
      created_at: new Date().toISOString(),
      result,
      input: answers
    });

    return { ...result, analysisId: id };
  }

  // Viral Analyzer Analysis
  async analyzeViral(input: ViralAnalysisInput): Promise<ViralAnalysisResult & { analysisId?: string }> {
    // Use Vercel endpoint format
    const result = await this.request<ViralAnalysisResult>('/api/analyze-viral', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    // Save to local history
    const id = crypto.randomUUID();
    saveToLocalHistory({
      id,
      type: 'viral_analyzer',
      title: `Viral: ${input.value || 'Tendências Atuais'}`,
      created_at: new Date().toISOString(),
      result,
      input
    });

    return { ...result, analysisId: id };
  }

  // History (using localStorage)
  async getHistory(type?: string, limit: number = 50): Promise<HistoryItem[]> {
    let history = getLocalHistory();

    if (type) {
      history = history.filter(item => item.type === type);
    }

    return history.slice(0, limit);
  }

  async getAnalysisById(id: string): Promise<FullAnalysis | null> {
    return getFullAnalysisFromLocal(id);
  }

  async deleteAnalysis(id: string): Promise<{ success: boolean }> {
    deleteFromLocalHistory(id);
    return { success: true };
  }

  // PDF Export - Generate in browser
  async downloadPDF(type: 'nicho_finder' | 'viral_analyzer', data: any, filename?: string): Promise<void> {
    // Create a printable version
    const printContent = this.generatePrintableHTML(type, data);

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  private generatePrintableHTML(type: string, data: any): string {
    const title = type === 'viral_analyzer' ? 'Análise de Tendências Virais' : 'Relatório Nicho Finder';
    const date = new Date().toLocaleDateString('pt-BR');

    if (type === 'viral_analyzer') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
            h2 { color: #1e293b; margin-top: 30px; }
            h3 { color: #475569; }
            .section { margin-bottom: 30px; }
            .item { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #6366f1; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px; }
            .alta { background: #fee2e2; color: #dc2626; }
            .media { background: #fef3c7; color: #d97706; }
            .baixa { background: #dcfce7; color: #16a34a; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
            .calendar { display: grid; gap: 10px; }
            .day { background: #f1f5f9; padding: 15px; border-radius: 8px; }
            .day-num { font-weight: bold; color: #6366f1; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p style="color: #64748b;">Gerado em: ${date}</p>

          <div class="section">
            <h2>Resumo Executivo</h2>
            <p>${data.resumo_executivo || ''}</p>
          </div>

          <div class="section">
            <h2>Oportunidades de Tendência</h2>
            ${(data.oportunidades_tendencia || []).map((o: any) => `
              <div class="item">
                <strong>${o.titulo}</strong>
                <span class="badge ${o.urgencia}">${o.urgencia}</span>
                <p>${o.descricao}</p>
                <p><em>Por que viraliza: ${o.por_que_pode_viralizar}</em></p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Títulos Virais Prontos</h2>
            ${(data.titulos_virais_prontos || []).map((t: any, i: number) => `
              <div class="item">
                <strong>${i + 1}. "${t.titulo}"</strong>
                <p>${t.por_que_funciona}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Ideias de Vídeos</h2>
            ${(data.ideias_videos_virais || []).map((v: any, i: number) => `
              <div class="item">
                <strong>${i + 1}. ${v.titulo}</strong>
                <p>${v.descricao_curta}</p>
                <p><em>Formato: ${v.formato_sugerido}</em></p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Calendário de 7 Dias</h2>
            <div class="calendar">
              ${(data.calendario_conteudo || []).map((d: any) => `
                <div class="day">
                  <span class="day-num">Dia ${d.dia}</span>: ${d.tema}
                  <br><small>Formato: ${d.formato}</small>
                  <br><strong>"${d.titulo_sugerido}"</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>Conclusão Estratégica</h2>
            <p><strong>Caminho mais promissor:</strong> ${data.conclusao_estrategica?.caminho_mais_promissor || ''}</p>
            <p><strong>Onde focar:</strong> ${data.conclusao_estrategica?.onde_focar || ''}</p>
            <p><strong>Formato para testar:</strong> ${data.conclusao_estrategica?.formato_para_testar_primeiro || ''}</p>
            <h3>Próximos Passos</h3>
            <ul>
              ${(data.conclusao_estrategica?.proximos_passos || []).map((p: string) => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </body>
        </html>
      `;
    } else {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
            h2 { color: #1e293b; margin-top: 30px; }
            .section { margin-bottom: 30px; }
            .item { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #6366f1; }
            .winner { background: linear-gradient(135deg, #fef3c7, #fde68a); border-left: 4px solid #f59e0b; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p style="color: #64748b;">Gerado em: ${date}</p>

          <div class="section">
            <h2>Resumo do Perfil</h2>
            <p>${data.resumo_perfil || ''}</p>
          </div>

          <div class="section">
            <h2>Nicho Principal Recomendado</h2>
            <div class="item winner">
              <h3>${data.nicho_nicho_finder_principal?.nome_do_nicho || ''}</h3>
              <p>${data.nicho_nicho_finder_principal?.explicacao || ''}</p>
              <h4>Plano de 7 Dias</h4>
              <ul>
                ${(data.nicho_nicho_finder_principal?.plano_de_acao_7_dias || []).map((p: string, i: number) => `<li><strong>Dia ${i + 1}:</strong> ${p}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>Outros Nichos Sugeridos</h2>
            ${(data.nichos_sugeridos || []).map((n: any) => `
              <div class="item">
                <h3>${n.nome_do_nicho}</h3>
                <p>${n.descricao_do_nicho}</p>
                <p><strong>Por que combina:</strong> ${n.por_que_enquadra_no_perfil}</p>
                <p><strong>Público:</strong> ${n.publico_alvo_detalhado}</p>
                <p><em>Dificuldade: ${n.dificuldade_de_crescimento} | Monetização: ${n.potencial_de_monetizacao}</em></p>
                <h4>Ideias de Vídeo</h4>
                <ul>
                  ${(n.ideias_de_video_iniciais || []).slice(0, 5).map((v: string) => `<li>${v}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
