<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Resident::with('family.dusun');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                    ->orWhere('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if ($jenisKelamin = $request->get('jenis_kelamin')) {
            $query->where('jenis_kelamin', $jenisKelamin);
        }

        if ($dusunId = $request->get('dusun_id')) {
            $query->whereHas('family', fn($q) => $q->where('dusun_id', $dusunId));
        }

        if ($status = $request->get('status')) {
            $query->where('is_active', $status === 'aktif');
        }

        $residents = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($residents);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'family_id' => 'nullable|exists:families,id',
            'nik' => 'required|string|size:16|unique:residents,nik',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'pendidikan_terakhir' => 'nullable|string|max:100',
            'pekerjaan' => 'nullable|string|max:100',
            'status_perkawinan' => 'nullable|string|max:50',
            'status_dalam_keluarga' => 'nullable|string|max:50',
            'golongan_darah' => 'nullable|string|max:5',
            'kewarganegaraan' => 'nullable|string|max:10',
            'no_hp' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        $resident = Resident::create($validated);

        return response()->json(['data' => $resident, 'message' => 'Penduduk berhasil ditambahkan.'], 201);
    }

    public function show(Resident $resident): JsonResponse
    {
        return response()->json(['data' => $resident->load('family.dusun')]);
    }

    public function update(Request $request, Resident $resident): JsonResponse
    {
        $validated = $request->validate([
            'family_id' => 'nullable|exists:families,id',
            'nik' => 'required|string|size:16|unique:residents,nik,' . $resident->id,
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'pendidikan_terakhir' => 'nullable|string|max:100',
            'pekerjaan' => 'nullable|string|max:100',
            'status_perkawinan' => 'nullable|string|max:50',
            'status_dalam_keluarga' => 'nullable|string|max:50',
            'golongan_darah' => 'nullable|string|max:5',
            'kewarganegaraan' => 'nullable|string|max:10',
            'no_hp' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        $resident->update($validated);

        return response()->json(['data' => $resident, 'message' => 'Data penduduk berhasil diperbarui.']);
    }

    public function destroy(Resident $resident): JsonResponse
    {
        $resident->update(['is_active' => false]);
        return response()->json(['message' => 'Penduduk dinonaktifkan.']);
    }

    public function statistics(): JsonResponse
    {
        $total = Resident::where('is_active', true)->count();
        $lakiLaki = Resident::where('is_active', true)->where('jenis_kelamin', 'L')->count();
        $perempuan = Resident::where('is_active', true)->where('jenis_kelamin', 'P')->count();

        $perDusun = Resident::where('residents.is_active', true)
            ->selectRaw('dusuns.nama_dusun, count(*) as total')
            ->join('families', 'residents.family_id', '=', 'families.id')
            ->join('dusuns', 'families.dusun_id', '=', 'dusuns.id')
            ->groupBy('dusuns.nama_dusun')
            ->get();

        $agama = Resident::where('is_active', true)
            ->selectRaw('agama, count(*) as total')
            ->whereNotNull('agama')
            ->groupBy('agama')
            ->get();

        return response()->json([
            'data' => [
                'total' => $total,
                'laki_laki' => $lakiLaki,
                'perempuan' => $perempuan,
                'per_dusun' => $perDusun,
                'agama' => $agama,
            ]
        ]);
    }
}
