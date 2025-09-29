import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { invoiceDir } from '../config/storage';

type Item = {
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
};

type PesananHeader = {
  nomor_pesanan: string;
  nama_pelanggan: string;
  dibuat_pada: string;
  total_harga: number;
};

type PembayaranInfo = {
  id_pembayaran: string;
  metode: 'tunai' | 'non_tunai';
  waktu_bayar: string;
};

export async function generateInvoicePdf(
  pesanan: PesananHeader,
  items: Item[],
  pembayaran: PembayaranInfo
): Promise<{ filename: string; url: string; absPath: string }> {
  const filename = `INV-${pesanan.nomor_pesanan}.pdf`;
  const absPath = path.join(invoiceDir, filename);
  const url = `/static/invoices/${filename}`;

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(absPath);
    doc.pipe(stream);

    doc.fontSize(18).text('Dapur Bunda Bahagia', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(12).text('Invoice Pembayaran', { align: 'left' });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Nomor Pesanan : ${pesanan.nomor_pesanan}`);
    doc.text(`Nama Pelanggan: ${pesanan.nama_pelanggan}`);
    doc.text(`Tanggal Pesan  : ${new Date(pesanan.dibuat_pada).toLocaleString('id-ID')}`);
    doc.text(`Metode Bayar   : ${pembayaran.metode === 'tunai' ? 'Tunai' : 'Non Tunai'}`);
    doc.text(`Waktu Bayar    : ${new Date(pembayaran.waktu_bayar).toLocaleString('id-ID')}`);
    doc.moveDown();

    // Tabel sederhana
    doc.fontSize(11).text('Rincian Item:');
    doc.moveDown(0.5);
    doc.fontSize(10);

    doc.text('Nama', 40, doc.y);
    doc.text('Qty', 260, doc.y);
    doc.text('Harga', 300, doc.y);
    doc.text('Subtotal', 380, doc.y);
    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.2);

    items.forEach((it) => {
      doc.text(it.nama_produk, 40, doc.y);
      doc.text(String(it.jumlah), 260, doc.y);
      doc.text(formatRupiah(it.harga_satuan), 300, doc.y);
      doc.text(formatRupiah(it.subtotal), 380, doc.y);
      doc.moveDown(0.2);
    });

    doc.moveDown(0.4);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.4);
    doc.fontSize(12).text(`Total: ${formatRupiah(pesanan.total_harga)}`, { align: 'right' });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', (e) => reject(e));
  });

  return { filename, url, absPath };
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
}
