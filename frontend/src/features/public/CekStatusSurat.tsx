import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Search, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  menunggu: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Menunggu' },
  diproses: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Diproses' },
  disetujui: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Disetujui' },
  ditolak: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Ditolak' },
  selesai: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Selesai' },
};

export default function CekStatusSurat() {
  const [nomor, setNomor] = useState('');
  const [nik, setNik] = useState('');
  const [search, setSearch] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['check-letter', nomor, nik],
    queryFn: async () => {
      const { data } = await api.get('/public/letter-requests/check', {
        params: { nomor_pengajuan: nomor, nik },
      });
      return data.data;
    },
    enabled: search,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(true);
  };

  return (
    <div className="bg-page min-h-screen transition-colors duration-300 py-12 lg:py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-fg">Cek Status Surat</h1>
          <p className="text-fg-secondary mt-2">Masukkan nomor pengajuan dan NIK pemohon</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <label className="block text-sm font-semibold text-fg mb-1.5">Nomor Pengajuan</label>
            <input
              type="text"
              required
              value={nomor}
              onChange={(e) => { setNomor(e.target.value); setSearch(false); }}
              className="input"
              placeholder="Contoh: 20260714-ABCDEF"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-fg mb-1.5">NIK Pemohon</label>
            <input
              type="text"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => { setNik(e.target.value); setSearch(false); }}
              className="input"
              placeholder="16 digit NIK sesuai KTP"
            />
          </div>
          <button
            type="submit"
            className="btn-primary btn-lg w-full cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Cek Status
          </button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-8 animate-fade-in">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-danger-500/10 border border-danger-500/25 text-danger-700 dark:text-danger-400 px-4 py-3.5 rounded-2xl text-sm font-medium animate-scale-in text-center shadow-sm">
            Data permohonan tidak ditemukan. Periksa kembali nomor pengajuan dan NIK Anda.
          </div>
        )}

        {data && (
          <div className="card p-6 sm:p-8 animate-scale-in">
            <h3 className="font-display font-bold text-fg text-lg mb-5 border-b border-border pb-3">Detail Permohonan</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-fg-secondary font-medium">Jenis Surat</span>
                <span className="font-bold text-fg">{data.letter_type?.nama}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-fg-secondary font-medium">Nama Pemohon</span>
                <span className="font-bold text-fg">{data.nama_pemohon}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-fg-secondary font-medium">Tanggal Pengajuan</span>
                <span className="font-bold text-fg">
                  {data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-fg-secondary font-medium">Status</span>
                <span className={`px-3 py-1 border rounded-full text-xs font-bold ${statusConfig[data.status]?.bg || 'bg-subtle border-border'} ${statusConfig[data.status]?.color || 'text-fg'}`}>
                  {statusConfig[data.status]?.label || data.status}
                </span>
              </div>
              {data.nomor_surat && (
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-fg-secondary font-medium">Nomor Surat Resmi</span>
                  <span className="font-bold text-fg font-mono">{data.nomor_surat}</span>
                </div>
              )}
              {data.catatan_admin && (
                <div className="pt-3 border-t border-border">
                  <span className="text-fg-secondary font-medium block mb-1">Catatan dari Desa</span>
                  <p className="text-fg leading-relaxed bg-subtle/50 p-3 rounded-xl border border-border/30">{data.catatan_admin}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
