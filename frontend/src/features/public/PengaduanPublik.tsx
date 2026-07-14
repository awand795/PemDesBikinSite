import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { MessageSquare, CheckCircle, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PengaduanPublik() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [result, setResult] = useState<{ kode_tiket: string } | null>(null);
  const [form, setForm] = useState({
    nama_pelapor: '',
    no_hp: '',
    kategori: '',
    isi_pengaduan: '',
    lokasi: '',
  });
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);

  const submitMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await api.post('/public/complaints', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: (data) => {
      setResult(data);
      setStep('success');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fotoFiles.forEach((file) => {
      formData.append('foto[]', file);
    });
    submitMutation.mutate(formData);
  };

  const addFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotoFiles((prev) => [...prev, ...files].slice(0, 3));
  };

  const removeFoto = (index: number) => {
    setFotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (step === 'success' && result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaduan Terkirim!</h2>
          <p className="text-gray-500 mb-4">Simpan kode tiket berikut:</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-2xl font-bold text-blue-700 tracking-wider">{result.kode_tiket}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Gunakan kode tiket untuk mengecek status pengaduan Anda.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setStep('form'); setForm({ nama_pelapor: '', no_hp: '', kategori: '', isi_pengaduan: '', lokasi: '' }); }}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Kirim Pengaduan Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = ['Infrastruktur', 'Pelayanan', 'Lingkungan', 'Sosial', 'Ekonomi', 'Lainnya'];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <MessageSquare className="w-12 h-12 text-primary-500 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-900">Pengaduan & Aspirasi</h1>
        <p className="text-gray-500 mt-2">Sampaikan keluhan, saran, atau aspirasi Anda</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama (opsional)</label>
              <input
                type="text"
                value={form.nama_pelapor}
                onChange={(e) => setForm({ ...form, nama_pelapor: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Boleh dikosongkan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (opsional)</label>
              <input
                type="text"
                value={form.no_hp}
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              required
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">Pilih kategori...</option>
              {categories.map((c) => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (opsional)</label>
            <input
              type="text"
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Lokasi kejadian"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pengaduan *</label>
            <textarea
              required
              value={form.isi_pengaduan}
              onChange={(e) => setForm({ ...form, isi_pengaduan: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Jelaskan pengaduan atau aspirasi Anda"
            />
          </div>

          {/* Foto Bukti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti (opsional, maks. 3)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {fotoFiles.map((file, i) => (
                <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFoto(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {fotoFiles.length < 3 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <input type="file" accept="image/*" onChange={addFoto} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400">Format: JPG/PNG/WebP, maks 5MB per file</p>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {submitMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Kirim Pengaduan'
            )}
          </button>
        </form>

        {submitMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            Gagal mengirim pengaduan. Silakan coba lagi.
          </div>
        )}
      </div>
    </div>
  );
}
