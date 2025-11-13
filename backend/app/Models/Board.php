<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 * schema="Board",
 * title="Board",
 * description="Board model. Represents a user's Kanban board.",
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="user_id", type="integer", example=1, description="ID of the owner user"),
 * @OA\Property(property="name", type="string", example="My First Board"),
 * @OA\Property(property="created_at", type="string", format="date-time", example="2025-11-13T10:00:00Z"),
 * @OA\Property(property="updated_at", type="string", format="date-time", example="2025-11-13T10:00:00Z")
 * )
 */
class Board extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'user_id', // Note: We will set this automatically, not from user input
    ];

    /**
     * Get the user who owns this board.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all the tasks for the board.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
