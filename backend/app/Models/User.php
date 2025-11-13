<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @OA\Schema(
 * schema="User",
 * title="User",
 * description="User model.",
 * @OA\Property(property="id", type="integer", format="int64", example=1, description="The user's unique identifier"),
 * @OA\Property(property="name", type="string", example="Test User", description="User name"),
 * @OA\Property(property="email", type="string", format="email", example="test@email.com", description="User email address"),
 * @OA\Property(property="created_at", type="string", format="date-time", example="2025-11-13T10:00:00Z", description="Creation date"),
 * @OA\Property(property="updated_at", type="string", format="date-time", example="2025-11-13T10:00:00Z", description="Date of modification")
 * )
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
