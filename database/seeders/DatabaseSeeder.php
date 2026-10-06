<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Dashboard: admin@example.com / password
        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
                'is_admin' => true,
            ]
        );

        $products = [
            ['slug' => 'extinguisher', 'name_ar' => 'طفاية حريق', 'name_en' => 'Fire extinguisher', 'category' => 'equipment', 'sort_order' => 1],
            ['slug' => 'hose-cabinet', 'name_ar' => 'خزانة الخرطوم', 'name_en' => 'Hose reel cabinet', 'category' => 'equipment', 'sort_order' => 2],
            ['slug' => 'ladder', 'name_ar' => 'سلم الإطفاء', 'name_en' => 'Fire ladder', 'category' => 'equipment', 'sort_order' => 3],
            ['slug' => 'nozzle', 'name_ar' => 'قاذف', 'name_en' => 'Fire nozzle', 'category' => 'equipment', 'sort_order' => 4],
            ['slug' => 'helmet', 'name_ar' => 'الخوذة', 'name_en' => 'Helmet', 'category' => 'safety', 'sort_order' => 5],
            ['slug' => 'suit', 'name_ar' => 'بدلة الإطفاء', 'name_en' => 'Turnout suit', 'category' => 'safety', 'sort_order' => 6],
            ['slug' => 'boots', 'name_ar' => 'جزمة الإطفاء', 'name_en' => 'Fire boots', 'category' => 'safety', 'sort_order' => 7],
            ['slug' => 'gloves', 'name_ar' => 'قفازات الحماية', 'name_en' => 'Protective gloves', 'category' => 'safety', 'sort_order' => 8],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['slug' => $product['slug']],
                $product + ['is_published' => true]
            );
        }
    }
}
