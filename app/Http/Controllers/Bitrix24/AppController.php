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

	public function index(Bitrix24ApiClient $bitrix24, Request $request): View
	{
		// Проверяем, это OAuth редирект?
		if ($request->has('code')) {
			// Преобразуем OAuth параметры в формат плейсмента
			$oauthData = [
				'auth' => [
					'code' => $request->input('code'),
					'state' => $request->input('state'),
					'domain' => $request->input('domain'),
					'member_id' => $request->input('member_id'),
					'scope' => $request->input('scope'),
					'server_domain' => $request->input('server_domain')
				]
			];

			// Создаём PLACEMENT_OPTIONS в нужном формате
			$placementOptions = json_encode([
				'parameters' => json_encode([
					'mode' => 'oauth',
					'auth_data' => $oauthData
				])
			]);

			// Добавляем параметры в request для совместимости
			$request->merge([
				'PLACEMENT_OPTIONS' => $placementOptions,
				'PLACEMENT' => 'OAUTH_REDIRECT',
				'params' => $oauthData
			]);

			Log::info('OAuth redirect transformed to placement format', [
				'original_params' => $request->all(),
				'transformed_placement_options' => $placementOptions
			]);
		}

		// Теперь код работает одинаково для обоих типов запросов
		$placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
		$params = $request->input('params', []);
		$options = json_decode($placementOptions, true) ?? [];

		// Параметры могут быть вложенными
		$parameters = [];
		if (isset($options['parameters'])) {
			if (is_string($options['parameters'])) {
				$parameters = json_decode($options['parameters'], true) ?? [];
			} else {
				$parameters = $options['parameters'] ?? [];
			}
		}

		$mode = $parameters['mode'] ?? $params['mode'] ?? null;

		Log::info('Request processed', [
			'type' => $request->has('code') ? 'oauth' : 'placement',
			'placementOptions' => $placementOptions,
			'params' => $params,
			'placement' => $request->input('PLACEMENT'),
			'mode' => $mode
		]);

		return view('b24api.index', [
			'placementOptions' => $placementOptions,
			'mode' => $mode,
			'params' => $params // передаём params в шаблон если нужно
		]);
	}
}