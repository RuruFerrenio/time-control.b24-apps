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
	    $placementOptions = $request->input('PLACEMENT_OPTIONS', '{}');
	    $params = $request->input('params', []);

	    $options = json_decode($placementOptions, true) ?? [];

		if(isset($options['parameters'])){
			$parameters = json_decode($options['parameters'], true) ?? [];
		}

	    $mode = $parameters['mode'] ?? null;

        return view('b24api.index', [
	        'placementOptions' => $placementOptions,
	        'mode' => $mode,
        ]);
    }
}
