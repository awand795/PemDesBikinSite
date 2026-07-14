import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import {
  MessageSquare, CheckCircle, Upload, X, AlertCircle,
  User, Phone, MapPin, FileText, Shield, Send,
} from 'lucide-react';

const categories = [
  { value: 'infrastruktur', label: 'Infrastruktur', icon: MapPin, desc: 'Jalan, jembatan, drainase, dll' },
  { value: 'pelayanan', label: 'Pelayanan', icon: User, desc: 'Pelayanan administrasi desa' },
  { value: 'lingkungan', label: 'Lingkungan', icon: Shield, desc: 'Kebersihan, penghijauan, dll' },
  { value: 'sosial', label: 'Sosial', icon: MessageSquare, desc: 'Bantuan sosial, kegiatan masyarakat' },
  { value: 'ekonomi', label: 'Ekonomi', icon: FileText, desc: 'UMKM, pasar, perekonomian' },
  { value: 'lainnya', label: 'Lainnya', icon: MessageSquare, desc: 'Kategori lainnya' },
];

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
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="card p-8 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-success-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Pengaduan Terkirim!</h2>
          <p className="text-slate-500 mb-6">Simpan kode tiket berikut untuk mengecek status:</p>
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-xl p-5 mb-6 inline-block">
            <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-1">Kode Tiket</p>
            <p className="text-2xl font-bold text-primary-700 tracking-wider font-mono">
              {result.kode_tiket}
            </p>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Gunakan kode tiket untuk mengecek status pengaduan Anda.
          </p>
          <button
            onClick={() => {
              setStep('form');
              setForm({ nama_pelapor: '', no_hp: '', kategori: '', isi_pengaduan: '', lokasi: '' });
              setFotoFiles([]);
            }}
            className="btn-primary btn-md w-full max-w-xs mx-auto"
          >
            <Send className="w-4 h-4" />
            Kirim Pengaduan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1c1917] dark:bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(250,250,249,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-5">
              <MessageSquare className="w-4 h-4 text-primary-400" />
              Pengaduan & Aspirasi
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Sampaikan <span className="gradient-text">Aspirasi</span> Anda
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Salurkan keluhan, saran, dan aspirasi Anda kepada pemerintah desa.
              Setiap masukan berarti untuk kemajuan desa kita.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Info Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100/50 text-center">
            <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Terjamin</p>
            <p className="text-xs text-slate-500">Identitas aman & rahasia</p>
          </div>
          <div className="bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl p-4 border border-accent-100/50 text-center">
            <Send className="w-8 h-8 text-accent-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Responsif</p>
            <p className="text-xs text-slate-500">Ditindaklanjuti segera</p>
          </div>
          <div className="bg-gradient-to-br from-secondary-50 to-emerald-50 rounded-xl p-4 border border-secondary-100/50 text-center">
            <CheckCircle className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Terpantau</p>
            <p className="text-xs text-slate-500">Status bisa dilacak</p>
          </div>
        </div>

        {/* ===== Form ===== */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Form Pengaduan</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama & No HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    Nama (opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.nama_pelapor}
                  onChange={(e) => setForm({ ...form, nama_pelapor: e.target.value })}
                  className="input"
                  placeholder="Boleh dikosongkan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    No. HP (opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.no_hp}
                  onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                  className="input"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Kategori <span className="text-danger-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const selected = form.kategori === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, kategori: cat.value })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${
                        selected
                          ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? 'text-primary-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Lokasi (opsional)
                </span>
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                className="input"
                placeholder="Lokasi kejadian atau lokasi terkait"
              />
            </div>

            {/* Isi Pengaduan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Isi Pengaduan <span className="text-danger-500">*</span>
              </label>
              <textarea
                required
                value={form.isi_pengaduan}
                onChange={(e) => setForm({ ...form, isi_pengaduan: e.target.value })}
                rows={5}
                className="input"
                placeholder="Jelaskan pengaduan, keluhan, atau aspirasi Anda secara detail"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-slate-400" />
                  Foto Bukti (opsional, maks. 3)
                </span>
              </label>
              <div className="flex flex-wrap gap-3 mb-2">
                {fotoFiles.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {fotoFiles.length < 3 && (
                  <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 mt-1">Upload</span>
                    <input type="file" accept="image/*" onChange={addFoto} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-400">Format: JPG/PNG/WebP, maks 5MB per file</p>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary btn-lg w-full"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pengaduan
                </>
              )}
            </button>
          </form>

          {submitMutation.isError && (
            <div className="mt-5 p-4 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger-700">Gagal mengirim pengaduan</p>
                <p className="text-xs text-danger-600 mt-0.5">
                  {(submitMutation.error as any)?.response?.data?.message || 'Silakan coba lagi beberapa saat.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
