<?php

namespace App\Http\Controllers\Bitrix24\Placements;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ChatPlacementController extends Controller
{
	/**
	 * Обработчик для встройки в сайдбар чата
	 * Возвращает HTML для отображения в сайдбаре
	 */
	public function handle(Request $request)
	{
		// Получаем параметры из запроса Bitrix24
		$placementOptions = $request->input('PLACEMENT_OPTIONS', []);
		$params = $request->input('params', []);

		$options = json_decode($placementOptions, true, 512, JSON_THROW_ON_ERROR) ?? [];

		$dialogId = $options['dialogId'] ?? null;

		\Log::info('ChatSidebar called', [
			'dialogId' => $dialogId,
			'placementOptions' => $placementOptions,
			'params' => $params
		]);

		return view('placements.chat-calc', [
			'dialogId' => $dialogId,
			'placementOptions' => $placementOptions,
			'sendBtnActive' => true,
			'authId' => $request->input('AUTH_ID'),
			'domain' => $request->input('DOMAIN'),
		]);
	}
}