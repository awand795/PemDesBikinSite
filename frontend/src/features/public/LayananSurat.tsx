import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, ArrowRight, Clock, ClipboardList, AlertCircle } from 'lucide-react';

export default function LayananSurat() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [result, setResult] = useState<{ nomor_pengajuan: string } | null>(null);
  const [form, setForm] = useState({
    letter_type_id: '',
    nik: '',
    nama_pemohon: '',
    keperluan: '',
  });

  const { data: letterTypes } = useQuery({
    queryKey: ['public-letter-types'],
    queryFn: async () => {
      const { data } = await api.get('/public/letter-types');
      return data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/public/letter-requests', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setResult(data);
      setStep('success');
    },
  });

  const types = Array.isArray(letterTypes) ? letterTypes : [];
  const selectedType = types.find((t: any) => t.id === Number(form.letter_type_id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  if (step === 'success' && result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 bg-page">
        <div className="card p-8 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-fg mb-2">Permohonan Terkirim!</h2>
          <p className="text-fg-secondary mb-6">Simpan nomor pengajuan berikut untuk mengecek status:</p>
          <div className="bg-gradient-to-br from-primary-500/10 to-indigo-500/5 dark:from-primary-950/25 dark:to-indigo-950/10 border border-primary-500/20 rounded-2xl p-6 mb-6 inline-block w-full max-w-sm">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">Nomor Pengajuan</p>
            <p className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 tracking-wider font-mono">
              {result.nomor_pengajuan}
            </p>
          </div>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link
              to="/layanan-surat/status"
              className="btn-primary btn-md w-full"
            >
              <ClipboardList className="w-4 h-4" />
              Cek Status Surat
            </Link>
            <button
              onClick={() => { setStep('form'); setForm({ letter_type_id: '', nik: '', nama_pemohon: '', keperluan: '' }); }}
              className="btn-secondary btn-md w-full"
            >
              Ajukan Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-300 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-fg">
            Layanan Surat Online
          </h1>
          <p className="text-fg-secondary mt-2 text-lg">
            Ajukan surat keterangan desa secara online, cepat, dan mudah
          </p>
        </div>

        <div className="card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jenis Surat */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                Jenis Surat <span className="text-danger-500">*</span>
              </label>
              <select
                required
                value={form.letter_type_id}
                onChange={(e) => setForm({ ...form, letter_type_id: e.target.value })}
                className="input"
              >
                <option value="">Pilih jenis surat...</option>
                {types.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.nama}</option>
                ))}
              </select>

              {selectedType && (
                <div className="mt-4 p-5 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 dark:from-primary-950/15 dark:to-indigo-950/10 rounded-2xl border border-primary-500/20">
                  {selectedType.deskripsi && (
                    <p className="text-sm text-fg-secondary mb-3 leading-relaxed">{selectedType.deskripsi}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {selectedType.estimasi_hari && (
                      <span className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold">
                        <Clock className="w-4 h-4" />
                        Estimasi: {selectedType.estimasi_hari} hari kerja
                      </span>
                    )}
                  </div>
                  {selectedType.persyaratan?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-2">Persyaratan:</p>
                      <ul className="space-y-2">
                        {selectedType.persyaratan.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-fg-secondary leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                NIK <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={16}
                pattern="[0-9]{16}"
                title="16 digit angka"
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                className="input"
                placeholder="16 digit NIK sesuai KTP"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                Nama Lengkap <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nama_pemohon}
                onChange={(e) => setForm({ ...form, nama_pemohon: e.target.value })}
                className="input"
                placeholder="Nama sesuai KTP"
              />
            </div>

            {/* Keperluan */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                Keperluan <span className="text-danger-500">*</span>
              </label>
              <textarea
                required
                value={form.keperluan}
                onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                rows={4}
                className="input"
                placeholder="Jelaskan keperluan pengajuan surat ini secara mendetail"
              />
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary btn-lg w-full cursor-pointer"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Ajukan Surat
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {submitMutation.isError && (
            <div className="mt-5 p-4 bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-900/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700 dark:text-danger-300 font-medium">
                {(submitMutation.error as any)?.response?.data?.message || 'Gagal mengajukan surat. Silakan coba lagi.'}
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/layanan-surat/status"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
          >
            Sudah punya nomor pengajuan?
            <ArrowRight className="w-4 h-4" />
            Cek status
          </Link>
        </div>
      </div>
    </div>
  );
}
