import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, CheckCircle, XCircle, Download } from 'lucide-react';

function DownloadPdfButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/letter-requests/${id}/print`);
      const { pdf, filename } = data;
      const byteCharacters = atob(pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'surat.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-bg-subtle disabled:opacity-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        {loading ? 'Mengunduh...' : 'Download PDF Surat'}
      </button>
    </div>
  );
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  menunggu: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Menunggu' },
  diproses: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Diproses' },
  disetujui: { color: 'text-green-700', bg: 'bg-green-50', label: 'Disetujui' },
  ditolak: { color: 'text-red-700', bg: 'bg-red-50', label: 'Ditolak' },
  selesai: { color: 'text-green-700', bg: 'bg-green-50', label: 'Selesai' },
};

export default function SuratDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const { data: item, isLoading } = useQuery({
    queryKey: ['letter-request', id],
    queryFn: async () => {
      const { data } = await api.get(`/letter-requests/${id}`);
      return data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => api.patch(`/letter-requests/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['letter-request', id] }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.patch(`/letter-requests/${id}/reject`, { catatan_admin: rejectNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letter-request', id] });
      setRejectMode(false);
      setRejectNote('');
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!item) return <div className="text-center py-12 text-text-secondary">Data tidak ditemukan</div>;

  const st = statusConfig[item.status] || { color: 'text-text-primary', bg: 'bg-bg-subtle', label: item.status };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/admin/surat/permohonan" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Detail Permohonan Surat</h1>
            <p className="text-sm text-text-secondary">No. {item.nomor_pengajuan}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${st.bg} ${st.color}`}>
            {st.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-text-secondary">Jenis Surat</span><p className="font-medium">{item.letter_type?.nama}</p></div>
          <div><span className="text-text-secondary">Nama Pemohon</span><p className="font-medium">{item.nama_pemohon}</p></div>
          <div><span className="text-text-secondary">NIK</span><p className="font-medium">{item.nik_pemohon}</p></div>
          <div><span className="text-text-secondary">Tanggal Pengajuan</span><p className="font-medium">{item.tanggal_pengajuan ? new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID') : '-'}</p></div>
          <div className="col-span-2"><span className="text-text-secondary">Keperluan</span><p className="font-medium">{item.keperluan}</p></div>
          {item.nomor_surat && (
            <div className="col-span-2"><span className="text-text-secondary">Nomor Surat</span><p className="font-medium font-mono">{item.nomor_surat}</p></div>
          )}
          {item.catatan_admin && (
            <div className="col-span-2"><span className="text-text-secondary">Catatan Admin</span><p className="text-text-primary">{item.catatan_admin}</p></div>
          )}
        </div>

        {/* Actions */}
        {['menunggu', 'diproses'].includes(item.status) && (
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {approveMutation.isPending ? 'Memproses...' : 'Setujui'}
            </button>
            {!rejectMode ? (
              <button onClick={() => setRejectMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                <XCircle className="w-4 h-4" /> Tolak
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <input type="text" placeholder="Alasan penolakan..." value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                <button onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending || !rejectNote}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {rejectMutation.isPending ? '...' : 'Konfirmasi'}
                </button>
                <button onClick={() => { setRejectMode(false); setRejectNote(''); }} className="px-3 py-2 text-text-secondary text-sm">Batal</button>
              </div>
            )}
          </div>
        )}

        {item.nomor_surat && (
          <DownloadPdfButton id={id!} />
        )}
      </div>
    </div>
  );
}
