import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Search, MessageSquare } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  baru: { color: 'text-red-700', bg: 'bg-red-50', label: 'Baru' },
  diproses: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Diproses' },
  selesai: { color: 'text-green-700', bg: 'bg-green-50', label: 'Selesai' },
  ditolak: { color: 'text-fg', bg: 'bg-subtle', label: 'Ditolak' },
};

export default function PengaduanList() {
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState('diproses');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', status],
    queryFn: async () => {
      const params: any = {};
      if (status) params.status = status;
      const { data } = await api.get('/complaints', { params });
      return data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: (payload: any) => api.patch(`/complaints/${selected.id}/respond`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setSelected(null);
      setResponse('');
    },
  });

  const items = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">Pengaduan Masyarakat</h1>
      </div>

      <div className="flex gap-2">
        {['', 'baru', 'diproses', 'selesai', 'ditolak'].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${status === s ? 'bg-primary-600 text-white border-primary-600' : 'border-border text-fg-secondary hover:bg-subtle'}`}>
            {s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Semua'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-fg-muted">Belum ada pengaduan</div>
        ) : (
          items.map((item: any) => {
            const st = statusConfig[item.status] || {};
            return (
              <div key={item.id} className="bg-surface rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-fg-muted" />
                      <span className="text-xs font-mono text-fg-muted">{item.kode_tiket}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-fg-secondary mt-1">{item.kategori} {item.nama_pelapor ? `- ${item.nama_pelapor}` : '(Anonim)'}</p>
                  </div>
                  {item.status === 'baru' && (
                    <button onClick={() => setSelected(item)}
                      className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Tanggapi
                    </button>
                  )}
                </div>
                <p className="text-sm text-fg">{item.isi_pengaduan}</p>
                {item.lokasi && <p className="text-xs text-fg-muted mt-2">Lokasi: {item.lokasi}</p>}
                {item.tanggapan && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-fg-secondary mb-1">Tanggapan:</p>
                    <p className="text-sm text-fg">{item.tanggapan}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Respond Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-lg w-full p-6">
            <h3 className="font-semibold text-fg mb-4">Tanggapi Pengaduan</h3>
            <p className="text-sm text-fg-secondary mb-4">
              <span className="font-mono">{selected.kode_tiket}</span> - {selected.kategori}
            </p>
            <p className="text-sm text-fg mb-4 p-3 bg-subtle rounded-lg">{selected.isi_pengaduan}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Ubah Status</label>
                <select value={responseStatus} onChange={(e) => setResponseStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Tanggapan</label>
                <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  placeholder="Tulis tanggapan..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => respondMutation.mutate({ tanggapan: response, status: responseStatus })}
                  disabled={!response || respondMutation.isPending}
                  className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  Kirim Tanggapan
                </button>
                <button onClick={() => { setSelected(null); setResponse(''); }}
                  className="px-4 py-2.5 border border-border text-fg text-sm rounded-lg hover:bg-subtle transition-colors">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
