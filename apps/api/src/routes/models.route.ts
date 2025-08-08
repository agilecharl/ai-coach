import express, { Request, Response } from 'express';
import { ModelService } from '../services/models.service';

const router = express.Router();
const modelService = new ModelService();

router.get('/models', async (req: Request, res: Response) => {
  try {
    const models = await modelService.getModels();
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

router.post('/models', async (req: Request, res: Response) => {
  try {
    const model = await modelService.createModel(req.body);
    res.status(201).json(model);
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(400).json({ error: 'Failed to create model' });
  }
});

export default router;
