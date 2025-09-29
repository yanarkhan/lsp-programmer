import { Router, type Request, type Response, type NextFunction } from 'express';
import { wajibAuth, wajibAdmin } from '../middleware/auth';
import {
  getAdminPesanan,
  getAdminDetailPesanan,
  postAdminAccPesanan,
  postAdminTolakPesanan
} from '../controller/pesananAdminController';

export const pesananAdminRoutes = Router();

pesananAdminRoutes.get(
  '/admin/pesanan',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await getAdminPesanan(req, res); } catch (e) { next(e); }
  }
);

pesananAdminRoutes.get(
  '/admin/pesanan/:id',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await getAdminDetailPesanan(req, res); } catch (e) { next(e); }
  }
);

pesananAdminRoutes.post(
  '/admin/pesanan/:id/acc',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await postAdminAccPesanan(req, res); } catch (e) { next(e); }
  }
);

pesananAdminRoutes.post(
  '/admin/pesanan/:id/tolak',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await postAdminTolakPesanan(req, res); } catch (e) { next(e); }
  }
);
