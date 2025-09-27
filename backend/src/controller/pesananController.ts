import type { Request, Response } from 'express';
import { z } from 'zod';
import { buatPesananUntukPengguna, daftarPesananSaya, detailPesanan } from '../services/pesananService';

const skemaBuatPesanan = z.object({
  items: z.array(
    z.object({
      id_produk: z.string().uuid(),
      jumlah: z.number().int().positive()
    })
  ).min(1, 'Minimal satu item')
});

export async function postBuatPesanan(req: Request, res: Response) {
  const { items } = skemaBuatPesanan.parse(req.body);
  const idPengguna = req.pengguna!.id_pengguna;
  const hasil = await buatPesananUntukPengguna(idPengguna, items);
  res.status(201).json(hasil);
}

export async function getPesananSaya(req: Request, res: Response) {
  const idPengguna = req.pengguna!.id_pengguna;
  const data = await daftarPesananSaya(idPengguna);
  res.json({ data });
}

export async function getDetailPesanan(req: Request, res: Response) {
  const idPengguna = req.pengguna!.id_pengguna;
  const { id } = req.params;
  const data = await detailPesanan(id, idPengguna);
  res.json(data);
}
