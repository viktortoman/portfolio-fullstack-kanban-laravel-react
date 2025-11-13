<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 * schema="Task",
 * title="Task",
 * description="Task model. Represents a single card on a Kanban board.",
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="board_id", type="integer", example=1),
 * @OA\Property(property="title", type="string", example="Buy milk"),
 * @OA\Property(property="description", type="string", nullable=true, example="Get 2% milk."),
 * @OA\Property(property="status", type="string", example="todo", description="The column the task is in", enum={"todo", "in_progress", "done"}),
 * @OA\Property(property="order", type="integer", example=1, description="Position for drag-and-drop"),
 * @OA\Property(property="created_at", type="string", format="date-time"),
 * @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_id',
        'title',
        'description',
        'order',
    ];

    protected $casts = [
        'status' => TaskStatus::class,
    ];

    /**
     * Get the board that this task belongs to.
     */
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}
