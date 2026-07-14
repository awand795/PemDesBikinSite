import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Search, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  menunggu: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Menunggu' },
  diproses: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Diproses' },
  disetujui: { color: 'text-green-700', bg: 'bg-green-50', label: 'Disetujui' },
  ditolak: { color: 'text-red-700', bg: 'bg-red-50', label: 'Ditolak' },
  selesai: { color: 'text-green-700', bg: 'bg-green-50', label: 'Selesai' },
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
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary-500 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-text-primary">Cek Status Surat</h1>
        <p className="text-text-secondary mt-2">Masukkan nomor pengajuan dan NIK</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nomor Pengajuan</label>
          <input
            type="text"
            required
            value={nomor}
            onChange={(e) => { setNomor(e.target.value); setSearch(false); }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Contoh: 20260714-ABCDEF"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">NIK</label>
          <input
            type="text"
            required
            maxLength={16}
            value={nik}
            onChange={(e) => { setNik(e.target.value); setSearch(false); }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="16 digit NIK"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          Cek Status
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Data tidak ditemukan. Periksa kembali nomor pengajuan dan NIK Anda.
        </div>
      )}

      {data && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Detail Permohonan</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Jenis Surat</span>
              <span className="font-medium">{data.letter_type?.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Nama Pemohon</span>
              <span className="font-medium">{data.nama_pemohon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Tanggal Pengajuan</span>
              <span className="font-medium">
                {data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan).toLocaleDateString('id-ID') : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-text-secondary">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[data.status]?.bg || 'bg-bg-subtle'} ${statusConfig[data.status]?.color || 'text-text-primary'}`}>
                {statusConfig[data.status]?.label || data.status}
              </span>
            </div>
            {data.nomor_surat && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Nomor Surat</span>
                <span className="font-medium">{data.nomor_surat}</span>
              </div>
            )}
            {data.catatan_admin && (
              <div className="pt-2 border-t">
                <span className="text-text-secondary block mb-1">Catatan Admin</span>
                <p className="text-text-primary">{data.catatan_admin}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
