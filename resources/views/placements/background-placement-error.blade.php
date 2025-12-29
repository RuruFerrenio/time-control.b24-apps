<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <title>Установка</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
      BX24.init(function () {
            console.log('background placement worked!');
      });
    </script>
</head>
<body>
</body>
</html>