import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { login } from "../controller/authController";

export const authRoutes = Router();

authRoutes.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await login(req, res);
    } catch (err) {
      next(err);
    }
  }
);
