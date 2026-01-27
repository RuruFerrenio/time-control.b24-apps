<template>
  <div class="lg:sticky lg:top-6 space-y-6">
    <!-- Карточка информации о приложении -->
    <B24Card>
      <div class="p-6">
        <div class="space-y-6">
          <!-- Логотип и название -->
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Автоматический контроль времени</h3>
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
                Список со временем
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
                  Все данные хранятся в защищенном хранилище Bitrix24 и доступны только авторизованным пользователям.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </B24Card>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const bitrixHelper = inject('bitrixHelper')

    const isAdmin = ref(false)
    const isStatisticsAvailable = ref(false)

    const isActiveRoute = (path) => {
      return router.currentRoute.value.path === path
    }

    onMounted(() => {
      // Проверяем, инициализирован ли bitrixHelper
      if (bitrixHelper && bitrixHelper.isReady()) {
        isAdmin.value = bitrixHelper.isUserAdmin()
        isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
      } else {
        // Если не инициализирован, пробуем инициализировать
        bitrixHelper.init().then(() => {
          isAdmin.value = bitrixHelper.isUserAdmin()
          isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
        }).catch(error => {
          console.error('Ошибка инициализации Bitrix24 в Sidebar:', error)
        })
      }
    })

    return {
      bitrixHelper,
      isAdmin,
      isStatisticsAvailable,
      isActiveRoute
    }
  }
}
</script>