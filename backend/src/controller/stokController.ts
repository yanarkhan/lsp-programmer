import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  adminDaftarProduk,
  adminBuatProduk,
  adminUbahProduk,
  adminNonaktifkanProduk,
  adminUbahStok,
} from '../services/stokService';

export async function getAdminProduk(_req: Request, res: Response) {
  const data = await adminDaftarProduk();
  res.json({ data });
}

const skemaBuatProduk = z.object({
  id_kategori: z.string().uuid(),
  nama_produk: z.string().min(2),
  harga: z.number().min(0),
  stok: z.number().int().min(0),
  url_gambar: z.string().url().optional().nullable(),
  aktif: z.boolean().optional()
});
export async function postAdminProduk(req: Request, res: Response) {
  const data = skemaBuatProduk.parse(req.body);
  const hasil = await adminBuatProduk(data);
  res.status(201).json(hasil);
}

const skemaUbahProduk = z.object({
  id_kategori: z.string().uuid().optional(),
  nama_produk: z.string().min(2).optional(),
  harga: z.number().min(0).optional(),
  stok: z.number().int().min(0).optional(),
  url_gambar: z.string().url().nullable().optional(),
  aktif: z.boolean().optional()
});
export async function patchAdminProduk(req: Request, res: Response) {
  const { id } = req.params;
  const data = skemaUbahProduk.parse(req.body);
  await adminUbahProduk(id, data);
  res.json({ message: 'Produk diperbarui' });
}

export async function deleteAdminProduk(req: Request, res: Response) {
  const { id } = req.params;
  await adminNonaktifkanProduk(id);
  res.json({ message: 'Produk dinonaktifkan' });
}

const skemaUbahStok = z.object({
  mode: z.enum(['tambah', 'kurangi', 'set']),
  jumlah: z.number().int().positive(),
  alasan: z.enum(['penyesuaian_admin', 'transaksi']).optional()
});
export async function patchAdminStok(req: Request, res: Response) {
  const { id } = req.params;
  const { mode, jumlah, alasan } = skemaUbahStok.parse(req.body);
  const idAdmin = req.pengguna!.id_pengguna;
  const hasil = await adminUbahStok(id, mode, jumlah, idAdmin, alasan ?? 'penyesuaian_admin');
  res.json({ message: 'Stok diperbarui', ...hasil });
}
