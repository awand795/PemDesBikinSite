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
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-5">
              <Newspaper className="w-4 h-4 text-primary-400" />
              Berita Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Berita <span className="gradient-text">Desa</span>
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Informasi dan kegiatan terbaru dari desa kami
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Filter ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setKategori(''); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !kategori
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setKategori(cat); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  kategori === cat
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            {data?.total || 0} berita ditemukan
          </p>
        </div>

        {/* ===== Content ===== */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Memuat berita...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Belum ada berita</p>
            <p className="text-slate-400 text-sm mt-1">Belum ada berita yang dipublikasikan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
            {items.map((item: any) => (
              <Link
                key={item.id}
                to={`/berita/${item.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {item.thumbnail_path ? (
                    <img
                      src={item.thumbnail_path}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
                      <Newspaper className="w-12 h-12 text-primary-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.kategori && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-600 shadow-sm">
                      {item.kategori}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    {item.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    )}
                    {item.author?.name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.author.name}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {item.judul}
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {stripHtml(item.konten)}...
                  </p>
                  <div className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                    Baca Selengkapnya
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    page === pageNum
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(lastPage, page + 1))}
              disabled={page === lastPage}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
