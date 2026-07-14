<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class ActivityLoggerService
{
    public function log(
        string $action,
        ?Model $subject = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $subject ? get_class($subject) : null,
            'model_id' => $subject?->getKey(),
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
        ]);
    }

    public function logLogin(int $userId): void
    {
        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'login',
            'description' => 'User login',
            'ip_address' => Request::ip(),
        ]);
    }
}
