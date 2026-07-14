<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DesaProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DesaProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = DesaProfile::firstOrCreate([]);
        return response()->json(['data' => $profile]);
    }

    public function update(Request $request): JsonResponse
    {
        $profile = DesaProfile::firstOrCreate([]);

        $validated = $request->validate([
            'nama_desa' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'nullable|string|max:10',
            'alamat_kantor' => 'nullable|string',
            'nama_kepala_desa' => 'nullable|string|max:255',
            'telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo_path' => 'nullable|string|max:500',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'sejarah' => 'nullable|string',
            'sambutan_kepala_desa' => 'nullable|string',
            'luas_wilayah' => 'nullable|numeric',
            'jumlah_dusun' => 'nullable|integer',
            'koordinat_lat' => 'nullable|string|max:20',
            'koordinat_lng' => 'nullable|string|max:20',
        ]);

        $profile->update($validated);

        return response()->json(['data' => $profile, 'message' => 'Profil desa berhasil diperbarui.']);
    }
}
