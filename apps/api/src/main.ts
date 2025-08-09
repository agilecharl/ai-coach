import cors from 'cors';
import express from 'express';
import { AiService } from './services/ai.service';
import { ChatbotService } from './services/chatbots.service';
import { ModelService } from './services/models.service';
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4200', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const chatbotService = new ChatbotService();
const modelService = new ModelService();

app.post('/api/generate', async (req, res) => {
  try {
    const message = req.body.message;
    const aiResponse = await AiService.generate(message);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

app.get('/api/chatbots', async (req, res) => {
  const chatbots = await chatbotService.getChatbots();
  res.json(chatbots);
});

app.post('/api/chatbots', async (req, res) => {
  const chatbot = await chatbotService.createChatbot(req.body);
  res.json(chatbot);
});

app.get('/api/models', async (req, res) => {
  const models = await modelService.getModels();
  res.json(models);
});

app.post('/api/models', async (req, res) => {
  const model = await modelService.createModel(req.body);
  res.json(model);
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
