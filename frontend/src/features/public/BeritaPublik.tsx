import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';

export default function BeritaPublik() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      const { data } = await api.get('/public/news');
      return data;
    },
  });

  const items = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Berita Desa</h1>
        <p className="text-gray-500 mt-2">Informasi dan kegiatan terbaru dari desa kami</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada berita.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Link
              key={item.id}
              to={`/berita/${item.slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {item.thumbnail_path ? (
                <img src={item.thumbnail_path} alt={item.judul} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <span className="text-primary-300 text-4xl font-bold">{item.judul?.charAt(0)}</span>
                </div>
              )}
              <div className="p-5">
                {item.kategori && (
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {item.kategori}
                  </span>
                )}
                <h2 className="font-semibold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.judul}
                </h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {item.konten?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                  <span>{item.author?.name || ''}</span>
                  <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {data?.last_page > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: data.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1.5 text-sm rounded-lg border ${page === data.current_page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
