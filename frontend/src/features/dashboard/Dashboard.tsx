import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Users, UserCircle, FileText, MessageSquare,
  Newspaper, Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: color + '20' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const demografi = data?.demografi || {};
  const suratTrend = data?.surat_trend || {};
  const chartData = Object.entries(suratTrend).map(([name, value]) => ({ name, value }));
  const demografiDusun = Object.entries(demografi.per_dusun || {}).map(([name, value]) => ({ name, value }));
  const totalPenduduk = demografi.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan data desa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Penduduk" value={stats.total_penduduk || 0} color="#22c55e" />
        <StatCard icon={UserCircle} label="Total KK" value={stats.total_kk || 0} color="#3b82f6" />
        <StatCard icon={FileText} label="Surat Bulan Ini" value={stats.surat_bulan_ini || 0} color="#f59e0b" />
        <StatCard icon={Clock} label="Surat Menunggu" value={stats.surat_menunggu || 0} color="#ef4444" />
        <StatCard icon={MessageSquare} label="Pengaduan Baru" value={stats.pengaduan_baru || 0} color="#8b5cf6" />
        <StatCard icon={Newspaper} label="Berita Terbit" value={stats.berita_published || 0} color="#ec4899" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surat Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Tren Pengajuan Surat</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Demografi per Dusun */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Demografi per Dusun</h3>
          {demografiDusun.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={demografiDusun}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {demografiDusun.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              Belum ada data
            </div>
          )}
        </div>
      </div>

      {/* Demografi Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Komposisi Penduduk</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{totalPenduduk}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{demografi.laki_laki || 0}</p>
            <p className="text-sm text-blue-600">Laki-laki</p>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <p className="text-2xl font-bold text-pink-700">{demografi.perempuan || 0}</p>
            <p className="text-sm text-pink-600">Perempuan</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{stats.total_kk || 0}</p>
            <p className="text-sm text-green-600">Kartu Keluarga</p>
          </div>
        </div>
      </div>
    </div>
  );
}
