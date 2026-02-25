<?php

use App\Http\Controllers\Bitrix24\InstallController;
use App\Http\Controllers\Bitrix24\Placements\BackGroundPlacementController;
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
	Route::get('/page-background-worker', [BackGroundPlacementController::class, 'handle']);
	Route::post('/page-background-worker', [BackGroundPlacementController::class, 'handle']);

	Route::get('/error-handler', [BackGroundPlacementController::class, 'errorHandler']);
	Route::post('/error-handler', [BackGroundPlacementController::class, 'errorHandler']);

});