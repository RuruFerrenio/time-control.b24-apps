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
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
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

        <!-- ДОБАВЛЕНО: Секция управления хранилищем сохраненного времени -->
        <div class="space-y-4 pt-4 border-t">
          <h4 class="text-sm font-medium text-gray-900">
            Управление хранилищем сохраненного времени
          </h4>

          <!-- Информация о хранилище -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">pr_saved_time_stats</p>
                <p class="text-sm text-gray-500 mt-1">
                  Хранилище персональных счетчиков сохраненного времени каждого пользователя.
                  Содержит ID пользователя, общее сохраненное время и дату последнего обновления.
                </p>

                <!-- Статистика хранилища -->
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="text-xs text-gray-500">Всего записей</div>
                    <div class="text-lg font-semibold text-gray-900">{{ storageStats.totalRecords }}</div>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="text-xs text-gray-500">Общее время</div>
                    <div class="text-lg font-semibold text-green-600">{{ formatDuration(storageStats.totalTime) }}</div>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="text-xs text-gray-500">Последнее обновление</div>
                    <div class="text-sm font-medium text-gray-900">{{ storageStats.lastUpdate || 'Нет данных' }}</div>
                  </div>
                </div>

                <!-- Кнопки управления (только для администратора) -->
                <div v-if="isAdmin" class="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                      @click="checkStorageStatus"
                      :disabled="isCheckingStorage"
                      class="px-3 py-2 bg-gray-600 text-white text-xs font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg v-if="isCheckingStorage" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    {{ isCheckingStorage ? 'Проверка...' : 'Проверить статус' }}
                  </button>
                  <button
                      @click="resetAllUsersTime"
                      :disabled="isResetting"
                      class="px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg v-if="isResetting" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    {{ isResetting ? 'Сброс...' : 'Сбросить все счетчики' }}
                  </button>
                </div>

                <!-- Сообщение для не-администраторов -->
                <div v-else class="mt-4">
                  <div class="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <p class="text-xs text-yellow-700">
                      Управление хранилищем доступно только администраторам портала.
                    </p>
                  </div>
                </div>
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
import { bitrixHelper } from '../helpers/app.js'

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

    // Статус хранилища
    const storageStats = ref({
      totalRecords: 0,
      totalTime: 0,
      lastUpdate: null,
      users: []
    })

    const isProcessing = ref(false)
    const isCheckingStorage = ref(false)
    const isResetting = ref(false)
    const isAdmin = ref(false)

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

    // ============== МЕТОДЫ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ==============

    /**
     * Форматирование длительности
     */
    const formatDuration = (seconds) => {
      if (!seconds || seconds === 0) return '0 сек'
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      const parts = []
      if (hours > 0) parts.push(`${hours} ч`)
      if (minutes > 0) parts.push(`${minutes} мин`)
      if (secs > 0 || parts.length === 0) parts.push(`${secs} сек`)
      return parts.join(' ')
    }

    /**
     * Форматирование даты
     */
    const formatDate = (dateString) => {
      if (!dateString) return 'Нет данных'
      return new Date(dateString).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    /**
     * Проверка статуса хранилища
     */
    const checkStorageStatus = async () => {
      try {
        isCheckingStorage.value = true

        // Получаем все записи из хранилища
        const storage = await bitrixHelper.getSavedTimeStorage()

        // Подсчитываем статистику
        const totalTime = storage.reduce((sum, item) => sum + (item.totalTime || 0), 0)
        const lastUpdate = storage.length > 0
            ? storage.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.updatedAt
            : null

        storageStats.value = {
          totalRecords: storage.length,
          totalTime: totalTime,
          lastUpdate: formatDate(lastUpdate),
          users: storage
        }

        // Показываем уведомление
        alert(`Статистика хранилища:\nВсего записей: ${storage.length}\nОбщее время: ${formatDuration(totalTime)}`)
      } catch (error) {
        console.error('Ошибка проверки хранилища:', error)
        alert('Ошибка при проверке хранилища')
      } finally {
        isCheckingStorage.value = false
      }
    }

    /**
     * Сброс времени всех пользователей (только для администратора)
     */
    const resetAllUsersTime = async () => {
      if (!confirm('Вы уверены, что хотите сбросить счетчики времени ВСЕХ пользователей? Это действие нельзя отменить.')) {
        return
      }

      try {
        isResetting.value = true

        // Сбрасываем через bitrixHelper
        const success = await bitrixHelper.resetAllUsersTime()

        if (success) {
          alert('Счетчики времени всех пользователей успешно сброшены!')
          // Обновляем статистику
          await checkStorageStatus()
        } else {
          alert('Ошибка при сбросе счетчиков')
        }
      } catch (error) {
        console.error('Ошибка сброса счетчиков:', error)
        alert('Ошибка при сбросе счетчиков')
      } finally {
        isResetting.value = false
      }
    }

    // ============== МЕТОДЫ ДЛЯ РАБОТЫ С ВСТРОЙКАМИ ==============

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

        await registerAllPlacements()
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
            const exists = await placementManager.checkStatus(placement.type, placement.handler)

            if (exists) {
              console.log(`Встройка ${placement.type} уже существует, удаляем...`)
              await placementManager.unbind(placement.type, placement.handler)
            }

            await placementManager.bind(placement.type, placement.handler)
            console.log(`Встройка ${placement.type} успешно зарегистрирована`)
          } catch (error) {
            console.error(`Ошибка при обработке встройки ${placement.type}:`, error)
          }
        }

        return true
      } catch (error) {
        console.error('Ошибка при регистрации встроек:', error)
        throw error
      }
    }

    // Инициализация
    const init = async () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          try {
            // Инициализируем bitrixHelper если нужно
            if (!bitrixHelper.isReady()) {
              await bitrixHelper.init()
            }

            // Проверяем права администратора
            isAdmin.value = bitrixHelper.isUserAdmin()

            // Проверяем статус встроек
            await checkPlacementsStatus()

            // Проверяем статус хранилища
            await checkStorageStatus()
          } catch (error) {
            console.error('Ошибка инициализации:', error)
          }
        })
      }
    }

    onMounted(() => {
      init()
    })

    return {
      placementsStatus,
      storageStats,
      isProcessing,
      isCheckingStorage,
      isResetting,
      isAdmin,
      formatDuration,
      updatePlacements,
      checkStorageStatus,
      resetAllUsersTime
    }
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>