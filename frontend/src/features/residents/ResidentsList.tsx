import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Plus, Search, Edit, User, Users, Filter } from 'lucide-react';

export default function ResidentsList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['residents', search, page],
    queryFn: async () => {
      const { data } = await api.get('/residents', {
        params: { search, per_page: 15, page },
      });
      return data;
    },
  });

  const residents = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Penduduk</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {total} jiwa</p>
        </div>
        <Link
          to="/admin/penduduk/tambah"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Penduduk
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari NIK, nama, atau no. HP..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">NIK</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Jenis Kelamin</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Dusun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : residents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Belum ada data penduduk
                  </td>
                </tr>
              ) : (
                residents.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{r.nik}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.nama_lengkap}</td>
                    <td className="px-4 py-3 text-sm">{r.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                    <td className="px-4 py-3 text-sm">{r.family?.dusun?.nama_dusun || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {r.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/penduduk/${r.id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Halaman {data.current_page} dari {data.last_page}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data.last_page || 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
