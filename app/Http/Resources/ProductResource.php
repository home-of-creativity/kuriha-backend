<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'summary_ar' => $this->summary_ar,
            'summary_en' => $this->summary_en,
            'category' => $this->category,
            'image_url' => $this->image ? asset('storage/'.$this->image) : null,
            'is_published' => $this->is_published,
            'sort_order' => $this->sort_order,
        ];
    }
}
