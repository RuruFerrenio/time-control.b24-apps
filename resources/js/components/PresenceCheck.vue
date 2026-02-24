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

      <!-- Статус уведомления руководителю -->
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

      <!-- Статус создания записи в хранилище -->
      <div v-if="showStorageStatus && storageStatus === 'created'"
           class="mt-2 p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
        <div class="flex items-center justify-center text-sm">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span>Запись об отсутствии сохранена</span>
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
    const ENTITY_ID = 'pr_tracking' // Должно совпадать с entityId из StorageManager

    // Состояние
    const timeRemaining = ref(10)
    const initialTime = ref(10)
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
    const managersData = ref([])
    const isLoadingSettings = ref(false)

    // Статусы
    const managerNotificationStatus = ref(null)
    const showManagerNotificationStatus = ref(false)
    const storageStatus = ref(null) // 'created', 'error'
    const showStorageStatus = ref(false)

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

    const formattedTime = computed(() => {
      const minutes = Math.floor(totalTimeOnPage.value / 60)
      const seconds = totalTimeOnPage.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const progressPercentage = computed(() => {
      if (isConfirmed.value) return 100
      if (initialTime.value === 0) return 0
      return (timeRemaining.value / initialTime.value) * 100
    })

    const isLastTenPercent = computed(() => {
      if (initialTime.value === 0) return false
      const percentage = (timeRemaining.value / initialTime.value) * 100
      return percentage <= 10 && percentage > 0
    })

    // ==========================================================================
    // МЕТОД: Создание записи об отсутствии
    // ==========================================================================
    const createAbsenceRecord = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для создания записи об отсутствии')
        return false
      }

      try {
        // Получаем сегодняшнюю дату для секции
        const today = new Date().toISOString().split('T')[0]

        // Получаем существующую секцию для сегодняшнего дня
        const sections = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.section.get', {
            ENTITY: ENTITY_ID,
            FILTER: { NAME: today }
          }, (result) => {
            if (result.error()) reject(result.error())
            else resolve(result.data())
          })
        })

        // Если секция не найдена, это ошибка - секция должна существовать из основного скрипта
        if (sections.length === 0) {
          console.error('❌ Секция для сегодняшнего дня не найдена')
          return false
        }

        const sectionId = sections[0].ID

        // Создаем запись об отсутствии с уникальным именем
        const timestamp = Date.now()
        const absenceTime = new Date().toLocaleTimeString('ru-RU')
        const elementName = `${currentUser.value.name} - Отсутствие ${absenceTime} (${timestamp})`

        const itemId = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.item.add', {
            ENTITY: ENTITY_ID,
            NAME: elementName,
            SECTION: sectionId,
            PROPERTY_VALUES: {
              USER_ID: currentUser.value.id || 0,
              USER_NAME: currentUser.value.name || 'Неизвестный',
              PAGE_URL: '', // Пустая ссылка как требуется в задании
              PAGE_TITLE: document.title || 'Отсутствие на рабочем месте',
              PAGE_TIME: totalTimeOnPage.value, // Время отсутствия в секундах
              PAGE_CATEGORY: 'Время вне Битрикс24' // Специальная категория
            }
          }, (result) => {
            if (result.error()) reject(result.error())
            else resolve(result.data())
          })
        })

        console.log('✅ Запись об отсутствии создана:', {
          id: itemId,
          section: sectionId,
          section_date: today,
          user: currentUser.value.name,
          user_id: currentUser.value.id,
          time: totalTimeOnPage.value,
          category: 'Время вне Битрикс24',
          timestamp: timestamp
        })

        // Обновляем статус для отображения в UI
        storageStatus.value = 'created'
        showStorageStatus.value = true

        // Скрываем статус через 3 секунды
        setTimeout(() => {
          showStorageStatus.value = false
        }, 3000)

        return true

      } catch (error) {
        console.error('❌ Ошибка при создании записи об отсутствии:', error)
        storageStatus.value = 'error'
        return false
      }
    }

    // ==========================================================================
    // МЕТОД: Получение данных текущего пользователя
    // ==========================================================================
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

    // ==========================================================================
    // МЕТОД: Загрузка настроек контроля присутствия
    // ==========================================================================
    const loadPresenceSettings = async () => {
      if (!BX24 || !BX24.appOption) {
        console.warn('BX24 API недоступна для загрузки настроек')
        return null
      }

      try {
        isLoadingSettings.value = true

        const batchCalls = [
          'presence_control_enabled',
          'notify_manager_enabled',
          'notification_method',
          'absence_time_threshold'
        ]

        const results = {}

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

    // ==========================================================================
    // МЕТОД: Получение данных руководителя
    // ==========================================================================
    const loadManagersData = async () => {
      if (!BX24) {
        console.warn('BX24 API недоступна для загрузки данных руководителя')
        return []
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

        console.log('Данные текущего пользователя для поиска руководителей:', userData)

        if (!userData.UF_DEPARTMENT || !Array.isArray(userData.UF_DEPARTMENT) || userData.UF_DEPARTMENT.length === 0) {
          console.log('У пользователя нет отделов (UF_DEPARTMENT пуст)')
          return []
        }

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

        const managers = []
        const uniqueManagerIds = new Set()

        departments.forEach(department => {
          if (department.manager_user_id && !uniqueManagerIds.has(department.manager_user_id)) {
            uniqueManagerIds.add(department.manager_user_id)

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

    // ==========================================================================
    // МЕТОД: Отправка уведомления руководителям
    // ==========================================================================
    const sendManagerNotifications = async () => {
      try {
        managerNotificationStatus.value = 'sending'
        showManagerNotificationStatus.value = false

        const createStructuredMessage = () => {
          const fullMessage = `[SIZE=16][B]🚨 Отсутствие сотрудника на рабочем месте[/B][/SIZE]\n\n`
              + `👤 [B]Сотрудник:[/B] [USER=${currentUser.value.id}]${currentUser.value.name}[/USER]\n`
              + `📅 [B]Дата/время:[/B] ${new Date().toLocaleString('ru-RU')}\n`
              + `⏱️ [B]Время отсутствия:[/B] ${formatTime(totalTimeOnPage.value)}\n`
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

        managersData.value.forEach(manager => {
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

        const results = await Promise.allSettled(notificationPromises)
        const successful = results.filter(r =>
            r.status === 'fulfilled' && r.value.success
        ).length

        console.log(`Результаты отправки: ${successful}/${notificationPromises.length} успешно`)

        if (successful > 0) {
          managerNotificationStatus.value = 'sent'
          showManagerNotificationStatus.value = true

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

    // ==========================================================================
    // МЕТОД: Подтверждение присутствия
    // ==========================================================================
    const confirmPresence = () => {
      if (isConfirmed.value || timeRemaining.value <= 0) return

      isConfirmed.value = true

      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }

      toast.add({
        description: t('presenceCheck.successNotification'),
        variant: 'success'
      })

      setTimeout(() => {
        closeApplication()
      }, 2000)
    }

    // ==========================================================================
    // МЕТОД: Закрытие приложения
    // ==========================================================================
    const closeApplication = () => {
      if (typeof BX24 !== 'undefined' && typeof BX24.closeApplication === 'function') {
        console.log('Закрытие приложения...')
        BX24.closeApplication()
      } else {
        console.error('Функция BX24.closeApplication недоступна')
        window.close()
      }
    }

    // ==========================================================================
    // МЕТОД: Обработка истечения времени
    // ==========================================================================
    const handleTimeExpired = async () => {
      if (!isConfirmed.value) {
        if (timerInterval.value) {
          clearInterval(timerInterval.value)
          timerInterval.value = null
        }

        // 1. СОЗДАЕМ ЗАПИСЬ ОБ ОТСУТСТВИИ В ХРАНИЛИЩЕ
        const recordCreated = await createAbsenceRecord()

        // 2. Показываем уведомление
        toast.add({
          description: t('presenceCheck.absenceNotification'),
          variant: 'error',
          duration: 5000
        })

        // 3. Отправляем уведомление руководителю если нужно
        if (presenceSettings.value?.notifyManagerEnabled && managersData.value.length > 0) {
          console.log(`Отправка уведомлений ${managersData.value.length} руководителям...`)
          await sendManagerNotifications()
        }

        console.log('Время истекло, приложение остается открытым')
      }
    }

    // ==========================================================================
    // МЕТОД: Запуск таймера
    // ==========================================================================
    const startTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }

      timerInterval.value = setInterval(() => {
        if (timeRemaining.value > 0 && !isConfirmed.value) {
          timeRemaining.value--
          totalTimeOnPage.value++

          if (timeRemaining.value === 0) {
            handleTimeExpired()
          }
        } else if (timeRemaining.value <= 0) {
          clearInterval(timerInterval.value)
        }
      }, CHECK_INTERVAL)
    }

    // ==========================================================================
    // МЕТОД: Обработка закрытия страницы
    // ==========================================================================
    const setupBeforeUnload = () => {
      window.addEventListener('beforeunload', async (event) => {
        if (!isConfirmed.value && timeRemaining.value <= 0) {
          // Создаем запись при закрытии страницы, если время истекло
          await createAbsenceRecord()
        }
      })
    }

    // ==========================================================================
    // МЕТОД: Инициализация компонента
    // ==========================================================================
    const initializeComponent = async () => {
      console.log('Компонент PresenceCheck загружен с параметрами:', props.alertaParameters)

      totalTimeOnPage.value = trackingData.value.time_on_page || 0

      try {
        const user = await loadCurrentUser()
        currentUser.value = user
        console.log('Данные текущего пользователя:', user)

        const settings = await loadPresenceSettings()
        presenceSettings.value = settings

        let timerDuration = 10

        if (settings && settings.absenceTimeThreshold) {
          timerDuration = settings.absenceTimeThreshold
        }

        if (props.alertaParameters?.timerDuration) {
          timerDuration = props.alertaParameters.timerDuration
        }

        timeRemaining.value = timerDuration
        initialTime.value = timerDuration
        console.log(`Таймер установлен на ${timerDuration} секунд`)

        if (settings?.notifyManagerEnabled) {
          const managers = await loadManagersData()
          managersData.value = managers

          if (managers.length === 0) {
            console.log('Уведомления руководителю включены, но руководители не найдены')
          } else {
            console.log(`Найдено ${managers.length} руководителей для уведомления`)
          }
        }

        // Настраиваем обработчик закрытия страницы
        setupBeforeUnload()

        // Запускаем таймер
        startTimer()

      } catch (error) {
        console.error('Ошибка инициализации компонента:', error)
        startTimer()
      }
    }

    // ==========================================================================
    // Хуки жизненного цикла
    // ==========================================================================
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

    onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
    })

    return {
      timeRemaining,
      isConfirmed,
      currentUser,
      trackingData,
      presenceSettings,
      managersData,
      isLoadingSettings,
      managerNotificationStatus,
      showManagerNotificationStatus,
      storageStatus,
      showStorageStatus,
      formattedTime,
      remainingFormattedTime,
      progressPercentage,
      isLastTenPercent,
      confirmPresence,
      formatTime
    }
  }
}
</script>

<style scoped>
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

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

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
</style>