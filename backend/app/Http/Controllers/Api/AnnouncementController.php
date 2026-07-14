<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::query();

        if ($isActive = $request->get('is_active')) {
            $query->where('is_active', true);
        }

        $announcements = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($announcements);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'nullable|boolean',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json(['data' => $announcement, 'message' => 'Pengumuman berhasil ditambahkan.'], 201);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json(['data' => $announcement]);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'nullable|boolean',
        ]);

        $announcement->update($validated);

        return response()->json(['data' => $announcement, 'message' => 'Pengumuman berhasil diperbarui.']);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();
        return response()->json(['message' => 'Pengumuman berhasil dihapus.']);
    }
}
