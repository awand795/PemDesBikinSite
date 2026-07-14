<?php

namespace Database\Seeders;

use App\Models\DesaProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DefaultAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@desa.id'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'phone' => '081234567890',
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('Super Admin');

        // Create Kepala Desa
        $kades = User::firstOrCreate(
            ['email' => 'kades@desa.id'],
            [
                'name' => 'Kepala Desa',
                'password' => Hash::make('password'),
                'phone' => '081234567891',
                'is_active' => true,
            ]
        );
        $kades->assignRole('Kepala Desa');

        // Create Sekretaris Desa
        $sekdes = User::firstOrCreate(
            ['email' => 'sekdes@desa.id'],
            [
                'name' => 'Sekretaris Desa',
                'password' => Hash::make('password'),
                'phone' => '081234567892',
                'is_active' => true,
            ]
        );
        $sekdes->assignRole('Sekretaris Desa');

        // Create Operator
        $operator = User::firstOrCreate(
            ['email' => 'operator@desa.id'],
            [
                'name' => 'Operator Konten',
                'password' => Hash::make('password'),
                'phone' => '081234567893',
                'is_active' => true,
            ]
        );
        $operator->assignRole('Operator');

        // Create default desa profile
        DesaProfile::firstOrCreate(
            ['nama_desa' => 'Desa Contoh'],
            [
                'kecamatan' => 'Kecamatan Contoh',
                'kabupaten' => 'Kabupaten Contoh',
                'provinsi' => 'Provinsi Contoh',
                'alamat_kantor' => 'Jl. Contoh No. 1',
                'nama_kepala_desa' => 'Kepala Desa Contoh',
                'luas_wilayah' => 100.00,
                'jumlah_dusun' => 3,
            ]
        );
    }
}
