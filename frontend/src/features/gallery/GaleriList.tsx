import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Plus, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';

export default function GaleriList() {
  const [showUpload, setShowUpload] = useState(false);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data } = await api.get('/galleries');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/galleries/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] }),
  });

  const galleries = data?.data || [];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !judul) return;

    setUploading(true);
    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'gallery');
      const { data: uploadData } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Save gallery entry
      await api.post('/galleries', {
        judul,
        foto_path: uploadData.path,
        kategori: kategori || null,
        tanggal: new Date().toISOString().split('T')[0],
      });

      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      setShowUpload(false);
      setJudul('');
      setKategori('');
      setFile(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal mengupload foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Galeri Foto</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola foto galeri desa</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <form onSubmit={handleUpload} className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Judul *</label>
            <input type="text" required value={judul} onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Kategori</label>
            <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Kegiatan, Pembangunan, dll." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">File Foto *</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1 text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
              {file && <span className="text-xs text-text-secondary">{file.name}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading || !file || !judul}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Mengupload...' : 'Upload'}
            </button>
            <button type="button" onClick={() => setShowUpload(false)}
              className="px-4 py-2.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-subtle transition-colors">
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="text-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-muted">Belum ada foto galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((g: any) => (
            <div key={g.id} className="bg-surface rounded-xl border border-border overflow-hidden group relative">
              <img
                src={g.foto_path || '/placeholder.svg'}
                alt={g.judul}
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Foto'; }}
              />
              <div className="p-3">
                <p className="text-sm font-medium text-text-primary truncate">{g.judul}</p>
                {g.kategori && (
                  <span className="text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{g.kategori}</span>
                )}
              </div>
              <button
                onClick={() => { if (confirm(`Hapus "${g.judul}"?`)) deleteMutation.mutate(g.id); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
