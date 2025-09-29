import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import type { PesananHead } from "../../types";
import { Badge, Button } from "../../components/UI";
import { formatRp } from "../../utils/format";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE;
const FILE_BASE = new URL(API_BASE).origin; // -> http://localhost:5000

export default function PesananSayaPage() {
  const [data, setData] = useState<PesananHead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    return api
      .get("/pesanan/saya")
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fileUrl = (path: string) =>
    path.startsWith("http") ? path : `${FILE_BASE}${path}`;

  const invoiceUrl = (nomor: string) =>
    `${FILE_BASE}/static/invoices/INV-${nomor}.pdf`;

  const bayar = async (id_pesanan: string) => {
    const metode = window.prompt("Metode (tunai/non_tunai):", "tunai");
    if (!metode) return;

    const body: {
      id_pesanan: string;
      metode: "tunai" | "non_tunai";
      referensi?: string;
    } = {
      id_pesanan,
      metode: (metode as any) === "non_tunai" ? "non_tunai" : "tunai",
    };
    if (body.metode === "non_tunai") {
      const ref = window.prompt("Masukkan referensi transaksi non-tunai:");
      if (ref) body.referensi = ref;
    }

    try {
      const { data } = await api.post("/pembayaran/bayar", body);
      toast.success("Pembayaran berhasil, membuka invoice…");
      // kalau backend kirim url relatif → jadikan absolut
      if (data?.url_invoice_pdf)
        window.open(
          fileUrl(data.url_invoice_pdf),
          "_blank",
          "noopener,noreferrer"
        );

      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal bayar");
    }
  };

  const warnaStatus = (s: string) =>
    s === "menunggu_konfirmasi"
      ? "amber"
      : s === "disetujui"
      ? "blue"
      : s === "dibayar"
      ? "green"
      : "red";

  if (loading) return <p className="p-4">Memuat...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Pesanan Saya</h1>
      {!data.length && <p>Belum ada pesanan.</p>}
      {data.map((p) => (
        <div key={p.id_pesanan} className="border rounded-lg p-3 mb-2">
          <div className="font-medium">{p.nomor_pesanan}</div>
          <div className="text-sm">
            Status: <b>{p.status_pesanan}</b> — Total: {formatRp(p.total_harga)}
          </div>
          <Badge color={warnaStatus(p.status_pesanan)}>
            {p.status_pesanan === "disetujui" && (
              <div className="mt-2">
                <Button onClick={() => bayar(p.id_pesanan)}>Bayar</Button>
              </div>
            )}
          </Badge>

          <Badge color={warnaStatus(p.status_pesanan)}>
            {p.status_pesanan === "dibayar" && (
              <div className="mt-2">
                <a
                  className="underline"
                  href={invoiceUrl(p.nomor_pesanan)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh Invoice
                </a>
              </div>
            )}
          </Badge>
        </div>
      ))}
    </div>
  );
}
