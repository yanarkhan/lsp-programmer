import { Router, type Request, type Response, type NextFunction } from 'express';
import { wajibAuth, wajibAdmin } from '../middleware/auth';
import {
  getAdminProduk,
  postAdminProduk,
  patchAdminProduk,
  deleteAdminProduk,
  patchAdminStok
} from '../controller/stokController';

export const stokRoutes = Router();

stokRoutes.get(
  '/admin/produk',
  wajibAuth, wajibAdmin,
  async (_req: Request, res: Response, next: NextFunction) => {
    try { await getAdminProduk(_req, res); } catch (e) { next(e); }
  }
);

stokRoutes.post(
  '/admin/produk',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await postAdminProduk(req, res); } catch (e) { next(e); }
  }
);

stokRoutes.patch(
  '/admin/produk/:id',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await patchAdminProduk(req, res); } catch (e) { next(e); }
  }
);

stokRoutes.delete(
  '/admin/produk/:id',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await deleteAdminProduk(req, res); } catch (e) { next(e); }
  }
);

stokRoutes.patch(
  '/admin/produk/:id/stok',
  wajibAuth, wajibAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try { await patchAdminStok(req, res); } catch (e) { next(e); }
  }
);
