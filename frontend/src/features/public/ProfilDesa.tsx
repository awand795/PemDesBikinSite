import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { MapPin, Phone, Mail, Users } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Profil {profile.nama_desa}</h1>
        <p className="text-gray-500 mt-2">Mengenal lebih dekat desa kami</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sejarah */}
          {profile.sejarah && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sejarah Desa</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.sejarah}</p>
            </div>
          )}

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.visi && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Visi</h2>
                <p className="text-gray-600 leading-relaxed">{profile.visi}</p>
              </div>
            )}
            {profile.misi && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Misi</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.misi}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Desa</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Alamat</p>
                  <p className="text-gray-500">
                    {profile.alamat_kantor}<br />
                    Kec. {profile.kecamatan}<br />
                    Kab. {profile.kabupaten}<br />
                    Prov. {profile.provinsi}
                  </p>
                </div>
              </div>
              {profile.telp && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Telepon</p>
                    <p className="text-gray-500">{profile.telp}</p>
                  </div>
                </div>
              )}
              {profile.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-500">{profile.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Kepala Desa</p>
                  <p className="text-gray-500">{profile.nama_kepala_desa || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {profile.luas_wilayah && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Wilayah</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Luas Wilayah</span>
                  <span className="font-medium">{profile.luas_wilayah} km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Dusun</span>
                  <span className="font-medium">{profile.jumlah_dusun}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
