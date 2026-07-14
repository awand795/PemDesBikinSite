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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-10 h-10 text-slate-300" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Berita tidak ditemukan</h1>
        <p className="text-slate-500 mt-2 mb-6">Berita yang Anda cari mungkin sudah tidak tersedia.</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Back link */}
      <Link
        to="/berita"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Berita
      </Link>

      <article className="animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          {news.kategori && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4">
              {news.kategori}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 leading-tight">
            {news.judul}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
            {news.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-400" />
                {new Date(news.published_at).toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            )}
            {news.author?.name && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary-400" />
                {news.author.name}
              </span>
            )}
            {news.views_count && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary-400" />
                {news.views_count} dilihat
              </span>
            )}
            {news.created_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-400" />
                Dipublikasikan {new Date(news.created_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        {news.thumbnail_path && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-lg shadow-slate-900/5">
            <img
              src={news.thumbnail_path}
              alt={news.judul}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="card p-6 lg:p-10">
          <div
            className="prose prose-slate max-w-none
              prose-headings:text-slate-900 prose-headings:font-display
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-lg
              prose-pre:bg-slate-900 prose-pre:rounded-xl
              prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: news.konten }}
          />
        </div>

        {/* Share & Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors group"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Bagikan Berita
          </button>
        </div>
      </article>
    </div>
  );
}
