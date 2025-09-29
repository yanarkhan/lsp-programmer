import type { Request, Response } from 'express';
import { z } from 'zod';
import { listPembayaranBulanan, listPembayaranMingguan } from '../services/riwayatAdminService';

export async function getAdminPembayaran(req: Request, res: Response) {
  const schema = z.object({
    filter: z.enum(['bulan','minggu']),
    yyyymm: z.string().optional(),     // contoh "2025-01" atau "202501"
    awal: z.string().optional(),       // contoh "2025-01-06" (awal minggu)
    limit: z.coerce.number().int().positive().max(200).optional(),
    offset: z.coerce.number().int().min(0).optional()
  });
  const { filter, yyyymm, awal, limit = 50, offset = 0 } = schema.parse(req.query);

  let data;
  if (filter === 'bulan') {
    if (!yyyymm) return res.status(400).json({ message: 'yyyymm diperlukan untuk filter=bulan' });
    data = await listPembayaranBulanan(yyyymm, limit, offset);
  } else {
    if (!awal) return res.status(400).json({ message: 'awal diperlukan untuk filter=minggu' });
    data = await listPembayaranMingguan(awal, limit, offset);
  }
  res.json({ data, meta: { filter, yyyymm, awal, limit, offset } });
}
