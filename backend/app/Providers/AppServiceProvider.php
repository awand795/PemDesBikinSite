<?php

namespace App\Providers;

use App\Services\ActivityLoggerService;
use App\Services\DashboardService;
use App\Services\LetterNumberService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ActivityLoggerService::class);
        $this->app->singleton(DashboardService::class);
        $this->app->singleton(LetterNumberService::class);
    }

    public function boot(): void
    {
        //
    }
}
