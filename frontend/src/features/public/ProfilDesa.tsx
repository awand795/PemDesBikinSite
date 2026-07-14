import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { MapPin, Phone, Mail, Users, TreePine, BookOpen, Target, Quote } from 'lucide-react';

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
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1c1917] dark:bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(250,250,249,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-5">
              <BookOpen className="w-4 h-4 text-primary-400" />
              Profil Desa
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Mengenal{' '}
              <span className="gradient-text">{profile.nama_desa || 'Desa Kami'}</span>
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Informasi lengkap tentang desa, sejarah, visi misi, dan data wilayah
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ===== Main Content ===== */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sejarah */}
            {profile.sejarah && (
              <div className="card p-6 lg:p-8 ">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-slate-900">Sejarah Desa</h2>
                </div>
                <div className="relative pl-6 border-l-2 border-primary-100">
                  <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-primary-500 -translate-x-[5px]" />
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {profile.sejarah}
                  </p>
                </div>
              </div>
            )}

            {/* Visi & Misi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.visi && (
                <div className="card p-6 lg:p-8 ">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-slate-900">Visi</h2>
                  </div>
                  <div className="bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl p-5 border border-accent-100/50">
                    <Quote className="w-6 h-6 text-accent-500 mb-2" />
                    <p className="text-slate-700 leading-relaxed italic">{profile.visi}</p>
                  </div>
                </div>
              )}
              {profile.misi && (
                <div className="card p-6 lg:p-8 ">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-slate-900">Misi</h2>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-emerald-50 rounded-xl p-5 border border-secondary-100/50">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{profile.misi}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== Sidebar ===== */}
          <div className="space-y-6">
            {/* Informasi Desa */}
            <div className="card p-6 ">
              <h3 className="font-display font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                Informasi Desa
              </h3>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-slate-800 mt-0.5 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wilayah */}
            <div className="card p-6 ">
              <h3 className="font-display font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-secondary-500" />
                Wilayah
              </h3>
              <div className="space-y-3">
                {wilayahItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-center">
              <p className="text-white font-display font-semibold text-lg mb-1">Butuh Bantuan?</p>
              <p className="text-primary-200 text-sm mb-4">Hubungi kantor desa untuk informasi lebih lanjut</p>
              <a
                href={profile.telp ? `tel:${profile.telp}` : '#'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
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
