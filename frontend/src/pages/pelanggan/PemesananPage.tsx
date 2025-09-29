import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Produk } from "../../types";
import { Card, Button, Badge } from "../../components/UI";
import { useCart } from "../../context/CartContext";
import { formatRp } from "../../utils/format";

const placeholder = (name: string) =>
  `https://placehold.co/600x400?text=${encodeURIComponent(name)}`;

export default function PemesananPage() {
  const [data, setData] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    api
      .get("/produk")
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 w-2/3 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-1/3 mb-4 rounded" />
              <div className="h-9 bg-gray-200 w-24 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((pr) => (
        <Card key={pr.id_produk}>
          <img
            src={pr.url_gambar || placeholder(pr.nama_produk)}
            alt={pr.nama_produk}
            className="w-full h-40 object-cover rounded-lg mb-3"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = placeholder(
                pr.nama_produk
              );
            }}
          />
          <div className="flex items-start justify-between">
            <div className="font-semibold">{pr.nama_produk}</div>
            <Badge color="blue">{pr.nama_kategori}</Badge>
          </div>
          <div className="text-blue-700 mt-1">{formatRp(pr.harga)}</div>
          <div className="text-xs text-gray-500 mt-1">Stok: {pr.stok}</div>
          <Button
            className="mt-3"
            onClick={() =>
              add({
                id_produk: pr.id_produk,
                nama_produk: pr.nama_produk,
                harga: Number(pr.harga),
              })
            }
          >
            Tambah ke Keranjang
          </Button>
        </Card>
      ))}
    </div>
  );
}
