import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Image as ImageIcon, X } from 'lucide-react';

export default function GaleriPublik() {
  const [kategori, setKategori] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['public-gallery', kategori],
    queryFn: async () => {
      const params: any = {};
      if (kategori) params.kategori = kategori;
      const { data } = await api.get('/public/gallery', { params });
      return data.data;
    },
  });

  const galleries = Array.isArray(data) ? data : [];
  const categories = [...new Set(galleries.map((g: any) => g.kategori).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Galeri Foto Desa</h1>
        <p className="text-gray-500 mt-2">Dokumentasi kegiatan dan pembangunan desa</p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setKategori('')}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${!kategori ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setKategori(cat)}
              className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${kategori === cat ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">Belum ada foto galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((g: any) => (
            <button
              key={g.id}
              onClick={() => setSelected(g)}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow text-left"
            >
              <img
                src={g.foto_path || '/placeholder.svg'}
                alt={g.judul}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Foto'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium truncate">{g.judul}</p>
                  {g.kategori && <p className="text-xs text-white/80">{g.kategori}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selected.foto_path}
              alt={selected.judul}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-white mt-3 text-center">
              <p className="font-medium">{selected.judul}</p>
              {selected.kategori && <p className="text-sm text-white/70">{selected.kategori}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
