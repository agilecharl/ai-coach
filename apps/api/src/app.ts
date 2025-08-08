import express, { Express } from 'express';
import chatbotRouter from './routes/chatbots.route';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use('/api', chatbotRouter);

  return app;
}
