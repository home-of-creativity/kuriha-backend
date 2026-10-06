<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard/');
});

Route::get('/dashboard/{any?}', function () {
    $index = public_path('dashboard/index.html');

    abort_unless(is_file($index), 404);

    return response()->file($index);
})->where('any', '.*');
