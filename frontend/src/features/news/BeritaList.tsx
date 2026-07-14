import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function BeritaList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['news', search, page],
    queryFn: async () => {
      const { data } = await api.get('/news', { params: { search, per_page: 15, page } });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/news/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  });

  const items = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {data?.total || 0} berita</p>
        </div>
        <Link to="/admin/berita/tambah"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Tambah Berita
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari judul berita..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Belum ada berita</td></tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{item.judul}</td>
                    <td className="px-4 py-3 text-sm">{item.kategori || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                        {item.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/berita/${item.id}`} className="text-primary-600 hover:text-primary-700">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { if (confirm('Hapus berita ini?')) deleteMutation.mutate(item.id); }}
                          className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
