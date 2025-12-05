import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, saveAnalysis, getAnalyses, getAnalysisById, deleteAnalysis } from './database.js';
import { generateNicheAnalysis, generateViralAnalysis } from './geminiService.js';
import { fetchYouTubeData } from './youtubeService.js';
import { generatePDF } from './pdfService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ NICHO FINDER ============
app.post('/api/analyze/niche', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !answers.passion || !answers.skill || !answers.market || !answers.monetization) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await generateNicheAnalysis(answers);

    // Save to history
    const saved = saveAnalysis({
      type: 'nicho_finder',
      input: JSON.stringify(answers),
      result: JSON.stringify(result),
      title: `Nicho: ${result.nicho_nicho_finder_principal?.nome_do_nicho || 'Análise'}`
    });

    res.json({ ...result, analysisId: saved.id });
  } catch (error) {
    console.error('Niche analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ VIRAL ANALYZER ============
app.post('/api/analyze/viral', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || !input.type) {
      return res.status(400).json({ error: 'Missing input type' });
    }

    // Fetch YouTube data if applicable
    let youtubeData = null;
    if (input.type !== 'trending_now' && input.value) {
      try {
        youtubeData = await fetchYouTubeData(input.type, input.value);
      } catch (ytError) {
        console.warn('YouTube API error (continuing without YouTube data):', ytError.message);
      }
    }

    const result = await generateViralAnalysis(input, youtubeData);

    // Save to history
    const saved = saveAnalysis({
      type: 'viral_analyzer',
      input: JSON.stringify(input),
      result: JSON.stringify(result),
      title: `Viral: ${input.value || 'Tendências Atuais'}`,
      youtube_data: youtubeData ? JSON.stringify(youtubeData) : null
    });

    res.json({ ...result, analysisId: saved.id, youtubeData });
  } catch (error) {
    console.error('Viral analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ YOUTUBE DATA ============
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const data = await fetchYouTubeData(type || 'keyword', query);
    res.json(data);
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ HISTORY ============
app.get('/api/history', (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    const analyses = getAnalyses(type, parseInt(limit));
    res.json(analyses);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history/:id', (req, res) => {
  try {
    const analysis = getAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history/:id', (req, res) => {
  try {
    deleteAnalysis(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PDF EXPORT ============
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { analysisId, type, data } = req.body;

    let analysisData = data;
    if (analysisId && !data) {
      const stored = getAnalysisById(analysisId);
      if (stored) {
        analysisData = JSON.parse(stored.result);
      }
    }

    if (!analysisData) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const pdfBuffer = await generatePDF(type, analysisData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nichofinder-${type}-${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API Keys configured:', {
    gemini: process.env.GEMINI_API_KEY ? 'Yes' : 'No',
    youtube: process.env.YOUTUBE_API_KEY ? 'Yes' : 'No'
  });
});
