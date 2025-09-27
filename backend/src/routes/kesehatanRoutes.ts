import { Router, type Request, type Response } from 'express';

export const kesehatanRoutes = Router();

kesehatanRoutes.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});
