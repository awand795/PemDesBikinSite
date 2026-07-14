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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Hubungi Kami</h1>
        <p className="text-text-secondary mt-2">Kantor Desa {profile?.nama_desa || 'Kami'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-primary mb-4">Informasi Kontak</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">Alamat</p>
                  <p className="text-sm text-text-secondary">
                    {profile?.alamat_kantor || 'Jl. Contoh No. 1'}<br />
                    Kec. {profile?.kecamatan || '-'}<br />
                    Kab. {profile?.kabupaten || '-'}<br />
                    Prov. {profile?.provinsi || '-'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">Telepon</p>
                  <p className="text-sm text-text-secondary">{profile?.telp || '(021) 12345678'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">Email</p>
                  <p className="text-sm text-text-secondary">{profile?.email || 'info@desa.id'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">Jam Kerja</p>
                  <p className="text-sm text-text-secondary">Senin - Jumat: 08:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Lokasi</h3>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Peta lokasi akan ditampilkan di sini</p>
              {profile?.koordinat_lat && profile?.koordinat_lng && (
                <p className="text-xs mt-1">
                  {profile.koordinat_lat}, {profile.koordinat_lng}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 text-center">
            Integrasi Google Maps dapat ditambahkan
          </p>
        </div>
      </div>
    </div>
  );
}
