<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <title>Установка</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
      let profilePollingInterval = null;

      BX24.init(function () {
        console.log('background placement worked!');
        startProfilePolling();
      });

      // Регулярное получение профиля
      function startProfilePolling() {
        stopProfilePolling();
        profilePollingInterval = setInterval(fetchProfile, 10000); // каждые 10 секунд
      }

      function stopProfilePolling() {
        if (profilePollingInterval) {
          clearInterval(profilePollingInterval);
          profilePollingInterval = null;
        }
      }

      async function fetchProfile() {
        try {
          const result = await BX24.callMethod("profile", {});
          console.log('Profile fetched:', result);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }

      // Дополнительно: можно сделать функции глобально доступными для отладки
      window.startPolling = startProfilePolling;
      window.stopPolling = stopProfilePolling;
    </script>
</head>
<body>
</body>
</html>