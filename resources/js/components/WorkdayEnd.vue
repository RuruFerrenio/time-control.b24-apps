<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white p-4">
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
        {{ isEnded ? 'Рабочий день завершен' : 'Завершение рабочего дня' }}
      </h1>

      <!-- Подзаголовок -->
      <p class="text-gray-600 mb-8" v-if="!isEnded">
        Завершите рабочий день, чтобы зафиксировать отработанное время
      </p>
      <p class="text-gray-600 mb-8" v-else>
        Рабочий день успешно завершен
      </p>

      <!-- Информация о текущем рабочем дне (если есть) -->
      <div v-if="workdayInfo && !isEnded" class="mb-6 p-4 bg-gray-50 rounded-lg text-left">
        <h3 class="font-semibold text-gray-700 mb-2">Текущий рабочий день:</h3>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Начало:</span>
            <span class="font-medium">{{ formatDateTime(workdayInfo.TIME_START) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Длительность:</span>
            <span class="font-medium">{{ workdayInfo.DURATION || '00:00:00' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Перерывы:</span>
            <span class="font-medium">{{ workdayInfo.TIME_LEAKS || '00:00:00' }}</span>
          </div>
          <div v-if="workdayInfo.TIME_FINISH_DEFAULT" class="flex justify-between text-blue-600">
            <span>Рекомендуемое завершение:</span>
            <span class="font-medium">{{ formatDateTime(workdayInfo.TIME_FINISH_DEFAULT) }}</span>
          </div>
        </div>
      </div>

      <!-- Кнопка завершения рабочего дня -->
      <div class="mb-8" v-if="!isEnded">
        <B24Button
            @click="endWorkday"
            :disabled="isEnding || isEnded"
            variant="primary"
            size="lg"
            class="w-full h-20 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            :class="{
                'bg-orange-600 hover:bg-orange-700 text-white hover:text-white': !isEnding && !isEnded,
                'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300': isEnding || isEnded,
                'shadow-md hover:shadow-lg': !isEnding && !isEnded
            }"
        >
          <div class="flex items-center justify-center">
            <span v-if="!isEnding && !isEnded">
              Завершить рабочий день
            </span>
            <span v-else-if="isEnding" class="flex items-center">
              <svg class="w-6 h-6 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Завершаем...
            </span>
            <span v-else-if="isEnded" class="flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 13l4 4L19 7" />
              </svg>
              Рабочий день завершен
            </span>
          </div>
        </B24Button>
      </div>

      <!-- Кнопка закрытия после успешного завершения -->
      <div class="mb-8" v-else>
        <B24Button
            @click="closeApplication"
            variant="primary"
            size="lg"
            class="w-full h-20 rounded-full text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
            Закрыть
          </div>
        </B24Button>
      </div>

      <!-- Статус -->
      <div v-if="statusMessage" class="text-sm mb-2" :class="statusClass">
        {{ statusMessage }}
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
        <div class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-sm font-medium">{{ error }}</span>
        </div>
      </div>

      <!-- Итоговая информация после завершения -->
      <div v-if="workdayInfo && isEnded" class="mt-6 p-4 bg-green-50 rounded-lg text-left border border-green-200">
        <h3 class="font-semibold text-green-800 mb-2">Итоги рабочего дня:</h3>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-green-700">Начало:</span>
            <span class="font-medium text-green-800">{{ formatDateTime(workdayInfo.TIME_START) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-green-700">Окончание:</span>
            <span class="font-medium text-green-800">{{ formatDateTime(workdayInfo.TIME_FINISH) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-green-700">Отработано:</span>
            <span class="font-medium text-green-800">{{ workdayInfo.DURATION || '00:00:00' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-green-700">Перерывы:</span>
            <span class="font-medium text-green-800">{{ workdayInfo.TIME_LEAKS || '00:00:00' }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-green-200 mt-2">
            <span class="text-green-700 font-semibold">Статус:</span>
            <span class="font-semibold text-green-800">{{ getStatusText(workdayInfo.STATUS) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомления -->
    <B24NotificationContainer position="top-right" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

export default {
  name: 'WorkdayEnd',

  props: {
    // Параметры из режима alerta
    alertaParameters: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const toast = useToast()

    // Состояние
    const isEnding = ref(false)
    const isEnded = ref(false)
    const error = ref(null)
    const statusMessage = ref('')
    const workdayInfo = ref(null)

    // Данные пользователя
    const currentUser = ref({
      id: 0,
      name: 'Сотрудник',
      lastName: '',
      email: ''
    })

    // Вычисляемые свойства
    const statusClass = computed(() => {
      if (error.value) return 'text-red-600 font-medium'
      if (isEnded.value) return 'text-green-600 font-medium'
      return 'text-gray-500'
    })

    // Методы
    const getStatusText = (status) => {
      const statusMap = {
        'OPENED': 'Открыт',
        'CLOSED': 'Закрыт',
        'PAUSED': 'Приостановлен',
        'EXPIRED': 'Истек'
      }
      return statusMap[status] || status
    }

    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return '—'
      try {
        const date = new Date(dateTimeStr)
        return date.toLocaleString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch {
        return dateTimeStr
      }
    }

    // Функция форматирования даты в формат ATOM (ISO-8601)
    const formatDateToATOM = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const timezoneOffset = date.getTimezoneOffset();
      const absOffset = Math.abs(timezoneOffset);
      const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
      const offsetMinutes = String(absOffset % 60).padStart(2, '0');
      const offsetSign = timezoneOffset <= 0 ? '+' : '-';

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    }

    // Получение данных текущего пользователя
    const loadCurrentUser = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для загрузки данных пользователя')
        return {
          id: 0,
          name: 'Тестовый пользователь',
          lastName: '',
          email: ''
        }
      }

      try {
        const userData = await new Promise((resolve, reject) => {
          BX24.callMethod('user.current', {}, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Данные пользователя из user.current:', userData)

        const fullName = userData.NAME || ''
        const lastName = userData.LAST_NAME || ''

        let displayName = ''
        if (fullName || lastName) {
          displayName = `${fullName} ${lastName}`.trim()
        } else if (userData.EMAIL) {
          displayName = userData.EMAIL.split('@')[0]
        } else {
          displayName = `Сотрудник ${userData.ID}`
        }

        return {
          id: parseInt(userData.ID) || 0,
          name: displayName,
          lastName: lastName,
          email: userData.EMAIL || ''
        }

      } catch (error) {
        console.warn('Ошибка при получении user.current:', error)

        try {
          const authData = BX24.getAuth()
          if (authData && authData.user_id) {
            return {
              id: parseInt(authData.user_id),
              name: authData.user_name || `Сотрудник ${authData.user_id}`,
              lastName: '',
              email: authData.user_email || ''
            }
          }
        } catch (authError) {
          console.warn('Ошибка при получении BX24.getAuth():', authError)
        }

        return {
          id: 0,
          name: 'Сотрудник',
          lastName: '',
          email: ''
        }
      }
    }

    // Получение текущего статуса рабочего дня
    const getCurrentWorkdayStatus = async () => {
      if (!BX24) return null

      try {
        const result = await new Promise((resolve, reject) => {
          BX24.callMethod('timeman.status', {}, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Текущий статус рабочего дня:', result)
        return result
      } catch (error) {
        console.error('Ошибка получения статуса рабочего дня:', error)
        return null
      }
    }

    // Завершить рабочий день
    const endWorkday = async () => {
      if (isEnding.value || isEnded.value) return

      // Сбрасываем предыдущие ошибки
      error.value = null
      statusMessage.value = ''

      // Проверяем наличие BX24
      if (!BX24) {
        error.value = 'API Битрикс24 недоступно'
        toast.add({
          description: error.value,
          variant: 'error'
        })
        return
      }

      try {
        isEnding.value = true
        statusMessage.value = 'Завершаем рабочий день...'

        // Получаем текущий статус рабочего дня
        const status = await getCurrentWorkdayStatus()
        console.log('Текущий статус рабочего дня перед завершением:', status)

        // Проверяем, можно ли завершить рабочий день
        if (!status || status.STATUS === 'CLOSED') {
          error.value = 'Рабочий день уже завершен'
          statusMessage.value = error.value
          toast.add({
            description: error.value,
            variant: 'warning'
          })
          isEnded.value = true
          workdayInfo.value = status
          return
        }

        // Подготавливаем параметры для завершения
        const params = {}

        // Добавляем ID пользователя, если он есть
        if (currentUser.value.id && currentUser.value.id > 0) {
          params.USER_ID = currentUser.value.id
        }

        // Добавляем текущее время в формате ATOM
        const now = new Date()
        params.TIME = formatDateToATOM(now)

        // Если есть рекомендованное время завершения, используем его
        if (status && status.TIME_FINISH_DEFAULT) {
          params.TIME = status.TIME_FINISH_DEFAULT
        }

        // Добавляем причину (можно добавить поле для ввода в будущем)
        if (status && status.STATUS === 'EXPIRED') {
          params.REPORT = 'Завершение истекшего рабочего дня'
        }

        console.log('Завершаем рабочий день с параметрами:', params)

        // Вызываем метод timeman.close
        const result = await new Promise((resolve, reject) => {
          BX24.callMethod('timeman.close', params, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Результат завершения рабочего дня:', result)

        // Сохраняем информацию о рабочем дне
        workdayInfo.value = result

        // Успешное завершение
        isEnded.value = true
        statusMessage.value = 'Рабочий день успешно завершен'

        // Показываем уведомление
        toast.add({
          description: 'Рабочий день успешно завершен',
          variant: 'success'
        })

      } catch (err) {
        console.error('Ошибка при завершении рабочего дня:', err)

        // Обработка специфических ошибок
        let errorMessage = err.error_description || err.message || 'Неизвестная ошибка'

        // Парсим код ошибки если есть
        if (err.error === 'WRONG_DATETIME') {
          errorMessage = 'Дата завершения рабочего дня должна совпадать с датой начала'
        } else if (err.error === 'WRONG_DATETIME_FORMAT') {
          errorMessage = 'Неверный формат даты. Используйте формат ATOM (ISO-8601)'
        } else if (err.error === 'ACCESS_DENIED' || err.error === 'insufficient_scope') {
          errorMessage = 'Недостаточно прав для выполнения операции'
        } else if (err.error === 'USER_NOT_FOUND' || err.message?.includes('User not found')) {
          errorMessage = 'Пользователь не найден'
        } else if (err.error === 'REPORT_REQUIRED') {
          errorMessage = 'Необходимо указать причину завершения рабочего дня'
        }

        error.value = errorMessage
        statusMessage.value = errorMessage

        toast.add({
          description: errorMessage,
          variant: 'error'
        })

      } finally {
        isEnding.value = false
      }
    }

    const closeApplication = () => {
      if (typeof BX24 !== 'undefined' && typeof BX24.closeApplication === 'function') {
        console.log('Закрытие приложения...')
        BX24.closeApplication()
      } else {
        console.error('Функция BX24.closeApplication недоступна')
        window.close()
      }
    }

    // Инициализация компонента
    const initializeComponent = async () => {
      console.log('Компонент WorkdayEnd загружен с параметрами:', props.alertaParameters)

      try {
        // Загружаем данные текущего пользователя
        const user = await loadCurrentUser()
        currentUser.value = user
        console.log('Данные текущего пользователя:', user)

        // Проверяем текущий статус рабочего дня
        const status = await getCurrentWorkdayStatus()
        if (status) {
          workdayInfo.value = status

          // Если рабочий день уже завершен
          if (status.STATUS === 'CLOSED') {
            isEnded.value = true
            statusMessage.value = 'Рабочий день уже завершен'
          }
        }

      } catch (error) {
        console.error('Ошибка инициализации компонента:', error)
      }
    }

    // Хуки жизненного цикла
    onMounted(() => {
      if (typeof BX24 !== 'undefined') {
        if (BX24.init) {
          BX24.init(async () => {
            await initializeComponent()
          })
        } else {
          initializeComponent()
        }
      } else {
        console.log('Режим разработки: BX24 не обнаружен')
        initializeComponent()
      }
    })

    return {
      // Состояние
      isEnding,
      isEnded,
      error,
      statusMessage,
      workdayInfo,
      currentUser,

      // Вычисляемые свойства
      statusClass,

      // Методы
      endWorkday,
      closeApplication,
      getStatusText,
      formatDateTime
    }
  }
}
</script>

<style scoped>
/* Анимация вращения для спиннера */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Анимация для кнопки */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.active\:scale-95:active {
  transform: scale(0.95);
}
</style>