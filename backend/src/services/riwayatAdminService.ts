import { pool } from '../db/pool';

export async function listPembayaranBulanan(yyyymm: string, limit = 50, offset = 0) {
  // yyyymm: "2025-01" atau "202501" → kita normalkan ke int 202501
  const num = Number(yyyymm.replace('-', ''));
  const q = `
    SELECT pb.id_pembayaran, pb.metode, pb.status_pembayaran, pb.waktu_bayar, pb.url_invoice_pdf,
           p.nomor_pesanan, p.total_harga, u.nama AS nama_pelanggan
    FROM pembayaran pb
    JOIN pesanan p ON p.id_pesanan = pb.id_pesanan
    JOIN pengguna u ON u.id_pengguna = p.id_pengguna
    WHERE pb.yyyymm_bayar = $1
    ORDER BY pb.waktu_bayar DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await pool.query(q, [num, limit, offset]);
  return rows;
}

export async function listPembayaranMingguan(awalMinggu: string, limit = 50, offset = 0) {
  // awalMinggu: "YYYY-MM-DD"
  const q = `
    SELECT pb.id_pembayaran, pb.metode, pb.status_pembayaran, pb.waktu_bayar, pb.url_invoice_pdf,
           p.nomor_pesanan, p.total_harga, u.nama AS nama_pelanggan
    FROM pembayaran pb
    JOIN pesanan p ON p.id_pesanan = pb.id_pesanan
    JOIN pengguna u ON u.id_pengguna = p.id_pengguna
    WHERE pb.awal_minggu_bayar = $1::date
    ORDER BY pb.waktu_bayar DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await pool.query(q, [awalMinggu, limit, offset]);
  return rows;
}
