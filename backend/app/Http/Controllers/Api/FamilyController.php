<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Family;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FamilyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Family::with('dusun', 'residents');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('no_kk', 'like', "%{$search}%")
                    ->orWhere('nama_kepala_keluarga', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        if ($dusunId = $request->get('dusun_id')) {
            $query->where('dusun_id', $dusunId);
        }

        $families = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($families);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:families,no_kk',
            'nama_kepala_keluarga' => 'required|string|max:255',
            'alamat' => 'required|string',
            'dusun_id' => 'nullable|exists:dusuns,id',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'kode_pos' => 'nullable|string|max:10',
        ]);

        $family = Family::create($validated);

        return response()->json(['data' => $family, 'message' => 'KK berhasil ditambahkan.'], 201);
    }

    public function show(Family $family): JsonResponse
    {
        return response()->json(['data' => $family->load('dusun', 'residents')]);
    }

    public function update(Request $request, Family $family): JsonResponse
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:families,no_kk,' . $family->id,
            'nama_kepala_keluarga' => 'required|string|max:255',
            'alamat' => 'required|string',
            'dusun_id' => 'nullable|exists:dusuns,id',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'kode_pos' => 'nullable|string|max:10',
        ]);

        $family->update($validated);

        return response()->json(['data' => $family, 'message' => 'KK berhasil diperbarui.']);
    }

    public function destroy(Family $family): JsonResponse
    {
        $family->delete();
        return response()->json(['message' => 'KK berhasil dihapus.']);
    }
}
