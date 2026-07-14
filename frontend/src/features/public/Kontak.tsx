import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Kontak() {
  const { data: profile } = useQuery({
    queryKey: ['public-profile'],
    queryFn: async () => {
      const { data } = await api.get('/public/profile');
      return data.data;
    },
  });

  return (
    <div className="bg-page min-h-screen transition-colors duration-300 py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-fg">Hubungi Kami</h1>
          <p className="text-fg-secondary mt-2">Kantor Desa {profile?.nama_desa || 'Kami'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-6">
            <div className="card p-6 sm:p-8 hover:-translate-y-0.5 transition-transform duration-300">
              <h3 className="font-display font-bold text-fg text-lg mb-6 border-b border-border pb-3">Informasi Kontak</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-primary-500/10">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-fg text-sm">Alamat Kantor</p>
                    <p className="text-sm text-fg-secondary mt-1 leading-relaxed">
                      {profile?.alamat_kantor || 'Jl. Contoh No. 1'}<br />
                      Kec. {profile?.kecamatan || '-'}<br />
                      Kab. {profile?.kabupaten || '-'}<br />
                      Prov. {profile?.provinsi || '-'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-primary-500/10">
                    <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-fg text-sm">Telepon / Fax</p>
                    <p className="text-sm text-fg-secondary mt-1">{profile?.telp || '(021) 12345678'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-primary-500/10">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-fg text-sm">Email Resmi</p>
                    <p className="text-sm text-fg-secondary mt-1">
                      <a href={`mailto:${profile?.email || 'info@desa.id'}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {profile?.email || 'info@desa.id'}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-primary-500/10">
                    <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-fg text-sm">Jam Kerja Pelayanan</p>
                    <p className="text-sm text-fg-secondary mt-1">Senin - Jumat: 08:00 - 16:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 sm:p-8 hover:-translate-y-0.5 transition-transform duration-300 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-fg text-lg mb-6 border-b border-border pb-3">Lokasi Kantor Desa</h3>
              <div className="bg-subtle/50 dark:bg-subtle/30 border border-border/50 rounded-2xl h-64 flex items-center justify-center text-fg-muted relative overflow-hidden">
                {/* Visual grid inside map placeholder */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]"
                  style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="text-center relative z-10 p-4">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-primary-500/80 animate-pulse" />
                  <p className="text-sm font-semibold text-fg">Peta Lokasi Kantor Desa</p>
                  <p className="text-xs text-fg-secondary mt-1 max-w-xs leading-relaxed">
                    Sistem GPS akan mendeteksi titik koordinat kantor pemerintahan desa.
                  </p>
                  {profile?.koordinat_lat && profile?.koordinat_lng && (
                    <span className="inline-block text-xs font-mono font-bold mt-3 px-3 py-1 bg-surface border border-border/80 rounded-lg text-primary-600 dark:text-primary-400">
                      {profile.koordinat_lat}, {profile.koordinat_lng}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-fg-muted mt-5 text-center leading-relaxed">
              Integrasi peta Google Maps atau OpenStreetMap dapat ditautkan dengan titik koordinat di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
