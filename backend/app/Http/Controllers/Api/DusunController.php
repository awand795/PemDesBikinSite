<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dusun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DusunController extends Controller
{
    public function index(): JsonResponse
    {
        $dusuns = Dusun::orderBy('nama_dusun')->get();
        return response()->json(['data' => $dusuns]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_dusun' => 'required|string|max:255',
            'nama_kepala_dusun' => 'nullable|string|max:255',
        ]);

        $dusun = Dusun::create($validated);

        return response()->json(['data' => $dusun, 'message' => 'Dusun berhasil ditambahkan.'], 201);
    }

    public function show(Dusun $dusun): JsonResponse
    {
        return response()->json(['data' => $dusun->load('families')]);
    }

    public function update(Request $request, Dusun $dusun): JsonResponse
    {
        $validated = $request->validate([
            'nama_dusun' => 'required|string|max:255',
            'nama_kepala_dusun' => 'nullable|string|max:255',
        ]);

        $dusun->update($validated);

        return response()->json(['data' => $dusun, 'message' => 'Dusun berhasil diperbarui.']);
    }

    public function destroy(Dusun $dusun): JsonResponse
    {
        if ($dusun->families()->exists()) {
            return response()->json(['message' => 'Dusun tidak bisa dihapus karena masih memiliki KK terkait.'], 422);
        }
        $dusun->delete();
        return response()->json(['message' => 'Dusun berhasil dihapus.']);
    }
}
