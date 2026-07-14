<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const ALLOWED_FOLDERS = [
        'residents', 'gallery', 'desa-profile', 'complaints', 'users', 'letters',
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'folder' => 'required|string|in:' . implode(',', self::ALLOWED_FOLDERS),
        ]);

        $file = $request->file('file');
        $folder = $validated['folder'];
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;

        $path = Storage::disk('public')->putFileAs($folder, $file, $filename);

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
