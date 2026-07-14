import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { MapPin, Phone, Mail, Users, TreePine, BookOpen, Target, Quote, Eye } from 'lucide-react';

export default function ProfilDesa() {
  const { data: profile } = useQuery({
    queryKey: ['public-profile'],
    queryFn: async () => {
      const { data } = await api.get('/public/profile');
      return data.data;
    },
  });

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Memuat profil desa...</p>
        </div>
      </div>
    );
  }

  const infoItems = [
    { icon: MapPin, label: 'Alamat', value: `${profile.alamat_kantor}\nKec. ${profile.kecamatan}\nKab. ${profile.kabupaten}\nProv. ${profile.provinsi}` },
    { icon: Users, label: 'Kepala Desa', value: profile.nama_kepala_desa || '-' },
  ];
  if (profile.telp) infoItems.push({ icon: Phone, label: 'Telepon', value: profile.telp });
  if (profile.email) infoItems.push({ icon: Mail, label: 'Email', value: profile.email });

  const wilayahItems = [
    { label: 'Luas Wilayah', value: `${profile.luas_wilayah || '-'} km²` },
    { label: 'Jumlah Dusun', value: profile.jumlah_dusun || '-' },
    { label: 'Kode Pos', value: profile.kode_pos || '-' },
  ];
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
              <BookOpen className="w-4 h-4 text-primary-500" />
              Profil Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-fg leading-tight">
              Mengenal{' '}
              <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">{profile.nama_desa || 'Desa Kami'}</span>
            </h1>
            <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
              Informasi lengkap tentang desa, sejarah, visi misi, dan data wilayah
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ===== Main Content ===== */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Sejarah */}
            {profile.sejarah && (
              <div className="card p-6 lg:p-8 hover:-translate-y-0.5 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/10">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-fg">Sejarah Desa</h2>
                </div>
                <div className="relative pl-6 border-l-2 border-primary-500/30">
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-primary-500 -translate-x-[6px]" />
                  <p className="text-fg-secondary leading-relaxed whitespace-pre-line text-base">
                    {profile.sejarah}
                  </p>
                </div>
              </div>
            )}

            {/* Visi & Misi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.visi && (
                <div className="card p-6 lg:p-8 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-fg">Visi</h2>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 rounded-2xl p-6 border border-amber-100/50 dark:border-amber-900/10 relative">
                    <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
                    <p className="text-fg-secondary leading-relaxed italic text-base relative z-10">
                      "{profile.visi}"
                    </p>
                  </div>
                </div>
              )}
              {profile.misi && (
                <div className="card p-6 lg:p-8 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-fg">Misi</h2>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/10 dark:to-teal-950/10 rounded-2xl p-6 border border-emerald-100/50 dark:border-emerald-900/10">
                    <p className="text-fg-secondary leading-relaxed whitespace-pre-line text-base">{profile.misi}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== Sidebar ===== */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Informasi Desa */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-fg text-lg mb-6 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-primary-500" />
                Informasi Desa
              </h3>
              <div className="space-y-5">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-fg mt-1 whitespace-pre-line leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wilayah */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-fg text-lg mb-6 flex items-center gap-2.5">
                <TreePine className="w-5 h-5 text-emerald-500" />
                Wilayah
              </h3>
              <div className="space-y-3">
                {wilayahItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 px-4 bg-subtle/50 dark:bg-subtle/30 rounded-xl border border-border/30">
                    <span className="text-sm text-fg-secondary">{item.label}</span>
                    <span className="text-sm font-bold text-fg">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-700 dark:from-primary-900 dark:to-indigo-950 rounded-3xl p-8 text-center shadow-xl">
              <div className="absolute inset-0 bg-white/5 opacity-10 blur-xl rounded-full scale-150 pointer-events-none" />
              <p className="text-white font-display font-bold text-xl mb-2 relative z-10">Butuh Bantuan?</p>
              <p className="text-primary-100/90 text-sm mb-6 max-w-xs mx-auto leading-relaxed relative z-10">Hubungi kantor desa untuk pelayanan administrasi atau info lebih lanjut</p>
              <a
                href={profile.telp ? `tel:${profile.telp}` : '#'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all relative z-10"
              >
                <Phone className="w-4 h-4" />
                Hubungi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
