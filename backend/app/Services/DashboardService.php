<?php

namespace App\Services;

use App\Models\Complaint;
use App\Models\Family;
use App\Models\LetterRequest;
use App\Models\News;
use App\Models\Resident;

class DashboardService
{
    public function getStats(): array
    {
        $totalPenduduk = Resident::where('is_active', true)->count();
        $totalKK = Family::count();
        $suratBulanIni = LetterRequest::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $suratMenunggu = LetterRequest::where('status', 'menunggu')->count();
        $pengaduanBaru = Complaint::where('status', 'baru')->count();
        $beritaPublished = News::where('status', 'published')->count();

        return [
            'total_penduduk' => $totalPenduduk,
            'total_kk' => $totalKK,
            'surat_bulan_ini' => $suratBulanIni,
            'surat_menunggu' => $suratMenunggu,
            'pengaduan_baru' => $pengaduanBaru,
            'berita_published' => $beritaPublished,
        ];
    }

    public function getDemografi(): array
    {
        $total = Resident::where('is_active', true)->count();
        $lakiLaki = Resident::where('is_active', true)->where('jenis_kelamin', 'L')->count();
        $perempuan = Resident::where('is_active', true)->where('jenis_kelamin', 'P')->count();

        $perDusun = Resident::where('is_active', true)
            ->selectRaw('dusuns.nama_dusun, count(*) as total')
            ->join('families', 'residents.family_id', '=', 'families.id')
            ->join('dusuns', 'families.dusun_id', '=', 'dusuns.id')
            ->groupBy('dusuns.nama_dusun')
            ->get()
            ->pluck('total', 'nama_dusun')
            ->toArray();

        $pekerjaan = Resident::where('is_active', true)
            ->selectRaw('pekerjaan, count(*) as total')
            ->whereNotNull('pekerjaan')
            ->groupBy('pekerjaan')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->pluck('total', 'pekerjaan')
            ->toArray();

        return [
            'total' => $total,
            'laki_laki' => $lakiLaki,
            'perempuan' => $perempuan,
            'per_dusun' => $perDusun,
            'pekerjaan' => $pekerjaan,
        ];
    }

    public function getSuratTrend(): array
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = LetterRequest::whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->count();
            $data[$month->format('M Y')] = $count;
        }
        return $data;
    }
}
