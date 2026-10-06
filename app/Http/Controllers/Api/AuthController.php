<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::query()->where('email', $request->string('email'))->first();

        if (! $user || ! Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'بيانات الدخول غير صحيحة.',
            ]);
        }

        if (! $user->is_admin) {
            abort(403, 'غير مصرح.');
        }

        $user->tokens()->where('name', 'dashboard')->delete();

        return response()->json([
            'data' => [
                'token' => $user->createToken('dashboard')->plainTextToken,
                'user' => (new UserResource($user))->resolve(),
            ],
            'message' => 'ok',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'data' => null,
            'message' => 'ok',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'data' => (new UserResource($request->user()))->resolve(),
            'message' => 'ok',
        ]);
    }
}
