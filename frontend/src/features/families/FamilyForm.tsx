import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function FamilyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    no_kk: '',
    nama_kepala_keluarga: '',
    alamat: '',
    dusun_id: '',
    rt: '',
    rw: '',
    kode_pos: '',
  });

  const { data: familyData } = useQuery({
    queryKey: ['family', id],
    queryFn: async () => {
      const { data } = await api.get(`/families/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (familyData) {
      setForm({
        no_kk: familyData.no_kk || '',
        nama_kepala_keluarga: familyData.nama_kepala_keluarga || '',
        alamat: familyData.alamat || '',
        dusun_id: familyData.dusun_id?.toString() || '',
        rt: familyData.rt || '',
        rw: familyData.rw || '',
        kode_pos: familyData.kode_pos || '',
      });
    }
  }, [familyData]);

  const { data: dusunData } = useQuery({
    queryKey: ['dusuns'],
    queryFn: async () => {
      const { data } = await api.get('/dusuns');
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/families', payload),
    onSuccess: () => navigate('/admin/keluarga'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/families/${id}`, payload),
    onSuccess: () => navigate('/admin/keluarga'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, dusun_id: form.dusun_id ? Number(form.dusun_id) : null };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/keluarga')} className="text-fg-muted hover:text-fg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-fg">{isEdit ? 'Edit' : 'Tambah'} Kartu Keluarga</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fg mb-1">No. KK * (16 digit)</label>
            <input type="text" required maxLength={16} pattern="[0-9]{16}" value={form.no_kk}
              onChange={(e) => setForm({ ...form, no_kk: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fg mb-1">Nama Kepala Keluarga *</label>
            <input type="text" required value={form.nama_kepala_keluarga}
              onChange={(e) => setForm({ ...form, nama_kepala_keluarga: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fg mb-1">Alamat *</label>
            <textarea required value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Dusun</label>
            <select value={form.dusun_id}
              onChange={(e) => setForm({ ...form, dusun_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Pilih Dusun --</option>
              {(Array.isArray(dusunData) ? dusunData : []).map((d: any) => (
                <option key={d.id} value={d.id}>{d.nama_dusun}</option>
              ))}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-fg mb-1">RT</label>
            <input type="text" value={form.rt} onChange={(e) => setForm({ ...form, rt: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div><label className="block text-sm font-medium text-fg mb-1">RW</label>
            <input type="text" value={form.rw} onChange={(e) => setForm({ ...form, rw: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div><label className="block text-sm font-medium text-fg mb-1">Kode Pos</label>
            <input type="text" value={form.kode_pos} onChange={(e) => setForm({ ...form, kode_pos: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/keluarga')}
            className="px-6 py-2.5 border border-border text-fg font-medium rounded-lg hover:bg-subtle transition-colors">Batal</button>
        </div>
      </form>
    </div>
  );
}
