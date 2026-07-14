import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Users, UserCircle, FileText, MessageSquare,
  Newspaper, Clock, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import clsx from 'clsx';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: any; label: string; value: string | number; change?: string; color: string
}) {
  const isPositive = change && parseFloat(change) > 0;
  const isNegative = change && parseFloat(change) < 0;

  return (
    <div className="card p-5  group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <div className={clsx(
              'inline-flex items-center gap-1 mt-2 text-xs font-medium',
              isPositive ? 'text-success-500' : isNegative ? 'text-danger-500' : 'text-slate-400'
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
              {change}
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: color + '15' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      {/* Subtle gradient bar at bottom */}
      <div className="mt-4 h-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: '60%', backgroundColor: color }} />
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
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const demografi = data?.demografi || {};
  const suratTrend = data?.surat_trend || {};
  const chartData = Object.entries(suratTrend).map(([name, value]) => ({ name, value }));
  const demografiDusun = Object.entries(demografi.per_dusun || {}).map(([name, value]) => ({ name, value }));
  const totalPenduduk = demografi.total || 0;

  // Generate area chart data from surat trend
  const areaData = chartData.length > 0 ? chartData : [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Ringkasan data dan statistik desa
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface px-3 py-2 rounded-lg card">
          <Clock className="w-3.5 h-3.5" />
          Update terakhir: {new Date().toLocaleTimeString('id-ID')}
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
        <StatCard icon={Users} label="Total Penduduk" value={stats.total_penduduk || 0} color="#6366f1" />
        <StatCard icon={UserCircle} label="Total KK" value={stats.total_kk || 0} color="#14b8a6" />
        <StatCard icon={FileText} label="Surat Bulan Ini" value={stats.surat_bulan_ini || 0} color="#f59e0b" />
        <StatCard icon={Clock} label="Surat Menunggu" value={stats.surat_menunggu || 0} color="#ef4444" />
        <StatCard icon={MessageSquare} label="Pengaduan Baru" value={stats.pengaduan_baru || 0} color="#8b5cf6" />
        <StatCard icon={Newspaper} label="Berita Terbit" value={stats.berita_published || 0} color="#ec4899" />
      </div>

      {/* ===== Charts Row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surat Trend - Area Chart */}
        <div className="card p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-text-primary">Tren Pengajuan Surat</h3>
              <p className="text-xs text-text-secondary mt-0.5">Per bulan tahun ini</p>
            </div>
            <span className="badge-neutral">Tahunan</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Demografi per Dusun - Pie Chart */}
        <div className="card p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-text-primary">Demografi per Dusun</h3>
              <p className="text-xs text-text-secondary mt-0.5">Distribusi penduduk</p>
            </div>
          </div>
          {demografiDusun.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={demografiDusun}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {demografiDusun.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-text-muted">
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-text-muted" />
                <p className="text-sm">Belum ada data dusun</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Demografi Summary ===== */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-text-primary">Komposisi Penduduk</h3>
            <p className="text-xs text-text-secondary mt-0.5">Berdasarkan jenis kelamin</p>
          </div>
          <span className="badge-neutral">Total: {totalPenduduk} Jiwa</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-5 bg-gradient-to-b from-primary-50 to-primary-50/50 rounded-xl border border-primary-100">
            <p className="text-3xl font-bold text-primary-700">{totalPenduduk}</p>
            <p className="text-xs font-medium text-primary-600 mt-1">Total Penduduk</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-b from-blue-50 to-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-3xl font-bold text-blue-700">{demografi.laki_laki || 0}</p>
            <p className="text-xs font-medium text-blue-600 mt-1">Laki-laki</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-b from-rose-50 to-rose-50/50 rounded-xl border border-rose-100">
            <p className="text-3xl font-bold text-rose-700">{demografi.perempuan || 0}</p>
            <p className="text-xs font-medium text-rose-600 mt-1">Perempuan</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-b from-secondary-50 to-secondary-50/50 rounded-xl border border-secondary-100">
            <p className="text-3xl font-bold text-secondary-700">{stats.total_kk || 0}</p>
            <p className="text-xs font-medium text-secondary-600 mt-1">Kartu Keluarga</p>
          </div>
        </div>
        {/* Detail bar */}
        <div className="mt-5 p-4 bg-bg-subtle rounded-xl">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-text-secondary">Laki-laki: <strong className="text-text-primary">{demografi.laki_laki || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-text-secondary">Perempuan: <strong className="text-text-primary">{demografi.perempuan || 0}</strong></span>
            </div>
          </div>
          {totalPenduduk > 0 && (
            <div className="mt-3 h-2 rounded-full bg-bg-subtle overflow-hidden flex">
              <div
                className="bg-blue-500 transition-all duration-500"
                style={{ width: `${((demografi.laki_laki || 0) / totalPenduduk) * 100}%` }}
              />
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${((demografi.perempuan || 0) / totalPenduduk) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
