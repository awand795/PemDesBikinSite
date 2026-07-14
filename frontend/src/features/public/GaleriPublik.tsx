import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import {
  X, ChevronLeft, ChevronRight, Grid, Camera,
} from 'lucide-react';

export default function GaleriPublik() {
  const [kategori, setKategori] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const selected = selectedIndex !== null ? galleries[selectedIndex] : null;

  const nextImage = () => {
    if (selectedIndex !== null && selectedIndex < galleries.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-5">
              <Camera className="w-4 h-4 text-primary-400" />
              Galeri Foto
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Galeri <span className="gradient-text">Foto Desa</span>
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Dokumentasi kegiatan, pembangunan, dan momen berharga desa
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Category Filter ===== */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setKategori('')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                !kategori
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Semua
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setKategori(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  kategori === cat
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ===== Content ===== */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Memuat galeri...</p>
            </div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg text-slate-400">Belum ada foto galeri</p>
            <p className="text-sm text-slate-300 mt-1">Belum ada foto yang diupload</p>
          </div>
        ) : (
          <>
            {/* Masonry-style grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {galleries.map((g: any, idx: number) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedIndex(idx)}
                  className="group relative bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-0.5 transition-all duration-300 text-left"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={g.foto_path || '/placeholder.svg'}
                      alt={g.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/e2e8f0/94a3b8?text=Foto';
                      }}
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-sm font-medium text-white truncate">{g.judul}</p>
                      {g.kategori && (
                        <p className="text-xs text-white/70 mt-0.5">{g.kategori}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Photo count */}
            <p className="text-center text-sm text-slate-400 mt-8">
              Menampilkan {galleries.length} foto
            </p>
          </>
        )}
      </div>

      {/* ===== Lightbox ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/80 text-sm">
            {selectedIndex! + 1} / {galleries.length}
          </div>

          {/* Previous */}
          {selectedIndex! > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.foto_path}
              alt={selected.judul}
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-4">
              <p className="text-lg font-medium text-white">{selected.judul}</p>
              {selected.kategori && (
                <p className="text-sm text-white/60 mt-1">{selected.kategori}</p>
              )}
            </div>
          </div>

          {/* Next */}
          {selectedIndex! < galleries.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
