<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="TaskFlow Kanban API Documentation",
 * description="A Trello-like Kanban board application built as a full-stack portfolio project. It features a Laravel 12 REST API backend, a React (Vite) frontend, and MySQL, all fully containerized with Docker Compose.",
 * @OA\Contact(
 * email="viktor.toman19@gmail.com"
 * ),
 * @OA\License(
 * name="MIT License",
 * url="https://opensource.org/licenses/MIT"
 * )
 * )
 *
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="Development (Docker) API Server"
 * )
 *
 * @OA\SecurityScheme(
 * securityScheme="bearerAuth",
 * type="http",
 * scheme="bearer",
 * bearerFormat="JWT",
 * description="Enter token in format: Bearer <token>"
 * )
 */
abstract class Controller
{

}
