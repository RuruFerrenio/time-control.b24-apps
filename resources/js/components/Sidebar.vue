<template>
  <div class="lg:sticky lg:top-6 space-y-6">
    <!-- Карточка информации о приложении -->
    <B24Card>
      <div class="p-0 md:p-6">
        <div class="space-y-6">
          <!-- Логотип и название -->
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Чистое время в Битрикс24</h3>
              <p class="text-sm text-gray-500">Версия 1.0.0</p>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900">Меню</h4>
            <!-- Панель навигации -->
            <nav class="space-y-2">
              <router-link
                  to="/time-list"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="isActiveRoute('/time-list') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                История посещений
              </router-link>

              <!-- Ссылка на статистику рабочего дня с проверкой тарифа -->
              <router-link
                  v-if="isStatisticsAvailable"
                  to="/workday-statistics"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="isActiveRoute('/workday-statistics') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Статистика рабочего дня
              </router-link>

              <!-- Заглушка для статистики если тариф не поддерживается -->
              <div
                  v-else
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                  :title="bitrixHelper.getStatisticsTooltip()"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Статистика рабочего дня
              </div>

              <!-- Пункт настроек виден только администраторам -->
              <router-link
                  v-if="isAdmin"
                  to="/settings"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="isActiveRoute('/settings') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Настройки
              </router-link>

              <!-- Заглушка для обычных пользователей -->
              <div
                  v-else
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                  title="Доступно только администраторам"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Настройки
              </div>
            </nav>
          </div>

          <!-- Быстрые ссылки -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900">Справка и поддержка</h4>
            <div class="space-y-2">
              <a
                  href="mailto:it.galera@yandex.ru?subject=Поддержка приложения Автоматический контроль времени"
                  class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Техническая поддержка
              </a>
            </div>
          </div>

          <!-- Информация о безопасности -->
          <div class="pt-4 border-t">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div>
                <p class="text-xs text-gray-600">
                  Данные об активности пользователей хранятся во внутреннем персональном хранилище портала Bitrix24 и не записываются в базу данных приложения.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </B24Card>

    <!-- Карточка со счетчиком времени -->
    <B24Card>
      <div class="p-0 md:p-6">
        <div class="space-y-4">
          <!-- Заголовок блока -->
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-semibold text-gray-900">Сохраненное время</h4>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>

          <!-- Общий счетчик -->
          <div class="text-center py-4">
            <div class="text-3xl font-bold text-green-600 mb-2">
              {{ formatSavedTime(totalSavedTime) }}
            </div>
            <p class="text-sm text-gray-500">
              Общее сохраненное время всех сотрудников
            </p>
          </div>

          <!-- Счетчик текущего пользователя -->
          <div class="bg-gray-50 rounded-lg p-4 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div>
                  <p class="text-xs text-gray-600">Ваше сохраненное время</p>
                  <p class="text-xl font-semibold text-blue-700">{{ formatSavedTime(mySavedTime) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">Доля от общего</p>
                <p class="text-lg font-medium text-blue-700">{{ myPercentage }}%</p>
              </div>
            </div>

            <!-- Прогресс-бар -->
            <div class="mt-3">
              <div class="w-full bg-blue-200 rounded-full h-2">
                <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${myPercentage}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="space-y-3 pt-4 border-t border-gray-200">
            <!-- Кнопка поддержать -->
            <B24Button
                @click="handleSupport"
                class="w-full justify-center"
                color="air-secondary"
                size="md"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
              </svg>
              Поддержать проект
            </B24Button>

            <!-- Кнопка оставить отзыв -->
            <B24Button
                @click="handleReview"
                class="w-full justify-center"
                color="air-primary"
                size="md"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
              Оставить отзыв
            </B24Button>
          </div>

          <!-- Информация о том, что такое сохраненное время -->
          <div class="pt-4 border-t border-gray-200">
            <div class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-xs text-gray-600">
                Чистое время, проведенное в Битрикс24, закрепленное пользователями за задачами с помощью приложения
              </p>
            </div>
          </div>
        </div>
      </div>
    </B24Card>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const bitrixHelper = inject('bitrixHelper')

    // Состояния
    const isAdmin = ref(false)
    const isStatisticsAvailable = ref(false)
    const totalSavedTime = ref(0)
    const mySavedTime = ref(0)
    const myPercentage = ref(0)
    const currentUserId = ref(null)
    const isLoading = ref(true)

    // Проверка активного маршрута
    const isActiveRoute = (path) => {
      return router.currentRoute.value.path === path
    }

    // Форматирование времени
    const formatSavedTime = (seconds) => {
      if (!seconds && seconds !== 0) return '0 сек'
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      const parts = []
      if (hours > 0) parts.push(`${hours} ч`)
      if (minutes > 0) parts.push(`${minutes} мин`)
      if (secs > 0 || parts.length === 0) parts.push(`${secs} сек`)
      return parts.join(' ')
    }

    // Загрузка всех данных о времени
    const loadSavedTime = async () => {
      try {
        isLoading.value = true

        if (bitrixHelper && bitrixHelper.isReady()) {
          // Получаем ID текущего пользователя
          if (!currentUserId.value) {
            currentUserId.value = await bitrixHelper.getCurrentUserId()
          }

          // Загружаем все данные параллельно
          const [total, userTime, percentage] = await Promise.all([
            bitrixHelper.getTotalSavedTime(),
            bitrixHelper.getUserSavedTime(currentUserId.value),
            bitrixHelper.getUserPercentage(currentUserId.value)
          ])

          totalSavedTime.value = total || 0
          mySavedTime.value = userTime || 0
          myPercentage.value = percentage || 0
        }
      } catch (error) {
        console.error('Ошибка загрузки сохраненного времени:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Обновление счетчика (вызывается из других компонентов)
    const refreshSavedTime = async () => {
      await loadSavedTime()
    }

    // Обработчики кнопок
    const handleSupport = () => {
      console.log('Поддержка проекта')
      // TODO: Реализовать логику поддержки проекта
    }

    const handleReview = () => {
      console.log('Оставить отзыв')
      // TODO: Реализовать логику отзыва
    }

    // Слушатель событий обновления времени
    const handleTimeUpdate = (event) => {
      if (event.detail) {
        refreshSavedTime()
      }
    }

    // Инициализация
    const initialize = async () => {
      try {
        isLoading.value = true

        // Проверяем, инициализирован ли bitrixHelper
        if (bitrixHelper && bitrixHelper.isReady()) {
          isAdmin.value = bitrixHelper.isUserAdmin()
          isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
          currentUserId.value = await bitrixHelper.getCurrentUserId()
          await loadSavedTime()
        } else {
          // Если не инициализирован, пробуем инициализировать
          await bitrixHelper.init()
          isAdmin.value = bitrixHelper.isUserAdmin()
          isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
          currentUserId.value = await bitrixHelper.getCurrentUserId()
          await loadSavedTime()

          // Выполняем миграцию данных, если нужно
          await bitrixHelper.migrateFromOldFormat()
        }
      } catch (error) {
        console.error('Ошибка инициализации Sidebar:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      await initialize()

      // Создаем глобальную функцию для обновления счетчика из других компонентов
      window.updateSidebarSavedTime = refreshSavedTime

      // Подписываемся на событие обновления времени
      window.addEventListener('saved-time-update', handleTimeUpdate)
    })

    onUnmounted(() => {
      // Удаляем глобальную функцию при размонтировании компонента
      if (window.updateSidebarSavedTime) {
        delete window.updateSidebarSavedTime
      }

      // Отписываемся от события
      window.removeEventListener('saved-time-update', handleTimeUpdate)
    })

    return {
      bitrixHelper,
      isAdmin,
      isStatisticsAvailable,
      totalSavedTime,
      mySavedTime,
      myPercentage,
      isLoading,
      isActiveRoute,
      formatSavedTime,
      handleSupport,
      handleReview
    }
  }
}
</script>

<style scoped>
/* Анимация для прогресс-бара */
.bg-blue-600 {
  transition: width 0.3s ease-in-out;
}

/* Стили для неактивных ссылок */
.cursor-not-allowed {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }
}
</style>