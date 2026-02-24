<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white p-4">
    <!-- Таймер в правом верхнем углу -->
    <div class="absolute top-4 right-4">
      <div class="flex items-center space-x-2 text-gray-600">
        <B24Badge variant="outline" class="text-sm font-mono">
          ⏱️ {{ remainingFormattedTime }}
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
                'bg-green-600 hover:bg-green-700 text-white hover:text-white': !isConfirmed && timeRemaining > 0,
                'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300': isConfirmed || timeRemaining <= 0,
                'shadow-md hover:shadow-lg': !isConfirmed && timeRemaining > 0
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
              class="h-full transition-all duration-300 ease-linear"
              :class="{
              'bg-green-600': isConfirmed,
              'bg-blue-600': !isConfirmed && timeRemaining > 0 && !isLastTenPercent,
              'bg-red-600': !isConfirmed && timeRemaining > 0 && isLastTenPercent,
              'bg-red-600': !isConfirmed && timeRemaining <= 0
            }"
              :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Статус уведомления руководителю (только если есть руководители и отправка успешна) -->
      <div v-if="showManagerNotificationStatus && managerNotificationStatus === 'sent'"
           class="mt-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
        <div class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm font-medium">Руководитель уведомлен об отсутствии</span>
        </div>
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
    const CHECK_INTERVAL = 1000 // 1 секунда

    // Состояние
    const timeRemaining = ref(10) // Значение по умолчанию
    const initialTime = ref(10) // Начальное время для расчета прогресса
    const isConfirmed = ref(false)
    const timerInterval = ref(null)
    const totalTimeOnPage = ref(0)

    // Состояние для пользователя
    const currentUser = ref({
      id: 0,
      name: 'Сотрудник',
      lastName: '',
      secondName: '',
      email: '',
      workPosition: '',
      profileUrl: ''
    })

    // Состояние для настроек и данных руководителя
    const presenceSettings = ref(null)
    const managersData = ref([]) // Может быть несколько руководителей
    const isLoadingSettings = ref(false)

    // Статус уведомления руководителю
    const managerNotificationStatus = ref(null) // 'sending', 'sent', 'error'
    const showManagerNotificationStatus = ref(false)

    // Данные отслеживания из параметров
    const trackingData = computed(() => {
      return props.alertaParameters?.tracking_data || {
        page_url: 'unknown',
        time_on_page: 0,
        opened_at: new Date().toISOString(),
        user_id: currentUser.value.id || 0
      }
    })

    const remainingFormattedTime = computed(() => {
      if (timeRemaining.value <= 0) return '00:00'
      const minutes = Math.floor(timeRemaining.value / 60)
      const seconds = timeRemaining.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Вычисляемые свойства
    const formattedTime = computed(() => {
      const minutes = Math.floor(totalTimeOnPage.value / 60)
      const seconds = totalTimeOnPage.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const progressPercentage = computed(() => {
      if (isConfirmed.value) return 100
      if (initialTime.value === 0) return 0
      // Инвертируем прогресс: от 100% до 0%
      return (timeRemaining.value / initialTime.value) * 100
    })

    const isLastTenPercent = computed(() => {
      if (initialTime.value === 0) return false
      const percentage = (timeRemaining.value / initialTime.value) * 100
      return percentage <= 10 && percentage > 0
    })

    // Методы
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Получение данных текущего пользователя
    const loadCurrentUser = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для загрузки данных пользователя')
        return {
          id: 0,
          name: 'Тестовый пользователь',
          lastName: '',
          secondName: '',
          email: '',
          workPosition: '',
          profileUrl: ''
        }
      }

      try {
        // Способ 1: Используем метод user.current
        const userData = await new Promise((resolve, reject) => {
          BX24.callMethod('user.current', {}, (result) => {
            if (result.error()) {
              // Если метод не работает, пробуем способ 2
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Данные пользователя из user.current:', userData)

        // Формируем полное имя
        const fullName = userData.NAME || userData.FIRST_NAME || ''
        const lastName = userData.LAST_NAME || ''
        const secondName = userData.SECOND_NAME || ''

        let displayName = ''
        if (fullName || lastName) {
          displayName = `${fullName} ${lastName}`.trim()
          if (secondName) {
            displayName = `${lastName} ${fullName} ${secondName}`.trim()
          }
        } else if (userData.NAME) {
          displayName = userData.NAME
        } else if (userData.EMAIL) {
          displayName = userData.EMAIL.split('@')[0]
        } else {
          displayName = `Сотрудник ${userData.ID}`
        }

        return {
          id: userData.ID || 0,
          name: displayName,
          lastName: lastName,
          secondName: secondName,
          email: userData.EMAIL || '',
          workPosition: userData.WORK_POSITION || '',
          profileUrl: `/company/personal/user/${userData.ID || 0}/`
        }

      } catch (error) {
        console.warn('Ошибка при получении user.current:', error)

        try {
          // Способ 2: Используем BX24.getAuth если user.current не работает
          const authData = BX24.getAuth()
          console.log('Данные из BX24.getAuth():', authData)

          if (authData && authData.user_id) {
            return {
              id: authData.user_id,
              name: authData.user_name || `Сотрудник ${authData.user_id}`,
              lastName: '',
              secondName: '',
              email: authData.user_email || '',
              workPosition: '',
              profileUrl: `/company/personal/user/${authData.user_id}/`
            }
          }
        } catch (authError) {
          console.warn('Ошибка при получении BX24.getAuth():', authError)
        }

        // Способ 3: Пробуем получить через profile если доступно
        if (typeof BX24.profile !== 'undefined') {
          try {
            const profile = BX24.profile()
            console.log('Данные из BX24.profile():', profile)

            return {
              id: profile.id || 0,
              name: profile.name || `Сотрудник ${profile.id || 0}`,
              lastName: '',
              secondName: '',
              email: profile.email || '',
              workPosition: '',
              profileUrl: profile.id ? `/company/personal/user/${profile.id}/` : ''
            }
          } catch (profileError) {
            console.warn('Ошибка при получении BX24.profile():', profileError)
          }
        }

        // Если все методы не сработали, возвращаем значения по умолчанию
        return {
          id: 0,
          name: 'Сотрудник',
          lastName: '',
          secondName: '',
          email: '',
          workPosition: '',
          profileUrl: ''
        }
      }
    }

    // Загрузка настроек контроля присутствия
    const loadPresenceSettings = async () => {
      if (!BX24 || !BX24.appOption) {
        console.warn('BX24 API недоступна для загрузки настроек')
        return null
      }

      try {
        isLoadingSettings.value = true

        // Загружаем все необходимые настройки
        const batchCalls = [
          'presence_control_enabled',
          'notify_manager_enabled',
          'notification_method',
          'absence_time_threshold'
        ]

        const results = {}

        // Выполняем все запросы параллельно
        await Promise.all(batchCalls.map(async (key) => {
          try {
            const value = await BX24.appOption.get(key)
            results[key] = value
          } catch (error) {
            console.warn(`Не удалось загрузить настройку ${key}:`, error)
            results[key] = null
          }
        }))

        const settings = {
          presenceControlEnabled: results.presence_control_enabled === 'Y',
          notifyManagerEnabled: results.notify_manager_enabled === 'Y',
          notificationMethod: results.notification_method || 'chat',
          absenceTimeThreshold: results.absence_time_threshold ? parseInt(results.absence_time_threshold) : 300
        }

        console.log('Настройки контроля присутствия загружены:', settings)
        return settings

      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
        // Возвращаем значения по умолчанию
        return {
          presenceControlEnabled: false,
          notifyManagerEnabled: false,
          notificationMethod: 'chat',
          absenceTimeThreshold: 300
        }
      } finally {
        isLoadingSettings.value = false
      }
    }

    // Получение данных руководителя через отдел
    const loadManagersData = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для загрузки данных руководителя')
        return []
      }

      try {
        // Получаем данные текущего пользователя, включая отделы
        const userData = await new Promise((resolve, reject) => {
          BX24.callMethod('user.current', {}, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Данные текущего пользователя для поиска руководителей:', userData)

        if (!userData.UF_DEPARTMENT || !Array.isArray(userData.UF_DEPARTMENT) || userData.UF_DEPARTMENT.length === 0) {
          console.log('У пользователя нет отделов (UF_DEPARTMENT пуст)')
          return []
        }

        // Получаем информацию об отделах с данными руководителей
        const departments = await new Promise((resolve, reject) => {
          BX24.callMethod('im.department.get', {
            ID: userData.UF_DEPARTMENT,
            USER_DATA: 'Y'
          }, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              resolve(result.data())
            }
          })
        })

        console.log('Данные отделов:', departments)

        // Собираем всех руководителей отделов
        const managers = []
        const uniqueManagerIds = new Set()

        departments.forEach(department => {
          if (department.manager_user_id && !uniqueManagerIds.has(department.manager_user_id)) {
            uniqueManagerIds.add(department.manager_user_id)

            // Используем данные из manager_user_data если они есть
            if (department.manager_user_data) {
              const manager = department.manager_user_data
              const fullName = manager.NAME || manager.FIRST_NAME || ''
              const lastName = manager.LAST_NAME || ''
              const secondName = manager.SECOND_NAME || ''

              let displayName = ''
              if (fullName || lastName) {
                displayName = `${fullName} ${lastName}`.trim()
                if (secondName) {
                  displayName = `${lastName} ${fullName} ${secondName}`.trim()
                }
              } else {
                displayName = manager.NAME || `Руководитель ${manager.id}`
              }

              managers.push({
                id: manager.id,
                name: displayName,
                email: manager.email,
                position: manager.work_position,
                profileUrl: `/company/personal/user/${manager.id}/`
              })
            } else {
              managers.push({
                id: department.manager_user_id,
                name: `Руководитель ${department.manager_user_id}`,
                email: null,
                position: null,
                profileUrl: `/company/personal/user/${department.manager_user_id}/`
              })
            }
          }
        })

        console.log('Найдены руководители:', managers)
        return managers

      } catch (error) {
        console.error('Ошибка загрузки данных руководителя:', error)
        return []
      }
    }

    // Отправка уведомления руководителям
    const sendManagerNotifications = async () => {
      try {
        managerNotificationStatus.value = 'sending'
        showManagerNotificationStatus.value = false

        // Формируем структурированное сообщение с BB-кодами
        const createStructuredMessage = () => {
          const userProfileLink = `/company/personal/user/${currentUser.value.id}/`
          const trackingTime = totalTimeOnPage.value
          const trackingUrl = trackingData.value.page_url || 'неизвестная страница'

          // Форматируем время
          const formatDuration = (seconds) => {
            if (!seconds) return '0 сек'
            const hours = Math.floor(seconds / 3600)
            const minutes = Math.floor((seconds % 3600) / 60)
            const secs = seconds % 60
            const parts = []
            if (hours > 0) parts.push(`${hours} ч`)
            if (minutes > 0) parts.push(`${minutes} мин`)
            if (secs > 0 || parts.length === 0) parts.push(`${secs} сек`)
            return parts.join(' ')
          }

          const fullMessage = `[SIZE=16][B]🚨 Отсутствие сотрудника на рабочем месте[/B][/SIZE]\n\n`
              + `👤 [B]Сотрудник:[/B] [USER=${currentUser.value.id}]${currentUser.value.name}[/USER]\n`
              + `📅 [B]Дата/время:[/B] ${new Date().toLocaleString('ru-RU')}\n`
              + `────────────────────\n`
              + `[SIZE=12][COLOR=#666666]Уведомление сгенерировано автоматически[/COLOR][/SIZE]`

          return {
            shortMessage: `${currentUser.value.name} отсутствует на рабочем месте`,
            detailedMessage: fullMessage,
            attach: [{
              MESSAGE: fullMessage,
              COLOR_TOKEN: "alert"
            }]
          }
        }

        const messageData = createStructuredMessage()
        const notificationPromises = []

        // Отправляем уведомление каждому руководителю
        managersData.value.forEach(manager => {
          // Отправляем push-уведомление если нужно
          if (presenceSettings.value.notificationMethod === 'push' ||
              presenceSettings.value.notificationMethod === 'all') {

            notificationPromises.push(
                new Promise((resolve, reject) => {
                  BX24.callMethod('im.notify.personal.add', {
                    USER_ID: manager.id,
                    MESSAGE: messageData.shortMessage,
                    ATTACH: messageData.attach,
                    TAG: `PRESENCE_ABSENCE_${Date.now()}_${manager.id}`,
                    SUB_TAG: `ABSENCE|${currentUser.value.id}|${Date.now()}`,
                    PARAMS: {
                      URL: trackingData.value.page_url,
                      USER_ID: currentUser.value.id,
                      USER_NAME: currentUser.value.name,
                      MANAGER_ID: manager.id,
                      TIMESTAMP: new Date().toISOString()
                    }
                  }, (result) => {
                    if (result.error()) {
                      console.error(`Ошибка push-уведомления руководителю ${manager.id}:`, result.error())
                      resolve({ manager, type: 'push', success: false, error: result.error() })
                    } else {
                      console.log(`Push-уведомление отправлено руководителю ${manager.name}`)
                      resolve({ manager, type: 'push', success: true })
                    }
                  })
                })
            )
          }

          // Отправляем сообщение в чат если нужно
          if (presenceSettings.value.notificationMethod === 'chat' ||
              presenceSettings.value.notificationMethod === 'all') {

            notificationPromises.push(
                new Promise((resolve, reject) => {
                  BX24.callMethod('im.message.add', {
                    DIALOG_ID: manager.id.toString(),
                    MESSAGE: '',
                    ATTACH: messageData.attach,
                    SYSTEM: 'N'
                  }, (result) => {
                    if (result.error()) {
                      console.error(`Ошибка отправки в чат руководителю ${manager.id}:`, result.error())
                      resolve({ manager, type: 'chat', success: false, error: result.error() })
                    } else {
                      console.log(`Сообщение отправлено в чат руководителю ${manager.name}`)
                      resolve({ manager, type: 'chat', success: true })
                    }
                  })
                })
            )
          }
        })

        // Ждем результаты отправки
        const results = await Promise.allSettled(notificationPromises)
        const successful = results.filter(r =>
            r.status === 'fulfilled' && r.value.success
        ).length

        console.log(`Результаты отправки: ${successful}/${notificationPromises.length} успешно`)

        if (successful > 0) {
          managerNotificationStatus.value = 'sent'
          showManagerNotificationStatus.value = true

          // Скрываем статус через 3 секунды
          setTimeout(() => {
            showManagerNotificationStatus.value = false
          }, 3000)
        } else {
          managerNotificationStatus.value = null
        }

      } catch (error) {
        console.error('Критическая ошибка отправки уведомлений:', error)
        managerNotificationStatus.value = null
        showManagerNotificationStatus.value = false
      }
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

    const handleTimeExpired = async () => {
      if (!isConfirmed.value) {
        // Останавливаем таймер
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }


        // ПРОВЕРЯЕМ РАБОЧЕЕ ВРЕМЯ
        const isWorkTime = await isCurrentWorkTime()

        if (isWorkTime) {
          // Если рабочее время - создаем запись об отсутствии
          await createAbsenceRecord()
          console.log('✅ Запись создана (рабочее время)')
        } else {
          // Если нерабочее время - только логируем
          console.log('Нерабочее время, запись не создана')
        }

        // Показываем уведомление о том, что отсутствие зафиксировано
        toast.add({
          description: t('presenceCheck.absenceNotification'),
          variant: 'error',
          duration: 5000 // Показываем 5 секунд
        })

        // Проверяем настройки и отправляем уведомление руководителю если нужно
        if (presenceSettings.value?.notifyManagerEnabled && managersData.value.length > 0) {
          console.log(`Отправка уведомлений ${managersData.value.length} руководителям...`)
          await sendManagerNotifications()
        } else {
          console.log('Уведомления руководителю не отправлены: либо отключены, либо руководители не найдены')
        }

        // ПРИЛОЖЕНИЕ НЕ ЗАКРЫВАЕТСЯ - просто остается на экране с информацией
        console.log('Время истекло, приложение остается открытым')
      }
    }

    // Метод для проверки, является ли текущее время рабочим
    const isCurrentWorkTime = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для проверки рабочего времени')
        return true // По умолчанию считаем рабочим
      }

      try {
        // Получаем настройки рабочего времени текущего пользователя
        const settings = await new Promise((resolve, reject) => {
          BX24.callMethod('timeman.settings', {
            USER_ID: currentUser.value.id
          }, (result) => {
            if (result.error()) reject(result.error())
            else resolve(result.data())
          })
        })

        // Если учет времени не включен или свободный график - всегда рабочее
        if (!settings || !settings.UF_TIMEMAN || settings.UF_TM_FREE) {
          return true
        }

        // Парсим текущее время
        const now = new Date()
        const currentMinutes = now.getHours() * 60 + now.getMinutes()

        // Парсим время начала и окончания рабочего дня
        const parseTimeToMinutes = (timeStr) => {
          if (!timeStr) return null
          const [hours, minutes] = timeStr.split(':').map(Number)
          return hours * 60 + minutes
        }

        const startMinutes = parseTimeToMinutes(settings.UF_TM_MAX_START)
        const endMinutes = parseTimeToMinutes(settings.UF_TM_MIN_FINISH)

        if (!startMinutes || !endMinutes) return true

        // Проверяем, находится ли текущее время в рабочем интервале
        const isWorkTime = currentMinutes >= startMinutes && currentMinutes <= endMinutes

        console.log('Проверка рабочего времени:', {
          current: `${now.getHours()}:${now.getMinutes()}`,
          start: settings.UF_TM_MAX_START,
          end: settings.UF_TM_MIN_FINISH,
          isWorkTime
        })

        return isWorkTime

      } catch (error) {
        console.error('Ошибка при проверке рабочего времени:', error)
        return true // В случае ошибки считаем рабочим
      }
    }

    // Метод для создания записи об отсутствии
    const createAbsenceRecord = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для создания записи об отсутствии')
        return
      }

      try {
        const entityId = 'pr_tracking'
        const today = new Date().toISOString().split('T')[0]

        // Получаем секцию для сегодняшнего дня
        const sections = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.section.get', {
            ENTITY: entityId,
            FILTER: { NAME: today }
          }, (result) => {
            if (result.error()) reject(result.error())
            else resolve(result.data())
          })
        })

        if (sections.length === 0) {
          console.error('❌ Секция для сегодняшнего дня не найдена')
          return
        }

        const sectionId = sections[0].ID
        const timestamp = Date.now()
        const absenceTime = new Date().toLocaleTimeString('ru-RU')
        const elementName = `${currentUser.value.name} - Отсутствие ${absenceTime} (${timestamp})`

        const itemId = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.item.add', {
            ENTITY: entityId,
            NAME: elementName,
            SECTION: sectionId,
            PROPERTY_VALUES: {
              USER_ID: currentUser.value.id || 0,
              USER_NAME: currentUser.value.name || 'Неизвестный',
              PAGE_URL: elementName,
              PAGE_TITLE: document.title || 'Отсутствие на рабочем месте',
              PAGE_TIME: totalTimeOnPage.value,
              PAGE_CATEGORY: 'Время вне Битрикс24'
            }
          }, (result) => {
            if (result.error()) reject(result.error())
            else resolve(result.data())
          })
        })

        console.log('✅ Запись об отсутствии создана:', itemId)

        toast.add({
          description: 'Запись об отсутствии сохранена',
          variant: 'info'
        })

      } catch (error) {
        console.error('❌ Ошибка при создании записи об отсутствии:', error)
      }
    }

    // Запуск таймера
    const startTimer = () => {
      // Останавливаем предыдущий таймер если есть
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }

      // Запускаем новый таймер
      timerInterval.value = setInterval(() => {
        if (timeRemaining.value > 0 && !isConfirmed.value) {
          timeRemaining.value--
          totalTimeOnPage.value++
          console.log(`Осталось времени: ${timeRemaining.value}с, прогресс: ${progressPercentage.value.toFixed(1)}%`)

          if (timeRemaining.value === 0) {
            handleTimeExpired()
          }
        } else if (timeRemaining.value <= 0) {
          clearInterval(timerInterval.value)
        }
      }, CHECK_INTERVAL)
    }

    // Инициализация компонента
    const initializeComponent = async () => {
      console.log('Компонент PresenceCheck загружен с параметрами:', props.alertaParameters)

      // Обновляем общее время на странице
      totalTimeOnPage.value = trackingData.value.time_on_page || 0

      try {
        // Загружаем данные текущего пользователя
        const user = await loadCurrentUser()
        currentUser.value = user
        console.log('Данные текущего пользователя:', user)

        // Загружаем настройки
        const settings = await loadPresenceSettings()
        presenceSettings.value = settings

        // Устанавливаем время таймера из настроек
        let timerDuration = 10 // По умолчанию
        let timerSource = 'по умолчанию'

        if (settings && settings.absenceTimeThreshold) {
          timerDuration = settings.absenceTimeThreshold
          timerSource = 'из настроек'
        }

        // Если в параметрах alerta есть timerDuration, используем его (приоритет)
        if (props.alertaParameters?.timerDuration) {
          timerDuration = props.alertaParameters.timerDuration
          timerSource = 'из параметров alerta'
        }

        timeRemaining.value = timerDuration
        initialTime.value = timerDuration
        console.log(`Таймер установлен на ${timerDuration} секунд (${timerSource})`)

        // Загружаем данные руководителей только если включены уведомления
        if (settings?.notifyManagerEnabled) {
          const managers = await loadManagersData()
          managersData.value = managers

          if (managers.length === 0) {
            console.log('Уведомления руководителю включены, но руководители не найдены')
          } else {
            console.log(`Найдено ${managers.length} руководителей для уведомления`)
          }
        }

        // Запускаем таймер
        startTimer()

      } catch (error) {
        console.error('Ошибка инициализации компонента:', error)

        // Запускаем таймер с дефолтными значениями
        startTimer()
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

    onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
    })

    return {
      // Состояние
      timeRemaining,
      isConfirmed,
      currentUser,
      trackingData,
      presenceSettings,
      managersData,
      isLoadingSettings,
      managerNotificationStatus,
      showManagerNotificationStatus,

      // Вычисляемые свойства
      formattedTime,
      remainingFormattedTime,
      progressPercentage,
      isLastTenPercent,

      // Методы
      confirmPresence,
      formatTime,
      createAbsenceRecord,
      isCurrentWorkTime
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

/* Анимация вращения для статуса отправки */
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

/* Стили для ссылки на профиль */
a {
  transition: color 0.2s ease;
}
</style>