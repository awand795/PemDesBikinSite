import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function BeritaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    judul: '',
    konten: '',
    kategori: '',
    status: 'draft' as 'draft' | 'published',
    thumbnail_path: '',
  });

  const { data: beritaData } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const { data } = await api.get(`/news/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (beritaData) {
      setForm({
        judul: beritaData.judul || '',
        konten: beritaData.konten || '',
        kategori: beritaData.kategori || '',
        status: beritaData.status || 'draft',
        thumbnail_path: beritaData.thumbnail_path || '',
      });
    }
  }, [beritaData]);

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/news', payload),
    onSuccess: () => navigate('/admin/berita'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/news/${id}`, payload),
    onSuccess: () => navigate('/admin/berita'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/berita')} className="text-fg-muted hover:text-fg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-fg">{isEdit ? 'Edit' : 'Tambah'} Berita</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">Judul *</label>
          <input type="text" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Kategori</label>
            <input type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="draft">Draft</option>
              <option value="published">Terbit</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-fg mb-1">Konten *</label>
          <textarea required value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={10}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
            placeholder="Tulis konten berita di sini... (HTML didukung)" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/berita')}
            className="px-6 py-2.5 border border-border text-fg font-medium rounded-lg hover:bg-subtle transition-colors">Batal</button>
        </div>
      </form>
    </div>
  );
}
