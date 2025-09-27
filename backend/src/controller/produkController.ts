import type { Request, Response } from 'express';
import { daftarProduk } from '../services/produkService';

export async function getProduk(_req: Request, res: Response) {
  const data = await daftarProduk();
  res.json({ data });
}
