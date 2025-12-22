<?php

namespace App\Http\Controllers\Bitrix24\Placements;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TaskPlacementController extends Controller
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

		$taskId = $options['taskId'] ?? null;

		\Log::info('TaskSidebar called', [
			'taskId' => $taskId,
			'placementOptions' => $placementOptions,
			'params' => $params,
			'placement' => $request->input('PLACEMENT'),
		]);

		return view('placements.calc', [
			'taskId' => $taskId,
			'placementOptions' => $placementOptions,
			'sendBtnActive' => false,
			'authId' => $request->input('AUTH_ID'),
			'domain' => $request->input('DOMAIN'),
		]);
	}

}