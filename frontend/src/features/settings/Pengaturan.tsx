import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Save, Upload, Building2, Settings as SettingsIcon } from 'lucide-react';

export default function Pengaturan() {
  const [tab, setTab] = useState<'profil' | 'umum'>('profil');
  const queryClient = useQueryClient();

  const [profileForm, setProfileForm] = useState({
    nama_desa: '', kecamatan: '', kabupaten: '', provinsi: '',
    kode_pos: '', alamat_kantor: '', nama_kepala_desa: '', telp: '',
    email: '', logo_path: '', visi: '', misi: '', sejarah: '',
    sambutan_kepala_desa: '', luas_wilayah: '', jumlah_dusun: '',
    koordinat_lat: '', koordinat_lng: '',
  });

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['desa-profile'],
    queryFn: async () => {
      const { data } = await api.get('/desa-profile');
      return data.data;
    },
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data;
    },
  });

  useEffect(() => {
    if (profileData) {
      setProfileForm({
        nama_desa: profileData.nama_desa || '',
        kecamatan: profileData.kecamatan || '',
        kabupaten: profileData.kabupaten || '',
        provinsi: profileData.provinsi || '',
        kode_pos: profileData.kode_pos || '',
        alamat_kantor: profileData.alamat_kantor || '',
        nama_kepala_desa: profileData.nama_kepala_desa || '',
        telp: profileData.telp || '',
        email: profileData.email || '',
        logo_path: profileData.logo_path || '',
        visi: profileData.visi || '',
        misi: profileData.misi || '',
        sejarah: profileData.sejarah || '',
        sambutan_kepala_desa: profileData.sambutan_kepala_desa || '',
        luas_wilayah: profileData.luas_wilayah?.toString() || '',
        jumlah_dusun: profileData.jumlah_dusun?.toString() || '',
        koordinat_lat: profileData.koordinat_lat || '',
        koordinat_lng: profileData.koordinat_lng || '',
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (settingsData) {
      setSettingsForm(settingsData);
    }
  }, [settingsData]);

  const profileMutation = useMutation({
    mutationFn: (payload: any) => api.put('/desa-profile', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['desa-profile'] }),
  });

  const settingsMutation = useMutation({
    mutationFn: (payload: any) => api.put('/settings', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);
      formData.append('folder', 'desa-profile');
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileForm({ ...profileForm, logo_path: data.path });
      setLogoFile(null);
    } catch (err) {
      alert('Gagal mengupload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...profileForm,
      luas_wilayah: profileForm.luas_wilayah ? Number(profileForm.luas_wilayah) : null,
      jumlah_dusun: profileForm.jumlah_dusun ? Number(profileForm.jumlah_dusun) : null,
    };
    profileMutation.mutate(payload);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settingsMutation.mutate({ settings: settingsForm });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setTab('profil')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'profil' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Building2 className="w-4 h-4" />
          Profil Desa
        </button>
        <button
          onClick={() => setTab('umum')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'umum' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <SettingsIcon className="w-4 h-4" />
          Pengaturan Umum
        </button>
      </div>

      {tab === 'profil' && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Logo Section */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {profileForm.logo_path ? (
                <img src={profileForm.logo_path} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Logo Desa</p>
              <div className="flex items-center gap-2 mt-1">
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700" />
                {logoFile && (
                  <button type="button" onClick={handleLogoUpload} disabled={uploadingLogo}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 disabled:opacity-50">
                    <Upload className="w-3 h-3" />
                    {uploadingLogo ? '...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Desa *</label>
              <input type="text" required value={profileForm.nama_desa}
                onChange={(e) => setProfileForm({ ...profileForm, nama_desa: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
              <input type="text" required value={profileForm.kecamatan}
                onChange={(e) => setProfileForm({ ...profileForm, kecamatan: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten *</label>
              <input type="text" required value={profileForm.kabupaten}
                onChange={(e) => setProfileForm({ ...profileForm, kabupaten: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
              <input type="text" required value={profileForm.provinsi}
                onChange={(e) => setProfileForm({ ...profileForm, provinsi: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
              <input type="text" value={profileForm.kode_pos}
                onChange={(e) => setProfileForm({ ...profileForm, kode_pos: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor</label>
              <textarea value={profileForm.alamat_kantor}
                onChange={(e) => setProfileForm({ ...profileForm, alamat_kantor: e.target.value })}
                rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Desa</label>
              <input type="text" value={profileForm.nama_kepala_desa}
                onChange={(e) => setProfileForm({ ...profileForm, nama_kepala_desa: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telp</label>
              <input type="text" value={profileForm.telp}
                onChange={(e) => setProfileForm({ ...profileForm, telp: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Luas Wilayah (km²)</label>
                <input type="number" step="0.01" value={profileForm.luas_wilayah}
                  onChange={(e) => setProfileForm({ ...profileForm, luas_wilayah: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Dusun</label>
                <input type="number" value={profileForm.jumlah_dusun}
                  onChange={(e) => setProfileForm({ ...profileForm, jumlah_dusun: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Visi</label>
              <textarea value={profileForm.visi}
                onChange={(e) => setProfileForm({ ...profileForm, visi: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Misi</label>
              <textarea value={profileForm.misi}
                onChange={(e) => setProfileForm({ ...profileForm, misi: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sejarah Desa</label>
              <textarea value={profileForm.sejarah}
                onChange={(e) => setProfileForm({ ...profileForm, sejarah: e.target.value })}
                rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sambutan Kepala Desa</label>
              <textarea value={profileForm.sambutan_kepala_desa}
                onChange={(e) => setProfileForm({ ...profileForm, sambutan_kepala_desa: e.target.value })}
                rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Teks sambutan yang akan ditampilkan di halaman depan website" />
            </div>
          </div>

          {profileMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {(profileMutation.error as any)?.response?.data?.message || 'Gagal menyimpan profil'}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={profileMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
              <Save className="w-4 h-4" /> {profileMutation.isPending ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>
      )}

      {tab === 'umum' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Object.keys(settingsForm).length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada pengaturan.</p>
          ) : (
            Object.entries(settingsForm).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                <input type="text" value={value as string}
                  onChange={(e) => setSettingsForm({ ...settingsForm, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            ))
          )}

          {settingsMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {(settingsMutation.error as any)?.response?.data?.message || 'Gagal menyimpan pengaturan'}
            </div>
          )}

          <button type="submit" disabled={settingsMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" /> {settingsMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      )}
    </div>
  );
}
