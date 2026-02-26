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

              <!-- Календарь для выбора диапазона -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Выберите период для просмотра
                </label>
                <div class="flex flex-col md:flex-row gap-2">
                  <div class="flex-1">
                    <B24Popover>
                      <B24Button
                          :disabled="isLoading"
                          color="air-secondary-accent"
                          size="md"
                          class="w-full justify-between"
                      >
                        <div class="flex items-center space-x-2 truncate">
                          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span class="truncate">{{ formatDateRangeDisplay() }}</span>
                        </div>
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </B24Button>

                      <template #content>
                        <div class="p-2">
                          <B24Calendar
                              v-model="selectedDateRange"
                              range
                              :number-of-months="2"
                              color="air-primary"
                              size="md"
                              :month-controls="true"
                              :year-controls="true"
                              :min-value="minCalendarDate"
                              :max-value="maxCalendarDate"
                              :is-date-disabled="isDateDisabled"
                              class="rounded-lg"
                              @update:modelValue="handleDateRangeChange"
                          />
                        </div>
                      </template>
                    </B24Popover>
                  </div>
                  <B24Button
                      @click="resetDateRange"
                      :disabled="isLoading"
                      color="air-secondary-accent"
                      size="md"
                      class="flex-shrink-0"
                      :title="'Сбросить фильтр по дате'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
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
                      <th class="text-left font-medium text-gray-700">Страница</th>
                      <th class="text-left font-medium text-gray-700">Категория</th>
                      <th class="text-left font-medium text-gray-700">Кол-во сотрудников</th>
                      <th class="text-left font-medium text-gray-700">Общее время</th>
                      <th class="text-left font-medium text-gray-700">Среднее время</th>
                      <th class="text-left font-medium text-gray-700">Максимальное время</th>
                      <th class="text-left font-medium text-gray-700">Минимальное время</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(page, index) in paginatedPages" :key="index" class="hover:bg-gray-50">
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

                      <!-- Категория в виде бейджа -->
                      <td class="text-sm">
                        <B24Badge :class="getCategoryBadgeClass(page.category)">
                          {{ page.category || 'Без категории' }}
                        </B24Badge>
                      </td>

                      <!-- Количество сотрудников (кликабельно) -->
                      <td class="text-sm">
                        <button
                            @click="showEmployeesModal(page)"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                          {{ page.employeeCount }}
                        </button>
                      </td>

                      <!-- Общее время -->
                      <td class="text-sm font-medium">{{ formatDuration(page.totalTime) }}</td>

                      <!-- Среднее время -->
                      <td class="text-sm">{{ formatDuration(page.averageTime) }}</td>

                      <!-- Максимальное время -->
                      <td class="text-sm">{{ formatDuration(page.maxTime) }}</td>

                      <!-- Минимальное время -->
                      <td class="text-sm">{{ formatDuration(page.minTime) }}</td>
                    </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-semibold">
                    <tr>
                      <td colspan="3" class="text-right">Итого:</td>
                      <td>{{ formatDuration(totalStats.totalTime) }}</td>
                      <td>{{ formatDuration(totalStats.averageTimePerEmployee) }}</td>
                      <td>{{ formatDuration(totalStats.maxTime) }}</td>
                      <td>{{ formatDuration(totalStats.minTime) }}</td>
                    </tr>
                    </tfoot>
                  </table>
                </B24TableWrapper>

                <!-- Пагинация -->
                <div v-if="filteredPages.length > itemsPerPage" class="flex justify-center mt-6">
                  <B24Pagination
                      v-model:page="currentPage"
                      :total="filteredPages.length"
                      :items-per-page="itemsPerPage"
                      :sibling-count="2"
                      show-edges
                      size="md"
                  />
                </div>

                <!-- Информация о количестве записей -->
                <div class="mt-4 text-sm text-gray-600 text-center">
                  Показано {{ paginatedPages.length }} из {{ filteredPages.length }} записей
                </div>
              </div>

              <!-- Сообщение при отсутствии данных -->
              <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-lg">Нет данных о посещениях за выбранный период</p>
                <p class="text-sm mt-2">Попробуйте изменить период или дождитесь появления новых данных</p>
              </div>

              <!-- Сообщение при отсутствии результатов поиска -->
              <div v-else-if="filteredPages.length === 0 && processedData.length > 0" class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p class="text-lg">Записи не найдены</p>
                <p class="text-sm mt-2">Попробуйте изменить параметры поиска</p>
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

    <!-- Модальное окно детальной информации по сотрудникам -->
    <B24Modal
        v-model:open="isShowEmployeesModal"
        :title="`Сотрудники на странице`"
        description="Детальная информация о времени, проведенном сотрудниками на странице"
        size="lg"
        scrollable
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div v-if="modalPageData" class="space-y-6">
          <!-- Информация о странице -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о странице</div>
                <div class="text-sm text-blue-700 break-all">
                  <a :href="modalPageData.url" target="_blank" class="underline">
                    {{ modalPageData.url }}
                  </a>
                </div>
                <div class="mt-2 text-sm text-blue-700">
                  <span class="font-semibold">Всего времени:</span> {{ formatDuration(modalPageData.totalTime) }} |
                  <span class="font-semibold">Сотрудников:</span> {{ modalPageData.employeeCount }} |
                  <span class="font-semibold">Посещений:</span> {{ modalPageData.visits }}
                </div>
              </div>
            </div>
          </div>

          <!-- Таблица сотрудников -->
          <B24TableWrapper
              class="overflow-x-auto w-full border border-gray-200 rounded-lg"
              size="sm"
              zebra
              row-hover
          >
            <table class="min-w-full">
              <thead class="bg-gray-50">
              <tr>
                <th class="text-left font-medium text-gray-700">Сотрудник</th>
                <th class="text-left font-medium text-gray-700">Время на странице</th>
                <th class="text-left font-medium text-gray-700">Доля от общего времени</th>
                <th class="text-left font-medium text-gray-700">Кол-во посещений</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="employee in modalPageData.employees" :key="employee.userId" class="hover:bg-gray-50">
                <td class="text-sm">
                  <a
                      :href="getUserProfileUrl(employee.userId)"
                      target="_blank"
                      class="inline-flex items-center hover:opacity-80 transition-opacity"
                  >
                    <B24User
                        :name="employee.userName"
                        size="sm"
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
                        class="truncate cursor-pointer"
                    />
                  </a>
                </td>
                <td class="text-sm font-medium">{{ formatDuration(employee.time) }}</td>
                <td class="text-sm">
                  <div class="flex items-center space-x-2">
                    <span>{{ calculatePercentage(employee.time, modalPageData.totalTime) }}%</span>
                    <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                          class="h-full bg-blue-500 rounded-full"
                          :style="{ width: calculatePercentage(employee.time, modalPageData.totalTime) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="text-sm">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {{ employee.visits || 1 }}
                    </span>
                </td>
              </tr>
              </tbody>
              <tfoot class="bg-gray-50 font-semibold">
              <tr>
                <td colspan="2" class="text-right">Итого:</td>
                <td>{{ formatDuration(modalPageData.totalTime) }}</td>
                <td>{{ modalPageData.visits }} посещений</td>
              </tr>
              </tfoot>
            </table>
          </B24TableWrapper>

          <!-- Дополнительная статистика -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Среднее время на сотрудника</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatDuration(modalPageData.averageTime) }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Максимальное время</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatDuration(modalPageData.maxTime) }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Минимальное время</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatDuration(modalPageData.minTime) }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-primary" class="w-full sm:w-auto">Закрыть</B24Button>
        </div>
      </template>
    </B24Modal>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { CalendarDate } from '@internationalized/date'
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
    this.filteredPages = ref([])
    this.userProfilesCache = ref({})
    this.categories = ref(categoriesData.categories)
    this.showAllEmployees = ref({})
    this.isLoadingProfile = ref(false)
    this.totalStats = ref({
      totalTime: 0,
      totalEmployees: 0,
      totalVisits: 0,
      averageTimePerEmployee: 0,
      maxTime: 0,
      minTime: 0
    })

    // Пагинация
    this.currentPage = ref(1)
    this.itemsPerPage = ref(20)

    // Поиск
    this.searchQuery = ref('')

    // Модальное окно
    this.isShowEmployeesModal = ref(false)
    this.modalPageData = ref(null)

    // Календарь для диапазона
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    this.selectedDateRange = ref({
      start: this.getCalendarDateFromString(this.formatDate(firstDayOfMonth)),
      end: this.getCalendarDateFromString(this.formatDate(today))
    })

    this.minCalendarDate = new CalendarDate(2020, 1, 1)
    this.maxCalendarDate = new CalendarDate(2030, 12, 31)
    this.isDateRangeActive = ref(false) // Флаг, указывающий, активен ли фильтр по дате
  }

  // Форматирование даты в строку YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Получение URL профиля пользователя
  getUserProfileUrl(userId) {
    if (!userId) return '#'
    const domain = BX24?.getDomain?.() || ''
    return `https://${domain}/company/personal/user/${userId}/`
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

  // Расчет процента
  calculatePercentage(value, total) {
    if (!total) return 0
    return ((value / total) * 100).toFixed(1)
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

  // Методы для работы с календарем
  getCalendarDateFromString(dateString) {
    if (!dateString) return null
    const date = new Date(dateString)
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  getStringFromCalendarDate(calendarDate) {
    if (!calendarDate) return ''
    const year = calendarDate.year
    const month = calendarDate.month.toString().padStart(2, '0')
    const day = calendarDate.day.toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  getTodayDate() {
    return new Date().toISOString().split('T')[0]
  }

  formatDateRangeDisplay() {
    if (!this.isDateRangeActive.value || !this.selectedDateRange.value?.start || !this.selectedDateRange.value?.end) {
      return 'Выберите период'
    }

    const startDate = this.selectedDateRange.value.start.toDate('UTC')
    const endDate = this.selectedDateRange.value.end.toDate('UTC')

    const formatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    const startStr = startDate.toLocaleDateString('ru-RU', formatOptions)
    const endStr = endDate.toLocaleDateString('ru-RU', formatOptions)

    return `${startStr} — ${endStr}`
  }

  isDateDisabled(date) {
    const dayOfWeek = date.toDate('UTC').getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  handleDateRangeChange(newRange) {
    if (newRange?.start && newRange?.end) {
      this.isDateRangeActive.value = true
      this.selectedDateRange.value = newRange
      this.loadAllData()
    }
  }

  resetDateRange() {
    this.isDateRangeActive.value = false
    this.loadAllData()
  }

  // Фильтрация элементов по диапазону дат
  filterItemsByDateRange(items) {
    if (!this.isDateRangeActive.value || !this.selectedDateRange.value?.start || !this.selectedDateRange.value?.end) {
      return items
    }

    const startDate = this.selectedDateRange.value.start.toDate('UTC')
    startDate.setHours(0, 0, 0, 0)

    const endDate = this.selectedDateRange.value.end.toDate('UTC')
    endDate.setHours(23, 59, 59, 999)

    return items.filter(item => {
      const itemDate = new Date(item.DATE_CREATE)
      return itemDate >= startDate && itemDate <= endDate
    })
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
    const filteredItems = this.filterItemsByDateRange(items)

    const pagesMap = new Map() // url -> данные страницы
    const userIds = new Set()

    // Собираем все userId для последующей загрузки профилей
    filteredItems.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const userId = parseInt(props.USER_ID) || 0
      if (userId > 0) {
        userIds.add(userId)
      }
    })

    // Группируем по страницам
    filteredItems.forEach(item => {
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
          employees: new Map(), // userId -> { userName, time, visits }
          visits: 0,
          items: new Set(), // для подсчета уникальных записей
          maxTime: 0,
          minTime: Infinity
        })
      }

      const pageData = pagesMap.get(url)
      pageData.totalTime += time
      pageData.visits++
      pageData.items.add(item.ID)

      // Обновляем макс и мин время
      if (time > pageData.maxTime) pageData.maxTime = time
      if (time < pageData.minTime) pageData.minTime = time

      // Добавляем информацию о сотруднике
      if (!pageData.employees.has(userId)) {
        pageData.employees.set(userId, {
          userId,
          userName,
          time: 0,
          visits: 0
        })
      }
      const employeeData = pageData.employees.get(userId)
      employeeData.time += time
      employeeData.visits++
    })

    // Преобразуем в массив и сортируем
    const result = []
    let totalTimeAll = 0
    let totalEmployeesAll = new Set()
    let totalVisitsAll = 0
    let globalMaxTime = 0
    let globalMinTime = Infinity

    pagesMap.forEach(pageData => {
      // Если мин время осталось Infinity, значит нет данных
      if (pageData.minTime === Infinity) pageData.minTime = 0

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
        averageTime: pageData.employees.size > 0 ? Math.round(pageData.totalTime / pageData.employees.size) : 0,
        employees: employeesArray,
        visits: pageData.visits,
        maxTime: pageData.maxTime,
        minTime: pageData.minTime
      }

      result.push(pageInfo)

      // Обновляем глобальные счетчики
      totalTimeAll += pageData.totalTime
      pageData.employees.forEach((_, userId) => totalEmployeesAll.add(userId))
      totalVisitsAll += pageData.visits
      if (pageData.maxTime > globalMaxTime) globalMaxTime = pageData.maxTime
      if (pageData.minTime < globalMinTime) globalMinTime = pageData.minTime
    })

    // Сортируем страницы по времени (убывание)
    result.sort((a, b) => b.totalTime - a.totalTime)

    this.processedData.value = result
    this.filteredPages.value = [...result]
    this.totalStats.value = {
      totalTime: totalTimeAll,
      totalEmployees: totalEmployeesAll.size,
      totalVisits: totalVisitsAll,
      averageTimePerEmployee: totalEmployeesAll.size > 0
          ? Math.round(totalTimeAll / totalEmployeesAll.size)
          : 0,
      maxTime: globalMaxTime,
      minTime: globalMinTime !== Infinity ? globalMinTime : 0
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
        this.filteredPages.value = []
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

      // Сбрасываем на первую страницу
      this.currentPage.value = 1

    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
      this.showNotification('error', 'Ошибка при загрузке данных')
    } finally {
      this.isLoading.value = false
    }
  }

  // Фильтрация страниц по поисковому запросу
  filterPages() {
    const query = this.searchQuery.value.toLowerCase().trim()

    if (!query) {
      this.filteredPages.value = [...this.processedData.value]
    } else {
      this.filteredPages.value = this.processedData.value.filter(page =>
          page.url.toLowerCase().includes(query) ||
          page.category.toLowerCase().includes(query)
      )
    }

    this.currentPage.value = 1
  }

  // Переключение показа всех сотрудников
  toggleShowAllEmployees(index) {
    this.showAllEmployees.value[index] = !this.showAllEmployees.value[index]
    this.showAllEmployees.value = { ...this.showAllEmployees.value }
  }

  // Показать модальное окно с сотрудниками
  showEmployeesModal(pageData) {
    this.modalPageData.value = pageData
    this.isShowEmployeesModal.value = true
  }

  // Закрыть модальное окно
  closeEmployeesModal() {
    this.isShowEmployeesModal.value = false
    this.modalPageData.value = null
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
    const filteredPages = computed(() => activityMapManager.filteredPages.value)
    const totalStats = computed(() => activityMapManager.totalStats.value)

    // Пагинированные данные
    const paginatedPages = computed(() => {
      const start = (activityMapManager.currentPage.value - 1) * activityMapManager.itemsPerPage.value
      const end = start + activityMapManager.itemsPerPage.value
      return filteredPages.value.slice(start, end)
    })

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
      filteredPages,
      showAllEmployees: activityMapManager.showAllEmployees,
      totalStats,
      currentPage: activityMapManager.currentPage,
      itemsPerPage: activityMapManager.itemsPerPage,
      searchQuery: activityMapManager.searchQuery,
      paginatedPages,

      // Календарь и диапазон
      selectedDateRange: activityMapManager.selectedDateRange,
      minCalendarDate: activityMapManager.minCalendarDate,
      maxCalendarDate: activityMapManager.maxCalendarDate,

      // Модальное окно
      isShowEmployeesModal: activityMapManager.isShowEmployeesModal,
      modalPageData: activityMapManager.modalPageData,

      // Методы
      loadAllData: activityMapManager.loadAllData.bind(activityMapManager),
      filterPages: activityMapManager.filterPages.bind(activityMapManager),
      toggleShowAllEmployees: activityMapManager.toggleShowAllEmployees.bind(activityMapManager),
      showEmployeesModal: activityMapManager.showEmployeesModal.bind(activityMapManager),
      closeEmployeesModal: activityMapManager.closeEmployeesModal.bind(activityMapManager),
      formatDuration: activityMapManager.formatDuration.bind(activityMapManager),
      calculatePercentage: activityMapManager.calculatePercentage.bind(activityMapManager),
      getCategoryBadgeClass: activityMapManager.getCategoryBadgeClass.bind(activityMapManager),
      getUserPhoto: (userId) => {
        const userProfile = activityMapManager.userProfilesCache.value[userId]
        return userProfile?.PERSONAL_PHOTO || null
      },
      getUserInitials: activityMapManager.getUserInitials.bind(activityMapManager),
      getOnlineStatus: (userId) => {
        const userProfile = activityMapManager.userProfilesCache.value[userId]
        return userProfile?.IS_ONLINE || 'N'
      },
      getUserProfileUrl: activityMapManager.getUserProfileUrl.bind(activityMapManager),
      handleDateRangeChange: activityMapManager.handleDateRangeChange.bind(activityMapManager),
      resetDateRange: activityMapManager.resetDateRange.bind(activityMapManager),
      formatDateRangeDisplay: activityMapManager.formatDateRangeDisplay.bind(activityMapManager),
      isDateDisabled: activityMapManager.isDateDisabled.bind(activityMapManager)
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

/* Стили для кликабельного счетчика сотрудников */
button.inline-flex {
  cursor: pointer;
  transition: all 0.2s ease;
}

button.inline-flex:hover {
  transform: scale(1.05);
}

/* Стили для прогресс-бара в модальном окне */
.bg-blue-500 {
  transition: width 0.3s ease;
}

/* Стили для календаря */
:deep(.B24Popover) {
  width: 100%;
}

/* Стили для кнопки сброса */
button.flex-shrink-0 {
  min-width: 40px;
}
</style>