import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  adminDaftarPesanan,
  adminDetailPesanan,
  adminSetujuiPesanan,
  adminTolakPesanan
} from '../services/pesananAdminService';

export async function getAdminPesanan(req: Request, res: Response) {
  const schema = z.object({
    status: z.enum(['menunggu_konfirmasi','disetujui','ditolak','dibayar']).optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    offset: z.coerce.number().int().min(0).optional()
  });
  const { status, limit = 20, offset = 0 } = schema.parse(req.query);
  const data = await adminDaftarPesanan(status, limit, offset);
  res.json({ data, meta: { limit, offset } });
}

export async function getAdminDetailPesanan(req: Request, res: Response) {
  const { id } = req.params;
  const data = await adminDetailPesanan(id);
  res.json(data);
}

export async function postAdminAccPesanan(req: Request, res: Response) {
  const { id } = req.params;
  await adminSetujuiPesanan(id);
  res.json({ message: 'Pesanan disetujui' });
}

export async function postAdminTolakPesanan(req: Request, res: Response) {
  const { id } = req.params;
  await adminTolakPesanan(id);
  res.json({ message: 'Pesanan ditolak' });
}
