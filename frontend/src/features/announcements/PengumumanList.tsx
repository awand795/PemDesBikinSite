import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function PengumumanList() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul: '', konten: '', tanggal_mulai: '', tanggal_selesai: '', is_active: true });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await api.get('/announcements');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/announcements', payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['announcements'] }); setShowForm(false); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/announcements/${editingId}`, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['announcements'] }); setShowForm(false); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/announcements/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });

  const resetForm = () => { setForm({ judul: '', konten: '', tanggal_mulai: '', tanggal_selesai: '', is_active: true }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setForm({ judul: item.judul, konten: item.konten, tanggal_mulai: item.tanggal_mulai || '', tanggal_selesai: item.tanggal_selesai || '', is_active: item.is_active });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  const items = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Pengumuman</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> {showForm ? 'Tutup' : 'Tambah'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Judul *</label>
            <input type="text" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Konten *</label>
            <textarea required value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Tgl Mulai</label>
              <input type="date" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Tgl Selesai</label>
              <input type="date" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="is_active" className="text-sm text-text-primary">Aktif</label>
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {editingId ? 'Simpan' : 'Tambah'} Pengumuman
          </button>
        </form>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-subtle border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Judul</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Periode</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-bg-subtle">
                <td className="px-4 py-3 text-sm font-medium">{item.judul}</td>
                <td className="px-4 py-3 text-sm">{item.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID') : '-'} s.d. {item.tanggal_selesai ? new Date(item.tanggal_selesai).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-4 py-3">
                  {item.is_active ? <span className="flex items-center gap-1 text-xs text-green-700"><Eye className="w-3 h-3" /> Aktif</span> : <span className="flex items-center gap-1 text-xs text-text-secondary"><EyeOff className="w-3 h-3" /> Nonaktif</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="text-primary-600 hover:text-primary-700"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm('Hapus?')) deleteMutation.mutate(item.id); }} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
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
