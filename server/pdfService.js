import PDFDocument from 'pdfkit';

/**
 * Generate PDF report from analysis data
 */
export async function generatePDF(type, data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24)
        .fillColor('#6366f1')
        .text('NichoFinder', { align: 'center' });

      doc.moveDown(0.5);
      doc.fontSize(12)
        .fillColor('#64748b')
        .text(type === 'viral_analyzer' ? 'Relatório de Análise Viral' : 'Relatório Nicho Finder', { align: 'center' });

      doc.moveDown(0.5);
      doc.fontSize(10)
        .fillColor('#94a3b8')
        .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

      doc.moveDown(2);

      if (type === 'viral_analyzer') {
        generateViralPDF(doc, data);
      } else {
        generateNichoPDF(doc, data);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generateViralPDF(doc, data) {
  // Resumo Executivo
  addSection(doc, 'Resumo Executivo');
  doc.fontSize(11)
    .fillColor('#334155')
    .text(data.resumo_executivo, { align: 'justify' });

  doc.moveDown(1.5);

  // Oportunidades de Tendência
  addSection(doc, 'Oportunidades de Tendência');
  data.oportunidades_tendencia?.forEach((opp, idx) => {
    doc.fontSize(11)
      .fillColor('#1e293b')
      .text(`${idx + 1}. ${opp.titulo}`, { continued: false });

    doc.fontSize(10)
      .fillColor('#475569')
      .text(opp.descricao);

    doc.fontSize(9)
      .fillColor('#6366f1')
      .text(`Por que viraliza: ${opp.por_que_pode_viralizar}`);

    doc.fontSize(9)
      .fillColor(opp.urgencia === 'alta' ? '#ef4444' : opp.urgencia === 'media' ? '#f59e0b' : '#22c55e')
      .text(`Urgência: ${opp.urgencia.toUpperCase()}`);

    doc.moveDown(0.5);
  });

  doc.addPage();

  // Formatos que Funcionam
  addSection(doc, 'Formatos que Funcionam');
  data.formatos_funcionando?.forEach((format, idx) => {
    doc.fontSize(11)
      .fillColor('#1e293b')
      .text(`${format.nome} (Potencial: ${format.potencial_no_nicho})`);

    doc.fontSize(10)
      .fillColor('#475569')
      .text(format.descricao);

    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // Títulos Virais
  addSection(doc, 'Títulos Virais Prontos');
  data.titulos_virais_prontos?.forEach((title, idx) => {
    doc.fontSize(11)
      .fillColor('#1e293b')
      .text(`${idx + 1}. "${title.titulo}"`);

    doc.fontSize(9)
      .fillColor('#6366f1')
      .text(`   → ${title.por_que_funciona}`);

    doc.moveDown(0.3);
  });

  doc.addPage();

  // Ideias de Vídeos
  addSection(doc, 'Ideias de Vídeos Virais');
  data.ideias_videos_virais?.slice(0, 10).forEach((idea, idx) => {
    doc.fontSize(11)
      .fillColor('#1e293b')
      .text(`${idx + 1}. ${idea.titulo}`);

    doc.fontSize(10)
      .fillColor('#475569')
      .text(`   ${idea.descricao_curta}`);

    doc.fontSize(9)
      .fillColor('#64748b')
      .text(`   Formato: ${idea.formato_sugerido}`);

    doc.moveDown(0.5);
  });

  doc.addPage();

  // Calendário de Conteúdo
  addSection(doc, 'Calendário de Conteúdo - 7 Dias');
  data.calendario_conteudo?.forEach(day => {
    doc.fontSize(11)
      .fillColor('#6366f1')
      .text(`Dia ${day.dia}: ${day.tema}`);

    doc.fontSize(10)
      .fillColor('#475569')
      .text(`   Formato: ${day.formato}`)
      .text(`   Título: "${day.titulo_sugerido}"`)
      .text(`   Objetivo: ${day.objetivo}`);

    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // Conclusão Estratégica
  addSection(doc, 'Conclusão Estratégica');

  doc.fontSize(11)
    .fillColor('#1e293b')
    .text('Caminho Mais Promissor:', { continued: true })
    .fillColor('#475569')
    .text(` ${data.conclusao_estrategica?.caminho_mais_promissor}`);

  doc.fontSize(11)
    .fillColor('#1e293b')
    .text('Onde Focar:', { continued: true })
    .fillColor('#475569')
    .text(` ${data.conclusao_estrategica?.onde_focar}`);

  doc.fontSize(11)
    .fillColor('#1e293b')
    .text('Formato para Testar:', { continued: true })
    .fillColor('#475569')
    .text(` ${data.conclusao_estrategica?.formato_para_testar_primeiro}`);

  doc.moveDown(1);
  doc.fontSize(11)
    .fillColor('#1e293b')
    .text('Próximos Passos:');

  data.conclusao_estrategica?.proximos_passos?.forEach((step, idx) => {
    doc.fontSize(10)
      .fillColor('#475569')
      .text(`   ${idx + 1}. ${step}`);
  });
}

function generateNichoPDF(doc, data) {
  // Resumo do Perfil
  addSection(doc, 'Resumo do Perfil');
  doc.fontSize(11)
    .fillColor('#334155')
    .text(data.resumo_perfil, { align: 'justify' });

  doc.moveDown(1.5);

  // Nicho Principal
  addSection(doc, 'Nicho Principal Recomendado');

  doc.fontSize(14)
    .fillColor('#6366f1')
    .text(data.nicho_nicho_finder_principal?.nome_do_nicho);

  doc.fontSize(11)
    .fillColor('#475569')
    .text(data.nicho_nicho_finder_principal?.explicacao, { align: 'justify' });

  doc.moveDown(1);
  doc.fontSize(11)
    .fillColor('#1e293b')
    .text('Plano de 7 Dias:');

  data.nicho_nicho_finder_principal?.plano_de_acao_7_dias?.forEach((step, idx) => {
    doc.fontSize(10)
      .fillColor('#475569')
      .text(`   Dia ${idx + 1}: ${step}`);
  });

  doc.addPage();

  // Outros Nichos Sugeridos
  addSection(doc, 'Outros Nichos Sugeridos');

  data.nichos_sugeridos?.forEach((niche, idx) => {
    doc.fontSize(12)
      .fillColor('#6366f1')
      .text(`${idx + 1}. ${niche.nome_do_nicho}`);

    doc.fontSize(10)
      .fillColor('#475569')
      .text(niche.descricao_do_nicho);

    doc.fontSize(9)
      .fillColor('#64748b')
      .text(`Dificuldade: ${niche.dificuldade_de_crescimento} | Monetização: ${niche.potencial_de_monetizacao}`);

    doc.moveDown(0.5);
    doc.fontSize(10)
      .fillColor('#1e293b')
      .text('Ideias de vídeo:');

    niche.ideias_de_video_iniciais?.slice(0, 3).forEach(idea => {
      doc.fontSize(9)
        .fillColor('#475569')
        .text(`   • ${idea}`);
    });

    doc.moveDown(1);
  });
}

function addSection(doc, title) {
  doc.fontSize(14)
    .fillColor('#1e293b')
    .text(title, { underline: true });
  doc.moveDown(0.5);
}
