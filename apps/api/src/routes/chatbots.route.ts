import express, { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbots.service';

const router = express.Router();
const chatbotService = new ChatbotService();

router.get('/chatbots', async (req: Request, res: Response) => {
  try {
    const chatbots = await chatbotService.getChatbots();
    res.json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ error: 'Failed to fetch chatbots' });
  }
});

router.post('/chatbots', async (req: Request, res: Response) => {
  try {
    const chatbot = await chatbotService.createChatbot(req.body);
    res.status(201).json(chatbot);
  } catch (error) {
    console.error('Error creating chatbot:', error);
    res.status(400).json({ error: 'Failed to create chatbot' });
  }
});

export default router;
