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
              Регистрация и обновление необходимых приложению мест встраивания
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
            <!-- Фоновый счетчик -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <div>
                      <p class="font-medium text-gray-900">Фоновый счетчик</p>
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
            <B24Button
                @click="updatePlacements"
                :disabled="isProcessing"
                color="air-primary"
                size="md"
                class="flex-1"
            >
              <template #left-icon>
                <svg v-if="!isProcessing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </template>
              {{ isProcessing ? 'Обновление...' : 'Обновить встройки' }}
            </B24Button>
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
                  Проверка существующих встроек в системе Bitrix24.
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Удаление старых версий встроек (если они существуют).
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Регистрация новых встроек с актуальными настройками.
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">4</span>
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  Проверка успешной регистрации и обновление статусов.
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
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

export default {
  name: 'PlacementsManager',
  setup() {
    const toast = useToast()

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
        title: 'Фоновый счетчик',
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

    // Показать уведомление
    const showNotification = (type, message) => {
      if (toast) {
        toast.add({
          description: message,
          variant: type
        })
      } else {
        console[type === 'error' ? 'error' : type === 'success' ? 'log' : 'info'](message)
      }
    }

    // Показать подтверждение
    const showConfirm = (message) => {
      return new Promise((resolve) => {
        if (toast) {
          // Создаем кастомное подтверждение через toast с действиями
          toast.add({
            description: message,
            variant: 'warning',
            actions: [
              {
                label: 'Да',
                onClick: () => resolve(true),
                variant: 'air-primary'
              },
              {
                label: 'Нет',
                onClick: () => resolve(false),
                variant: 'air-tertiary'
              }
            ],
            timeout: 0
          })
        } else {
          // Fallback на стандартный confirm
          resolve(confirm(message))
        }
      })
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
      const confirmed = await showConfirm('Вы уверены, что хотите обновить все встройки? Существующие встройки будут удалены и зарегистрированы заново.')

      if (!confirmed) {
        return
      }

      try {
        isProcessing.value = true

        // Регистрируем обе встройки
        await registerAllPlacements()

        // Проверяем статус после регистрации
        await checkPlacementsStatus()

        showNotification('success', 'Встройки успешно обновлены!')
      } catch (error) {
        console.error('Ошибка при обновлении встроек:', error)
        showNotification('error', 'Произошла ошибка при обновлении встроек. Пожалуйста, попробуйте еще раз.')
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
              await placementManager.unbind(placement.type, placement.handler)
            }

            // Регистрируем новую встройку
            await placementManager.bind(placement.type, placement.handler)
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