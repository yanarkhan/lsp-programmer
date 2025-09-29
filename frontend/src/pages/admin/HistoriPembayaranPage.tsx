import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { formatRp } from "../../utils/format";
import { Button } from "../../components/UI";

type Row = {
  id_pembayaran: string;
  metode: "tunai" | "non_tunai";
  status_pembayaran: "lunas";
  waktu_bayar: string;
  url_invoice_pdf: string | null;
  nomor_pesanan: string;
  total_harga: string;
  nama_pelanggan: string;
};

const API_BASE = import.meta.env.VITE_API_BASE;
const FILE_BASE = new URL(API_BASE).origin;
const makeAbsolute = (url: string | null) =>
  !url ? null : url.startsWith("http") ? url : `${FILE_BASE}${url}`;

export default function HistoriPembayaranPage() {
  const [filter, setFilter] = useState<"bulan" | "minggu">("bulan");
  const [yyyymm, setYyyymm] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`; // ex: 2025-09
  });
  const [awal, setAwal] = useState<string>(() => {
    const d = new Date();
    const day = d.getDay(); // 0 Minggu, 1 Senin...
    const offset = (day + 6) % 7; // mundur ke Senin
    const senin = new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset);
    return senin.toISOString().slice(0, 10);
  });

  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = filter === "bulan" ? { filter, yyyymm } : { filter, awal };
    const { data } = await api.get("/admin/pembayaran", { params });
    setData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter, yyyymm, awal]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Histori Pembayaran</h1>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="text-sm">Filter</label>
          <br />
          <select
            className="border px-3 py-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="bulan">Per Bulan</option>
            <option value="minggu">Per Minggu</option>
          </select>
        </div>
        {filter === "bulan" ? (
          <div>
            <label className="text-sm">Periode (YYYY-MM)</label>
            <br />
            <input
              className="border px-3 py-2 rounded"
              value={yyyymm}
              onChange={(e) => setYyyymm(e.target.value)}
              placeholder="2025-09"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm">Awal Minggu (YYYY-MM-DD)</label>
            <br />
            <input
              className="border px-3 py-2 rounded"
              value={awal}
              onChange={(e) => setAwal(e.target.value)}
              placeholder="2025-09-22"
            />
          </div>
        )}
        <Button onClick={load}>Terapkan</Button>
      </div>

      {loading && <p>Memuat...</p>}
      {!loading && !data.length && <p>Data kosong.</p>}
      {!loading && !!data.length && (
        <div className="space-y-2">
          {data.map((r) => (
            <div
              key={r.id_pembayaran}
              className="border rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {r.nomor_pesanan} — {r.nama_pelanggan}
                </div>
                <div className="text-sm">
                  {new Date(r.waktu_bayar).toLocaleString("id-ID")}
                  {" · "}Metode: {r.metode === "tunai" ? "Tunai" : "Non Tunai"}
                  {" · "}Total: {formatRp(r.total_harga)}
                </div>
              </div>
              <div>
                {r.url_invoice_pdf ? (
                  <a
                    className="underline"
                    href={makeAbsolute(r.url_invoice_pdf)!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unduh Invoice
                  </a>
                ) : (
                  <span className="opacity-60">Tanpa invoice</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
