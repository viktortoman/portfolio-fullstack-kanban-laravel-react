<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Board\StoreBoardRequest;
use App\Http\Requests\Api\V1\Board\UpdateBoardRequest;
use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BoardController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/v1/boards",
     * operationId="getUserBoards",
     * tags={"Boards"},
     * summary="Get all boards for the authenticated user",
     * security={ {"bearerAuth": {} } },
     * @OA\Response(
     * response=200,
     * description="A list of the user's boards",
     * @OA\JsonContent(
     * type="array",
     * @OA\Items(ref="#/components/schemas/Board")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $boards = $request->user()->boards()->latest()->get();

        return response()->json($boards);
    }

    /**
     * @OA\Post(
     * path="/api/v1/boards",
     * operationId="createBoard",
     * tags={"Boards"},
     * summary="Create a new board",
     * security={ {"bearerAuth": {} } },
     * @OA\RequestBody(
     * required=true,
     * description="Board data",
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", example="New Project Board")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Board created successfully",
     * @OA\JsonContent(ref="#/components/schemas/Board")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error"
     * )
     * )
     */
    public function store(StoreBoardRequest $request): JsonResponse
    {
        $board = $request->user()->boards()->create([
            'name' => $request->get('name'),
        ]);

        return response()->json($board, 201);
    }

    /**
     * @OA\Get(
     * path="/api/v1/boards/{id}",
     * operationId="getBoardById",
     * tags={"Boards"},
     * summary="Get a single board by its ID",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="The ID of the board",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Board data",
     * @OA\JsonContent(ref="#/components/schemas/Board")
     * ),
     * @OA\Response(
     * response=404,
     * description="Board not found"
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own this board)"
     * )
     * )
     */
    public function show(Request $request, Board $board): JsonResponse
    {
        if (!$request->user()->can('view', $board)) {
            abort(403, 'Unauthorized');
        }

        return response()->json($board);
    }

    /**
     * @OA\Put(
     * path="/api/v1/boards/{id}",
     * operationId="updateBoard",
     * tags={"Boards"},
     * summary="Update an existing board",
     * description="Updates the board (e.g., renames it). Only the owner can update.",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="The ID of the board to update",
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="New data for the board",
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", example="Updated Board Name")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Board updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/Board")
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden (User does not own this board)"
     * ),
     * @OA\Response(
     * response=404,
     * description="Board not found"
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error"
     * )
     * )
     */
    public function update(UpdateBoardRequest $request, Board $board): JsonResponse
    {
        if (!$request->user()->can('update', $board)) {
            abort(403, 'Unauthorized');
        }

        $board->update($request->validated());

        return response()->json($board);
    }

    /**
     * @OA\Delete(
     * path="/api/v1/boards/{id}",
     * operationId="deleteBoard",
     * tags={"Boards"},
     * summary="Delete an existing board",
     * description="Deletes a board and all of its associated tasks. Only the owner can delete.",
     * security={ {"bearerAuth": {} } },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="The ID of the board to delete",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=204,
     * description="No Content (Board deleted successfully)"
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
     */
    public function destroy(Request $request, Board $board): Response|JsonResponse
    {
        if (!$request->user()->can('delete', $board)) {
            abort(403, 'Unauthorized');
        }

        $board->delete();

        return response()->noContent();
    }
}
