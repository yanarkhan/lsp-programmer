import { pool } from '../db/pool';
import { HttpError } from '../utils/httpError';
import { buatNomorPesanan } from '../utils/nomorPesanan';

type ItemInput = { id_produk: string; jumlah: number };

export async function buatPesananUntukPengguna(id_pengguna: string, items: ItemInput[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ids = items.map(i => i.id_produk);
    const { rows: produkRows } = await client.query(
      `SELECT id_produk, harga, stok, aktif FROM produk WHERE id_produk = ANY($1::uuid[]) FOR SHARE`, [ids]
    );
    const peta = new Map(produkRows.map(r => [r.id_produk, r]));
    for (const it of items) {
      const p = peta.get(it.id_produk);
      if (!p || !p.aktif) throw new HttpError(400, 'Produk tidak ditemukan/aktif: ' + it.id_produk);
      if (it.jumlah < 1) throw new HttpError(400, 'Jumlah minimal 1');
    }

    const nomor = buatNomorPesanan('DBB');
    const insPesanan = await client.query(
      `INSERT INTO pesanan (id_pengguna, nomor_pesanan, status_pesanan, total_harga)
       VALUES ($1, $2, 'menunggu_konfirmasi', 0) RETURNING id_pesanan`,
      [id_pengguna, nomor]
    );
    const id_pesanan = insPesanan.rows[0].id_pesanan;

    let total = 0;
    for (const it of items) {
      const p = peta.get(it.id_produk)!;
      const harga_satuan = Number(p.harga);
      const subtotal = harga_satuan * it.jumlah;
      total += subtotal;

      await client.query(
        `INSERT INTO item_pesanan (id_pesanan, id_produk, jumlah, harga_satuan)
         VALUES ($1, $2, $3, $4)`,
        [id_pesanan, it.id_produk, it.jumlah, harga_satuan]
      );
    }

    await client.query(
      `UPDATE pesanan SET total_harga = $2, diperbarui_pada = now() WHERE id_pesanan = $1`,
      [id_pesanan, total]
    );

    await client.query('COMMIT');
    return { id_pesanan, nomor_pesanan: nomor, total_harga: total, status: 'menunggu_konfirmasi' };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function daftarPesananSaya(id_pengguna: string) {
  const q = `
    SELECT id_pesanan, nomor_pesanan, status_pesanan, total_harga, dibuat_pada, diperbarui_pada
    FROM pesanan
    WHERE id_pengguna = $1
    ORDER BY dibuat_pada DESC
  `;
  const { rows } = await pool.query(q, [id_pengguna]);
  return rows;
}

export async function detailPesanan(id_pesanan: string, id_pengguna: string) {
  const q1 = `
    SELECT p.id_pesanan, p.nomor_pesanan, p.status_pesanan, p.total_harga, p.dibuat_pada
    FROM pesanan p
    WHERE p.id_pesanan = $1 AND p.id_pengguna = $2
  `;
  const pesanan = await pool.query(q1, [id_pesanan, id_pengguna]);
  if (!pesanan.rowCount) throw new HttpError(404, 'Pesanan tidak ditemukan');

  const q2 = `
    SELECT i.id_item_pesanan, pr.nama_produk, i.jumlah, i.harga_satuan, i.subtotal
    FROM item_pesanan i
    JOIN produk pr ON pr.id_produk = i.id_produk
    WHERE i.id_pesanan = $1
    ORDER BY pr.nama_produk
  `;
  const items = await pool.query(q2, [id_pesanan]);

  return { ...pesanan.rows[0], items: items.rows };
}
