import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Berita tidak ditemukan</h1>
        <Link to="/berita" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/berita" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Berita
      </Link>

      {news.kategori && (
        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {news.kategori}
        </span>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-4">{news.judul}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {news.published_at ? new Date(news.published_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {news.views_count} dilihat
        </span>
        <span>{news.author?.name}</span>
      </div>

      {news.thumbnail_path && (
        <img src={news.thumbnail_path} alt={news.judul} className="w-full h-64 md:h-80 object-cover rounded-xl mb-8" />
      )}

      <div className="prose prose-gray max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: news.konten }} />
    </article>
  );
}
