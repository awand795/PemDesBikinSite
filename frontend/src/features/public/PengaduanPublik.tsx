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
      <div className="max-w-lg mx-auto px-4 py-20 bg-page">
        <div className="card p-8 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-fg mb-2">Pengaduan Terkirim!</h2>
          <p className="text-fg-secondary mb-6">Simpan kode tiket berikut untuk mengecek status:</p>
          <div className="bg-gradient-to-br from-primary-500/10 to-indigo-500/5 dark:from-primary-950/25 dark:to-indigo-950/10 border border-primary-500/20 rounded-2xl p-6 mb-6 inline-block w-full max-w-sm">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">Kode Tiket</p>
            <p className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 tracking-wider font-mono">
              {result.kode_tiket}
            </p>
          </div>
          <p className="text-sm text-fg-muted mb-6">
            Gunakan kode tiket ini untuk mengecek status pengaduan Anda di masa mendatang.
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
    <div className="bg-page min-h-screen transition-colors duration-300">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-primary-50/40 via-page to-secondary-50/20 dark:from-zinc-950 dark:via-page dark:to-primary-950/20 border-b border-border overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]"
          style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-5 backdrop-blur-sm">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              Pengaduan & Aspirasi
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-fg leading-tight">
              Sampaikan <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Aspirasi</span> Anda
            </h1>
            <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
              Salurkan keluhan, saran, dan aspirasi Anda kepada pemerintah desa.
              Setiap masukan sangat berarti untuk transparansi dan kemajuan desa kita.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ===== Info Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-to-br from-primary-500/10 to-indigo-500/5 dark:from-primary-950/20 dark:to-indigo-950/10 rounded-2xl p-5 border border-primary-500/20 text-center shadow-sm">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-fg">Terjamin</p>
            <p className="text-xs text-fg-secondary mt-1">Identitas pelapor aman & rahasia</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/10 rounded-2xl p-5 border border-amber-500/20 text-center shadow-sm">
            <Send className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-fg">Responsif</p>
            <p className="text-xs text-fg-secondary mt-1">Ditindaklanjuti segera oleh desa</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-2xl p-5 border border-emerald-500/20 text-center shadow-sm">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-fg">Terpantau</p>
            <p className="text-xs text-fg-secondary mt-1">Status tiket aduan bisa dilacak</p>
          </div>
        </div>

        {/* ===== Form ===== */}
        <div className="card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-display font-bold text-fg mb-6 border-b border-border pb-3">Form Pengaduan</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama & No HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-fg mb-2">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-fg-muted" />
                    Nama Pelapor (opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.nama_pelapor}
                  onChange={(e) => setForm({ ...form, nama_pelapor: e.target.value })}
                  className="input"
                  placeholder="Nama Anda atau kosongkan untuk anonim"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-fg mb-2">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-fg-muted" />
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
              <label className="block text-sm font-semibold text-fg mb-2">
                Kategori Pengaduan <span className="text-danger-500">*</span>
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
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? 'bg-primary-500/10 dark:bg-primary-950/30 border-primary-500/40 text-primary-700 dark:text-primary-300 font-bold shadow-sm'
                          : 'bg-surface border-border text-fg-secondary hover:border-fg-muted hover:bg-surface-hover hover:text-fg'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? 'text-primary-600 dark:text-primary-400' : 'text-fg-muted'}`} />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-fg-muted" />
                  Lokasi Kejadian (opsional)
                </span>
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                className="input"
                placeholder="Lokasi kejadian atau nama dusun"
              />
            </div>

            {/* Isi Pengaduan */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                Isi Pengaduan <span className="text-danger-500">*</span>
              </label>
              <textarea
                required
                value={form.isi_pengaduan}
                onChange={(e) => setForm({ ...form, isi_pengaduan: e.target.value })}
                rows={5}
                className="input"
                placeholder="Jelaskan secara detail keluhan, aduan, atau aspirasi yang ingin Anda sampaikan"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-fg-muted" />
                  Foto Bukti Pendukung (opsional, maks. 3)
                </span>
              </label>
              <div className="flex flex-wrap gap-3 mb-2">
                {fotoFiles.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 bg-subtle rounded-2xl overflow-hidden group border border-border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {fotoFiles.length < 3 && (
                  <label className="w-24 h-24 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 dark:hover:bg-primary-950/10 transition-all duration-200">
                    <Upload className="w-5 h-5 text-fg-muted" />
                    <span className="text-[10px] font-bold text-fg-muted mt-1.5">Upload</span>
                    <input type="file" accept="image/*" onChange={addFoto} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-xs text-fg-muted">Format yang didukung: JPG, PNG, WebP (maks 5MB per file)</p>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary btn-lg w-full cursor-pointer"
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
            <div className="mt-5 p-4 bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-900/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-danger-700 dark:text-danger-300">Gagal mengirim pengaduan</p>
                <p className="text-xs text-danger-600 dark:text-danger-400 mt-1">
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
