import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for coach recommendations
  app.post("/api/coach/recommendations", async (req, res) => {
    try {
      const { muscleStatuses } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured inside the environment variables." });
      }

      const promptString = `You are a sophisticated cybernetic tactical athletic operative and elite personal gym trainer.
Analyze the following muscle group states compiled over a 5-day physiological window:
${JSON.stringify(muscleStatuses)}

Your goal is to give direct, high-performance coaching advice for today's training.

Consider these recovery states:
- "Active Today" (#ef4444 / red): These were worked today and are under severe peak fatigue. Tell them to AVOID training them.
- "Fatigued (D1)" or "Fatigued (D2)" (#f97316 / orange): Under active muscular repair and breakdown. Advise resting unless doing light recovery.
- "Ready (D3)" (#22c55e / green): Soreness cleared, optimal training supercompensation window. Highly recommended!
- "Fully Rested (D4+)" (translucent/dark): Muscle pools are completely recovered and untapped. Excellent targets today to unlock potential.

Format your response strictly as JSON conforming to the requested schema. Provide inspiring, blocky, sci-fi cyber-tech military operative fitness feedback. Ensure you give realistic physiological reasoning for the advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallStatus: { 
                type: Type.STRING, 
                description: "Short status summary of the body's overall recovery state, e.g., 'Lower Body Rested, Upper Recovering'." 
              },
              recoveryScore: { 
                type: Type.INTEGER, 
                description: "A calculated score from 0 (total body exhaustion) to 100 (fully rested and fresh) based on muscle recovery." 
              },
              priorityTargets: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Muscle groups ready for heavy recruitment today."
              },
              avoidTargets: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Muscle groups actively fatigued or sore that should be avoided/rested."
              },
              shortMotivationalQuote: { 
                type: Type.STRING, 
                description: "1 short uppercase, hard-hitting cybernetic/retro gym operative battle phrase." 
              },
              customWorkoutRecommendation: { 
                type: Type.STRING, 
                description: "Recommended session theme/split, e.g. 'Glute-Focused Leg Devastation' or 'Active Mobility Rest Day'." 
              },
              personalizedAdvice: { 
                type: Type.STRING, 
                description: "A detailed paragraph of physiological reasoning outlining precisely which muscles are ready, which are rebuilding, and why." 
              }
            },
            required: [
              "overallStatus", 
              "recoveryScore", 
              "priorityTargets", 
              "avoidTargets", 
              "shortMotivationalQuote", 
              "customWorkoutRecommendation", 
              "personalizedAdvice"
            ]
          }
        }
      });

      const text = response?.text;
      if (!text) {
        throw new Error("Empty response from GenAI");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Coach API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI Coach advice" });
    }
  });

  // API Route for Google Maps key retrieval at runtime (to support deployed mobile versions securely)
  app.get("/api/maps-key", (req, res) => {
    res.json({ key: process.env.GOOGLE_MAPS_PLATFORM_KEY || "" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
