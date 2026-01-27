<?php

namespace App\Http\Controllers\Bitrix24\Placements;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BackGroundPlacementController extends Controller
{
	/**
	 * Обработчик для встройки в правой панели карточки задачи (TASK_VIEW_SIDEBAR)
	 */
	public function handle(Request $request)
	{
		// Получаем параметры из запроса Bitrix24
		$placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
		$params = $request->input('params', []);

		$options = json_decode($placementOptions, true) ?? [];

		$url = $options['URI'] ?? null;

		\Log::info('Background placement called', [
			'placementOptions' => $placementOptions,
			'params' => $params,
			'placement' => $request->input('PLACEMENT'),
		]);

		return view('placements.background-placement', [
			'placementOptions' => $placementOptions,
			'clientUrl' => $url,
			'authId' => $request->input('AUTH_ID'),
			'domain' => $request->input('DOMAIN'),
		]);
	}

	public function errorHandler(Request $request)
	{
		// Получаем параметры из запроса Bitrix24
		$placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
		$params = $request->input('params', []);

		$options = json_decode($placementOptions, true) ?? [];

		\Log::info('Background placement called', [
			'placementOptions' => $placementOptions,
			'params' => $params,
			'placement' => $request->input('PLACEMENT'),
		]);

		return view('placements.background-placement-error', [
			'placementOptions' => $placementOptions,
			'authId' => $request->input('AUTH_ID'),
			'domain' => $request->input('DOMAIN'),
		]);
	}

}