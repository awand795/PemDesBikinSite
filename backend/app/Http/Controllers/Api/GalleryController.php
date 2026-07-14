<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query();

        if ($kategori = $request->get('kategori')) {
            $query->where('kategori', $kategori);
        }

        $galleries = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($galleries);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'foto_path' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'tanggal' => 'nullable|date',
        ]);

        $gallery = Gallery::create($validated);

        return response()->json(['data' => $gallery, 'message' => 'Galeri berhasil ditambahkan.'], 201);
    }

    public function destroy(Gallery $gallery): JsonResponse
    {
        $gallery->delete();
        return response()->json(['message' => 'Galeri berhasil dihapus.']);
    }
}
