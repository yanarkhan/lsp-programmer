import { pool } from '../db/pool';
import { HttpError } from '../utils/httpError';
import { generateInvoicePdf } from '../utils/invoice';

type Metode = 'tunai' | 'non_tunai';

export async function bayarPesananPelanggan(
  id_pengguna: string,
  id_pesanan: string,
  metode: Metode,
  referensi?: string
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock pesanan
    const psn = await client.query(
      `SELECT id_pesanan, id_pengguna, nomor_pesanan, status_pesanan, total_harga, dibuat_pada
       FROM pesanan WHERE id_pesanan = $1 AND id_pengguna = $2 FOR UPDATE`,
      [id_pesanan, id_pengguna]
    );
    if (!psn.rowCount) throw new HttpError(404, 'Pesanan tidak ditemukan');
    const head = psn.rows[0];
    if (head.status_pesanan === 'dibayar') throw new HttpError(409, 'Pesanan sudah dibayar');
    if (head.status_pesanan !== 'disetujui') throw new HttpError(409, 'Pesanan belum di-ACC admin');

    // Cek sudah ada pembayaran lunas?
    const sudah = await client.query(
      `SELECT 1 FROM pembayaran WHERE id_pesanan = $1 AND status_pembayaran = 'lunas' LIMIT 1`,
      [id_pesanan]
    );
    if (sudah.rowCount) throw new HttpError(409, 'Pembayaran sudah tercatat');

    // Ambil item untuk hitung & kurangi stok
    const items = await client.query(
      `SELECT i.id_produk, pr.nama_produk, i.jumlah, i.harga_satuan,
              (i.jumlah * i.harga_satuan) AS subtotal
       FROM item_pesanan i
       JOIN produk pr ON pr.id_produk = i.id_produk
       WHERE i.id_pesanan = $1
       ORDER BY pr.nama_produk`,
      [id_pesanan]
    );
    if (!items.rowCount) throw new HttpError(409, 'Item pesanan kosong');

    // Kurangi stok setiap produk (FOR UPDATE per produk)
    for (const it of items.rows) {
      const r = await client.query(
        `SELECT stok FROM produk WHERE id_produk = $1 FOR UPDATE`,
        [it.id_produk]
      );
      if (!r.rowCount) throw new HttpError(404, 'Produk tidak ditemukan');
      const stok = Number(r.rows[0].stok);
      if (stok < it.jumlah) throw new HttpError(409, `Stok tidak cukup untuk ${it.nama_produk}`);
      await client.query(
        `UPDATE produk SET stok = $2 WHERE id_produk = $1`,
        [it.id_produk, stok - it.jumlah]
      );
      await client.query(
        `INSERT INTO riwayat_stok (id_produk, perubahan, alasan, id_akun_admin)
         VALUES ($1, $2, 'transaksi', NULL)`,
        [it.id_produk, -it.jumlah]
      );
    }

    // Simpan pembayaran (lunas)
    if (metode === 'non_tunai' && !referensi) {
      throw new HttpError(400, 'referensi diperlukan untuk pembayaran non_tunai');
    }
    const pay = await client.query(
      `INSERT INTO pembayaran (id_pesanan, metode, status_pembayaran, referensi_pembayaran, waktu_bayar)
       VALUES ($1, $2, 'lunas', $3, now())
       RETURNING id_pembayaran, waktu_bayar`,
      [id_pesanan, metode, referensi ?? null]
    );
    const id_pembayaran = pay.rows[0].id_pembayaran;
    const waktu_bayar = pay.rows[0].waktu_bayar as string;

    // Update status pesanan -> dibayar
    await client.query(
      `UPDATE pesanan SET status_pesanan = 'dibayar', diperbarui_pada = now()
       WHERE id_pesanan = $1`,
      [id_pesanan]
    );

    // Generate invoice PDF
    const invoice = await generateInvoicePdf(
      {
        nomor_pesanan: head.nomor_pesanan,
        nama_pelanggan: await namaPelanggan(client, id_pengguna),
        dibuat_pada: head.dibuat_pada,
        total_harga: Number(head.total_harga),
      },
      items.rows.map((r) => ({
        nama_produk: r.nama_produk,
        jumlah: Number(r.jumlah),
        harga_satuan: Number(r.harga_satuan),
        subtotal: Number(r.subtotal),
      })),
      {
        id_pembayaran,
        metode,
        waktu_bayar,
      }
    );

    // Simpan url invoice
    await client.query(
      `UPDATE pembayaran SET url_invoice_pdf = $2 WHERE id_pembayaran = $1`,
      [id_pembayaran, invoice.url]
    );

    await client.query('COMMIT');
    return {
      id_pembayaran,
      status: 'lunas',
      url_invoice_pdf: invoice.url,
      pesan: 'Pembayaran berhasil. Terima kasih.'
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function namaPelanggan(client: any, id_pengguna: string): Promise<string> {
  const q = await client.query(`SELECT nama FROM pengguna WHERE id_pengguna = $1`, [id_pengguna]);
  return q.rowCount ? q.rows[0].nama : 'Pelanggan';
}
