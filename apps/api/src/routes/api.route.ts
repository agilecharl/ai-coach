import express, { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

const router = express.Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const ai = await AiService.generate(req.query.message as string);
    res.json(ai);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ error: 'Failed to fetch chatbots' });
  }
});

export default router;
