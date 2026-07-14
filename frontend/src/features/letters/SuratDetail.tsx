import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, CheckCircle, XCircle, Download } from 'lucide-react';

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

  if (!item) return <div className="text-center py-12 text-gray-500">Data tidak ditemukan</div>;

  const st = statusConfig[item.status] || { color: 'text-gray-700', bg: 'bg-gray-50', label: item.status };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/admin/surat/permohonan" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detail Permohonan Surat</h1>
            <p className="text-sm text-gray-500">No. {item.nomor_pengajuan}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${st.bg} ${st.color}`}>
            {st.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Jenis Surat</span><p className="font-medium">{item.letter_type?.nama}</p></div>
          <div><span className="text-gray-500">Nama Pemohon</span><p className="font-medium">{item.nama_pemohon}</p></div>
          <div><span className="text-gray-500">NIK</span><p className="font-medium">{item.nik_pemohon}</p></div>
          <div><span className="text-gray-500">Tanggal Pengajuan</span><p className="font-medium">{item.tanggal_pengajuan ? new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID') : '-'}</p></div>
          <div className="col-span-2"><span className="text-gray-500">Keperluan</span><p className="font-medium">{item.keperluan}</p></div>
          {item.nomor_surat && (
            <div className="col-span-2"><span className="text-gray-500">Nomor Surat</span><p className="font-medium font-mono">{item.nomor_surat}</p></div>
          )}
          {item.catatan_admin && (
            <div className="col-span-2"><span className="text-gray-500">Catatan Admin</span><p className="text-gray-700">{item.catatan_admin}</p></div>
          )}
        </div>

        {/* Actions */}
        {['menunggu', 'diproses'].includes(item.status) && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
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
                <button onClick={() => { setRejectMode(false); setRejectNote(''); }} className="px-3 py-2 text-gray-500 text-sm">Batal</button>
              </div>
            )}
          </div>
        )}

        {item.nomor_surat && (
          <div className="mt-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF Surat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
