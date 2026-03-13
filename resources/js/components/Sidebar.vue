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
              <h3 class="text-lg font-semibold text-gray-900">Чистое время</h3>
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

              <!-- Пункт карта активности виден только администраторам -->
              <router-link
                  to="/activity-map"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="isActiveRoute('/activity-map') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                Карта активности
              </router-link>

              <!-- Ссылка на статистику рабочего дня с проверкой тарифа -->
              <router-link
                  to="/workday-statistics"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  :class="isActiveRoute('/workday-statistics') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Статистика рабочего дня
              </router-link>

              <!-- Ссылка Развитие проекта (только для администраторов) -->
              <a
                  v-if="isAdmin"
                  href="https://forms.yandex.ru/u/69ac34e6505690a2bcabb0f4"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Развитие проекта
              </a>

              <!-- Заглушка для обычных пользователей -->
              <div
                  v-else
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                  title="Доступно только администраторам"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Развитие проекта
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
                  href="mailto:technogalera@yandex.ru?subject=Поддержка приложения Чистое время"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Данные об активности пользователей хранятся во внутреннем персональном хранилище портала Bitrix24.
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
          <div class="rounded-lg p-4 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div>
                  <p class="text-xs text-gray-600">Ваше сохраненное время:</p>
                  <p class="text-xl font-semibold text-blue-700">{{ formatSavedTime(mySavedTime) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">Ваш вклад:</p>
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
            <B24Button
                @click="handleReview"
                class="w-full justify-center"
                color="air-primary"
                size="md"
                title="Скоро..."
                disabled=""
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
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
(function(w,d,u){
  var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
  var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
})(window,document,'https://cdn-ru.bitrix24.ru/b37062684/crm/site_button/loader_2_byevyu.js');

import { ref, onMounted, onUnmounted, inject, computed } from 'vue'
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
    const isGenerating = ref(false)

    // Проверка активного маршрута
    const isActiveRoute = (path) => {
      return router.currentRoute.value.path === path
    }

    const isSettingsPage = computed(() => {
      return router.currentRoute.value.path === '/settings'
    })

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

    // Функция для генерации тестовых данных
    // Функция для генерации тестовых данных
    const generateTestData = async () => {
      if (!isAdmin.value || isGenerating.value) return

      isGenerating.value = true
      console.log('🚀 Начинаю генерацию тестовых данных...')

      try {
        const userId = currentUserId.value || await bitrixHelper.getCurrentUserId()
        const userName = await bitrixHelper.getUserNameById(userId) || 'Тестовый пользователь'
        const domain = window.location.hostname

        // Категории с путями для разных сущностей
        const categories = [
          // Сделки
          { name: 'CRM › Сделки', path: '/crm/deal/', weight: 30, ids: 1000 },
          // Лиды
          { name: 'CRM › Лиды', path: '/crm/lead/', weight: 20, ids: 800 },
          // Контакты
          { name: 'CRM › Контакты', path: '/crm/contact/', weight: 15, ids: 600 },
          // Компании
          { name: 'CRM › Компании', path: '/crm/company/', weight: 10, ids: 400 },
          // Счета
          { name: 'CRM › Счета', path: '/crm/invoice/', weight: 8, ids: 300 },
          // Предложения
          { name: 'CRM › Предложения', path: '/crm/quote/', weight: 7, ids: 250 },
          // Задачи
          { name: 'Задачи и Проекты › Задачи', path: '/company/personal/user/1/tasks/', weight: 25, ids: 500 },
          // Лента
          { name: 'Совместная работа › Лента', path: '/stream/', weight: 10, ids: 50 },
          // Календарь
          { name: 'Совместная работа › Календарь', path: '/calendar/', weight: 5, ids: 100 },
          // Диск
          { name: 'Совместная работа › Диск', path: '/docs/', weight: 5, ids: 200 }
        ]

        const sections = {}
        const today = new Date()
        let created = 0
        const totalToCreate = 500

        for (let i = 0; i < totalToCreate; i++) {
          try {
            // Случайная дата за последние 60 дней
            const randomDay = Math.floor(Math.random() * 60)
            const date = new Date(today)
            date.setDate(date.getDate() - randomDay)
            const dateStr = date.toISOString().split('T')[0]

            // Получаем или создаем секцию
            if (!sections[dateStr]) {
              const sectionsList = await bitrixHelper.executeBatch([
                ['entity.section.get', {
                  ENTITY: 'pr_tracking',
                  FILTER: { NAME: dateStr }
                }]
              ])

              if (sectionsList[0] && sectionsList[0].length > 0) {
                sections[dateStr] = parseInt(sectionsList[0][0].ID)
              } else {
                const newSection = await bitrixHelper.executeBatch([
                  ['entity.section.add', {
                    ENTITY: 'pr_tracking',
                    NAME: dateStr
                  }]
                ])
                sections[dateStr] = parseInt(newSection[0])
              }
            }

            // Выбираем случайную категорию с учетом веса
            let randomCat
            const randomWeight = Math.floor(Math.random() * 100) + 1
            let weightSum = 0

            for (const cat of categories) {
              weightSum += cat.weight
              if (randomWeight <= weightSum) {
                randomCat = cat
                break
              }
            }

            if (!randomCat) randomCat = categories[0]

            // Генерируем ID сущности
            const entityId = Math.floor(Math.random() * randomCat.ids) + 1

            // Формируем URL как в примере
            const pageUrl = `https://${domain}${randomCat.path}${entityId}/`

            // Генерируем заголовок
            let pageTitle
            if (randomCat.name.includes('Сделки')) {
              pageTitle = `Сделка #${entityId} - ${['ООО "Ромашка"', 'АО "ТехноСервис"', 'ИП Иванов', 'ООО "Глобал Трейд"', 'ЗАО "СтройИнвест"'][Math.floor(Math.random() * 5)]}`
            } else if (randomCat.name.includes('Лиды')) {
              pageTitle = `Лид #${entityId} - ${['Анна Петрова', 'Сергей Смирнов', 'Елена Козлова', 'Дмитрий Морозов', 'Ольга Новикова'][Math.floor(Math.random() * 5)]}`
            } else if (randomCat.name.includes('Контакты')) {
              pageTitle = `${['Иван Петров', 'Мария Сидорова', 'Алексей Иванов', 'Наталья Соколова', 'Павел Медведев'][Math.floor(Math.random() * 5)]}`
            } else if (randomCat.name.includes('Компании')) {
              pageTitle = `${['ООО "Ромашка"', 'АО "ТехноСервис"', 'ИП Иванов', 'ООО "Глобал Трейд"', 'ЗАО "СтройИнвест"'][Math.floor(Math.random() * 5)]}`
            } else if (randomCat.name.includes('Задачи')) {
              pageTitle = `Задача #${entityId}: ${['Создать отчет', 'Позвонить клиенту', 'Подготовить договор', 'Отправить КП', 'Согласовать бюджет'][Math.floor(Math.random() * 5)]}`
            } else {
              pageTitle = `${randomCat.name.split(' › ').pop()} - ${entityId}`
            }

            // Генерируем случайное время (от 1 минуты до 3 часов)
            const pageTime = Math.floor(Math.random() * 10800) + 60

            // Создаем запись
            await bitrixHelper.executeBatch([
              ['entity.item.add', {
                ENTITY: 'pr_tracking',
                NAME: `${userName} - ${randomCat.name} #${entityId}`,
                SECTION: sections[dateStr],
                PROPERTY_VALUES: {
                  USER_ID: userId,
                  USER_NAME: userName,
                  PAGE_URL: pageUrl,
                  PAGE_TITLE: pageTitle,
                  PAGE_TIME: pageTime,
                  PAGE_CATEGORY: randomCat.name
                }
              }]
            ])

            created++

            if (created % 50 === 0) {
              console.log(`📊 Прогресс: ${created}/${totalToCreate} записей`)
              // Небольшая задержка чтобы не перегружать API
              await new Promise(resolve => setTimeout(resolve, 100))
            }

          } catch (error) {
            console.error(`❌ Ошибка при создании записи ${i + 1}:`, error)
          }
        }

        console.log(`✅ Генерация завершена! Создано ${created} записей`)

        // Обновляем счетчики
        await loadSavedTime()

        // Показываем статистику
        console.log('📊 Статистика по категориям:')
        const stats = {}
        for (const cat of categories) {
          stats[cat.name] = 0
        }
        // Здесь можно добавить подсчет созданных записей по категориям

      } catch (error) {
        console.error('❌ Ошибка при генерации тестовых данных:', error)
      } finally {
        isGenerating.value = false
      }
    }

    // Загрузка всех данных о времени
    const loadSavedTime = async () => {
      try {
        isLoading.value = true

        if (bitrixHelper && bitrixHelper.isReady()) {
          if (!currentUserId.value) {
            currentUserId.value = await bitrixHelper.getCurrentUserId()
          }

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

    // Обновление счетчика
    const refreshSavedTime = async () => {
      await loadSavedTime()
    }

    // Обработчики кнопок
    const handleReview = () => {}

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

        if (bitrixHelper && bitrixHelper.isReady()) {
          isAdmin.value = bitrixHelper.isUserAdmin()
          isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
          currentUserId.value = await bitrixHelper.getCurrentUserId()
          await loadSavedTime()
        } else {
          await bitrixHelper.init()
          isAdmin.value = bitrixHelper.isUserAdmin()
          isStatisticsAvailable.value = bitrixHelper.isStatisticsAvailable()
          currentUserId.value = await bitrixHelper.getCurrentUserId()
          await loadSavedTime()
        }

        console.log('generate')
        //setTimeout(() => generateTestData(), 2000)

      } catch (error) {
        console.error('Ошибка инициализации Sidebar:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      await initialize()
      window.updateSidebarSavedTime = refreshSavedTime
      window.addEventListener('saved-time-update', handleTimeUpdate)
    })

    onUnmounted(() => {
      if (window.updateSidebarSavedTime) {
        delete window.updateSidebarSavedTime
      }
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
      handleReview,
      isSettingsPage,
      isGenerating
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