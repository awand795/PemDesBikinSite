import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Search, Eye } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  menunggu: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Menunggu' },
  diproses: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Diproses' },
  disetujui: { color: 'text-green-700', bg: 'bg-green-50', label: 'Disetujui' },
  ditolak: { color: 'text-red-700', bg: 'bg-red-50', label: 'Ditolak' },
  selesai: { color: 'text-green-700', bg: 'bg-green-50', label: 'Selesai' },
};

export default function SuratList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['letter-requests', search, status, page],
    queryFn: async () => {
      const params: any = { search, per_page: 15, page };
      if (status) params.status = status;
      const { data } = await api.get('/letter-requests', { params });
      return data;
    },
  });

  const requests = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permohonan Surat</h1>
        <p className="text-gray-500 text-sm mt-1">Total: {data?.total || 0} permohonan</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nomor pengajuan, pemohon..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diproses">Diproses</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">No. Pengajuan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Jenis Surat</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada permohonan surat</td></tr>
              ) : (
                requests.map((r: any) => {
                  const st = statusConfig[r.status] || { color: 'text-gray-700', bg: 'bg-gray-50', label: r.status };
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{r.nomor_pengajuan}</td>
                      <td className="px-4 py-3 text-sm font-medium">{r.nama_pemohon}</td>
                      <td className="px-4 py-3 text-sm">{r.letter_type?.nama}</td>
                      <td className="px-4 py-3 text-sm">{r.tanggal_pengajuan ? new Date(r.tanggal_pengajuan).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/admin/surat/permohonan/${r.id}`} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                          <Eye className="w-4 h-4" /> Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {data?.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">Halaman {data.current_page} dari {data.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Sebelumnya</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= (data.last_page || 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Selanjutnya</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
