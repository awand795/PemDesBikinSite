<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Complaint;
use App\Models\DesaProfile;
use App\Models\Gallery;
use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\News;
use App\Models\Resident;
use App\Services\LetterNumberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicController extends Controller
{
    public function __construct(
        private readonly LetterNumberService $letterNumberService,
    ) {}

    public function profile(): JsonResponse
    {
        $profile = DesaProfile::firstOrCreate([]);
        return response()->json(['data' => $profile]);
    }

    public function news(): JsonResponse
    {
        $news = News::where('status', 'published')
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->paginate(10);
        return response()->json($news);
    }

    public function newsDetail(string $slug): JsonResponse
    {
        $news = News::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $news->increment('views_count');

        return response()->json(['data' => $news->load('author')]);
    }

    public function announcements(): JsonResponse
    {
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('tanggal_selesai')
                    ->orWhere('tanggal_selesai', '>=', now());
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $announcements]);
    }

    public function gallery(): JsonResponse
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $galleries]);
    }

    public function letterTypes(): JsonResponse
    {
        $types = LetterType::where('is_active', true)->get();
        return response()->json(['data' => $types]);
    }

    public function submitLetterRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'letter_type_id' => 'required|exists:letter_types,id',
            'nik' => 'required|string|size:16',
            'nama_pemohon' => 'required|string|max:255',
            'keperluan' => 'required|string',
            'data_tambahan' => 'nullable|array',
        ]);

        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => $this->letterNumberService->generatePengajuanNumber(),
            'letter_type_id' => $validated['letter_type_id'],
            'nama_pemohon' => $validated['nama_pemohon'],
            'nik_pemohon' => $validated['nik'],
            'keperluan' => $validated['keperluan'],
            'data_tambahan' => $validated['data_tambahan'] ?? [],
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        return response()->json([
            'data' => [
                'nomor_pengajuan' => $letterRequest->nomor_pengajuan,
                'message' => 'Permohonan surat berhasil diajukan. Simpan nomor pengajuan untuk cek status.',
            ]
        ], 201);
    }

    public function checkLetterRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nomor_pengajuan' => 'required|string',
            'nik' => 'required|string|size:16',
        ]);

        $letterRequest = LetterRequest::where('nomor_pengajuan', $validated['nomor_pengajuan'])
            ->where('nik_pemohon', $validated['nik'])
            ->with('letterType')
            ->first();

        if (!$letterRequest) {
            return response()->json([
                'message' => 'Data tidak ditemukan. Periksa kembali nomor pengajuan dan NIK Anda.',
            ], 404);
        }

        return response()->json(['data' => $letterRequest]);
    }

    public function stats(): JsonResponse
    {
        return response()->json(['data' => [
            'total_penduduk' => Resident::where('is_active', true)->count(),
            'total_kk' => \App\Models\Family::count(),
            'surat_selesai_bulan_ini' => LetterRequest::whereIn('status', ['disetujui', 'selesai'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'total_berita' => News::where('status', 'published')->count(),
            'total_pengaduan_selesai' => Complaint::where('status', 'selesai')->count(),
        ]]);
    }

    public function submitComplaint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_pelapor' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'kategori' => 'required|string|max:100',
            'isi_pengaduan' => 'required|string',
            'lokasi' => 'nullable|string|max:255',
            'foto' => 'nullable|array|max:3',
            'foto.*' => 'file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Handle photo uploads
        $fotoPaths = [];
        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = Storage::disk('public')->putFileAs('complaints', $file, $filename);
                $fotoPaths[] = Storage::disk('public')->url($path);
            }
        }

        $complaint = Complaint::create([
            'kode_tiket' => $this->letterNumberService->generateTicketCode(),
            'nama_pelapor' => $validated['nama_pelapor'] ?? 'Anonim',
            'no_hp' => $validated['no_hp'] ?? null,
            'kategori' => $validated['kategori'],
            'isi_pengaduan' => $validated['isi_pengaduan'],
            'lokasi' => $validated['lokasi'] ?? null,
            'foto' => !empty($fotoPaths) ? $fotoPaths : null,
            'status' => 'baru',
        ]);

        return response()->json([
            'data' => [
                'kode_tiket' => $complaint->kode_tiket,
                'message' => 'Pengaduan berhasil dikirim. Simpan kode tiket untuk cek status.',
            ]
        ], 201);
    }

    public function checkComplaint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode_tiket' => 'required|string',
        ]);

        $complaint = Complaint::where('kode_tiket', $validated['kode_tiket'])->first();

        if (!$complaint) {
            return response()->json([
                'message' => 'Kode tiket tidak ditemukan.',
            ], 404);
        }

        return response()->json(['data' => $complaint]);
    }
}
