import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const PLACEHOLDERS = [
  '{{nama}}', '{{nik}}', '{{alamat}}', '{{tempat_lahir}}',
  '{{tanggal_lahir}}', '{{jenis_kelamin}}', '{{pekerjaan}}',
  '{{keperluan}}', '{{tanggal_surat}}', '{{nomor_surat}}',
  '{{nama_kepala_desa}}', '{{nama_desa}}',
];

export default function JenisSuratForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const templateRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState({
    kode: '',
    nama: '',
    deskripsi: '',
    template_konten: '',
    persyaratan: [] as string[],
    estimasi_hari: '',
    is_active: true,
  });

  const [syaratInput, setSyaratInput] = useState('');

  const { data: existingData } = useQuery({
    queryKey: ['letter-type', id],
    queryFn: async () => {
      const { data } = await api.get(`/letter-types/${id}`);
      return data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingData) {
      setForm({
        kode: existingData.kode || '',
        nama: existingData.nama || '',
        deskripsi: existingData.deskripsi || '',
        template_konten: existingData.template_konten || '',
        persyaratan: existingData.persyaratan || [],
        estimasi_hari: existingData.estimasi_hari?.toString() || '',
        is_active: existingData.is_active ?? true,
      });
    }
  }, [existingData]);

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/letter-types', payload),
    onSuccess: () => navigate('/admin/surat/jenis-surat'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => api.put(`/letter-types/${id}`, payload),
    onSuccess: () => navigate('/admin/surat/jenis-surat'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      estimasi_hari: form.estimasi_hari ? Number(form.estimasi_hari) : null,
    };
    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const addSyarat = () => {
    if (syaratInput.trim() && !form.persyaratan.includes(syaratInput.trim())) {
      setForm({ ...form, persyaratan: [...form.persyaratan, syaratInput.trim()] });
      setSyaratInput('');
    }
  };

  const removeSyarat = (index: number) => {
    setForm({ ...form, persyaratan: form.persyaratan.filter((_, i) => i !== index) });
  };

  const insertPlaceholder = (placeholder: string) => {
    const textarea = templateRef.current;
    if (!textarea) {
      setForm({ ...form, template_konten: form.template_konten + placeholder });
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = form.template_konten.substring(0, start) + placeholder + form.template_konten.substring(end);
    setForm({ ...form, template_konten: newText });
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
      textarea.focus();
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/surat/jenis-surat')} className="text-text-muted hover:text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{isEdit ? 'Edit' : 'Tambah'} Jenis Surat</h1>
          <p className="text-text-secondary text-sm">Kelola template dan persyaratan surat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Kode *</label>
            <input
              type="text" required maxLength={20}
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="SKTM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Estimasi (hari kerja)</label>
            <input
              type="number" min={1}
              value={form.estimasi_hari}
              onChange={(e) => setForm({ ...form, estimasi_hari: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Nama *</label>
            <input
              type="text" required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Surat Keterangan Tidak Mampu"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Persyaratan */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Persyaratan</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.persyaratan.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                {s}
                <button type="button" onClick={() => removeSyarat(i)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={syaratInput}
              onChange={(e) => setSyaratInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSyarat(); } }}
              placeholder="Tambah syarat..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button type="button" onClick={addSyarat}
              className="px-3 py-2 bg-gray-100 text-text-primary text-sm rounded-lg hover:bg-gray-200 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template Konten */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Template Konten Surat</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {PLACEHOLDERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => insertPlaceholder(p)}
                className="px-2 py-0.5 bg-gray-100 text-text-secondary text-xs rounded hover:bg-primary-100 hover:text-primary-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mb-1">Klik placeholder untuk menyisipkan ke posisi kursor</p>
          <textarea
            ref={templateRef}
            value={form.template_konten}
            onChange={(e) => setForm({ ...form, template_konten: e.target.value })}
            rows={12}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
            placeholder="Tulis template surat dengan placeholder yang tersedia..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox" id="is_active"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm text-text-primary">Aktif</label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {(error as any)?.response?.data?.message || 'Terjadi kesalahan.'}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/surat/jenis-surat')}
            className="px-6 py-2.5 border border-border text-text-primary font-medium rounded-lg hover:bg-bg-subtle transition-colors">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
