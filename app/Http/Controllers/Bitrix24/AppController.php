<?php

namespace App\Http\Controllers\Bitrix24;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\View\View;
use X3Group\Bitrix24\Bitrix24ApiClient;

class AppController extends Controller
{
	public function index(Bitrix24ApiClient $bitrix24, Request $request): View
	{
		// Получаем параметры авторизации из URL
		$authParams = [
			'access_token' => $request->input('AUTH_ID') ?? $request->input('code'),
			'refresh_token' => $request->input('REFRESH_ID'),
			'domain' => $request->input('domain'),
			'member_id' => $request->input('member_id'),
			'expires_in' => $request->input('expires_in'),
			'state' => $request->input('state'),
		];

		$placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
		$params = $request->input('params', []);

		$options = json_decode($placementOptions, true) ?? [];

		$parameters = [];
		if(isset($options['parameters'])){
			$parameters = json_decode($options['parameters'], true) ?? [];
		}

		$mode = $parameters['mode'] ?? null;

		return view('b24api.index', [
			'authParams' => $authParams,
			'placementOptions' => $placementOptions,
			'mode' => $mode,
			'params' => $params,
			'fitWindow' => $request->input('fitWindow', false),
		]);
	}
}