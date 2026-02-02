<template>
  <B24Card>
    <div class="p-0 md:p-6">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">
              Управление встройками
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Регистрация и обновление встроек системы контроля времени
            </p>
          </div>
        </div>

        <!-- Информация о встройках -->
        <div class="space-y-4 pt-4 border-t">
          <h4 class="text-sm font-medium text-gray-900 mb-4">
            Управление встройками системы
          </h4>

          <!-- Список встроек -->
          <div class="space-y-6">
            <!-- Фоновый таймер -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Фоновый таймер</p>
                      <p class="text-sm text-gray-500">Подсчитывает время, проведенное пользователем на странице</p>
                    </div>
                  </div>

                  <!-- Статус встройки -->
                  <div class="mt-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-medium text-gray-900">Статус встройки</div>
                        <div class="text-xs text-gray-500 mt-1">
                          {{ placementsStatus.pageBackgroundWorker.registered ? 'Зарегистрирована' : 'Не зарегистрирована' }}
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 rounded-full" :class="placementsStatus.pageBackgroundWorker.registered ? 'bg-green-500' : 'bg-red-500'"></div>
                        <span class="text-xs" :class="placementsStatus.pageBackgroundWorker.registered ? 'text-green-600' : 'text-red-600'">
                          {{ placementsStatus.pageBackgroundWorker.registered ? 'Активна' : 'Неактивна' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Форма для отчета -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Форма для отчета</p>
                      <p class="text-sm text-gray-500">Позволяет сотруднику заполнять запрошенные отчеты</p>
                    </div>
                  </div>

                  <!-- Статус встройки -->
                  <div class="mt-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-medium text-gray-900">Статус встройки</div>
                        <div class="text-xs text-gray-500 mt-1">
                          {{ placementsStatus.restAppUri.registered ? 'Зарегистрирована' : 'Не зарегистрирована' }}
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 rounded-full" :class="placementsStatus.restAppUri.registered ? 'bg-green-500' : 'bg-red-500'"></div>
                        <span class="text-xs" :class="placementsStatus.restAppUri.registered ? 'text-green-600' : 'text-red-600'">
                          {{ placementsStatus.restAppUri.registered ? 'Активна' : 'Неактивна' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Информация об обновлении -->
          <div class="mt-4">
            <div class="flex items-start p-3 bg-blue-50 rounded-lg">
              <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="text-sm text-blue-700">
                <span class="font-medium">Важно:</span> Обновление встроек перерегистрирует все компоненты системы.
                Это может быть полезно при возникновении проблем с работой встроек или после обновления системы.
              </div>
            </div>
          </div>

          <!-- Кнопка обновления встроек -->
          <div class="flex space-x-2">
            <button
                @click="updatePlacements"
                :disabled="isProcessing"
                class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isProcessing ? 'Обновление...' : 'Обновить встройки' }}
            </button>
          </div>
        </div>

        <!-- Как работает обновление встроек -->
        <div class="space-y-4 mt-6">
          <h4 class="text-sm font-medium text-gray-900">
            Как работает обновление встроек
          </h4>
          <div class="space-y-3">
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Проверка существующих встроек в системе Bitrix24
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Удаление старых версий встроек (если они существуют)
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Регистрация новых встроек с актуальными настройками
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">4</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Проверка успешной регистрации и обновление статусов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </B24Card>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'PlacementsManager',
  setup() {
    // Статус встроек
    const placementsStatus = ref({
      pageBackgroundWorker: {
        registered: false,
        checking: false
      },
      restAppUri: {
        registered: false,
        checking: false
      }
    })

    const isProcessing = ref(false)

    // URL обработчиков
    const HANDLERS = {
      pageBackgroundWorker: `${window.location.origin}/placements/page-background-worker`,
      restAppUri: `${window.location.origin}/app`
    }

    // Конфигурации встроек
    const PLACEMENT_CONFIGS = {
      PAGE_BACKGROUND_WORKER: {
        title: 'Фоновый таймер',
        description: 'Подсчитывает время, проведенное пользователем на странице',
        options: {
          errorHandlerUrl: `${window.location.origin}/placements/error-handler`
        }
      },
      REST_APP_URI: {
        title: 'Форма для отчета',
        description: 'Позволяет сотруднику заполнять запрошенные отчеты',
        options: {}
      }
    }

    // Функции для работы с Bitrix24 API
    const bitrixAPI = {
      call: (method, params) => {
        return new Promise((resolve, reject) => {
          if (typeof BX24 === 'undefined' || typeof BX24.callMethod === 'undefined') {
            reject(new Error('Библиотека Bitrix24 не доступна'))
            return
          }

          BX24.callMethod(method, params, (result) => {
            if (result.error()) {
              reject(new Error(result.error().getError()))
            } else {
              resolve(result.data())
            }
          })
        })
      },

      getPlacements: async () => {
        try {
          const result = await bitrixAPI.call('placement.get', {})
          console.log('Список встроек:', result)
          return result || []
        } catch (error) {
          console.error('Ошибка при получении списка встроек:', error)
          return []
        }
      }
    }

    // Менеджер встроек
    const placementManager = {
      getConfig: (placementType) => {
        const config = PLACEMENT_CONFIGS[placementType]
        if (!config) {
          throw new Error(`Неизвестный тип встройки: ${placementType}`)
        }
        return config
      },

      bind: async (placementType, handler) => {
        try {
          const config = placementManager.getConfig(placementType)

          // Для PAGE_BACKGROUND_WORKER используем специальный формат конфигурации
          const placementConfig = placementType === 'PAGE_BACKGROUND_WORKER'
              ? {
                PLACEMENT: placementType,
                HANDLER: handler,
                OPTIONS: config.options
              }
              : {
                PLACEMENT: placementType,
                HANDLER: handler,
                LANG_ALL: {
                  ru: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Инструменты контроля времени'
                  },
                  en: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Time control tools'
                  },
                  be: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Інструменты кантролю часу'
                  },
                  kk: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Уақытты бақылау құралдары'
                  }
                },
                OPTIONS: config.options
              }

          const result = await bitrixAPI.call('placement.bind', placementConfig)
          console.log(`Встройка ${placementType} зарегистрирована:`, result)
          return true
        } catch (error) {
          console.error(`Ошибка регистрации встройки ${placementType}:`, error)
          throw error
        }
      },

      unbind: async (placementType, handler) => {
        try {
          const result = await bitrixAPI.call('placement.unbind', {
            PLACEMENT: placementType,
            HANDLER: handler
          })
          console.log(`Встройка ${placementType} удалена:`, result)
          return result
        } catch (error) {
          console.error(`Ошибка удаления встройки ${placementType}:`, error)
          // Игнорируем ошибку, если встройка не существует
          return null
        }
      },

      checkStatus: async (placementType, handler) => {
        try {
          const placements = await bitrixAPI.getPlacements()

          if (!Array.isArray(placements)) {
            console.warn('Получен некорректный формат данных встроек:', placements)
            return false
          }

          const placement = placements.find(p =>
              p.placement === placementType &&
              p.handler === handler
          )

          return !!placement
        } catch (error) {
          console.error(`Ошибка при проверке статуса встройки ${placementType}:`, error)
          return false
        }
      }
    }

    // Проверка статуса встроек
    const checkPlacementsStatus = async () => {
      try {
        placementsStatus.value.pageBackgroundWorker.checking = true
        placementsStatus.value.restAppUri.checking = true

        const pageBackgroundWorkerStatus = await placementManager.checkStatus(
            'PAGE_BACKGROUND_WORKER',
            HANDLERS.pageBackgroundWorker
        )

        const restAppUriStatus = await placementManager.checkStatus(
            'REST_APP_URI',
            HANDLERS.restAppUri
        )

        placementsStatus.value.pageBackgroundWorker.registered = pageBackgroundWorkerStatus
        placementsStatus.value.restAppUri.registered = restAppUriStatus
      } catch (error) {
        console.error('Ошибка при проверке статуса встроек:', error)
      } finally {
        placementsStatus.value.pageBackgroundWorker.checking = false
        placementsStatus.value.restAppUri.checking = false
      }
    }

    // Обновление встроек
    const updatePlacements = async () => {
      if (!confirm('Вы уверены, что хотите обновить все встройки? Существующие встройки будут удалены и зарегистрированы заново.')) {
        return
      }

      try {
        isProcessing.value = true

        // Регистрируем обе встройки
        await registerAllPlacements()

        // Проверяем статус после регистрации
        await checkPlacementsStatus()

        alert('Встройки успешно обновлены!')
      } catch (error) {
        console.error('Ошибка при обновлении встроек:', error)
        alert('Произошла ошибка при обновлении встроек. Пожалуйста, попробуйте еще раз.')
      } finally {
        isProcessing.value = false
      }
    }

    // Регистрация всех встроек
    const registerAllPlacements = async () => {
      try {
        // Для каждой встройки сначала удаляем старую, затем регистрируем новую
        const placements = [
          {
            type: 'PAGE_BACKGROUND_WORKER',
            handler: HANDLERS.pageBackgroundWorker
          },
          {
            type: 'REST_APP_URI',
            handler: HANDLERS.restAppUri
          }
        ]

        for (const placement of placements) {
          try {
            // Проверяем существование встройки
            const exists = await placementManager.checkStatus(placement.type, placement.handler)

            // Если существует, удаляем
            if (exists) {
              console.log(`Встройка ${placement.type} уже существует, удаляем...`)
              await placementManager.unbind(placement.type, placement.handler)
            }

            // Регистрируем новую встройку
            await placementManager.bind(placement.type, placement.handler)
            console.log(`Встройка ${placement.type} успешно зарегистрирована`)
          } catch (error) {
            console.error(`Ошибка при обработке встройки ${placement.type}:`, error)
            // Продолжаем с другими встройками
          }
        }

        return true
      } catch (error) {
        console.error('Ошибка при регистрации встроек:', error)
        throw error
      }
    }

    // Инициализация при монтировании
    const init = () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(() => {
          checkPlacementsStatus()
        })
      }
    }

    onMounted(() => {
      init()
    })

    return {
      placementsStatus,
      isProcessing,
      updatePlacements
    }
  }
}
</script>