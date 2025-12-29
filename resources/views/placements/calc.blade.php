<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Калькулятор - CRM</title>

    <!-- Bitrix24 SDK -->
    <script src="//api.bitrix24.com/api/v1/"></script>

    <!-- Передаем данные из PHP в JavaScript -->
    <script>
      window.bitrixData = {
        taskId: @json($taskId ?? null),
        placementOptions: @json($placementOptions ?? []),
        sendBtnActive: @json($sendBtnActive ?? []),
        fitWindow: @json($fitWindow ?? []),
      };
    </script>

    <!-- Подключение через Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-transparent">
<div id="app">
    <!-- Vue приложение смонтируется здесь -->
</div>
</body>
</html>