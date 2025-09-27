import { pool } from '../db/pool';

export async function daftarProduk() {
  const q = `
  SELECT p.id_produk, p.nama_produk, p.harga, p.stok, p.url_gambar, p.aktif,
         k.id_kategori, k.nama_kategori
  FROM produk p
  JOIN kategori k ON k.id_kategori = p.id_kategori
  WHERE p.aktif = true
  ORDER BY k.nama_kategori, p.nama_produk;
  `;
  const { rows } = await pool.query(q);
  return rows;
}
