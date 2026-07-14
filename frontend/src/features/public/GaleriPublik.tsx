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
    <div className="bg-page min-h-screen transition-colors duration-300">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-primary-50/40 via-page to-secondary-50/20 dark:from-zinc-950 dark:via-page dark:to-primary-950/20 border-b border-border overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]"
          style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-5 backdrop-blur-sm">
              <Camera className="w-4 h-4 text-primary-500" />
              Galeri Foto
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-fg leading-tight">
              Galeri <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Foto Desa</span>
            </h1>
            <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
              Dokumentasi kegiatan, pembangunan, dan momen berharga desa
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Category Filter ===== */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => setKategori('')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !kategori
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-surface text-fg-secondary border border-border hover:bg-surface-hover hover:text-fg'
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
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  kategori === cat
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-surface text-fg-secondary border border-border hover:bg-surface-hover hover:text-fg'
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
              <p className="text-sm text-fg-muted font-medium">Memuat galeri...</p>
            </div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center card p-12 max-w-md mx-auto">
            <Camera className="w-16 h-16 text-fg-muted mx-auto mb-4 opacity-50" />
            <p className="text-fg font-bold text-lg">Belum ada foto</p>
            <p className="text-fg-secondary text-sm mt-1">Belum ada foto yang diupload dalam galeri.</p>
          </div>
        ) : (
          <>
            {/* Masonry-style grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
              {galleries.map((g: any, idx: number) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedIndex(idx)}
                  className="group relative card overflow-hidden hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer w-full"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-subtle">
                    <img
                      src={g.foto_path || '/placeholder.svg'}
                      alt={g.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x450/e2e8f0/94a3b8?text=Foto';
                      }}
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-sm font-semibold text-white truncate">{g.judul}</p>
                      {g.kategori && (
                        <p className="text-xs text-white/80 mt-1 font-medium">{g.kategori}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Photo count */}
            <p className="text-center text-sm font-medium text-fg-muted mt-10">
              Menampilkan {galleries.length} foto
            </p>
          </>
        )}
      </div>

      {/* ===== Lightbox ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white/90 text-sm font-semibold">
            {selectedIndex! + 1} / {galleries.length}
          </div>

          {/* Previous */}
          {selectedIndex! > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all focus:outline-none"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.foto_path}
              alt={selected.judul}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/5"
            />
            <div className="text-center mt-6 max-w-xl px-4">
              <p className="text-xl font-bold text-white leading-tight">{selected.judul}</p>
              {selected.kategori && (
                <span className="inline-block text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-3 py-1 rounded-full mt-2">
                  {selected.kategori}
                </span>
              )}
            </div>
          </div>

          {/* Next */}
          {selectedIndex! < galleries.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all focus:outline-none"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
