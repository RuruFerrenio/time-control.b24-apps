<?php

use App\Http\Controllers\Bitrix24\AppController;
use Illuminate\Support\Facades\Route;

/**
 * Запросы из фронта приложения. Обязательна передача авторизации через
 * header X-b24api-access-token, X-b24api-member-id, X-b24api-domain.
 */
Route::get('/app', [AppController::class, 'oauth']);