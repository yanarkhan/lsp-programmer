import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Produk } from "../../types";
import { Badge, Button } from "../../components/UI";
import { formatRp } from "../../utils/format";

export default function StokPage() {
  const [list, setList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get("/admin/produk")
      .then(({ data }) => setList(data.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const ubahStok = async (
    id_produk: string,
    mode: "tambah" | "kurangi" | "set"
  ) => {
    const jumlah = Number(window.prompt(`Jumlah untuk ${mode}:`, "1") || "0");
    if (!jumlah || jumlah < 0) return;
    await api.patch(`/admin/produk/${id_produk}/stok`, { mode, jumlah });
    load();
  };

  if (loading) return <p className="p-4">Memuat...</p>;
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Kelola Stok</h1>
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Produk</th>
              <th className="text-left px-4 py-2">Kategori</th>
              <th className="text-left px-4 py-2">Harga</th>
              <th className="text-left px-4 py-2">Stok</th>
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id_produk} className="border-t">
                <td className="px-4 py-2">{p.nama_produk}</td>
                <td className="px-4 py-2">
                  <Badge color="blue">{p.nama_kategori}</Badge>
                </td>
                <td className="px-4 py-2">{formatRp(p.harga)}</td>
                <td className="px-4 py-2 font-semibold">{p.stok}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button onClick={() => ubahStok(p.id_produk, "tambah")}>
                      + Tambah
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => ubahStok(p.id_produk, "set")}
                    >
                      Set
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => ubahStok(p.id_produk, "kurangi")}
                    >
                      - Kurangi
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
