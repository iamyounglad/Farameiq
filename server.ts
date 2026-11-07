import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { AIGateway } from './server/ai/AIGateway';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const aiGateway = new AIGateway();

// Parse large JSON payloads for high-resolution photo uploads (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'FRAMEIQ by FAZLENZ',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    promptVersion: 'v2.1-deterministic',
  });
});

// Centralized Version-Controlled Rubric Schema (8 Categories with 0-100 Scoring and Defined Weights)
const photoAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: 'Calculated overall score 0 to 100 based on weighted rubric.',
    },
    overallTier: {
      type: Type.STRING,
      description: 'Exhibition Grade (90-100), Professional Standard (80-89), Advanced Practice (70-79), Developing Vision (55-69), or Foundational Study (<55)',
    },
    summary: {
      type: Type.STRING,
      description: 'A sharp, professional 2-3 sentence visual critique summarizing the photograph.',
    },
    professionalVerdict: {
      type: Type.STRING,
      description: 'An authoritative master verdict from the FAZLENZ artistic director.',
    },
    strongestAspect: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        explanation: { type: Type.STRING },
      },
      required: ['title', 'explanation'],
    },
    areasNeedingImprovement: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 specific areas where the image can be technically or creatively elevated.',
    },
    categories: {
      type: Type.OBJECT,
      properties: {
        exposure: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Exposure' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        focusAndSharpness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Focus and sharpness' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        composition: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Composition' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '20' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        lighting: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Lighting' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '15' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        whiteBalance: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for White balance' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        contrast: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Contrast' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        colourAccuracy: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Colour accuracy' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '10' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
        backgroundAndDistractions: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score 0 to 100 for Background and distractions' },
            maxScore: { type: Type.INTEGER },
            weight: { type: Type.INTEGER, description: '5' },
            rating: { type: Type.STRING },
            keyObservations: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ['score', 'maxScore', 'weight', 'rating', 'keyObservations', 'advice'],
        },
      },
      required: [
        'exposure',
        'focusAndSharpness',
        'composition',
        'lighting',
        'whiteBalance',
        'contrast',
        'colourAccuracy',
        'backgroundAndDistractions',
      ],
    },
    composition: {
      type: Type.OBJECT,
      properties: {
        detectedRule: { type: Type.STRING },
        balance: { type: Type.STRING },
        eyeFlow: { type: Type.STRING },
        horizonNote: { type: Type.STRING },
      },
      required: ['detectedRule', 'balance', 'eyeFlow', 'horizonNote'],
    },
    lighting: {
      type: Type.OBJECT,
      properties: {
        lightQuality: { type: Type.STRING },
        dynamicRange: { type: Type.STRING },
        histogramImpression: { type: Type.STRING },
      },
      required: ['lightQuality', 'dynamicRange', 'histogramImpression'],
    },
    color: {
      type: Type.OBJECT,
      properties: {
        paletteType: { type: Type.STRING },
        dominantHexTones: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        whiteBalanceNote: { type: Type.STRING },
      },
      required: ['paletteType', 'dominantHexTones', 'whiteBalanceNote'],
    },
    technical: {
      type: Type.OBJECT,
      properties: {
        visibleDepthOfField: { type: Type.STRING },
        focalPlaneAccuracy: { type: Type.STRING },
        noiseAndArtifacts: { type: Type.STRING },
      },
      required: ['visibleDepthOfField', 'focalPlaneAccuracy', 'noiseAndArtifacts'],
    },
    practicalRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    editingSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    creativeDirections: {
      type: Type.OBJECT,
      properties: {
        cinematic: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        editorial: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        portrait: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        documentary: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
        commercial: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            specializedTip: { type: Type.STRING },
          },
          required: ['headline', 'advice', 'specializedTip'],
        },
      },
      required: ['cinematic', 'editorial', 'portrait', 'documentary', 'commercial'],
    },
  },
  required: [
    'overallScore',
    'overallTier',
    'summary',
    'professionalVerdict',
    'strongestAspect',
    'areasNeedingImprovement',
    'categories',
    'composition',
    'lighting',
    'color',
    'technical',
    'practicalRecommendations',
    'editingSuggestions',
    'creativeDirections',
  ],
};

// API Endpoint: /api/analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, fileName, fileSizeKB, imageDimensions } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({
        error: 'Missing image data or MIME type. Please provide a valid photograph.',
      });
    }

    const rawMime = (mimeType || '').toLowerCase();
    const normalizedMimeType = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(normalizedMimeType)) {
      return res.status(400).json({
        error: `Unsupported format: ${mimeType}. FRAMEIQ accepts JPG, JPEG, PNG, and WEBP.`,
      });
    }

    const approximateBytes = (imageBase64.length * 3) / 4;
    if (approximateBytes > 12 * 1024 * 1024) {
      return res.status(400).json({
        error: 'File size exceeds 10MB limit. Please upload a smaller image file.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').trim();

    const fullReport = await aiGateway.analyzePhoto(cleanBase64, normalizedMimeType, fileName || 'photograph.jpg', fileSizeKB || Math.round(approximateBytes / 1024), imageDimensions || null);

    return res.json(fullReport);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    const errorMessage = error?.message || 'An unexpected error occurred during photographic analysis.';
    return res.status(500).json({ error: errorMessage });
  }
});

// Deep Creative Direction Endpoint: /api/creative-direction
app.post('/api/creative-direction', async (req, res) => {
  try {
    const { imageBase64, mimeType, genre, currentSummary } = req.body;

    if (!imageBase64 || !mimeType || !genre) {
      return res.status(400).json({ error: 'Missing image or genre parameter.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').trim();

    const creativeResult = await aiGateway.generateCreativeDirection(cleanBase64, normalizedMimeType, genre, currentSummary);

    return res.json(creativeResult);
  } catch (error: any) {
    console.error('Error in /api/creative-direction:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate deep creative direction.' });
  }
});

// Mount Vite middleware in development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`FRAMEIQ by FAZLENZ server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
