import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import api from '@/services/api';
import DataTable from '@/components/ui/DataTable';
import { exportToExcel, exportToPdf } from '@/utils/export';
import { Search, Eye, FileSpreadsheet, FileText } from 'lucide-react';

interface LetterRequest {
  id: number;
  nomor_pengajuan: string;
  nama_pemohon: string;
  status: string;
  tanggal_pengajuan: string;
  letter_type?: { nama: string };
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  menunggu: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Menunggu' },
  diproses: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Diproses' },
  disetujui: { color: 'text-green-700', bg: 'bg-green-50', label: 'Disetujui' },
  ditolak: { color: 'text-red-700', bg: 'bg-red-50', label: 'Ditolak' },
  selesai: { color: 'text-green-700', bg: 'bg-green-50', label: 'Selesai' },
};

const columnHelper = createColumnHelper<LetterRequest>();

export default function SuratList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isExporting, setIsExporting] = useState(false);

  const sortBy = sorting[0]?.id || '';
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc';

  const { data, isLoading } = useQuery({
    queryKey: ['letter-requests', search, status, page, sortBy, sortDir],
    queryFn: async () => {
      const params: any = { search, per_page: 15, page, sort_by: sortBy || undefined, sort_dir: sortBy ? sortDir : undefined };
      if (status) params.status = status;
      const { data } = await api.get('/letter-requests', { params });
      return data;
    },
  });

  const requests = data?.data || [];

  // Export columns
  const exportColumns = [
    { key: 'nomor_pengajuan', label: 'No. Pengajuan' },
    { key: 'nama_pemohon', label: 'Pemohon' },
    { key: 'nik_pemohon', label: 'NIK' },
    { key: 'letter_type.nama', label: 'Jenis Surat' },
    { key: 'keperluan', label: 'Keperluan' },
    { key: 'status', label: 'Status' },
    { key: 'nomor_surat', label: 'No. Surat' },
    { key: 'tanggal_pengajuan', label: 'Tanggal Pengajuan' },
    { key: 'tanggal_diproses', label: 'Tanggal Diproses' },
  ];

  const statusLabels: Record<string, string> = {
    menunggu: 'Menunggu', diproses: 'Diproses',
    disetujui: 'Disetujui', ditolak: 'Ditolak', selesai: 'Selesai',
  };

  const exportFormatters = {
    'status': (v: string) => statusLabels[v] || v,
    'tanggal_pengajuan': (v: string) => v ? new Date(v).toLocaleDateString('id-ID') : '',
    'tanggal_diproses': (v: string) => v ? new Date(v).toLocaleDateString('id-ID') : '',
    'letter_type.nama': (v: string) => v || '-',
    'nomor_surat': (v: string) => v || '-',
    'keperluan': (v: string) => v || '-',
  };

  async function fetchAllForExport() {
    const params: any = { search, per_page: 99999, sort_by: sortBy || undefined, sort_dir: sortBy ? sortDir : undefined };
    if (status) params.status = status;
    const { data } = await api.get('/letter-requests', { params });
    return data.data || [];
  }

  async function handleExportExcel() {
    setIsExporting(true);
    try {
      const allData = await fetchAllForExport();
      exportToExcel(allData, exportColumns, 'Permohonan_Surat', exportFormatters);
    } catch (err) {
      console.error('Export Excel gagal:', err);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPdf() {
    setIsExporting(true);
    try {
      const allData = await fetchAllForExport();
      exportToPdf(allData, exportColumns, 'Data Permohonan Surat', 'Permohonan_Surat', exportFormatters);
    } catch (err) {
      console.error('Export PDF gagal:', err);
    } finally {
      setIsExporting(false);
    }
  }

  const columns = useMemo(() => [
    columnHelper.accessor('nomor_pengajuan', {
      header: 'No. Pengajuan',
      enableSorting: true,
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('nama_pemohon', {
      header: 'Pemohon',
      enableSorting: true,
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('letter_type.nama', {
      id: 'jenis_surat',
      header: 'Jenis Surat',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('tanggal_pengajuan', {
      header: 'Tanggal',
      enableSorting: true,
      cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString('id-ID') : '-',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: true,
      cell: (info) => {
        const st = statusConfig[info.getValue()] || { color: 'text-fg', bg: 'bg-subtle', label: info.getValue() };
        return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${st.bg} ${st.color}`}>{st.label}</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="text-right">
          <Link to={`/admin/surat/permohonan/${row.original.id}`} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            <Eye className="w-4 h-4" /> Detail
          </Link>
        </div>
      ),
    }),
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Permohonan Surat</h1>
          <p className="text-fg-secondary text-sm mt-1">Total: {data?.total || 0} permohonan</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-fg text-sm font-medium rounded-lg hover:bg-subtle disabled:opacity-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Excel
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-fg text-sm font-medium rounded-lg hover:bg-subtle disabled:opacity-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nomor pengajuan, pemohon..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diproses">Diproses</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        pageCount={data?.last_page || 0}
        pageIndex={page - 1}
        onPageChange={(p) => setPage(p)}
        emptyMessage="Belum ada permohonan surat"
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </div>
  );
}
