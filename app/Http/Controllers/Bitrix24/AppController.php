<?php

namespace App\Http\Controllers\Bitrix24;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\View\View;
use X3Group\Bitrix24\Bitrix24ApiClient;
use Illuminate\Support\Facades\Log;

class AppController extends Controller
{
	/**
	 * Обработка OAuth2 редиректа (GET запрос с кодом)
	 */
	public function oauthCallback(Request $request)
	{
		Log::info('OAuth2 callback received', [
			'code' => $request->has('code'),
			'state' => $request->has('state'),
			'domain' => $request->input('domain'),
			'member_id' => $request->input('member_id'),
			'all_params' => $request->all()
		]);

		// Проверяем, есть ли код авторизации
		if (!$request->has('code')) {
			$error = $request->input('error', 'unknown_error');
			$errorDescription = $request->input('error_description', '');

			Log::error('OAuth2 error', [
				'error' => $error,
				'description' => $errorDescription
			]);

			return response()->json([
				'error' => $error,
				'error_description' => $errorDescription
			], 400);
		}

		// Возвращаем HTML страницу с скриптом, который отправит данные обратно в расширение
		return $this->createCallbackHtml($request);
	}

	/**
	 * Создает HTML страницу с JavaScript для отправки данных обратно в расширение
	 */
	private function createCallbackHtml(Request $request): View
	{
		$params = [
			'code' => $request->input('code'),
			'state' => $request->input('state'),
			'domain' => $request->input('domain'),
			'member_id' => $request->input('member_id'),
			'scope' => $request->input('scope'),
			'server_domain' => $request->input('server_domain')
		];

		return view('b24api.oauth-callback', $params);
	}

	/**
	 * Основной метод для плейсментов (оставляем как есть)
	 */
	public function index(Bitrix24ApiClient $bitrix24, Request $request): View
	{
		$placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
		$params = $request->input('params', []);
		$options = json_decode($placementOptions, true) ?? [];

		if (isset($options['parameters'])) {
			$parameters = json_decode($options['parameters'], true) ?? [];
		}

		$mode = $parameters['mode'] ?? null;

		Log::info('Background placement called', [
			'placementOptions' => $placementOptions,
			'params' => $params,
			'placement' => $request->input('PLACEMENT'),
		]);

		return view('b24api.index', [
			'placementOptions' => $placementOptions,
			'mode' => $mode,
		]);
	}
}