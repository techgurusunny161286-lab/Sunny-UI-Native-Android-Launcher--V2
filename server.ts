import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint for AI Theme Generation
app.post('/api/generate-theme', async (req, res) => {
  try {
    const { mood, currentWallpaperId } = req.body;
    if (!mood && !currentWallpaperId) {
      return res.status(400).json({ error: 'Mood or current wallpaper is required' });
    }

    if (!ai) {
      // If API key is not configured, send 503 so client falls back to local procedural AI
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const prompt = `
You are an expert mobile UI/UX designer for SolOS (an advanced tactile glass mobile launcher).
Generate a cohesive mobile theme matching the user's aesthetic request:
User Mood / Concept: "${mood || 'Harmonious daylight golden solar'}"
Current Wallpaper ID: "${currentWallpaperId || 'golden'}"

Select matching properties strictly from the allowed values:
- iconPack: "ios-glass" | "neon-cyber" | "frost-crystal" | "golden-solstice" | "retro-clay"
- wallpaper: "golden" | "sunset" | "live-solar-flare" | "live-aurora" | "live-caustics" | "live-starfield" | "parallax-dunes" | "parallax-nebula" | "parallax-prisms" | "circadian-dynamic" | "amoled-obsidian" | "minimal-silk" | "botanical-emerald" | "prism"
- themeMode: "light" | "dark"
- systemFont: "sf-pro" | "jakarta" | "outfit" | "playfair" | "jetbrains" | "orbitron"
- systemFontSize: "compact" | "standard" | "large" | "xlarge"
- systemTextColor: "adaptive" | "amber" | "white" | "mint" | "rose" | "azure"
- statusBarStyle: "ios-classic" | "android-minimal" | "cyber-neon" | "pill-compact"
- batteryStyle: "capsule-outside" | "capsule-inside" | "circle-meter" | "bar-only" | "percentage-only"
- signalStyle: "bars" | "dots" | "cyber"
- clockPosition: "left" | "center" | "right"
- controlCenterAccent: "amber" | "emerald" | "blue" | "purple" | "coral"
- lockClockStyle: "ios-depth" | "minimal-serif" | "solar-sundial" | "retro-flip" | "cyber-hud"
- aodTheme: "eclipse-ring" | "minimal-digital" | "analog-sundial" | "bioluminescent-wave" | "star-map"
- bootAnimation: "solar-flare" | "liquid-apple" | "cyber-matrix" | "retro-mac" | "nebula-ignition"
- soundPack: "solar-harmonix" | "cyber-neon" | "zen-bamboo" | "8bit-arcade" | "mechanical-typewriter" | "ethereal-crystal"

Return valid JSON with:
{
  "themeName": string,
  "badge": string,
  "rationale": string (short 1-2 sentence aesthetic explanation of why these colors, icons, and sounds were picked),
  "moodTags": string[],
  "dominantHex": string,
  "secondaryHex": string,
  "previewBg": string (CSS linear-gradient),
  "iconPack": string,
  "wallpaper": string,
  "themeMode": string,
  "systemFont": string,
  "systemFontSize": string,
  "systemTextColor": string,
  "statusBarStyle": string,
  "batteryStyle": string,
  "signalStyle": string,
  "clockPosition": string,
  "controlCenterAccent": string,
  "lockClockStyle": string,
  "aodTheme": string,
  "bootAnimation": string,
  "soundPack": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    const parsed = JSON.parse(text);
    const preset = {
      id: `ai-gen-${Date.now()}`,
      name: parsed.themeName || 'AI Sol Custom',
      badge: parsed.badge || 'AI Generated',
      description: parsed.rationale || 'AI personalized aesthetic configuration',
      previewBg: parsed.previewBg || 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fde047 100%)',
      wallpaper: parsed.wallpaper || 'golden',
      iconPack: parsed.iconPack || 'ios-glass',
      themeMode: parsed.themeMode || 'light',
      systemFont: parsed.systemFont || 'sf-pro',
      systemFontSize: parsed.systemFontSize || 'standard',
      systemTextColor: parsed.systemTextColor || 'adaptive',
      statusBarStyle: parsed.statusBarStyle || 'ios-classic',
      batteryStyle: parsed.batteryStyle || 'capsule-outside',
      signalStyle: parsed.signalStyle || 'bars',
      clockPosition: parsed.clockPosition || 'left',
      controlCenterAccent: parsed.controlCenterAccent || 'amber',
      notificationCardStyle: parsed.themeMode === 'dark' ? 'minimal-outline' : 'glass-blur',
      lockClockStyle: parsed.lockClockStyle || 'ios-depth',
      lockWidgets: ['weather', 'battery', 'golden-hour'],
      aodTheme: parsed.aodTheme || 'eclipse-ring',
      bootAnimation: parsed.bootAnimation || 'solar-flare',
      soundPack: parsed.soundPack || 'solar-harmonix',
    };

    return res.json({
      preset,
      rationale: parsed.rationale,
      moodTags: parsed.moodTags || ['AI Generated'],
      dominantHex: parsed.dominantHex || '#F59E0B',
      secondaryHex: parsed.secondaryHex || '#D97706',
      soundPack: parsed.soundPack || 'solar-harmonix',
    });
  } catch (error: any) {
    console.error('Gemini Theme Gen Error:', error);
    return res.status(500).json({ error: error.message || 'Generation error' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
