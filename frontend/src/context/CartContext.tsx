import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ItemKeranjang } from '../types';

type CartState = {
  items: ItemKeranjang[];
  add: (item: Omit<ItemKeranjang, 'jumlah'>) => void;
  inc: (id_produk: string) => void;
  dec: (id_produk: string) => void;
  remove: (id_produk: string) => void;
  clear: () => void;
  total: number;
};

const CartCtx = createContext<CartState | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemKeranjang[]>([]);

  const add = (item: Omit<ItemKeranjang, 'jumlah'>) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id_produk === item.id_produk);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], jumlah: clone[idx].jumlah + 1 };
        return clone;
      }
      return [...prev, { ...item, jumlah: 1 }];
    });
  };

  const inc = (id: string) => setItems((prev) => prev.map(i => i.id_produk === id ? { ...i, jumlah: i.jumlah + 1 } : i));
  const dec = (id: string) => setItems((prev) => prev.map(i => i.id_produk === id ? { ...i, jumlah: Math.max(1, i.jumlah - 1) } : i));
  const remove = (id: string) => setItems((prev) => prev.filter(i => i.id_produk !== id));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((s, it) => s + (it.harga * it.jumlah), 0), [items]);

  return (
    <CartCtx.Provider value={{ items, add, inc, dec, remove, clear, total }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
