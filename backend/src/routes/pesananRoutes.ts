import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { wajibAuth, wajibPelanggan } from "../middleware/auth";
import {
  postBuatPesanan,
  getPesananSaya,
  getDetailPesanan,
} from "../controller/pesananController";

export const pesananRoutes = Router();

pesananRoutes.post(
  "/pesanan",
  wajibAuth,
  wajibPelanggan,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postBuatPesanan(req, res);
    } catch (err) {
      next(err);
    }
  }
);

pesananRoutes.get(
  "/pesanan/saya",
  wajibAuth,
  wajibPelanggan,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getPesananSaya(req, res);
    } catch (err) {
      next(err);
    }
  }
);

pesananRoutes.get(
  "/pesanan/:id",
  wajibAuth,
  wajibPelanggan,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getDetailPesanan(req, res);
    } catch (err) {
      next(err);
    }
  }
);
