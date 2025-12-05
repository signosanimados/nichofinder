import { UserAnswers, AnalysisResult, ViralAnalysisInput, ViralAnalysisResult } from '../types';

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
  input: unknown;
  result: unknown;
  youtube_data?: unknown;
  created_at: string;
}

// Local storage for history
const HISTORY_KEY = 'nichofinder_history';

function getLocalHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalHistory(item: HistoryItem & { result: unknown; input: unknown }) {
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

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpoint, {
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
    const result = await this.request<AnalysisResult>('/api/analyze-niche', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });

    // Save to local history
    const id = generateUUID();
    saveToLocalHistory({
      id,
      type: 'nicho_finder',
      title: `Nicho: ${result.nicho_nicho_finder_principal?.nome_do_nicho || 'Analise'}`,
      created_at: new Date().toISOString(),
      result,
      input: answers
    });

    return { ...result, analysisId: id };
  }

  // Viral Analyzer Analysis
  async analyzeViral(input: ViralAnalysisInput): Promise<ViralAnalysisResult & { analysisId?: string }> {
    const result = await this.request<ViralAnalysisResult>('/api/analyze-viral', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    // Save to local history
    const id = generateUUID();
    saveToLocalHistory({
      id,
      type: 'viral_analyzer',
      title: `Viral: ${input.value || 'Tendencias Atuais'}`,
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
  async downloadPDF(type: 'nicho_finder' | 'viral_analyzer', data: AnalysisResult | ViralAnalysisResult): Promise<void> {
    const printContent = this.generatePrintableHTML(type, data);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  private generatePrintableHTML(type: string, data: AnalysisResult | ViralAnalysisResult): string {
    const title = type === 'viral_analyzer' ? 'Analise de Tendencias Virais' : 'Relatorio Nicho Finder';
    const date = new Date().toLocaleDateString('pt-BR');

    if (type === 'viral_analyzer') {
      const viralData = data as ViralAnalysisResult;
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
            <p>${viralData.resumo_executivo || ''}</p>
          </div>

          <div class="section">
            <h2>Oportunidades de Tendencia</h2>
            ${(viralData.oportunidades_tendencia || []).map((o) => `
              <div class="item">
                <strong>${o.titulo}</strong>
                <span class="badge ${o.urgencia}">${o.urgencia}</span>
                <p>${o.descricao}</p>
                <p><em>Por que viraliza: ${o.por_que_pode_viralizar}</em></p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Titulos Virais Prontos</h2>
            ${(viralData.titulos_virais_prontos || []).map((t, i) => `
              <div class="item">
                <strong>${i + 1}. "${t.titulo}"</strong>
                <p>${t.por_que_funciona}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Ideias de Videos</h2>
            ${(viralData.ideias_videos_virais || []).map((v, i) => `
              <div class="item">
                <strong>${i + 1}. ${v.titulo}</strong>
                <p>${v.descricao_curta}</p>
                <p><em>Formato: ${v.formato_sugerido}</em></p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Calendario de 7 Dias</h2>
            <div class="calendar">
              ${(viralData.calendario_conteudo || []).map((d) => `
                <div class="day">
                  <span class="day-num">Dia ${d.dia}</span>: ${d.tema}
                  <br><small>Formato: ${d.formato}</small>
                  <br><strong>"${d.titulo_sugerido}"</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>Conclusao Estrategica</h2>
            <p><strong>Caminho mais promissor:</strong> ${viralData.conclusao_estrategica?.caminho_mais_promissor || ''}</p>
            <p><strong>Onde focar:</strong> ${viralData.conclusao_estrategica?.onde_focar || ''}</p>
            <p><strong>Formato para testar:</strong> ${viralData.conclusao_estrategica?.formato_para_testar_primeiro || ''}</p>
            <h3>Proximos Passos</h3>
            <ul>
              ${(viralData.conclusao_estrategica?.proximos_passos || []).map((p) => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </body>
        </html>
      `;
    } else {
      const nichoData = data as AnalysisResult;
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
            <p>${nichoData.resumo_perfil || ''}</p>
          </div>

          <div class="section">
            <h2>Nicho Principal Recomendado</h2>
            <div class="item winner">
              <h3>${nichoData.nicho_nicho_finder_principal?.nome_do_nicho || ''}</h3>
              <p>${nichoData.nicho_nicho_finder_principal?.explicacao || ''}</p>
              <h4>Plano de 7 Dias</h4>
              <ul>
                ${(nichoData.nicho_nicho_finder_principal?.plano_de_acao_7_dias || []).map((p, i) => `<li><strong>Dia ${i + 1}:</strong> ${p}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>Outros Nichos Sugeridos</h2>
            ${(nichoData.nichos_sugeridos || []).map((n) => `
              <div class="item">
                <h3>${n.nome_do_nicho}</h3>
                <p>${n.descricao_do_nicho}</p>
                <p><strong>Por que combina:</strong> ${n.por_que_enquadra_no_perfil}</p>
                <p><strong>Publico:</strong> ${n.publico_alvo_detalhado}</p>
                <p><em>Dificuldade: ${n.dificuldade_de_crescimento} | Monetizacao: ${n.potencial_de_monetizacao}</em></p>
                <h4>Ideias de Video</h4>
                <ul>
                  ${(n.ideias_de_video_iniciais || []).slice(0, 5).map((v) => `<li>${v}</li>`).join('')}
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
