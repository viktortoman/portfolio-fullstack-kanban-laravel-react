<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     * path="/api/v1/register",
     * operationId="registerUser",
     * tags={"Authentication"},
     * summary="New user registration",
     * description="Creates a new user account and returns an API token.",
     * @OA\RequestBody(
     * required=true,
     * description="User registration data",
     * @OA\JsonContent(
     * required={"name","email","password","password_confirmation"},
     * @OA\Property(property="name", type="string", example="Test User"),
     * @OA\Property(property="email", type="string", format="email", example="test@email.com"),
     * @OA\Property(property="password", type="string", format="password", example="password123"),
     * @OA\Property(property="password_confirmation", type="string", format="password", example="password123")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Successful registration",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="user", type="object", ref="#/components/schemas/User"),
     * @OA\Property(property="token", type="string", example="1|aBcDeFgHiJkLmNoPqRsTuVwXyZ...")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validációs hiba (pl. email már foglalt)"
     * )
     * )
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
