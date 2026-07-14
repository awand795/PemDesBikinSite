import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Plus, Search, Edit } from 'lucide-react';

export default function FamiliesList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['families', search, page],
    queryFn: async () => {
      const { data } = await api.get('/families', { params: { search, per_page: 15, page } });
      return data;
    },
  });

  const families = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Kartu Keluarga</h1>
          <p className="text-text-secondary text-sm mt-1">Total: {data?.total || 0} KK</p>
        </div>
        <Link
          to="/admin/keluarga/tambah"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah KK
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari No. KK atau nama kepala keluarga..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">No. KK</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Kepala Keluarga</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Dusun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">RT/RW</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : families.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-text-muted">Belum ada data KK</td></tr>
              ) : (
                families.map((f: any) => (
                  <tr key={f.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{f.no_kk}</td>
                    <td className="px-4 py-3 text-sm font-medium">{f.nama_kepala_keluarga}</td>
                    <td className="px-4 py-3 text-sm">{f.dusun?.nama_dusun || '-'}</td>
                    <td className="px-4 py-3 text-sm">{f.rt}/{f.rw}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/keluarga/${f.id}`} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-text-secondary">Halaman {data.current_page} dari {data.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 hover:bg-bg-subtle">Sebelumnya</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= (data.last_page || 1)} className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 hover:bg-bg-subtle">Selanjutnya</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
