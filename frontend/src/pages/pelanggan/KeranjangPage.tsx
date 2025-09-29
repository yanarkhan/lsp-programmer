import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/UI';
import { formatRp } from '../../utils/format';
import { api } from '../../services/api';

export default function KeranjangPage(){
  const { items, inc, dec, remove, total, clear } = useCart();
  const nav = useNavigate();

  const buatPesanan = async () => {
    if (!items.length) return;
    const payload = {
      items: items.map(i => ({ id_produk: i.id_produk, jumlah: i.jumlah }))
    };
    const { data } = await api.post('/pesanan', payload);
    clear();
    alert(`Pesanan dibuat: ${data.nomor_pesanan}. Tunggu ACC admin sebelum bayar.`);
    nav('/pesanan-saya');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Keranjang</h1>
      {!items.length && <p>Keranjang kosong.</p>}
      {items.map(it => (
        <div key={it.id_produk} className="border rounded-lg p-3 mb-2 flex items-center justify-between">
          <div>
            <div className="font-medium">{it.nama_produk}</div>
            <div className="text-sm">{formatRp(it.harga)} x {it.jumlah} = {formatRp(it.harga * it.jumlah)}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => dec(it.id_produk)}>-</button>
            <button className="px-3 py-1 border rounded" onClick={() => inc(it.id_produk)}>+</button>
            <button className="px-3 py-1 border rounded" onClick={() => remove(it.id_produk)}>Hapus</button>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold">Total: {formatRp(total)}</div>
          <Button onClick={buatPesanan}>Buat Pesanan</Button>
        </div>
      )}
    </div>
  );
}
