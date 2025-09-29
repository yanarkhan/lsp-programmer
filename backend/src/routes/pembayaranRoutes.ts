import { Router, type Request, type Response, type NextFunction } from 'express';
import { wajibAuth, wajibPelanggan } from '../middleware/auth';
import { postBayar } from '../controller/pembayaranController';

export const pembayaranRoutes = Router();

pembayaranRoutes.post(
  '/pembayaran/bayar',
  wajibAuth, wajibPelanggan,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await postBayar(req, res); } catch (e) { next(e); }
  }
);
