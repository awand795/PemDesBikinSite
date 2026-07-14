<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\LetterRequest;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function pending(): JsonResponse
    {
        $pendingLetters = LetterRequest::where('status', 'menunggu')->count();
        $pendingComplaints = Complaint::where('status', 'baru')->count();
        $total = $pendingLetters + $pendingComplaints;

        // Get the latest pending items for notification preview (limit 5)
        $latestLetters = LetterRequest::where('status', 'menunggu')
            ->with('letterType')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'type' => 'surat',
                'title' => 'Pengajuan Surat Baru',
                'description' => $item->nama_pemohon . ' - ' . ($item->letterType?->nama ?? 'Surat'),
                'url' => '/admin/surat/permohonan/' . $item->id,
                'created_at' => $item->created_at->diffForHumans(),
            ]);

        $latestComplaints = Complaint::where('status', 'baru')
            ->orderBy('created_at', 'desc')
            ->take(2)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'type' => 'pengaduan',
                'title' => 'Pengaduan Baru',
                'description' => $item->kategori . ' - ' . ($item->nama_pelapor ?? 'Anonim'),
                'url' => '/admin/pengaduan',
                'created_at' => $item->created_at->diffForHumans(),
            ]);

        return response()->json([
            'data' => [
                'total' => $total,
                'pending_letters' => $pendingLetters,
                'pending_complaints' => $pendingComplaints,
                'items' => $latestLetters->concat($latestComplaints)->sortByDesc('created_at')->take(5)->values(),
            ]
        ]);
    }
}
