<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DesaProfile;
use App\Models\LetterRequest;
use App\Models\Resident;
use App\Services\LetterNumberService;
use App\Services\LetterTemplateRenderer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LetterRequestController extends Controller
{
    public function __construct(
        private readonly LetterNumberService $letterNumberService,
        private readonly LetterTemplateRenderer $templateRenderer,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = LetterRequest::with(['letterType', 'resident', 'diprosesOleh']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($letterTypeId = $request->get('letter_type_id')) {
            $query->where('letter_type_id', $letterTypeId);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pengajuan', 'like', "%{$search}%")
                    ->orWhere('nama_pemohon', 'like', "%{$search}%")
                    ->orWhere('nik_pemohon', 'like', "%{$search}%")
                    ->orWhere('nomor_surat', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSort = ['nomor_pengajuan', 'nama_pemohon', 'tanggal_pengajuan', 'status', 'created_at'];
        if (in_array($sortBy, $allowedSort)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $requests = $query->paginate($request->get('per_page', 15));

        return response()->json($requests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'letter_type_id' => 'required|exists:letter_types,id',
            'nik' => 'required|string|size:16',
            'nama_pemohon' => 'required|string|max:255',
            'keperluan' => 'required|string',
            'data_tambahan' => 'nullable|array',
            'lampiran' => 'nullable|array',
        ]);

        // Find or use resident data
        $resident = Resident::where('nik', $validated['nik'])->first();

        $letterRequest = LetterRequest::create([
            'nomor_pengajuan' => $this->letterNumberService->generatePengajuanNumber(),
            'letter_type_id' => $validated['letter_type_id'],
            'resident_id' => $resident?->id,
            'nama_pemohon' => $validated['nama_pemohon'],
            'nik_pemohon' => $validated['nik'],
            'keperluan' => $validated['keperluan'],
            'data_tambahan' => $validated['data_tambahan'] ?? [],
            'lampiran' => $validated['lampiran'] ?? [],
            'status' => 'menunggu',
            'tanggal_pengajuan' => now(),
        ]);

        return response()->json([
            'data' => $letterRequest->load('letterType'),
            'message' => 'Permohonan surat berhasil diajukan. Nomor pengajuan: ' . $letterRequest->nomor_pengajuan,
        ], 201);
    }

    public function show(LetterRequest $letterRequest): JsonResponse
    {
        return response()->json([
            'data' => $letterRequest->load(['letterType', 'resident', 'diprosesOleh']),
        ]);
    }

    public function approve(LetterRequest $letterRequest): JsonResponse
    {
        if (!in_array($letterRequest->status, ['menunggu', 'diproses'])) {
            return response()->json(['message' => 'Permohonan sudah diproses.'], 422);
        }

        $letterRequest->update([
            'status' => 'disetujui',
            'nomor_surat' => $this->letterNumberService->generate($letterRequest->letterType),
            'tanggal_diproses' => now(),
            'diproses_oleh' => auth()->id(),
        ]);

        return response()->json([
            'data' => $letterRequest->fresh()->load('letterType'),
            'message' => 'Permohonan surat disetujui. Nomor surat: ' . $letterRequest->nomor_surat,
        ]);
    }

    public function reject(Request $request, LetterRequest $letterRequest): JsonResponse
    {
        $validated = $request->validate([
            'catatan_admin' => 'required|string',
        ]);

        $letterRequest->update([
            'status' => 'ditolak',
            'catatan_admin' => $validated['catatan_admin'],
            'tanggal_diproses' => now(),
            'diproses_oleh' => auth()->id(),
        ]);

        return response()->json([
            'data' => $letterRequest->fresh(),
            'message' => 'Permohonan surat ditolak.',
        ]);
    }

    public function print(LetterRequest $letterRequest): JsonResponse
    {
        $letterRequest->load(['letterType', 'resident']);
        $desa = DesaProfile::firstOrCreate([]);

        $renderedContent = $this->templateRenderer->render($letterRequest, $desa);

        if (!empty($renderedContent)) {
            // Use dynamic template content
            $html = view('pdf.surat_dinamis', [
                'letter' => $letterRequest,
                'desa' => $desa,
                'dynamicContent' => $renderedContent,
            ])->render();
        } else {
            // Fallback to static blade template
            $html = view('pdf.surat', [
                'letter' => $letterRequest,
                'desa' => $desa,
            ])->render();
        }

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return response()->json([
            'pdf' => base64_encode($pdf->output()),
            'filename' => 'Surat_' . ($letterRequest->nomor_surat ?? $letterRequest->nomor_pengajuan) . '.pdf',
        ]);
    }
}
