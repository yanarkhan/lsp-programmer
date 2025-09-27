import type {
  Peran, StatusPesanan, MetodePembayaran, StatusPembayaran, AlasanRiwayatStok
} from './enums';

export interface Pengguna {
  idPengguna: string;
  nama: string;
  email: string;
  kataSandiHash: string;
  peran: Peran;
  dibuatPada: string;
}

export interface Kategori {
  idKategori: string;
  namaKategori: string;
}

export interface Produk {
  idProduk: string;
  idKategori: string;
  namaProduk: string;
  harga: number;
  stok: number;
  urlGambar: string | null;
  aktif: boolean;
}

export interface Pesanan {
  idPesanan: string;
  idPengguna: string;
  nomorPesanan: string;
  statusPesanan: StatusPesanan;
  totalHarga: number;
  dibuatPada: string;
  diperbaruiPada: string | null;
}

export interface ItemPesanan {
  idItemPesanan: string;
  idPesanan: string;
  idProduk: string;
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface Pembayaran {
  idPembayaran: string;
  idPesanan: string;
  metode: MetodePembayaran;
  statusPembayaran: StatusPembayaran;
  referensiPembayaran: string | null;
  waktuBayar: string | null;
  urlInvoicePdf: string | null;
}

export interface RiwayatStok {
  idRiwayatStok: string;
  idProduk: string;
  perubahan: number;
  alasan: AlasanRiwayatStok;
  idAkunAdmin: string | null;
  dibuatPada: string;
}
