export type Peran = 'pelanggan' | 'admin';
export type StatusPesanan = 'menunggu_konfirmasi' | 'disetujui' | 'ditolak' | 'dibayar';

export type Pengguna = {
  id_pengguna: string;
  peran: Peran;
  email: string;
  nama: string;
};

export type Produk = {
  id_produk: string;
  id_kategori: string;
  nama_kategori: string;
  nama_produk: string;
  harga: string; // dari backend numeric -> string
  stok: number;
  url_gambar: string | null;
  aktif: boolean;
};

export type ItemKeranjang = {
  id_produk: string;
  nama_produk: string;
  harga: number;
  jumlah: number;
};

export type PesananHead = {
  id_pesanan: string;
  nomor_pesanan: string;
  status_pesanan: StatusPesanan;
  total_harga: string;
  dibuat_pada: string;
  diperbarui_pada: string | null;
};
