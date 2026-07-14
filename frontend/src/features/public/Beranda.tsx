import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import {
  ArrowRight, Newspaper, Users, FileText, MessageSquare, Quote,
  ChevronRight, Sparkles, Shield, Star,
} from 'lucide-react';

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

  const { data: statsData } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const { data } = await api.get('/public/stats');
      return data.data;
    },
  });

  const news = Array.isArray(newsData) ? newsData.slice(0, 3) : (newsData?.data || []).slice(0, 3);
  const stats = statsData || {};
  const profile = profileData || {};

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1c1917] dark:bg-black">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(250,250,249,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-6">
                <Sparkles className="w-4 h-4 text-primary-400" />
                Sistem Informasi Desa Modern
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">
                Selamat Datang di{' '}
                <span className="gradient-text inline-block">
                  {profile?.nama_desa || 'Desa Kita'}
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
                Pelayanan publik yang lebih cepat, transparan, dan akuntabel. 
                Akses layanan administrasi desa secara online — kapan saja, di mana saja.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/layanan-surat"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Ajukan Surat Online
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pengaduan"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Kirim Pengaduan
                </Link>
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-2 px-6 py-3 text-slate-300 font-medium rounded-xl hover:text-white hover:bg-white/5 transition-all"
                >
                  Profil Desa
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Visual / Stats */}
            <div className="hidden lg:flex flex-col gap-4 items-end animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-full max-w-md p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: 'Penduduk', value: stats.total_penduduk ?? '-', color: 'from-primary-400 to-primary-600' },
                    { icon: FileText, label: 'Surat Terbit', value: stats.surat_selesai_bulan_ini ?? '-', color: 'from-secondary-400 to-secondary-600' },
                    { icon: Newspaper, label: 'Berita', value: stats.total_berita ?? '-', color: 'from-accent-400 to-accent-600' },
                    { icon: MessageSquare, label: 'Pengaduan Selesai', value: stats.total_pengaduan_selesai ?? '-', color: 'from-rose-400 to-rose-600' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-xl bg-white/5">
                      <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
                      <p className="text-xs text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SAMBUTAN KEPALA DESA ===== */}
      {profile?.sambutan_kepala_desa && (
        <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <Quote className="w-8 h-8 lg:w-10 h-10 text-white/90" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-0.5 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                  <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Sambutan</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-2">
                  {profile?.nama_kepala_desa || 'Kepala Desa'}
                </h2>
                <p className="text-slate-500 text-sm mb-6">Kepala Desa {profile?.nama_desa || ''}</p>
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base lg:text-lg">
                    {profile.sambutan_kepala_desa}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== LAYANAN CEPAT ===== */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Layanan Unggulan
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Layanan <span className="gradient-text">Cepat & Mudah</span>
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              Nikmati kemudahan akses layanan administrasi desa secara online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: FileText,
                title: 'Surat Online',
                desc: 'Ajukan surat keterangan secara online tanpa datang ke kantor. Proses cepat dan mudah.',
                link: '/layanan-surat',
                gradient: 'from-primary-500 to-primary-700',
                features: ['SKTM', 'SK Domisili', 'SK Usaha', '+ 4 jenis lainnya'],
              },
              {
                icon: MessageSquare,
                title: 'Pengaduan Masyarakat',
                desc: 'Sampaikan aspirasi, keluhan, dan laporan Anda ke pemerintah desa dengan mudah.',
                link: '/pengaduan',
                gradient: 'from-secondary-500 to-secondary-700',
                features: ['Anonim', 'Lacak status', 'Respons cepat'],
              },
              {
                icon: Newspaper,
                title: 'Informasi Desa',
                desc: 'Dapatkan informasi terbaru seputar kegiatan, pembangunan, dan program desa.',
                link: '/berita',
                gradient: 'from-accent-500 to-orange-600',
                features: ['Berita terbaru', 'Pengumuman', 'Galeri foto'],
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group bg-white rounded-2xl border border-slate-200/60 p-8 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-${item.gradient}`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                  Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATISTIK ===== */}
      <section className="relative bg-[#1c1917] dark:bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(250,250,249,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              Desa dalam <span className="gradient-text">Angka</span>
            </h2>
            <p className="text-slate-400 mt-2">Data terkini pemerintahan desa</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              { icon: Users, label: 'Total Penduduk', value: stats.total_penduduk ?? '-', desc: 'Jiwa' },
              { icon: Shield, label: 'Kartu Keluarga', value: stats.total_kk ?? '-', desc: 'KK' },
              { icon: FileText, label: 'Surat Terbit (Bulan Ini)', value: stats.surat_selesai_bulan_ini ?? '-', desc: 'Surat' },
              { icon: Newspaper, label: 'Berita Terbit', value: stats.total_berita ?? '-', desc: 'Berita' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 lg:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-white">{item.value}</p>
                <p className="text-sm text-slate-400 mt-1">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BERITA TERBARU ===== */}
      {news.length > 0 && (
        <section className="py-20 lg:py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-3">
                  <Newspaper className="w-4 h-4" />
                  Informasi Terkini
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900">
                  Berita <span className="gradient-text">Terbaru</span>
                </h2>
              </div>
              <Link
                to="/berita"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Lihat Semua Berita
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {news.map((item: any, idx: number) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
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
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.kategori && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-600 shadow-sm">
                        {item.kategori}
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    {item.published_at && (
                      <p className="text-xs text-slate-400 mb-2">
                        {new Date(item.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    )}
                    <h3 className="font-display font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.konten?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    <div className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="relative bg-primary-600 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Siap Untuk Pelayanan yang Lebih Mudah?
          </h2>
          <p className="text-xl text-primary-100/80 mb-10 max-w-2xl mx-auto">
            Ajukan surat secara online, lacak status pengaduan, dan akses informasi desa kapan saja
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/layanan-surat"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileText className="w-5 h-5" />
              Ajukan Surat Sekarang
            </Link>
            <Link
              to="/pengaduan"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Sampaikan Pengaduan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
