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
        Рабочий день не начат
      </h1>

      <!-- Подзаголовок -->
      <p class="text-gray-600 mb-8">
        Начните рабочий день, чтобы фиксировать рабочее время
      </p>

      <!-- Кнопка начала рабочего дня -->
      <div class="mb-8">
        <B24Button
            @click="startWorkday"
            :disabled="isStarting || isStarted"
            variant="primary"
            size="lg"
            class="w-full h-20 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            :class="{
                'bg-green-600 hover:bg-green-700 text-white hover:text-white': !isStarting && !isStarted,
                'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300': isStarting || isStarted,
                'shadow-md hover:shadow-lg': !isStarting && !isStarted
            }"
        >
          <div class="flex items-center justify-center">
            <span v-if="!isStarting && !isStarted">
              Начать рабочий день
            </span>
            <span v-else-if="isStarting" class="flex items-center">
              <svg class="w-6 h-6 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Начинаем...
            </span>
            <span v-else-if="isStarted" class="flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 13l4 4L19 7" />
              </svg>
              Рабочий день начат
            </span>
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
    </div>

    <!-- Уведомления -->
    <B24NotificationContainer position="top-right" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

export default {
  name: 'WorkdayStart',

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
    const isStarting = ref(false)
    const isStarted = ref(false)
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
      if (isStarted.value) return 'text-green-600 font-medium'
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
      // Получаем компоненты даты
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      // Получаем смещение часового пояса в минутах
      const timezoneOffset = date.getTimezoneOffset();
      const absOffset = Math.abs(timezoneOffset);
      const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
      const offsetMinutes = String(absOffset % 60).padStart(2, '0');
      // Если местное время впереди UTC, offset отрицательный, значит знак +
      const offsetSign = timezoneOffset <= 0 ? '+' : '-';

      // Формат ATOM: YYYY-MM-DDTHH:MM:SS±HH:MM
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
        // Пробуем получить через user.current
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

        // Формируем имя
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

        // Пробуем получить через getAuth
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

        // Возвращаем значения по умолчанию
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

    // Начать рабочий день
    const startWorkday = async () => {
      if (isStarting.value || isStarted.value) return

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
        isStarting.value = true
        statusMessage.value = 'Начинаем рабочий день...'

        // Получаем текущий статус рабочего дня
        const status = await getCurrentWorkdayStatus()
        console.log('Текущий статус рабочего дня:', status)

        let result

        // В зависимости от статуса используем разные методы
        if (!status || status.STATUS === 'CLOSED') {
          // Если рабочий день закрыт или его нет - используем timeman.open с TIME
          const now = new Date()
          const atomTime = formatDateToATOM(now)

          const params = {
            //TIME: atomTime
          }

          if (currentUser.value.id && currentUser.value.id > 0) {
            params.USER_ID = currentUser.value.id
          }

          console.log('Открываем новый рабочий день с параметрами:', params)

          result = await new Promise((resolve, reject) => {
            BX24.callMethod('timeman.open', params, (result) => {
              if (result.error()) {
                reject(result.error())
              } else {
                resolve(result.data())
              }
            })
          })

        } else if (status.STATUS === 'PAUSED') {
          // Если рабочий день приостановлен - используем timeman.resume без TIME
          console.log('Возобновляем приостановленный рабочий день')

          const params = {}

          if (currentUser.value.id && currentUser.value.id > 0) {
            params.USER_ID = currentUser.value.id
          }

          result = await new Promise((resolve, reject) => {
            BX24.callMethod('timeman.resume', params, (result) => {
              if (result.error()) {
                reject(result.error())
              } else {
                resolve(result.data())
              }
            })
          })

        } else if (status.STATUS === 'OPENED') {
          // Если уже открыт - просто показываем информацию
          console.log('Рабочий день уже открыт')
          result = status
          isStarted.value = true
          statusMessage.value = 'Рабочий день уже начат'
        } else {
          // Для других статусов используем timeman.open без TIME?
          console.log('Неизвестный статус, пробуем открыть без времени')

          const params = {}

          if (currentUser.value.id && currentUser.value.id > 0) {
            params.USER_ID = currentUser.value.id
          }

          result = await new Promise((resolve, reject) => {
            BX24.callMethod('timeman.open', params, (result) => {
              if (result.error()) {
                reject(result.error())
              } else {
                resolve(result.data())
              }
            })
          })
        }

        console.log('Результат операции:', result)

        // Сохраняем информацию о рабочем дне
        workdayInfo.value = result

        // Успешный старт
        isStarted.value = true
        statusMessage.value = 'Рабочий день успешно начат'

        // Показываем уведомление
        toast.add({
          description: 'Рабочий день успешно начат',
          variant: 'success'
        })

        // Ждем 2 секунды и закрываем приложение
        setTimeout(() => {
          closeApplication()
        }, 2000)

      } catch (err) {
        console.error('Ошибка при начале рабочего дня:', err)

        // Обработка специфических ошибок
        let errorMessage = err.error_description || err.message || 'Неизвестная ошибка'

        // Парсим код ошибки если есть
        if (err.error === 'WRONG_DATETIME') {
          errorMessage = 'Дата открытия рабочего дня должна совпадать с текущей календарной датой'
        } else if (err.error === 'WRONG_DATETIME_FORMAT') {
          errorMessage = 'Неверный формат даты. Используйте формат ATOM (ISO-8601)'
        } else if (err.error === 'TIME') {
          errorMessage = 'Нельзя установить время для приостановленного рабочего дня. Рабочий день возобновлен автоматически.'

          // Пробуем возобновить без TIME
          try {
            console.log('Пробуем возобновить рабочий день без параметра TIME...')

            const params = {}
            if (currentUser.value.id && currentUser.value.id > 0) {
              params.USER_ID = currentUser.value.id
            }

            const result = await new Promise((resolve, reject) => {
              BX24.callMethod('timeman.resume', params, (result) => {
                if (result.error()) {
                  reject(result.error())
                } else {
                  resolve(result.data())
                }
              })
            })

            console.log('Рабочий день успешно возобновлен:', result)

            workdayInfo.value = result
            isStarted.value = true
            statusMessage.value = 'Рабочий день возобновлен'

            toast.add({
              description: 'Рабочий день успешно возобновлен',
              variant: 'success'
            })

            setTimeout(() => {
              closeApplication()
            }, 2000)

            return // Выходим, чтобы не показывать ошибку

          } catch (resumeError) {
            console.error('Ошибка при возобновлении:', resumeError)
            errorMessage = 'Не удалось возобновить рабочий день'
          }
        } else if (err.error === 'ACCESS_DENIED' || err.error === 'insufficient_scope') {
          errorMessage = 'Недостаточно прав для выполнения операции'
        } else if (err.error === 'USER_NOT_FOUND' || err.message?.includes('User not found')) {
          errorMessage = 'Пользователь не найден'
        }

        error.value = errorMessage
        statusMessage.value = errorMessage

        toast.add({
          description: errorMessage,
          variant: 'error'
        })

      } finally {
        isStarting.value = false
      }
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

    // Инициализация компонента
    const initializeComponent = async () => {
      console.log('Компонент WorkdayStart загружен с параметрами:', props.alertaParameters)

      try {
        // Загружаем данные текущего пользователя
        const user = await loadCurrentUser()
        currentUser.value = user
        console.log('Данные текущего пользователя:', user)

        // Проверяем текущий статус рабочего дня
        const status = await getCurrentWorkdayStatus()
        if (status && status.STATUS === 'OPENED') {
          isStarted.value = true
          workdayInfo.value = status
          statusMessage.value = 'Рабочий день уже начат'
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
          // BX24 уже инициализирован
          initializeComponent()
        }
      } else {
        // Режим разработки без BX24
        console.log('Режим разработки: BX24 не обнаружен')
        initializeComponent()
      }
    })

    return {
      // Состояние
      isStarting,
      isStarted,
      error,
      statusMessage,
      workdayInfo,
      currentUser,

      // Вычисляемые свойства
      statusClass,

      // Методы
      startWorkday,
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