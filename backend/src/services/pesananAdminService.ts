import { pool } from '../db/pool';
import { HttpError } from '../utils/httpError';

export async function adminDaftarPesanan(
  status?: 'menunggu_konfirmasi'|'disetujui'|'ditolak'|'dibayar',
  limit = 20,
  offset = 0
) {
  const params: any[] = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE p.status_pesanan = $1`;
  }
  params.push(limit, offset);
  const q = `
    SELECT p.id_pesanan, p.nomor_pesanan, p.status_pesanan, p.total_harga, p.dibuat_pada, u.nama AS nama_pelanggan
    FROM pesanan p
    JOIN pengguna u ON u.id_pengguna = p.id_pengguna
    ${where}
    ORDER BY p.dibuat_pada DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const { rows } = await pool.query(q, params);
  return rows;
}

export async function adminDetailPesanan(id_pesanan: string) {
  const head = await pool.query(
    `SELECT p.id_pesanan, p.nomor_pesanan, p.status_pesanan, p.total_harga, p.dibuat_pada, u.nama AS nama_pelanggan
     FROM pesanan p JOIN pengguna u ON u.id_pengguna = p.id_pengguna
     WHERE id_pesanan = $1`, [id_pesanan]
  );
  if (!head.rowCount) throw new HttpError(404, 'Pesanan tidak ditemukan');

  const items = await pool.query(
    `SELECT i.id_item_pesanan, pr.nama_produk, i.jumlah, i.harga_satuan, i.subtotal
     FROM item_pesanan i JOIN produk pr ON pr.id_produk = i.id_produk
     WHERE i.id_pesanan = $1
     ORDER BY pr.nama_produk`, [id_pesanan]
  );

  return { ...head.rows[0], items: items.rows };
}

export async function adminSetujuiPesanan(id_pesanan: string) {
  // Hanya boleh dari menunggu_konfirmasi -> disetujui
  const q = `
    UPDATE pesanan
    SET status_pesanan = 'disetujui', diperbarui_pada = now()
    WHERE id_pesanan = $1 AND status_pesanan = 'menunggu_konfirmasi'
    RETURNING id_pesanan
  `;
  const { rowCount } = await pool.query(q, [id_pesanan]);
  if (!rowCount) throw new HttpError(409, 'Transisi status tidak valid');
}

export async function adminTolakPesanan(id_pesanan: string) {
  const q = `
    UPDATE pesanan
    SET status_pesanan = 'ditolak', diperbarui_pada = now()
    WHERE id_pesanan = $1 AND status_pesanan = 'menunggu_konfirmasi'
    RETURNING id_pesanan
  `;
  const { rowCount } = await pool.query(q, [id_pesanan]);
  if (!rowCount) throw new HttpError(409, 'Transisi status tidak valid');
}
