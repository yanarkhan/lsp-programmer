import { pool } from '../db/pool';
import { HttpError } from '../utils/httpError';

export async function adminDaftarProduk() {
  const q = `
    SELECT p.id_produk, p.nama_produk, p.harga, p.stok, p.url_gambar, p.aktif,
           k.id_kategori, k.nama_kategori
    FROM produk p
    JOIN kategori k ON k.id_kategori = p.id_kategori
    ORDER BY k.nama_kategori, p.nama_produk;
  `;
  const { rows } = await pool.query(q);
  return rows;
}

type BuatProdukInput = {
  id_kategori: string;
  nama_produk: string;
  harga: number;
  stok: number;
  url_gambar?: string | null;
  aktif?: boolean;
};

export async function adminBuatProduk(data: BuatProdukInput) {
  const q = `
    INSERT INTO produk (id_kategori, nama_produk, harga, stok, url_gambar, aktif)
    VALUES ($1,$2,$3,$4,$5,COALESCE($6,true))
    RETURNING id_produk
  `;
  const { rows } = await pool.query(q, [
    data.id_kategori,
    data.nama_produk,
    data.harga,
    data.stok,
    data.url_gambar ?? null,
    data.aktif ?? true
  ]);
  return rows[0];
}

type UbahProdukInput = Partial<Omit<BuatProdukInput, 'id_kategori'>> & { id_kategori?: string };

export async function adminUbahProduk(id_produk: string, data: UbahProdukInput) {
  // bangun SET dinamis
  const kolom: string[] = [];
  const nilai: any[] = [];
  let i = 1;

  for (const [k, v] of Object.entries(data)) {
    kolom.push(`${k} = $${i++}`);
    nilai.push(v);
  }
  if (kolom.length === 0) return;

  const q = `UPDATE produk SET ${kolom.join(', ')}, aktif = COALESCE(aktif, true) WHERE id_produk = $${i}`;
  nilai.push(id_produk);
  await pool.query(q, nilai);
}

export async function adminNonaktifkanProduk(id_produk: string) {
  const q = `UPDATE produk SET aktif = false WHERE id_produk = $1`;
  await pool.query(q, [id_produk]);
}

type ModeStok = 'tambah' | 'kurangi' | 'set';

export async function adminUbahStok(
  id_produk: string,
  mode: ModeStok,
  jumlah: number,
  id_admin: string,
  alasan: 'penyesuaian_admin' | 'transaksi' = 'penyesuaian_admin'
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows, rowCount } = await client.query(
      `SELECT stok FROM produk WHERE id_produk = $1 FOR UPDATE`, [id_produk]
    );
    if (!rowCount) throw new HttpError(404, 'Produk tidak ditemukan');

    const stokLama = Number(rows[0].stok);
    let stokBaru = stokLama;

    if (mode === 'tambah') stokBaru = stokLama + jumlah;
    else if (mode === 'kurangi') stokBaru = stokLama - jumlah;
    else if (mode === 'set') stokBaru = jumlah;

    if (stokBaru < 0) throw new HttpError(400, 'Stok tidak boleh negatif');

    await client.query(`UPDATE produk SET stok = $2 WHERE id_produk = $1`, [id_produk, stokBaru]);

    const perubahan = stokBaru - stokLama; // bisa + atau -
    if (perubahan !== 0) {
      await client.query(
        `INSERT INTO riwayat_stok (id_produk, perubahan, alasan, id_akun_admin)
         VALUES ($1,$2,$3,$4)`,
        [id_produk, perubahan, alasan, id_admin]
      );
    }

    await client.query('COMMIT');
    return { stok_lama: stokLama, stok_baru: stokBaru, perubahan };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
