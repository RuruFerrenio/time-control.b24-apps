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

      console.log('!!!!!!!!!!!!!!!!');
      console.log(@json($authParams ?? []))
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

      BX24.ready(async function () {
        await BX24.init(async function () {
          window.axios.defaults.headers.common['X-b24api-access-token'] = BX24.getAuth().access_token;
          window.axios.defaults.headers.common['X-b24api-refresh-token'] = BX24.getAuth().refresh_token;
          window.axios.defaults.headers.common['X-b24api-domain'] = BX24.getAuth().domain;
          window.axios.defaults.headers.common['X-b24api-member-id'] = BX24.getAuth().member_id;
          window.axios.defaults.headers.common['X-b24api-expires-in'] = BX24.getAuth().expires_in;
        });
      });
    </script>
</head>
<body>
<div id="app" class="isolate">
    <!-- Vue приложение будет монтироваться сюда -->
</div>
</body>
</html>