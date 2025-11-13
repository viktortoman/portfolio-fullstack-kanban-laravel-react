<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginUserRequest;
use App\Http\Requests\Api\V1\Auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    /**
     * @OA\Post(
     * path="/api/v1/login",
     * operationId="loginUser",
     * tags={"Authentication"},
     * summary="Login user",
     * description="Verifies user data and returns an API token if login is successful.",
     * @OA\RequestBody(
     * required=true,
     * description="User login data",
     * @OA\JsonContent(
     * required={"email","password"},
     * @OA\Property(property="email", type="string", format="email", example="test@email.com"),
     * @OA\Property(property="password", type="string", format="password", example="password123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login successful",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="user", type="object", ref="#/components/schemas/User"),
     * @OA\Property(property="token", type="string", example="2|aBcDeFgHiJkLmNoPqRsTuVwXyZ...")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Login failed (incorrect email or password)",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="message", type="string", example="Incorrect login details")
     * )
     * )
     * )
     */
    public function login(LoginUserRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Incorrect login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * @OA\Get(
     * path="/api/v1/user",
     * operationId="getAuthenticatedUser",
     * tags={"Authentication"},
     * summary="Get the authenticated user's data",
     * description="Returns the data of the user who owns the provided Bearer token.",
     * security={ {"bearerAuth": {} } },
     * @OA\Response(
     * response=200,
     * description="User data retrieved successfully",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="user", type="object", ref="#/components/schemas/User")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated (Invalid or missing token)"
     * )
     * )
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * @OA\Post(
     * path="/api/v1/logout",
     * operationId="logoutUser",
     * tags={"Authentication"},
     * summary="Log out the current user",
     * description="Revokes the authentication token currently in use.",
     * security={ {"bearerAuth": {} } },
     * @OA\Response(
     * response=200,
     * description="Logged out successfully",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="message", type="string", example="Logged out")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated (Invalid or missing token)"
     * )
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
