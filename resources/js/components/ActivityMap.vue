<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        title="Карта активности"
        description="Сводная статистика посещений страниц всеми сотрудниками за всё время"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2">
        <!-- Карта активности -->
        <B24Card>
          <div class="p-0 md:p-6">
            <div class="space-y-4 md:space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Карта активности
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Сводные данные по посещенным страницам за всё время
                  </p>
                </div>
                <div class="flex flex-row space-x-2 w-full md:w-40">
                  <B24Button
                      @click="loadAllData"
                      :disabled="isLoading"
                      color="air-primary"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Обновить
                  </B24Button>
                </div>
              </div>

              <!-- Прелоадер при загрузке -->
              <div v-if="isLoading" class="text-center py-12">
                <svg class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <p class="text-sm text-gray-500">Загрузка данных...</p>
              </div>

              <!-- Данные -->
              <div v-else-if="!isLoading && processedData.length > 0">
                <B24TableWrapper
                    class="overflow-x-auto w-full border border-gray-200 rounded-lg"
                    size="sm"
                    zebra
                    row-hover
                    :b24ui="{
                      base: '[&>table>thead>tr]:border-gray-200 [&>table>tbody>tr]:border-gray-100'
                    }"
                >
                  <table class="min-w-full">
                    <!-- Заголовок таблицы -->
                    <thead class="bg-gray-50">
                    <tr>
                      <th class="text-left font-medium text-gray-700">Категория</th>
                      <th class="text-left font-medium text-gray-700">Страница</th>
                      <th class="text-left font-medium text-gray-700">Общее время</th>
                      <th class="text-left font-medium text-gray-700">Кол-во сотрудников</th>
                      <th class="text-left font-medium text-gray-700">Среднее время</th>
                      <th class="text-left font-medium text-gray-700">Сотрудники</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(page, index) in processedData" :key="index" class="hover:bg-gray-50">
                      <!-- Категория в виде бейджа -->
                      <td class="text-sm">
                        <B24Badge :class="getCategoryBadgeClass(page.category)">
                          {{ page.category || 'Без категории' }}
                        </B24Badge>
                      </td>

                      <!-- URL страницы -->
                      <td class="text-sm">
                        <a
                            :href="page.url"
                            target="_blank"
                            class="text-blue-600 hover:text-blue-800 hover:underline break-all"
                            :title="page.url"
                        >
                          {{ page.url }}
                        </a>
                      </td>

                      <!-- Общее время -->
                      <td class="text-sm font-medium">{{ formatDuration(page.totalTime) }}</td>

                      <!-- Количество сотрудников -->
                      <td class="text-sm">
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ page.employeeCount }}
                          </span>
                      </td>

                      <!-- Среднее время -->
                      <td class="text-sm">{{ formatDuration(page.averageTime) }}</td>

                      <!-- Список сотрудников -->
                      <td class="text-sm">
                        <div class="flex flex-col space-y-1 max-w-xs">
                          <div
                              v-for="employee in page.employees.slice(0, showAllEmployees[index] ? undefined : 3)"
                              :key="employee.userId"
                              class="flex items-center space-x-2"
                          >
                            <B24User
                                :name="employee.userName"
                                size="xs"
                                :avatar="{
                                      src: getUserPhoto(employee.userId),
                                      initials: getUserInitials(employee.userName)
                                  }"
                                :chip="{
                                      color: getOnlineStatus(employee.userId) === 'Y'
                                          ? 'air-primary-success'
                                          : 'air-secondary-accent',
                                      position: 'top-right'
                                  }"
                                class="truncate"
                            />
                            <span class="text-xs text-gray-600">{{ formatDuration(employee.time) }}</span>
                          </div>
                          <button
                              v-if="page.employees.length > 3"
                              @click="toggleShowAllEmployees(index)"
                              class="text-xs text-blue-600 hover:text-blue-800 mt-1 text-left"
                          >
                            {{ showAllEmployees[index] ? 'Скрыть' : `Показать ещё ${page.employees.length - 3}` }}
                          </button>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-semibold">
                    <tr>
                      <td colspan="2" class="text-right">Итого:</td>
                      <td>{{ formatDuration(totalStats.totalTime) }}</td>
                      <td>{{ totalStats.totalEmployees }}</td>
                      <td>{{ formatDuration(totalStats.averageTimePerEmployee) }}</td>
                      <td>{{ totalStats.totalVisits }} посещений</td>
                    </tr>
                    </tfoot>
                  </table>
                </B24TableWrapper>
              </div>

              <!-- Сообщение при отсутствии данных -->
              <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-lg">Нет данных о посещениях</p>
                <p class="text-sm mt-2">Данные появятся после того, как сотрудники начнут посещать страницы</p>
              </div>
            </div>
          </div>
        </B24Card>
      </div>

      <!-- Сайдбар -->
      <div class="lg:col-span-1">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'
import Sidebar from './Sidebar.vue'
import categoriesData from './categories.json'
import {bitrixHelper} from "../helpers/app.js"

const toast = useToast()

class ActivityMapManager {
  constructor() {
    this.currentUserId = ref(null)
    this.currentUserProfile = ref(null)
    this.isLoading = ref(false)
    this.allItems = ref([])
    this.processedData = ref([])
    this.userProfilesCache = ref({})
    this.categories = ref(categoriesData.categories)
    this.showAllEmployees = ref({})
    this.isLoadingProfile = ref(false)
    this.totalStats = ref({
      totalTime: 0,
      totalEmployees: 0,
      totalVisits: 0,
      averageTimePerEmployee: 0
    })
  }

  // Получение инициалов пользователя
  getUserInitials(name) {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  // Получение фото пользователя
  getUserPhoto(userId) {
    const userProfile = this.userProfilesCache.value[userId]
    return userProfile?.PERSONAL_PHOTO || null
  }

  // Получение статуса онлайн
  getOnlineStatus(userId) {
    const userProfile = this.userProfilesCache.value[userId]
    return userProfile?.IS_ONLINE || 'N'
  }

  // Форматирование полного имени
  getFullName(userData) {
    const parts = []
    if (userData.NAME) parts.push(userData.NAME)
    if (userData.LAST_NAME) parts.push(userData.LAST_NAME)
    if (userData.SECOND_NAME) parts.push(userData.SECOND_NAME)
    return parts.join(' ') || `Пользователь ${userData.ID}`
  }

  // Форматирование времени
  formatDuration(seconds) {
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

  // Получение класса для бейджа категории
  getCategoryBadgeClass(category) {
    if (!category) return 'bg-gray-100 text-gray-800'
    const mainCategory = category.split(' › ')[0]
    const categoryData = this.categories.value.find(cat => cat.name === mainCategory)
    return categoryData?.color || 'bg-gray-100 text-gray-800'
  }

  // Показать уведомление
  showNotification(type, message) {
    if (typeof toast !== 'undefined') {
      toast.add({
        description: message,
        variant: type
      })
    } else {
      console[type === 'error' ? 'error' : type === 'success' ? 'log' : 'info'](message)
    }
  }

  // Загрузка профиля текущего пользователя
  async loadCurrentUserProfile() {
    return new Promise((resolve, reject) => {
      if (!BX24) {
        reject(new Error('BX24 не инициализирован'))
        return
      }

      this.isLoadingProfile.value = true
      BX24.callBatch({
        current_user: ['user.current', {}]
      }, (result) => {
        if (result.current_user.error()) {
          this.isLoadingProfile.value = false
          this.showNotification('error', 'Ошибка загрузки профиля пользователя')
          reject(result.current_user.error())
        } else {
          const userData = result.current_user.data()
          userData.FULL_NAME = this.getFullName(userData)
          this.currentUserProfile.value = userData
          this.currentUserId.value = Number(userData.ID)
          this.userProfilesCache.value[userData.ID] = userData
          this.isLoadingProfile.value = false
          resolve(userData)
        }
      }, true)
    })
  }

  // Загрузка профилей пользователей пачками
  async getUserProfilesBatch(userIds) {
    if (!BX24 || userIds.length === 0) {
      return {}
    }

    const uncachedUserIds = userIds.filter(id => !this.userProfilesCache.value[id])

    if (uncachedUserIds.length === 0) {
      return userIds.reduce((acc, id) => {
        acc[id] = this.userProfilesCache.value[id]
        return acc
      }, {})
    }

    const batches = []
    const batchSize = 50

    for (let i = 0; i < uncachedUserIds.length; i += batchSize) {
      const batchIds = uncachedUserIds.slice(i, i + batchSize)
      batches.push(batchIds)
    }

    for (const batchIds of batches) {
      await new Promise((resolve, reject) => {
        BX24.callBatch({
          users: [
            'user.get',
            {
              FILTER: { 'ID': batchIds },
              SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL', 'WORK_POSITION', 'ACTIVE', 'PERSONAL_PHOTO', 'IS_ONLINE']
            }
          ]
        }, (result) => {
          if (result.users.error()) {
            this.showNotification('error', 'Ошибка загрузки профилей пользователей')
            reject(result.users.error())
            return
          }

          const users = result.users.data()
          users.forEach(user => {
            user.FULL_NAME = this.getFullName(user)
            this.userProfilesCache.value[user.ID] = user
          })

          batchIds.forEach(id => {
            if (!this.userProfilesCache.value[id]) {
              this.userProfilesCache.value[id] = {
                ID: id,
                FULL_NAME: `Пользователь ${id}`,
                NAME: 'Пользователь',
                PERSONAL_PHOTO: null,
                IS_ONLINE: 'N'
              }
            }
          })

          resolve()
        }, true)
      })
    }

    return userIds.reduce((acc, id) => {
      acc[id] = this.userProfilesCache.value[id]
      return acc
    }, {})
  }

  // Получение всех разделов (дней)
  async getAllSections() {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        sections: [
          'entity.section.get',
          {
            ENTITY: 'pr_tracking',
            SELECT: ['ID', 'NAME']
          }
        ]
      }, (result) => {
        if (result.sections.error()) {
          this.showNotification('error', 'Ошибка получения разделов')
          reject(result.sections.error())
          return
        }

        const sections = result.sections.data() || []
        resolve(sections)
      }, true)
    })
  }

  // Получение всех элементов из всех разделов
  async getAllItems() {
    try {
      const sections = await this.getAllSections()

      if (sections.length === 0) {
        return []
      }

      // Создаем батч запросов для получения элементов из каждого раздела
      const batchCommands = {}
      sections.forEach((section, index) => {
        batchCommands[`items_${index}`] = [
          'entity.item.get',
          {
            ENTITY: 'pr_tracking',
            FILTER: { SECTION_ID: section.ID },
            SELECT: ['ID', 'DATE_CREATE', 'TIMESTAMP_X', 'PROPERTY_VALUES', 'NAME']
          }
        ]
      })

      return new Promise((resolve, reject) => {
        BX24.callBatch(batchCommands, (result) => {
          const allItems = []

          Object.keys(result).forEach(key => {
            if (!result[key].error()) {
              const items = result[key].data() || []
              allItems.push(...items)
            }
          })

          resolve(allItems)
        }, true)
      })
    } catch (error) {
      this.showNotification('error', 'Ошибка получения данных')
      return []
    }
  }

  // Обработка данных для карты активности
  processActivityData(items) {
    const pagesMap = new Map() // url -> данные страницы
    const userIds = new Set()

    // Собираем все userId для последующей загрузки профилей
    items.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const userId = parseInt(props.USER_ID) || 0
      if (userId > 0) {
        userIds.add(userId)
      }
    })

    // Группируем по страницам
    items.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const url = props.PAGE_URL || ''
      const time = parseInt(props.PAGE_TIME) || 0
      const userId = parseInt(props.USER_ID) || 0
      const userName = props.USER_NAME || `Пользователь ${userId}`
      const category = props.PAGE_CATEGORY || 'Без категории'

      if (!url || userId === 0) return

      // Получаем или создаем страницу
      if (!pagesMap.has(url)) {
        pagesMap.set(url, {
          url,
          category,
          totalTime: 0,
          employees: new Map(), // userId -> { userName, time }
          visits: 0,
          items: new Set() // для подсчета уникальных записей
        })
      }

      const pageData = pagesMap.get(url)
      pageData.totalTime += time
      pageData.visits++
      pageData.items.add(item.ID)

      // Добавляем информацию о сотруднике
      if (!pageData.employees.has(userId)) {
        pageData.employees.set(userId, {
          userId,
          userName,
          time: 0
        })
      }
      const employeeData = pageData.employees.get(userId)
      employeeData.time += time
    })

    // Преобразуем в массив и сортируем
    const result = []
    let totalTimeAll = 0
    let totalEmployeesAll = new Set()
    let totalVisitsAll = 0

    pagesMap.forEach(pageData => {
      const employeesArray = Array.from(pageData.employees.values())
          .map(emp => ({
            ...emp,
            userName: this.userProfilesCache.value[emp.userId]?.FULL_NAME || emp.userName
          }))
          .sort((a, b) => b.time - a.time)

      const pageInfo = {
        url: pageData.url,
        category: pageData.category,
        totalTime: pageData.totalTime,
        employeeCount: pageData.employees.size,
        averageTime: Math.round(pageData.totalTime / pageData.employees.size),
        employees: employeesArray,
        visits: pageData.visits
      }

      result.push(pageInfo)

      // Обновляем глобальные счетчики
      totalTimeAll += pageData.totalTime
      pageData.employees.forEach((_, userId) => totalEmployeesAll.add(userId))
      totalVisitsAll += pageData.visits
    })

    // Сортируем страницы по времени (убывание)
    result.sort((a, b) => b.totalTime - a.totalTime)

    this.processedData.value = result
    this.totalStats.value = {
      totalTime: totalTimeAll,
      totalEmployees: totalEmployeesAll.size,
      totalVisits: totalVisitsAll,
      averageTimePerEmployee: totalEmployeesAll.size > 0
          ? Math.round(totalTimeAll / totalEmployeesAll.size)
          : 0
    }
  }

  // Основной метод загрузки всех данных
  async loadAllData() {
    try {
      this.isLoading.value = true

      // Загружаем профиль текущего пользователя, если еще не загружен
      if (!this.currentUserId.value) {
        await this.loadCurrentUserProfile()
      }

      // Получаем все элементы
      const items = await this.getAllItems()
      this.allItems.value = items

      if (items.length === 0) {
        this.processedData.value = []
        this.isLoading.value = false
        return
      }

      // Собираем уникальные userId для загрузки профилей
      const userIds = new Set()
      items.forEach(item => {
        const props = item.PROPERTY_VALUES || {}
        const userId = parseInt(props.USER_ID) || 0
        if (userId > 0) {
          userIds.add(userId)
        }
      })

      // Загружаем профили пользователей
      if (userIds.size > 0) {
        await this.getUserProfilesBatch(Array.from(userIds))
      }

      // Обрабатываем данные
      this.processActivityData(items)

    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
      this.showNotification('error', 'Ошибка при загрузке данных')
    } finally {
      this.isLoading.value = false
    }
  }

  // Переключение показа всех сотрудников
  toggleShowAllEmployees(index) {
    this.showAllEmployees.value[index] = !this.showAllEmployees.value[index]
    this.showAllEmployees.value = { ...this.showAllEmployees.value }
  }

  // Инициализация
  async initialize() {
    try {
      await this.loadAllData()
    } catch (error) {
      this.showNotification('error', 'Ошибка инициализации приложения')
      this.isLoading.value = false
    }
  }
}

export default {
  name: 'ActivityMap',
  components: {
    Sidebar
  },
  setup() {
    const activityMapManager = new ActivityMapManager()

    // Вычисляемые свойства для шаблона
    const processedData = computed(() => activityMapManager.processedData.value)
    const totalStats = computed(() => activityMapManager.totalStats.value)

    onMounted(async () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          try {
            await activityMapManager.initialize()
          } catch (error) {
            activityMapManager.showNotification('error', 'Ошибка инициализации приложения')
            activityMapManager.isLoading.value = false
          }
        })
      } else {
        activityMapManager.isLoading.value = false
      }
    })

    return {
      // Состояния
      isLoading: activityMapManager.isLoading,
      processedData,
      showAllEmployees: activityMapManager.showAllEmployees,
      totalStats,

      // Методы
      loadAllData: activityMapManager.loadAllData.bind(activityMapManager),
      toggleShowAllEmployees: activityMapManager.toggleShowAllEmployees.bind(activityMapManager),
      formatDuration: activityMapManager.formatDuration.bind(activityMapManager),
      getCategoryBadgeClass: activityMapManager.getCategoryBadgeClass.bind(activityMapManager),
      getUserPhoto: (userId) => {
        const userProfile = activityMapManager.userProfilesCache.value[userId]
        return userProfile?.PERSONAL_PHOTO || null
      },
      getUserInitials: activityMapManager.getUserInitials.bind(activityMapManager),
      getOnlineStatus: (userId) => {
        const userProfile = activityMapManager.userProfilesCache.value[userId]
        return userProfile?.IS_ONLINE || 'N'
      }
    }
  }
}
</script>

<style scoped>
/* Стили для таблицы */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

th {
  background-color: #f9fafb;
  font-weight: 500;
  padding: 0.75rem 1rem;
}

td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

/* Стили для бейджей категорий */
:deep(.B24Badge) {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стили для списка сотрудников */
.employee-list {
  max-width: 300px;
}
</style>