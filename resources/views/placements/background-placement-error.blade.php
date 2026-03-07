<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <title>Переустановка фонового счетчика</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
      BX24.init(async function() {
        const HANDLER_URL = `${window.location.origin}/placements/page-background-worker`;
        const PLACEMENT_TYPE = 'PAGE_BACKGROUND_WORKER';

        // Конфигурация встройки (та же, что и в основном приложении)
        const PLACEMENT_CONFIG = {
          PAGE_BACKGROUND_WORKER: {
            options: {
              errorHandlerUrl: window.location.href
            }
          }
        };

        // Вспомогательная функция для вызова методов Bitrix24
        function callBitrixMethod(method, params = {}) {
          return new Promise((resolve, reject) => {
            if (typeof BX24 === 'undefined' || typeof BX24.callMethod === 'undefined') {
              reject(new Error('Библиотека Bitrix24 не доступна'));
              return;
            }

            BX24.callMethod(method, params, (result) => {
              if (result.error()) {
                reject(new Error(result.error().getError()));
              } else {
                resolve(result.data());
              }
            });
          });
        }

        async function reinstallPlacement() {
          try {
            // Пытаемся удалить старую встройку (если она есть)
            try {
              await callBitrixMethod('placement.unbind', {
                PLACEMENT: PLACEMENT_TYPE,
                HANDLER: HANDLER_URL
              });
            } catch (unbindError) {
              // Если встройка не найдена - это нормально, продолжаем
              if (unbindError.message.includes('not found') ||
                unbindError.message.includes('PLACEMENT_NOT_FOUND')) {
              } else {
                throw unbindError;
              }
            }

            // Регистрируем новую встройку с теми же параметрами
            await callBitrixMethod('placement.bind', {
              PLACEMENT: PLACEMENT_TYPE,
              HANDLER: HANDLER_URL,
              OPTIONS: PLACEMENT_CONFIG.PAGE_BACKGROUND_WORKER.options
            });

            // Проверяем, что встройка установлена
            const placements = await callBitrixMethod('placement.get', {});
            const ourPlacement = placements.find(p =>
              p.PLACEMENT === PLACEMENT_TYPE &&
              p.HANDLER === HANDLER_URL
            );

            if (ourPlacement) {
              // Завершаем установку и закрываем окно
              BX24.installFinish();
            } else {
              throw new Error('Встройка не найдена после установки');
            }

          } catch (error) {
            console.error('Ошибка при переустановке:', error);

            // Показываем ошибку и предлагаем повторить
            alert('Ошибка переустановки фонового счетчика: ' + error.message);

            // Пробуем еще раз через 3 секунды
            setTimeout(() => {
              reinstallPlacement();
            }, 3000);
          }
        }

        // Запускаем переустановку
        await reinstallPlacement();
      });
    </script>
</head>
<body>
<!-- Минимальное тело для корректной работы -->
<p>Переустановка фонового счетчика...</p>
<script>
  // Дополнительная обработка на случай, если BX24.init не сработает
  window.onload = function() {
    if (typeof BX24 === 'undefined') {
      console.error('Библиотека Bitrix24 не загружена');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
</script>
</body>
</html>