import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isHttp = err instanceof HttpError;
  const status = isHttp ? err.status : 500;
  const message = isHttp ? err.message : 'Terjadi kesalahan pada server';
  if (!isHttp) console.error(err);
  res.status(status).json({ message });
}
