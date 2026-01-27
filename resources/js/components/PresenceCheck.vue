<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white p-4">
    <!-- Таймер в правом верхнем углу -->
    <div class="absolute top-4 right-4">
      <div class="flex items-center space-x-2 text-gray-600">
        <B24Badge variant="outline" class="text-sm font-mono">
          ⏱️ {{ formattedTime }}
        </B24Badge>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="text-center w-full">
      <!-- Иконка -->
      <div class="mb-8 flex justify-center">
        <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Заголовок -->
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t('presenceCheck.title') }}
      </h1>

      <!-- Подзаголовок -->
      <p class="text-gray-600 mb-8">
        {{ $t('presenceCheck.description') }}
      </p>

      <!-- Кнопка подтверждения -->
      <div class="mb-8">
        <B24Button
            @click="confirmPresence"
            :disabled="isConfirmed || timeRemaining <= 0"
            variant="primary"
            size="lg"
            class="w-full h-20 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            :class="{
            'bg-green-600 hover:bg-green-700': !isConfirmed && timeRemaining > 0,
            'bg-gray-400 cursor-not-allowed': isConfirmed || timeRemaining <= 0
          }"
        >
          <div class="flex items-center justify-center">
            <span v-if="!isConfirmed && timeRemaining > 0">
              {{ $t('presenceCheck.confirmButton') }}
            </span>
            <span v-else-if="isConfirmed" class="flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 13l4 4L19 7" />
              </svg>
              {{ $t('presenceCheck.confirmed') }}
            </span>
            <span v-else>
              {{ $t('presenceCheck.timeExpired') }}
            </span>
          </div>
        </B24Button>
      </div>

      <!-- Сообщение о таймере -->
      <div class="text-sm text-gray-500 mb-2">
        <span v-if="timeRemaining > 0">
          {{ $t('presenceCheck.timeRemaining') }}: {{ formatTime(timeRemaining) }}
        </span>
        <span v-else-if="!isConfirmed" class="text-red-600 font-medium">
          {{ $t('presenceCheck.timeExpiredMessage') }}
        </span>
        <span v-else class="text-green-600 font-medium">
          {{ $t('presenceCheck.confirmedMessage') }}
        </span>
      </div>

      <!-- Индикатор прогресса -->
      <div class="w-full mx-auto mb-6">
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
              class="h-full transition-all duration-1000 ease-linear"
              :class="{
              'bg-green-600': isConfirmed,
              'bg-blue-600': !isConfirmed && timeRemaining > 0,
              'bg-red-600': !isConfirmed && timeRemaining <= 0
            }"
              :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          <strong>{{ $t('presenceCheck.trackingInfo') }}:</strong><br>
          {{ $t('presenceCheck.pageUrl') }}: {{ trackingData.page_url }}<br>
          {{ $t('presenceCheck.timeOnPage') }}: {{ formatTime(trackingData.time_on_page) }}<br>
          {{ $t('presenceCheck.openedAt') }}: {{ formatDate(trackingData.opened_at) }}
        </p>
      </div>
    </div>

    <!-- Уведомления -->
    <B24NotificationContainer position="top-right" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'
import { useI18n } from 'vue-i18n'

export default {
  name: 'PresenceCheck',

  props: {
    // Параметры из режима alerta
    alertaParameters: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const { t } = useI18n()
    const toast = useToast()

    // Константы
    const TOTAL_TIME = 10 // 10 секунд
    const CHECK_INTERVAL = 1000 // 1 секунда

    // Состояние
    const timeRemaining = ref(TOTAL_TIME)
    const isConfirmed = ref(false)
    const timerInterval = ref(null)
    const totalTimeOnPage = ref(0)

    // Данные отслеживания из параметров
    const trackingData = computed(() => {
      return props.alertaParameters?.tracking_data || {
        page_url: 'unknown',
        time_on_page: 0,
        opened_at: new Date().toISOString()
      }
    })

    // Вычисляемые свойства
    const formattedTime = computed(() => {
      const minutes = Math.floor(totalTimeOnPage.value / 60)
      const seconds = totalTimeOnPage.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const progressPercentage = computed(() => {
      if (isConfirmed.value) return 100
      return ((TOTAL_TIME - timeRemaining.value) / TOTAL_TIME) * 100
    })

    // Методы
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const confirmPresence = () => {
      if (isConfirmed.value || timeRemaining.value <= 0) return

      isConfirmed.value = true

      // Останавливаем таймер
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }

      // Показываем уведомление об успехе
      toast.add({
        description: t('presenceCheck.successNotification'),
        variant: 'success'
      })

      // Ждем 2 секунды и закрываем приложение
      setTimeout(() => {
        closeApplication()
      }, 2000)
    }

    const closeApplication = () => {
      if (typeof BX24 !== 'undefined' && typeof BX24.closeApplication === 'function') {
        console.log('Закрытие приложения...')
        BX24.closeApplication()
      } else {
        console.error('Функция BX24.closeApplication недоступна')
        // Альтернативный способ закрытия
        window.close()
      }
    }

    const handleTimeExpired = () => {
      if (!isConfirmed.value) {
        // Показываем уведомление о том, что отсутствие зафиксировано
        toast.add({
          description: t('presenceCheck.absenceNotification'),
          variant: 'error',
          duration: 0 // Не исчезает автоматически
        })

        // Здесь можно отправить данные о неактивности на сервер
        sendAbsenceData()
      }
    }

    const sendAbsenceData = () => {
      // Отправка данных о неактивности
      const absenceData = {
        user_id: trackingData.value.user_id,
        page_url: trackingData.value.page_url,
        total_time_on_page: trackingData.value.time_on_page,
        absence_time: TOTAL_TIME,
        timestamp: new Date().toISOString(),
        status: 'absence_confirmed'
      }

      console.log('Данные об отсутствии:', absenceData)
      // TODO: Реализовать отправку данных на сервер
    }

    // Хуки жизненного цикла
    onMounted(() => {
      console.log('Компонент PresenceCheck загружен с параметрами:', props.alertaParameters)

      // Обновляем общее время на странице
      totalTimeOnPage.value = trackingData.value.time_on_page

      // Запускаем таймер обратного отсчета
      timerInterval.value = setInterval(() => {
        if (timeRemaining.value > 0 && !isConfirmed.value) {
          timeRemaining.value--
          totalTimeOnPage.value++
          console.log(`Осталось времени: ${timeRemaining.value}с`)

          if (timeRemaining.value === 0) {
            handleTimeExpired()
          }
        } else if (timeRemaining.value <= 0) {
          clearInterval(timerInterval.value)
        }
      }, CHECK_INTERVAL)
    })

    onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
    })

    return {
      // Состояние
      timeRemaining,
      isConfirmed,
      trackingData,

      // Вычисляемые свойства
      formattedTime,
      progressPercentage,

      // Методы
      confirmPresence,
      formatTime,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Анимация пульсации для кнопки */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Анимация для индикатора прогресса */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>