<?php

namespace App\Providers;

use App\Models\Board;
use App\Models\Task;
use App\Policies\BoardPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Board::class, BoardPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
    }
}
