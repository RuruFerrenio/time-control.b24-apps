<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <title>Приложение</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Добавляем meta-теги с токенами для безопасности --}}
    <meta name="api-access-token" content="{{ $authParams['access_token'] ?? '' }}">
    <meta name="api-refresh-token" content="{{ $authParams['refresh_token'] ?? '' }}">
    <meta name="api-domain" content="{{ $authParams['domain'] ?? '' }}">
    <meta name="api-member-id" content="{{ $authParams['member_id'] ?? '' }}">
    <meta name="api-expires-in" content="{{ $authParams['expires_in'] ?? '' }}">

    <script>
      window.bitrixData = {
        params: @json($params ?? null),
        mode: @json($mode ?? null),
        placementOptions: @json($placementOptions ?? []),
        fitWindow: @json($fitWindow ?? []),
        // Добавляем authParams для доступа из JavaScript
        auth: @json($authParams ?? [])
      };
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <script>
      BX24.init(function () {
        BX24.installFinish();
      });
    </script>
</head>
<body>
<div id="app" class="isolate">
    <!-- Vue приложение будет монтироваться сюда -->
</div>
</body>
</html>