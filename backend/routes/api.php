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
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ========== PUBLIC ENDPOINTS (No Auth Required) ==========
Route::prefix('public')->middleware('throttle:60,1')->group(function () {
    Route::get('profile', [PublicController::class, 'profile']);
    Route::get('stats', [PublicController::class, 'stats']);
    Route::get('letter-types', [PublicController::class, 'letterTypes']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('news/{slug}', [PublicController::class, 'newsDetail']);
    Route::get('announcements', [PublicController::class, 'announcements']);
    Route::get('gallery', [PublicController::class, 'gallery']);

    // Rate limited submission endpoints (10 req/min per IP)
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('letter-requests', [PublicController::class, 'submitLetterRequest']);
        Route::post('complaints', [PublicController::class, 'submitComplaint']);
    });

    Route::get('letter-requests/check', [PublicController::class, 'checkLetterRequest']);
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

    // Upload (permission check is done in controller for granularity)
    Route::post('uploads', [UploadController::class, 'store']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('permission:dashboard.view');

    // Master Data
    Route::middleware('permission:residents.view')->group(function () {
        Route::get('residents', [ResidentController::class, 'index']);
        Route::get('residents/{resident}', [ResidentController::class, 'show']);
        Route::get('residents/statistics', [ResidentController::class, 'statistics']);
    });
    Route::post('residents', [ResidentController::class, 'store'])
        ->middleware('permission:residents.create');
    Route::put('residents/{resident}', [ResidentController::class, 'update'])
        ->middleware('permission:residents.edit');
    Route::delete('residents/{resident}', [ResidentController::class, 'destroy'])
        ->middleware('permission:residents.delete');

    Route::get('families', [FamilyController::class, 'index'])
        ->middleware('permission:families.view');
    Route::get('families/{family}', [FamilyController::class, 'show'])
        ->middleware('permission:families.view');
    Route::post('families', [FamilyController::class, 'store'])
        ->middleware('permission:families.create');
    Route::put('families/{family}', [FamilyController::class, 'update'])
        ->middleware('permission:families.edit');
    Route::delete('families/{family}', [FamilyController::class, 'destroy'])
        ->middleware('permission:families.delete');

    Route::get('dusuns', [DusunController::class, 'index']);
    Route::apiResource('dusuns', DusunController::class)->except(['index']);

    // Surat Menyurat
    Route::middleware('permission:letters.view')->group(function () {
        Route::get('letter-requests', [LetterRequestController::class, 'index']);
        Route::get('letter-requests/{letterRequest}', [LetterRequestController::class, 'show']);
        Route::get('letter-requests/{letterRequest}/print', [LetterRequestController::class, 'print']);
    });
    Route::post('letter-requests', [LetterRequestController::class, 'store'])
        ->middleware('permission:letters.create');
    Route::patch('letter-requests/{letterRequest}/approve', [LetterRequestController::class, 'approve'])
        ->middleware('permission:letters.approve');
    Route::patch('letter-requests/{letterRequest}/reject', [LetterRequestController::class, 'reject'])
        ->middleware('permission:letters.reject');

    // Letter Types
    Route::middleware('permission:letter_types.view')->group(function () {
        Route::get('letter-types', [LetterTypeController::class, 'index']);
        Route::get('letter-types/{letterType}', [LetterTypeController::class, 'show']);
    });
    Route::post('letter-types', [LetterTypeController::class, 'store'])
        ->middleware('permission:letter_types.create');
    Route::put('letter-types/{letterType}', [LetterTypeController::class, 'update'])
        ->middleware('permission:letter_types.edit');
    Route::delete('letter-types/{letterType}', [LetterTypeController::class, 'destroy'])
        ->middleware('permission:letter_types.delete');

    // Berita & Pengumuman
    Route::middleware('permission:news.view')->group(function () {
        Route::get('news', [NewsController::class, 'index']);
        Route::get('news/{news}', [NewsController::class, 'show']);
    });
    Route::post('news', [NewsController::class, 'store'])
        ->middleware('permission:news.create');
    Route::put('news/{news}', [NewsController::class, 'update'])
        ->middleware('permission:news.edit');
    Route::delete('news/{news}', [NewsController::class, 'destroy'])
        ->middleware('permission:news.delete');

    Route::middleware('permission:announcements.view')->group(function () {
        Route::get('announcements', [AnnouncementController::class, 'index']);
        Route::get('announcements/{announcement}', [AnnouncementController::class, 'show']);
    });
    Route::post('announcements', [AnnouncementController::class, 'store'])
        ->middleware('permission:announcements.create');
    Route::put('announcements/{announcement}', [AnnouncementController::class, 'update'])
        ->middleware('permission:announcements.edit');
    Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy'])
        ->middleware('permission:announcements.delete');

    // Pengaduan
    Route::middleware('permission:complaints.view')->group(function () {
        Route::get('complaints', [ComplaintController::class, 'index']);
        Route::get('complaints/{complaint}', [ComplaintController::class, 'show']);
    });
    Route::patch('complaints/{complaint}/respond', [ComplaintController::class, 'respond'])
        ->middleware('permission:complaints.respond');

    // Galeri
    Route::middleware('permission:gallery.view')->group(function () {
        Route::get('galleries', [GalleryController::class, 'index']);
    });
    Route::post('galleries', [GalleryController::class, 'store'])
        ->middleware('permission:gallery.create');
    Route::delete('galleries/{gallery}', [GalleryController::class, 'destroy'])
        ->middleware('permission:gallery.delete');

    // Manajemen Pengguna
    Route::middleware('permission:users.view')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::get('users/roles/list', [UserController::class, 'roles']);
    });
    Route::post('users', [UserController::class, 'store'])
        ->middleware('permission:users.create');
    Route::put('users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.edit');
    Route::delete('users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:users.delete');

    // Profil Desa & Pengaturan
    Route::middleware('permission:desa_profile.view')->group(function () {
        Route::get('desa-profile', [DesaProfileController::class, 'show']);
    });
    Route::put('desa-profile', [DesaProfileController::class, 'update'])
        ->middleware('permission:desa_profile.edit');

    Route::middleware('permission:settings.view')->group(function () {
        Route::get('settings', [SettingController::class, 'index']);
    });
    Route::put('settings', [SettingController::class, 'update'])
        ->middleware('permission:settings.edit');
});
