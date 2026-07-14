import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import api from '@/services/api';
import DataTable from '@/components/ui/DataTable';
import { exportToExcel, exportToPdf } from '@/utils/export';
import { Plus, Search, Edit, FileSpreadsheet, FileText } from 'lucide-react';

interface Resident {
  id: number;
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  is_active: boolean;
  family?: { dusun?: { nama_dusun: string } };
}

const columnHelper = createColumnHelper<Resident>();

export default function ResidentsList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isExporting, setIsExporting] = useState(false);

  const sortBy = sorting[0]?.id || '';
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc';

  const { data, isLoading } = useQuery({
    queryKey: ['residents', search, page, sortBy, sortDir],
    queryFn: async () => {
      const { data } = await api.get('/residents', {
        params: { search, per_page: 15, page, sort_by: sortBy || undefined, sort_dir: sortBy ? sortDir : undefined },
      });
      return data;
    },
  });

  const residents = data?.data || [];
  const total = data?.total || 0;

  // Export columns definition
  const exportColumns = [
    { key: 'nik', label: 'NIK' },
    { key: 'nama_lengkap', label: 'Nama Lengkap' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
    { key: 'tempat_lahir', label: 'Tempat Lahir' },
    { key: 'tanggal_lahir', label: 'Tanggal Lahir' },
    { key: 'agama', label: 'Agama' },
    { key: 'pendidikan_terakhir', label: 'Pendidikan' },
    { key: 'pekerjaan', label: 'Pekerjaan' },
    { key: 'status_perkawinan', label: 'Status Perkawinan' },
    { key: 'family.dusun.nama_dusun', label: 'Dusun' },
    { key: 'no_hp', label: 'No. HP' },
    { key: 'is_active', label: 'Status' },
  ];

  const exportFormatters = {
    'jenis_kelamin': (v: string) => v === 'L' ? 'Laki-laki' : 'Perempuan',
    'is_active': (v: boolean) => v ? 'Aktif' : 'Nonaktif',
    'tanggal_lahir': (v: string) => v ? new Date(v).toLocaleDateString('id-ID') : '',
    'family.dusun.nama_dusun': (v: string) => v || '-',
  };

  async function fetchAllForExport() {
    const { data } = await api.get('/residents', {
      params: { search, per_page: 99999, sort_by: sortBy || undefined, sort_dir: sortBy ? sortDir : undefined },
    });
    return data.data || [];
  }

  async function handleExportExcel() {
    setIsExporting(true);
    try {
      const allData = await fetchAllForExport();
      exportToExcel(allData, exportColumns, 'Data_Penduduk', exportFormatters);
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
      exportToPdf(allData, exportColumns, 'Data Penduduk Desa', 'Data_Penduduk', exportFormatters);
    } catch (err) {
      console.error('Export PDF gagal:', err);
    } finally {
      setIsExporting(false);
    }
  }

  const columns = useMemo(() => [
    columnHelper.accessor('nik', {
      header: 'NIK',
      enableSorting: true,
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('nama_lengkap', {
      header: 'Nama',
      enableSorting: true,
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('jenis_kelamin', {
      header: 'Jenis Kelamin',
      cell: (info) => info.getValue() === 'L' ? 'Laki-laki' : 'Perempuan',
    }),
    columnHelper.accessor('family.dusun.nama_dusun', {
      id: 'dusun',
      header: 'Dusun',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      enableSorting: true,
      cell: (info) => (
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${info.getValue() ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {info.getValue() ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="text-right">
          <Link to={`/admin/penduduk/${row.original.id}`} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            <Edit className="w-4 h-4" /> Edit
          </Link>
        </div>
      ),
    }),
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Data Penduduk</h1>
          <p className="text-fg-secondary text-sm mt-1">Total: {total} jiwa</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-fg text-sm font-medium rounded-lg hover:bg-subtle disabled:opacity-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Excel
          </button>
          {/* Export PDF */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-fg text-sm font-medium rounded-lg hover:bg-subtle disabled:opacity-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600" />
            PDF
          </button>
          <Link
            to="/admin/penduduk/tambah"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Penduduk
          </Link>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari NIK, nama, atau no. HP..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={residents}
        isLoading={isLoading}
        pageCount={data?.last_page || 0}
        pageIndex={page - 1}
        onPageChange={(p) => setPage(p)}
        emptyMessage="Belum ada data penduduk"
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </div>
  );
}
