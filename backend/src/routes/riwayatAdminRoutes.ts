import { Router, type Request, type Response, type NextFunction } from 'express';
import { wajibAuth, wajibAdmin } from '../middleware/auth';
import { getAdminPembayaran } from '../controller/riwayatAdminController';

export const riwayatAdminRoutes = Router();

riwayatAdminRoutes.get(
  '/admin/pembayaran',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await getAdminPembayaran(req, res); } catch (e) { next(e); }
  }
);
