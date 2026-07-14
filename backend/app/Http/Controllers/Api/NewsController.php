<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = News::with('author');

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($kategori = $request->get('kategori')) {
            $query->where('kategori', $kategori);
        }

        if ($search = $request->get('search')) {
            $query->where('judul', 'like', "%{$search}%");
        }

        $news = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($news);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'nullable|string|max:100',
            'thumbnail_path' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,published',
        ]);

        $news = News::create([
            'judul' => $validated['judul'],
            'slug' => Str::slug($validated['judul']) . '-' . Str::random(5),
            'konten' => $validated['konten'],
            'kategori' => $validated['kategori'] ?? null,
            'thumbnail_path' => $validated['thumbnail_path'] ?? null,
            'status' => $validated['status'] ?? 'draft',
            'author_id' => auth()->id(),
            'published_at' => ($validated['status'] ?? 'draft') === 'published' ? now() : null,
        ]);

        return response()->json(['data' => $news, 'message' => 'Berita berhasil ditambahkan.'], 201);
    }

    public function show(News $news): JsonResponse
    {
        return response()->json(['data' => $news->load('author')]);
    }

    public function update(Request $request, News $news): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'nullable|string|max:100',
            'thumbnail_path' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,published',
        ]);

        $data = [
            'judul' => $validated['judul'],
            'slug' => Str::slug($validated['judul']) . '-' . Str::random(5),
            'konten' => $validated['konten'],
            'kategori' => $validated['kategori'] ?? $news->kategori,
            'thumbnail_path' => $validated['thumbnail_path'] ?? $news->thumbnail_path,
            'status' => $validated['status'] ?? $news->status,
        ];

        if (($validated['status'] ?? $news->status) === 'published' && !$news->published_at) {
            $data['published_at'] = now();
        }

        $news->update($data);

        return response()->json(['data' => $news, 'message' => 'Berita berhasil diperbarui.']);
    }

    public function destroy(News $news): JsonResponse
    {
        $news->delete();
        return response()->json(['message' => 'Berita berhasil dihapus.']);
    }
}
