import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function ResidentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nik: '',
    nama_lengkap: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: '',
    pendidikan_terakhir: '',
    pekerjaan: '',
    status_perkawinan: '',
    no_hp: '',
    family_id: '',
  });

  // Load data for edit
  const { data: residentData } = useQuery({
    queryKey: ['resident', id],
    queryFn: async () => {
      const { data } = await api.get(`/residents/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (residentData) {
      setForm({
        nik: residentData.nik || '',
        nama_lengkap: residentData.nama_lengkap || '',
        jenis_kelamin: residentData.jenis_kelamin || 'L',
        tempat_lahir: residentData.tempat_lahir || '',
        tanggal_lahir: residentData.tanggal_lahir || '',
        agama: residentData.agama || '',
        pendidikan_terakhir: residentData.pendidikan_terakhir || '',
        pekerjaan: residentData.pekerjaan || '',
        status_perkawinan: residentData.status_perkawinan || '',
        no_hp: residentData.no_hp || '',
        family_id: residentData.family_id?.toString() || '',
      });
    }
  }, [residentData]);

  const { data: families } = useQuery({
    queryKey: ['families-list'],
    queryFn: async () => {
      const { data } = await api.get('/families', { params: { per_page: 100 } });
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/residents', payload),
    onSuccess: () => navigate('/admin/penduduk'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/residents/${id}`, payload),
    onSuccess: () => navigate('/admin/penduduk'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, family_id: form.family_id ? Number(form.family_id) : null };
    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/penduduk')} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Tambah'} Penduduk</h1>
          <p className="text-gray-500 text-sm">Isi data penduduk dengan benar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK * (16 digit)</label>
            <input
              type="text"
              required
              maxLength={16}
              pattern="[0-9]{16}"
              value={form.nik}
              onChange={(e) => setForm({ ...form, nik: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
            <select
              required
              value={form.jenis_kelamin}
              onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as 'L' | 'P' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
            <input
              type="text"
              value={form.no_hp}
              onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
            <input
              type="text"
              value={form.tempat_lahir}
              onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agama</label>
            <input
              type="text"
              value={form.agama}
              onChange={(e) => setForm({ ...form, agama: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan</label>
            <input
              type="text"
              value={form.pendidikan_terakhir}
              onChange={(e) => setForm({ ...form, pendidikan_terakhir: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
            <input
              type="text"
              value={form.pekerjaan}
              onChange={(e) => setForm({ ...form, pekerjaan: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Perkawinan</label>
            <input
              type="text"
              value={form.status_perkawinan}
              onChange={(e) => setForm({ ...form, status_perkawinan: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kartu Keluarga</label>
            <select
              value={form.family_id}
              onChange={(e) => setForm({ ...form, family_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">-- Pilih KK --</option>
              {(Array.isArray(families) ? families : []).map((f: any) => (
                <option key={f.id} value={f.id}>{f.no_kk} - {f.nama_kepala_keluarga}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {(error as any)?.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/penduduk')}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
