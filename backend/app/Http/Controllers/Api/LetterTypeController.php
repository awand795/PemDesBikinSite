<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LetterType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LetterTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $types = LetterType::orderBy('nama')->get();
        return response()->json(['data' => $types]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:20|unique:letter_types,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'template_konten' => 'nullable|string',
            'persyaratan' => 'nullable|array',
            'estimasi_hari' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        $letterType = LetterType::create($validated);

        return response()->json(['data' => $letterType, 'message' => 'Jenis surat berhasil ditambahkan.'], 201);
    }

    public function show(LetterType $letterType): JsonResponse
    {
        return response()->json(['data' => $letterType]);
    }

    public function update(Request $request, LetterType $letterType): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:20|unique:letter_types,kode,' . $letterType->id,
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'template_konten' => 'nullable|string',
            'persyaratan' => 'nullable|array',
            'estimasi_hari' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        $letterType->update($validated);

        return response()->json(['data' => $letterType, 'message' => 'Jenis surat berhasil diperbarui.']);
    }

    public function destroy(LetterType $letterType): JsonResponse
    {
        if ($letterType->letterRequests()->exists()) {
            return response()->json(['message' => 'Jenis surat tidak bisa dihapus karena masih ada permohonan terkait.'], 422);
        }
        $letterType->delete();
        return response()->json(['message' => 'Jenis surat berhasil dihapus.']);
    }
}
