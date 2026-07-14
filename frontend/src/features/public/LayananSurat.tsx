import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  if (step === 'success' && result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Terkirim!</h2>
          <p className="text-gray-500 mb-4">Simpan nomor pengajuan berikut:</p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-2xl font-bold text-primary-700 tracking-wider">
              {result.nomor_pengajuan}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Gunakan nomor pengajuan dan NIK Anda untuk mengecek status surat.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/layanan-surat/status"
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Cek Status Surat
            </Link>
            <button
              onClick={() => { setStep('form'); setForm({ letter_type_id: '', nik: '', nama_pemohon: '', keperluan: '' }); }}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ajukan Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary-500 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-900">Layanan Surat Online</h1>
        <p className="text-gray-500 mt-2">Ajukan surat keterangan desa secara online</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat *</label>
            <select
              required
              value={form.letter_type_id}
              onChange={(e) => setForm({ ...form, letter_type_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">Pilih jenis surat...</option>
              {types.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK *</label>
            <input
              type="text"
              required
              maxLength={16}
              pattern="[0-9]{16}"
              title="16 digit angka"
              value={form.nik}
              onChange={(e) => setForm({ ...form, nik: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="16 digit NIK"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={form.nama_pemohon}
              onChange={(e) => setForm({ ...form, nama_pemohon: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Nama sesuai KTP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan *</label>
            <textarea
              required
              value={form.keperluan}
              onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Jelaskan keperluan pengajuan surat ini"
            />
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {submitMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Ajukan Surat
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {submitMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {(submitMutation.error as any)?.response?.data?.message || 'Gagal mengajukan surat. Silakan coba lagi.'}
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <Link to="/layanan-surat/status" className="text-sm text-primary-600 hover:text-primary-700">
          Sudah punya nomor pengajuan? Cek status →
        </Link>
      </div>
    </div>
  );
}
