import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut } from 'lucide-react';

export default function Navbar() {
  const { pengguna, logout } = useAuth();
  const { items } = useCart();
  const loc = useLocation();
  const active = (p: string) => (loc.pathname === p ? 'underline' : 'hover:underline');

  return (
    <div className="w-full bg-gray-900 text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link to="/" className="font-bold text-lg">🍽️ DBB</Link>
          {pengguna?.peran === 'pelanggan' && (
            <>
              <Link to="/menu" className={active('/menu')}>Menu</Link>
              <Link to="/keranjang" className={active('/keranjang')}>
                <span className="inline-flex items-center gap-1">
                  <ShoppingCart size={16} /> Keranjang
                  {items.length > 0 && <span className="ml-1 inline-block bg-amber-400 text-black rounded px-1 text-xs">{items.length}</span>}
                </span>
              </Link>
              <Link to="/pesanan-saya" className={active('/pesanan-saya')}>Pesanan Saya</Link>
            </>
          )}
          {pengguna?.peran === 'admin' && (
            <>
              <Link to="/admin/stok" className={active('/admin/stok')}>Kelola Stok</Link>
              <Link to="/admin/pesanan" className={active('/admin/pesanan')}>Validasi Pesanan</Link>
              <Link to="/admin/pembayaran" className={active('/admin/pembayaran')}>Histori</Link>
            </>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {!pengguna && <Link to="/login" className="underline">Login</Link>}
          {pengguna && (
            <>
              <span className="text-sm opacity-80 hidden sm:inline">{pengguna.nama} ({pengguna.peran})</span>
              <button className="text-sm underline inline-flex items-center gap-1" onClick={logout}>
                <LogOut size={14}/> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
  