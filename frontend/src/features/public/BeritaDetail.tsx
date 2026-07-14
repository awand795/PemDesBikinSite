import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Calendar, Eye, User, Share2, Clock } from 'lucide-react';

export default function BeritaDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: news, isLoading } = useQuery({
    queryKey: ['public-news', slug],
    queryFn: async () => {
      const { data } = await api.get(`/public/news/${slug}`);
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto bg-subtle rounded-full flex items-center justify-center mb-4 border border-border">
          <Eye className="w-10 h-10 text-fg-muted" />
        </div>
        <h1 className="text-2xl font-display font-bold text-fg">Berita tidak ditemukan</h1>
        <p className="text-fg-secondary mt-2 mb-6">Berita yang Anda cari mungkin sudah tidak tersedia.</p>
        <Link
          to="/berita"
          className="btn-primary btn-md inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-300 py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Berita
        </Link>

        <article className="animate-fade-in-up">
          {/* Header */}
          <div className="mb-8">
            {news.kategori && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-bold mb-4">
                {news.kategori}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-fg leading-tight">
              {news.judul}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-fg-secondary">
              {news.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary-500/70" />
                  {new Date(news.published_at).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              )}
              {news.author?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary-500/70" />
                  {news.author.name}
                </span>
              )}
              {news.views_count && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary-500/70" />
                  {news.views_count} dilihat
                </span>
              )}
              {news.created_at && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-500/70" />
                  Dipublikasikan {new Date(news.created_at).toLocaleDateString('id-ID')}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          {news.thumbnail_path && (
            <div className="rounded-3xl overflow-hidden mb-10 shadow-lg border border-border/40">
              <img
                src={news.thumbnail_path}
                alt={news.judul}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="card p-6 sm:p-8 lg:p-12 mb-10">
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:text-fg prose-headings:font-display prose-headings:font-bold
                prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-md
                prose-blockquote:border-primary-500 prose-blockquote:bg-subtle/50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-2xl
                prose-pre:bg-black/90 dark:prose-pre:bg-black/40 prose-pre:rounded-2xl
                prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                leading-relaxed text-fg-secondary"
              dangerouslySetInnerHTML={{ __html: news.konten }}
            />
          </div>

          {/* Share & Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              to="/berita"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-fg-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Berita Lainnya
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: news.judul, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-fg hover:bg-surface-hover transition-all duration-200 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-fg-secondary" />
              Bagikan Berita
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
