<?php

use App\Http\Controllers\Bitrix24\InstallController;
use App\Http\Controllers\Bitrix24\Placements\ChatPlacementController;
use App\Http\Controllers\Bitrix24\Placements\TaskPlacementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Bitrix24\Events\OnApplicationInstallController;
use App\Http\Controllers\Bitrix24\Events\DemoOnApplicationUninstallController;

/**
 * Роуты для приложений типа: использует только API.
 */

Route::post('/install', [InstallController::class, 'install']);

Route::prefix('/events')->group(function() {
	Route::post('/onApplicationInstall', [OnApplicationInstallController::class, 'handle']);
	Route::post('/onApplicationUninstall', [DemoOnApplicationUninstallController::class, 'handle']);
});

Route::prefix('/placements')->group(function() {
	Route::get('/chat-sidebar', [ChatPlacementController::class, 'handle']);
	Route::post('/chat-sidebar', [ChatPlacementController::class, 'handle']);

	Route::get('/chat-panel', [ChatPlacementController::class, 'handle']);
	Route::post('/chat-panel', [ChatPlacementController::class, 'handle']);

	Route::get('/task-tab', [TaskPlacementController::class, 'handle']);
	Route::post('/task-tab', [TaskPlacementController::class, 'handle']);

	Route::get('/task-sidebar', [TaskPlacementController::class, 'handle']);
	Route::post('/task-sidebar', [TaskPlacementController::class, 'handle']);
});