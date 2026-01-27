<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <script src="//api.bitrix24.com/api/v1/"></script>
        <title>Приложение</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script>
          window.bitrixData = {
            mode: @json($mode ?? null),
            placementOptions: @json($placementOptions ?? []),
            fitWindow: @json($fitWindow ?? []),
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