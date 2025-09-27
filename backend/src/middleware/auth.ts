import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

export interface TokenPayload {
  id_pengguna: string;
  peran: 'pelanggan' | 'admin';
  email: string;
  nama: string;
}

declare global {
  namespace Express {
    interface Request {
      pengguna?: TokenPayload;
    }
  }
}

export function wajibAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw new HttpError(401, 'Token tidak ditemukan');

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.pengguna = payload;
    next();
  } catch {
    throw new HttpError(401, 'Token tidak valid');
  }
}

export function wajibPelanggan(req: Request, _res: Response, next: NextFunction) {
  if (req.pengguna?.peran !== 'pelanggan') throw new HttpError(403, 'Akses khusus pelanggan');
  next();
}

export function wajibAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.pengguna?.peran !== 'admin') throw new HttpError(403, 'Akses khusus admin');
  next();
}
