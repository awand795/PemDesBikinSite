<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Complaint::with('ditanganiOleh');

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($kategori = $request->get('kategori')) {
            $query->where('kategori', $kategori);
        }

        $complaints = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($complaints);
    }

    public function show(Complaint $complaint): JsonResponse
    {
        return response()->json(['data' => $complaint->load('ditanganiOleh')]);
    }

    public function respond(Request $request, Complaint $complaint): JsonResponse
    {
        $validated = $request->validate([
            'tanggapan' => 'required|string',
            'status' => 'required|in:diproses,selesai,ditolak',
        ]);

        $complaint->update([
            'tanggapan' => $validated['tanggapan'],
            'status' => $validated['status'],
            'ditangani_oleh' => auth()->id(),
        ]);

        return response()->json([
            'data' => $complaint->fresh()->load('ditanganiOleh'),
            'message' => 'Tanggapan berhasil dikirim.',
        ]);
    }
}
