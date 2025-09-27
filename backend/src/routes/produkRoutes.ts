import { Router, type Request, type Response, type NextFunction } from 'express';
import { getProduk } from '../controller/produkController';

export const produkRoutes = Router();

produkRoutes.get('/produk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getProduk(req, res);
  } catch (err) {
    next(err);
  }
});
