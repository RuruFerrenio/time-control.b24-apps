<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>OAuth2 Callback</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: #f8f9fa;
        }
        .message {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .success {
            color: #1ec1b0;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .loading {
            color: #6c757d;
            margin: 20px 0;
        }
        .redirecting {
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="message">
    <div class="success">✓</div>
    <h2>Авторизация успешна!</h2>
    <div class="loading">Перенаправление обратно в расширение...</div>
    <div class="redirecting">Пожалуйста, подождите</div>
</div>

<script>
  // Формируем URL для редиректа обратно в расширение
  const redirectUri = '{{ config('app.redirect_uri') }}';

  if (redirectUri) {
    // Если указан redirect_uri, перенаправляем туда
    window.location.href = redirectUri + '?' + new URLSearchParams({
      code: '{{ $code }}',
      state: '{{ $state }}',
      domain: '{{ $domain }}',
      member_id: '{{ $member_id }}',
      scope: '{{ $scope }}',
      server_domain: '{{ $server_domain }}'
    });
  } else {
    // Иначе просто показываем сообщение об успехе
    setTimeout(() => {
      window.close();
    }, 3000);
  }

  // Логируем параметры для отладки
  console.log('OAuth2 callback params:', {
    code: '{{ $code }}',
    state: '{{ $state }}',
    domain: '{{ $domain }}',
    member_id: '{{ $member_id }}'
  });
</script>
</body>
</html>