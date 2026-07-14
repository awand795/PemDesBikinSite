<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DesaProfileController;
use App\Http\Controllers\Api\DusunController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\LetterRequestController;
use App\Http\Controllers\Api\LetterTypeController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ========== PUBLIC ENDPOINTS (No Auth Required) ==========
Route::prefix('public')->group(function () {
    Route::get('profile', [PublicController::class, 'profile']);
    Route::get('letter-types', [PublicController::class, 'letterTypes']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('news/{slug}', [PublicController::class, 'newsDetail']);
    Route::get('announcements', [PublicController::class, 'announcements']);
    Route::get('gallery', [PublicController::class, 'gallery']);
    Route::post('letter-requests', [PublicController::class, 'submitLetterRequest']);
    Route::get('letter-requests/check', [PublicController::class, 'checkLetterRequest']);
    Route::post('complaints', [PublicController::class, 'submitComplaint']);
    Route::get('complaints/check', [PublicController::class, 'checkComplaint']);
});

// ========== AUTH ENDPOINTS ==========
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

// ========== PROTECTED ENDPOINTS (Sanctum Auth Required) ==========
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    // Master Data
    Route::apiResource('dusuns', DusunController::class);
    Route::apiResource('families', FamilyController::class);
    Route::apiResource('residents', ResidentController::class);
    Route::get('residents/statistics', [ResidentController::class, 'statistics']);

    // Surat Menyurat
    Route::apiResource('letter-types', LetterTypeController::class);
    Route::apiResource('letter-requests', LetterRequestController::class)->except(['update', 'destroy']);
    Route::patch('letter-requests/{letterRequest}/approve', [LetterRequestController::class, 'approve']);
    Route::patch('letter-requests/{letterRequest}/reject', [LetterRequestController::class, 'reject']);
    Route::get('letter-requests/{letterRequest}/print', [LetterRequestController::class, 'print']);

    // Berita & Pengumuman
    Route::apiResource('news', NewsController::class);
    Route::apiResource('announcements', AnnouncementController::class)->except(['edit', 'create']);

    // Pengaduan
    Route::get('complaints', [ComplaintController::class, 'index']);
    Route::get('complaints/{complaint}', [ComplaintController::class, 'show']);
    Route::patch('complaints/{complaint}/respond', [ComplaintController::class, 'respond']);

    // Galeri
    Route::apiResource('galleries', GalleryController::class)->except(['edit', 'create', 'update', 'show']);

    // Manajemen Pengguna
    Route::get('users/roles/list', [UserController::class, 'roles']);
    Route::apiResource('users', UserController::class);

    // Profil Desa & Pengaturan
    Route::get('desa-profile', [DesaProfileController::class, 'show']);
    Route::put('desa-profile', [DesaProfileController::class, 'update']);
    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);
});
