import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Button } from '../../components/UI';
import { formatRp } from '../../utils/format';

type Row = {
  id_pesanan: string;
  nomor_pesanan: string;
  status_pesanan: 'menunggu_konfirmasi'|'disetujui'|'ditolak'|'dibayar';
  total_harga: string;
  dibuat_pada: string;
  nama_pelanggan: string;
};

export default function PesananAdminPage(){
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<'menunggu_konfirmasi'|'disetujui'|'ditolak'|'dibayar'>('menunggu_konfirmasi');
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/admin/pesanan', { params: { status: filter, limit: 50 }})
    .then(({data}) => setRows(data.data)).finally(() => setLoading(false));

  useEffect(() => { setLoading(true); load(); }, [filter]);

  const acc = async (id: string) => { await api.post(`/admin/pesanan/${id}/acc`); load(); };
  const tolak = async (id: string) => { await api.post(`/admin/pesanan/${id}/tolak`); load(); };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Validasi Pesanan</h1>
      <div className="mb-3">
        <select className="border px-3 py-2 rounded" value={filter} onChange={e => setFilter(e.target.value as any)}>
          <option value="menunggu_konfirmasi">Menunggu konfirmasi</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
          <option value="dibayar">Dibayar</option>
        </select>
      </div>
      {loading && <p>Memuat...</p>}
      {!loading && rows.map(r => (
        <div key={r.id_pesanan} className="border rounded-lg p-3 mb-2">
          <div className="font-medium">{r.nomor_pesanan} — {r.nama_pelanggan}</div>
          <div className="text-sm">Status: <b>{r.status_pesanan}</b> · Total: {formatRp(r.total_harga)}</div>
          {r.status_pesanan === 'menunggu_konfirmasi' && (
            <div className="mt-2 flex gap-2">
              <Button onClick={() => acc(r.id_pesanan)}>ACC</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => tolak(r.id_pesanan)}>Tolak</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
