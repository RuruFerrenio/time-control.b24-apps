<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <title>Установка</title>
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
Установка успешно завершена
</body>
</html>
