<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ========== PERMISSIONS ==========
        $permissionsByModule = [
            'residents' => ['view', 'create', 'edit', 'delete', 'import', 'export'],
            'families' => ['view', 'create', 'edit', 'delete'],
            'letters' => ['view', 'create', 'edit', 'approve', 'reject', 'delete', 'print'],
            'letter_types' => ['view', 'create', 'edit', 'delete'],
            'news' => ['view', 'create', 'edit', 'delete', 'publish'],
            'announcements' => ['view', 'create', 'edit', 'delete'],
            'complaints' => ['view', 'respond', 'delete'],
            'finance' => ['view', 'create', 'edit', 'delete', 'approve'],
            'assets' => ['view', 'create', 'edit', 'delete'],
            'gallery' => ['view', 'create', 'edit', 'delete'],
            'users' => ['view', 'create', 'edit', 'delete'],
            'settings' => ['view', 'edit'],
            'desa_profile' => ['view', 'edit'],
            'village_potentials' => ['view', 'create', 'edit', 'delete'],
            'dashboard' => ['view'],
        ];

        foreach ($permissionsByModule as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(
                    ['name' => "{$module}.{$action}", 'guard_name' => 'web']
                );
            }
        }

        // ========== ROLES ==========
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);

        $kadesPermissions = Permission::whereIn('name', [
            'dashboard.view',
            'residents.view',
            'families.view',
            'letters.view', 'letters.approve', 'letters.reject', 'letters.print',
            'news.view',
            'announcements.view',
            'complaints.view',
            'finance.view', 'finance.approve',
            'assets.view',
            'desa_profile.view',
        ])->pluck('name')->toArray();

        $sekdesPermissions = Permission::whereNotIn('name', [
            'users.delete', 'settings.delete', 'finance.delete'
        ])->pluck('name')->toArray();

        $kaurPermissions = [
            'dashboard.view',
            'residents.view', 'residents.create', 'residents.edit',
            'families.view', 'families.create', 'families.edit',
            'letters.view', 'letters.create', 'letters.edit', 'letters.print',
            'news.view', 'news.create', 'news.edit',
            'complaints.view', 'complaints.respond',
            'gallery.view', 'gallery.create', 'gallery.edit',
        ];

        $operatorPermissions = [
            'dashboard.view',
            'news.view', 'news.create', 'news.edit', 'news.delete', 'news.publish',
            'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete',
            'gallery.view', 'gallery.create', 'gallery.edit', 'gallery.delete',
            'desa_profile.view', 'desa_profile.edit',
        ];

        // Sync permissions for each role (safe to run multiple times)
        Role::firstOrCreate(['name' => 'Kepala Desa', 'guard_name' => 'web'])
            ->syncPermissions($kadesPermissions);

        Role::firstOrCreate(['name' => 'Sekretaris Desa', 'guard_name' => 'web'])
            ->syncPermissions($sekdesPermissions);

        Role::firstOrCreate(['name' => 'Kaur/Kasi', 'guard_name' => 'web'])
            ->syncPermissions($kaurPermissions);

        Role::firstOrCreate(['name' => 'Operator', 'guard_name' => 'web'])
            ->syncPermissions($operatorPermissions);

        // Super Admin gets all permissions
        $superAdmin->syncPermissions(Permission::all()->pluck('name')->toArray());
    }
}
