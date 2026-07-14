import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function JenisSuratList() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['letter-types-admin', search],
    queryFn: async () => {
      const { data } = await api.get('/letter-types');
      return data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/letter-types/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['letter-types-admin'] }),
  });

  const types = Array.isArray(data) ? data : [];

  const filtered = types.filter((t: any) =>
    !search || t.nama.toLowerCase().includes(search.toLowerCase()) || t.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Jenis Surat</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola jenis surat dan template</p>
        </div>
        <Link
          to="/admin/surat/jenis-surat/tambah"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Jenis Surat
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari jenis surat..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-subtle border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Kode</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Nama</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Estimasi (hari)</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Syarat</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-text-muted">Belum ada jenis surat</td></tr>
            ) : (
              filtered.map((t: any) => (
                <tr key={t.id} className="hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-medium">{t.kode}</td>
                  <td className="px-4 py-3 text-sm">{t.nama}</td>
                  <td className="px-4 py-3 text-sm">{t.estimasi_hari ? `${t.estimasi_hari} hari` : '-'}</td>
                  <td className="px-4 py-3 text-sm">{t.persyaratan?.length || 0} syarat</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${t.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {t.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/surat/jenis-surat/${t.id}`} className="text-primary-600 hover:text-primary-700">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus "${t.nama}"?`)) {
                            deleteMutation.mutate(t.id, {
                              onError: (err: any) => alert(err?.response?.data?.message || 'Gagal menghapus'),
                            });
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
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
    </div>
  );
}
