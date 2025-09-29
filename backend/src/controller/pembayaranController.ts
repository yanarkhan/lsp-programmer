import type { Request, Response } from 'express';
import { z } from 'zod';
import { bayarPesananPelanggan } from '../services/pembayaranService';

const skemaBayar = z.object({
  id_pesanan: z.string().uuid(),
  metode: z.enum(['tunai', 'non_tunai']),
  referensi: z.string().optional()
});

export async function postBayar(req: Request, res: Response) {
  const { id_pesanan, metode, referensi } = skemaBayar.parse(req.body);
  const idPengguna = req.pengguna!.id_pengguna;
  const hasil = await bayarPesananPelanggan(idPengguna, id_pesanan, metode, referensi);
  res.status(201).json(hasil);
}
