<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => ProductResource::collection($products)->resolve(),
            'message' => 'ok',
        ]);
    }

    public function adminIndex()
    {
        $products = Product::query()->orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'data' => ProductResource::collection($products)->resolve(),
            'message' => 'ok',
        ]);
    }

    public function store(ProductRequest $request)
    {
        $product = Product::query()->create($this->attributes($request));

        return response()->json([
            'data' => (new ProductResource($product))->resolve(),
            'message' => 'تم إنشاء المنتج.',
        ], 201);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->update($this->attributes($request, $product));

        return response()->json([
            'data' => (new ProductResource($product->fresh()))->resolve(),
            'message' => 'تم تحديث المنتج.',
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'data' => null,
            'message' => 'تم حذف المنتج.',
        ]);
    }

    private function attributes(Request $request, ?Product $product = null): array
    {
        $slug = $request->filled('slug')
            ? Str::slug($request->string('slug'))
            : Str::slug($request->string('name_en'));

        if ($slug === '') {
            $slug = 'product-'.Str::lower(Str::random(6));
        }

        $attributes = [
            'slug' => $slug,
            'name_ar' => $request->string('name_ar'),
            'name_en' => $request->string('name_en'),
            'summary_ar' => $request->input('summary_ar'),
            'summary_en' => $request->input('summary_en'),
            'category' => $request->string('category'),
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => (int) $request->input('sort_order', 0),
        ];

        if ($request->hasFile('image')) {
            if ($product?->image) {
                Storage::disk('public')->delete($product->image);
            }

            $attributes['image'] = $request->file('image')->store('products', 'public');
        }

        return $attributes;
    }
}
