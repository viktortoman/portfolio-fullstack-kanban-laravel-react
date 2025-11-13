<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Task\ReorderTasksRequest;
use App\Http\Requests\Api\V1\Task\StoreTaskRequest;
use App\Http\Requests\Api\V1\Task\UpdateTaskRequest;
use App\Models\Board;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    use AuthorizesRequests;

    /**
     * @OA\Get(
     * path="/api/v1/boards/{board}/tasks",
     * operationId="getBoardTasks",
     * tags={"Tasks"},
     * summary="Get all tasks for a specific board",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="board",
     * in="path",
     * required=true,
     * description="The ID of the board",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="A list of tasks",
     * @OA\JsonContent(
     * type="array",
     * @OA\Items(ref="#/components/schemas/Task")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own this board)"
     * ),
     * @OA\Response(
     * response=404,
     * description="Board not found"
     * )
     * )
     * @throws AuthorizationException
     */
    public function index(Board $board): JsonResponse
    {
        $this->authorize('view', $board);
        $tasks = $board->tasks()->orderBy('order')->get();

        return response()->json($tasks);
    }

    /**
     * @OA\Post(
     * path="/api/v1/boards/{board}/tasks",
     * operationId="createTaskForBoard",
     * tags={"Tasks"},
     * summary="Create a new task on a board",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="board",
     * in="path",
     * required=true,
     * description="The ID of the board",
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="Task data",
     * @OA\JsonContent(
     * required={"title", "status"},
     * @OA\Property(property="title", type="string", example="New Task Title"),
     * @OA\Property(property="description", type="string", nullable=true, example="Task details..."),
     * @OA\Property(property="status", type="string", example="todo", enum={"todo", "in_progress", "done"})
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Task created successfully",
     * @OA\JsonContent(ref="#/components/schemas/Task")
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User cannot 'update' this board)"
     * )
     * )
     * @throws AuthorizationException
     */
    public function store(StoreTaskRequest $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);
        $validatedData = $request->validated();

        $maxOrder = $board->tasks()
            ->where('status', $validatedData['status'])
            ->max('order');

        $taskData = array_merge($validatedData, [
            'order' => $maxOrder + 1,
        ]);

        $task = $board->tasks()->create($taskData);

        return response()->json($task, 201);
    }

    /**
     * @OA\Get(
     * path="/api/v1/tasks/{task}",
     * operationId="getTaskById",
     * tags={"Tasks"},
     * summary="Get a single task by its ID",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="task",
     * in="path",
     * required=true,
     * description="The ID of the task",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Task data",
     * @OA\JsonContent(ref="#/components/schemas/Task")
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own the parent board)"
     * ),
     * @OA\Response(
     * response=404,
     * description="Task not found"
     * )
     * )
     * @throws AuthorizationException
     */
    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return response()->json($task->fresh());
    }

    /**
     * @OA\Put(
     * path="/api/v1/tasks/{task}",
     * operationId="updateTask",
     * tags={"Tasks"},
     * summary="Update an existing task",
     * description="Updates title, description, status, or order. This endpoint is used for drag-and-drop by sending new 'status' and 'order'.",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="task",
     * in="path",
     * required=true,
     * description="The ID of the task to update",
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="Task data to update. All fields are optional.",
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string", example="Updated Task Title"),
     * @OA\Property(property="description", type="string", nullable=true, example="Updated task details..."),
     * @OA\Property(property="status", type="string", example="in_progress", enum={"todo", "in_progress", "done"}),
     * @OA\Property(property="order", type="integer", example=2)
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Task updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/Task")
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own the parent board)"
     * )
     * )
     * @throws AuthorizationException
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);
        $task->update($request->validated());

        return response()->json($task->fresh());
    }

    /**
     * @OA\Delete(
     * path="/api/v1/tasks/{task}",
     * operationId="deleteTask",
     * tags={"Tasks"},
     * summary="Delete an existing task",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="task",
     * in="path",
     * required=true,
     * description="The ID of the task to delete",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=204,
     * description="No Content (Task deleted successfully)"
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own the parent board)"
     * )
     * )
     * @throws AuthorizationException
     */
    public function destroy(Task $task): Response
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->noContent();
    }

    /**
     * @OA\Post(
     * path="/api/v1/tasks/reorder",
     * operationId="reorderTasks",
     * tags={"Tasks"},
     * summary="Reorder tasks in a specific column",
     * description="Updates the status and order of multiple tasks at once. Used for drag-and-drop.",
     * security={ {"bearerAuth": {} } },
     * @OA\RequestBody(
     * required=true,
     * description="The status of the column and the array of task IDs in their new order.",
     * @OA\JsonContent(
     * required={"status", "taskIds"},
     * @OA\Property(property="status", type="string", example="in_progress", enum={"todo", "in_progress", "done"}),
     * @OA\Property(
     * property="taskIds",
     * type="array",
     * @OA\Items(type="integer"),
     * example={5, 2, 8}
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Tasks reordered successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Tasks reordered successfully.")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own the board)"
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error"
     * )
     * )
     * @throws AuthorizationException
     */
    public function reorder(ReorderTasksRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $taskIds = $validated['taskIds'];
        $status = $validated['status'];

        if (empty($taskIds)) {
            return response()->json(['message' => 'No tasks to reorder.']);
        }

        $tasks = Task::whereIn('id', $taskIds)->get();
        if ($tasks->isEmpty()) {
            return response()->json(['message' => 'No valid tasks found.'], 404);
        }

        $board = $tasks->first()->board;
        $this->authorize('update', $board);

        if (!$tasks->every(fn($task) => $task->board_id === $board->id)) {
            abort(403, 'Cannot reorder tasks from different boards.');
        }

        DB::transaction(function () use ($status, $taskIds, $board) {
            foreach ($taskIds as $index => $taskId) {
                Task::where('id', $taskId)
                    ->where('board_id', $board->id)
                    ->update([
                        'status' => $status,
                        'order' => $index
                    ]);
            }
        });

        return response()->json(['message' => 'Tasks reordered successfully.']);
    }
}
