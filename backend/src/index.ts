import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const MODEL = 'gemini-2.0-flash';

const SYS_PROMPT = `
Respond to the prompt with a snarky, snappy, but overall positive attitude. 
Responses should direct and to-the-point and primarily targeted to young adults familiar with some internet slang.
Respond as if you were writing a longer comment online, using lowercase text, occasional improper grammar and emojis.
`;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.post('/text/RMUS', async (req, res) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        parts: [
          { text: "Rate the person's music taste based on their given favorite artists from a scale of 0-10 and provide an explanation. Do not give a score lower than a 6." },
          { text: req.body.userInput }
        ]
      },
    ],
    config: {
      systemInstruction: SYS_PROMPT,
      temperature: 2.0,
    }
  });

  res.status(200).json({ text: response.text })
});

app.post('/image/RFIT', async (req, res) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        parts: [
          { text: "Rate the person's outfit on a scale from 0-10 and provide an explanation. Do not give a score lower than 6." },
          { inlineData: { mimeType: 'image/png', data: req.body.imageB64 } }
        ]
      },
    ],
    config: {
      systemInstruction: SYS_PROMPT,
      temperature: 2.0,
    }
  });

  res.status(200).json({ text: response.text })
})

app.listen(port, () => {
  console.log(`STARTING SERVER ON PORT ${port}`);
})
