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
    <div className="bg-page min-h-screen transition-colors duration-300">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-50/40 via-page to-secondary-50/20 dark:from-zinc-950 dark:via-page dark:to-primary-950/20 border-b border-border">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                Sistem Informasi Desa Modern
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-fg leading-[1.1] tracking-tight">
                Selamat Datang di{' '}
                <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent inline-block">
                  {profile?.nama_desa || 'Desa Kita'}
                </span>
              </h1>
              <p className="mt-6 text-lg text-fg-secondary leading-relaxed max-w-xl">
                Pelayanan publik yang lebih cepat, transparan, dan akuntabel. 
                Akses layanan administrasi desa secara online — kapan saja, di mana saja.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/layanan-surat"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Ajukan Surat Online
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pengaduan"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface/80 dark:bg-surface/40 backdrop-blur-sm text-fg font-semibold rounded-xl border border-border hover:bg-surface-hover dark:hover:bg-surface-hover/60 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-fg-secondary" />
                  Kirim Pengaduan
                </Link>
                <Link
                  to="/profil"
                  className="inline-flex items-center gap-1.5 px-6 py-3 text-fg-secondary hover:text-fg font-medium rounded-xl hover:bg-surface/50 dark:hover:bg-white/5 transition-all"
                >
                  Profil Desa
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Visual / Stats */}
            <div className="lg:col-span-5 flex flex-col gap-4 items-center lg:items-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-full max-w-md p-6 rounded-3xl bg-surface/60 dark:bg-surface/20 backdrop-blur-md border border-border/80 dark:border-border/30 shadow-xl">
                <p className="text-sm font-semibold text-fg-secondary mb-4 text-center lg:text-left">Statistik Pelayanan & Kependudukan</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: 'Penduduk', value: stats.total_penduduk ?? '-', color: 'from-primary-500 to-indigo-600' },
                    { icon: FileText, label: 'Surat Terbit', value: stats.surat_selesai_bulan_ini ?? '-', color: 'from-emerald-500 to-teal-600' },
                    { icon: Newspaper, label: 'Berita', value: stats.total_berita ?? '-', color: 'from-amber-500 to-orange-600' },
                    { icon: MessageSquare, label: 'Aduan Selesai', value: stats.total_pengaduan_selesai ?? '-', color: 'from-rose-500 to-pink-600' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-2xl bg-page/50 dark:bg-black/20 border border-border/40 dark:border-border/10 hover:shadow-md transition-all">
                      <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-extrabold text-fg mt-3">{item.value}</p>
                      <p className="text-xs text-fg-secondary mt-1">{item.label}</p>
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
        <section className="relative overflow-hidden py-20 bg-surface/40 dark:bg-surface/10 border-b border-border">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center lg:items-start">
              <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <Quote className="w-8 h-8 lg:w-12 lg:h-12 text-white/90" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <span className="h-0.5 w-8 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full" />
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Sambutan</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-fg mb-1">
                  {profile?.nama_kepala_desa || 'Kepala Desa'}
                </h2>
                <p className="text-fg-secondary text-sm mb-6 font-medium">Kepala Desa {profile?.nama_desa || ''}</p>
                <div className="relative pl-0 lg:pl-6 border-l-0 lg:border-l-2 lg:border-primary-500/20 italic">
                  <p className="text-fg-secondary leading-relaxed whitespace-pre-line text-base lg:text-lg">
                    "{profile.sambutan_kepala_desa}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== LAYANAN CEPAT ===== */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-b from-page to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-primary-500" />
              Layanan Unggulan
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-fg">
              Layanan <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Cepat & Mudah</span>
            </h2>
            <p className="mt-3 text-fg-secondary text-lg">
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
                gradient: 'from-primary-500 to-indigo-600',
                features: ['SKTM', 'SK Domisili', 'SK Usaha', '+ 4 jenis lainnya'],
              },
              {
                icon: MessageSquare,
                title: 'Pengaduan Masyarakat',
                desc: 'Sampaikan aspirasi, keluhan, dan laporan Anda ke pemerintah desa dengan mudah.',
                link: '/pengaduan',
                gradient: 'from-emerald-500 to-teal-600',
                features: ['Pelapor Anonim', 'Pantau status', 'Tanggapan cepat'],
              },
              {
                icon: Newspaper,
                title: 'Informasi Desa',
                desc: 'Dapatkan informasi terbaru seputar kegiatan, pembangunan, dan program desa.',
                link: '/berita',
                gradient: 'from-amber-500 to-orange-600',
                features: ['Berita terbaru', 'Pengumuman resmi', 'Galeri foto'],
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group card p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-primary-500/5`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-fg mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-fg-secondary text-sm leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-fg-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                  Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATISTIK ===== */}
      <section className="relative bg-surface/50 dark:bg-black/30 border-y border-border py-20 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]"
          style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '45px 45px' }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-fg">
              Desa dalam <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Angka</span>
            </h2>
            <p className="text-fg-secondary mt-2 text-lg">Data terkini kependudukan dan pelayanan pemerintahan desa</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              { icon: Users, label: 'Total Penduduk', value: stats.total_penduduk ?? '-', desc: 'Jiwa' },
              { icon: Shield, label: 'Kartu Keluarga', value: stats.total_kk ?? '-', desc: 'Kepala Keluarga' },
              { icon: FileText, label: 'Surat Terbit (Bulan Ini)', value: stats.surat_selesai_bulan_ini ?? '-', desc: 'Dokumen Selesai' },
              { icon: Newspaper, label: 'Berita Terbit', value: stats.total_berita ?? '-', desc: 'Publikasi Aktif' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 lg:p-8 card border border-border/40 dark:border-border/10 hover:border-primary-500/30 hover:scale-[1.03] transition-all duration-300">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-primary-500/10">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl lg:text-4xl font-extrabold text-fg">{item.value}</p>
                <p className="text-sm font-semibold text-fg-secondary mt-2">{item.label}</p>
                <p className="text-xs text-fg-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BERITA TERBARU ===== */}
      {news.length > 0 && (
        <section className="py-20 lg:py-24 bg-page">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-3">
                  <Newspaper className="w-4 h-4 text-primary-500" />
                  Informasi Terkini
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-fg">
                  Berita <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Terbaru</span>
                </h2>
              </div>
              <Link
                to="/berita"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
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
                  className="group card overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
                  style={{ animationDelay: `${idx * 0.1}s` }}
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
                        <Newspaper className="w-12 h-12 text-primary-200 dark:text-primary-900" />
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
                      {item.published_at && (
                        <p className="text-xs text-fg-muted mb-2 font-medium">
                          {new Date(item.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      )}
                      <h3 className="font-display font-bold text-fg text-lg line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-fg-secondary mt-2 line-clamp-2 leading-relaxed">
                        {item.konten?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-700 dark:from-primary-900 dark:to-indigo-950 overflow-hidden shadow-2xl py-20 text-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-white mb-4">
              Siap Untuk Pelayanan yang Lebih Mudah?
            </h2>
            <p className="text-lg text-primary-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ajukan surat secara online, lacak status pengaduan, dan akses informasi desa kapan saja.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/layanan-surat"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 hover:bg-primary-50 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <FileText className="w-5 h-5" />
                Ajukan Surat Sekarang
              </Link>
              <Link
                to="/pengaduan"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                <MessageSquare className="w-5 h-5 text-white/80" />
                Sampaikan Pengaduan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
