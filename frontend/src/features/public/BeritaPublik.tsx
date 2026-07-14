import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Newspaper, ChevronRight, Calendar, User } from 'lucide-react';

export default function BeritaPublik() {
  const [page, setPage] = useState(1);
  const [kategori, setKategori] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['public-news', page, kategori],
    queryFn: async () => {
      const params: any = { page, per_page: 9 };
      if (kategori) params.kategori = kategori;
      const { data } = await api.get('/public/news', { params });
      return data;
    },
  });

  const items = data?.data || [];
  const lastPage = data?.last_page || 1;
  const categories = ['Informasi', 'Kegiatan', 'Pembangunan', 'Pengumuman'];

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').substring(0, 150) || '';

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
              <Newspaper className="w-4 h-4 text-primary-500" />
              Berita Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-fg leading-tight">
              Berita <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Desa</span>
            </h1>
            <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
              Informasi, pengumuman, dan kegiatan terbaru dari desa kami
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Filter ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setKategori(''); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !kategori
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-surface text-fg-secondary border border-border hover:bg-surface-hover hover:text-fg'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setKategori(cat); setPage(1); }}
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
          <p className="text-sm font-medium text-fg-muted">
            {data?.total || 0} berita ditemukan
          </p>
        </div>

        {/* ===== Content ===== */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-fg-muted font-medium">Memuat berita...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center card p-12 max-w-md mx-auto">
            <Newspaper className="w-16 h-16 text-fg-muted mx-auto mb-4 opacity-50" />
            <p className="text-fg font-bold text-lg">Belum ada berita</p>
            <p className="text-fg-secondary text-sm mt-1">Belum ada berita yang dipublikasikan untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
            {items.map((item: any) => (
              <Link
                key={item.id}
                to={`/berita/${item.slug}`}
                className="group card overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-subtle shrink-0 border-b border-border">
                  {item.thumbnail_path ? (
                    <img
                      src={item.thumbnail_path}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/5 to-indigo-500/5">
                      <Newspaper className="w-12 h-12 text-primary-200 dark:text-primary-950" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.kategori && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-surface/90 dark:bg-black/90 backdrop-blur-sm text-xs font-semibold text-primary-600 dark:text-primary-400 shadow-sm border border-border/50">
                      {item.kategori}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-fg-muted mb-2.5 font-medium">
                      {item.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary-500/70" />
                          {new Date(item.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      )}
                      {item.author?.name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-primary-500/70" />
                          {item.author.name}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-bold text-fg text-lg line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.judul}
                    </h2>
                    <p className="text-sm text-fg-secondary mt-2 line-clamp-3 leading-relaxed">
                      {stripHtml(item.konten)}...
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 animate-fade-in-up">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-border bg-surface text-fg-secondary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Sebelumnya
            </button>
            {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
              let pageNum: number;
              if (lastPage <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= lastPage - 3) {
                pageNum = lastPage - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    page === pageNum
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'border border-border bg-surface text-fg-secondary hover:bg-surface-hover hover:text-fg'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(lastPage, page + 1))}
              disabled={page === lastPage}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-border bg-surface text-fg-secondary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
