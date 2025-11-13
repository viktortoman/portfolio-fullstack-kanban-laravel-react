<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/v1/status",
     * operationId="getApiStatus",
     * tags={"Base"},
     * summary="API Status Check",
     * description="A simple 'health-check' endpoint that confirms that the API is running and responding.",
     * @OA\Response(
     * response=200,
     * description="Successful response",
     * @OA\JsonContent(
     * type="object",
     * @OA\Property(property="status", type="string", example="OK")
     * )
     * )
     * )
     */
    public function index()
    {
        return response()->json(['status' => 'OK']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
