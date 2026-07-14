import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowRight, Newspaper, Users, FileText, MessageSquare } from 'lucide-react';

export default function Beranda() {
  const { data: newsData } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      const { data } = await api.get('/public/news');
      return data.data;
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ['public-profile'],
    queryFn: async () => {
      const { data } = await api.get('/public/profile');
      return data.data;
    },
  });

  const news = Array.isArray(newsData) ? newsData.slice(0, 3) : (newsData?.data || []).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Selamat Datang di{' '}
              <span className="text-primary-200">Desa {profileData?.nama_desa || 'Kami'}</span>
            </h1>
            <p className="mt-4 text-lg text-primary-100 leading-relaxed">
              Sistem Informasi Desa untuk pelayanan publik yang lebih cepat, transparan, dan akuntabel.
              Akses layanan administrasi secara online kapan saja dan di mana saja.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/layanan-surat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Ajukan Surat Online
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pengaduan"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Kirim Pengaduan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Penduduk', value: '-' },
              { icon: FileText, label: 'Surat Terbit', value: '-' },
              { icon: Newspaper, label: 'Berita', value: '-' },
              { icon: MessageSquare, label: 'Pengaduan', value: '-' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="w-6 h-6 text-primary-500 mx-auto" />
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan Cepat */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Layanan Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Surat Online',
                desc: 'Ajukan surat keterangan secara online tanpa datang ke kantor',
                link: '/layanan-surat',
              },
              {
                icon: MessageSquare,
                title: 'Pengaduan',
                desc: 'Sampaikan aspirasi, keluhan, atau laporan ke pemerintah desa',
                link: '/pengaduan',
              },
              {
                icon: Newspaper,
                title: 'Informasi Desa',
                desc: 'Dapatkan informasi terbaru seputar kegiatan dan pembangunan desa',
                link: '/berita',
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Berita Terbaru */}
      {news.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Berita Terbaru</h2>
              <Link
                to="/berita"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item: any) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.thumbnail_path && (
                    <img
                      src={item.thumbnail_path}
                      alt={item.judul}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    {item.kategori && (
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {item.kategori}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.konten?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
