<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        :title="pageTitle"
        description="Анализ времени в Bitrix24 относительно общего рабочего времени и задач"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Основная часть со статистикой -->
      <div class="lg:col-span-2">
        <!-- Основная карточка со статистикой -->
        <B24Card>
          <div class="p-6">
            <div class="space-y-6">
              <!-- Заголовок и кнопки -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Статистика рабочего времени
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Анализ времени в Bitrix24 относительно рабочего дня
                    <span v-if="viewedUserId && viewedUserId !== currentUserId" class="font-medium text-blue-600">
                      (Пользователь #{{ viewedUserId }})
                    </span>
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <B24Button
                      @click="refreshData"
                      :disabled="isLoading"
                      color="air-primary"
                      size="sm"
                  >
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Обновить
                  </B24Button>
                </div>
              </div>

              <!-- Выбор дня -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Выберите день для анализа
                </label>
                <B24Popover class="w-full">
                  <button
                      type="button"
                      :disabled="isLoading"
                      class="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span class="text-sm text-gray-700">{{ formatDayDisplay(selectedDay) }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <template #content>
                    <div class="p-2">
                      <B24Calendar
                          v-model="calendarDate"
                          @update:modelValue="handleCalendarDateChange"
                          color="air-primary"
                          size="md"
                          :month-controls="true"
                          :year-controls="false"
                          :min-value="minCalendarDate"
                          :max-value="maxCalendarDate"
                          :is-date-disabled="isDateDisabled"
                          :is-date-unavailable="isDateUnavailable"
                          class="rounded-lg"
                      />
                    </div>
                  </template>
                </B24Popover>
              </div>

              <!-- Табы -->
              <B24Tabs
                  v-model="activeTab"
                  :items="[
                    { label: 'Время в Bitrix24', value: 'bitrix-time' },
                    { label: 'Время задач', value: 'task-time' }
                  ]"
                  @update:modelValue="onTabChange"
                  class="w-full whitespace-nowrap overflow-hidden"
              />

              <!-- Прелоадер -->
              <div v-if="isLoading" class="text-center py-12">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <p class="text-sm text-gray-500">Загрузка данных...</p>
              </div>

              <!-- Контент для таба "Время в Bitrix24" -->
              <div v-else-if="activeTab === 'bitrix-time'">
                <!-- Контейнер для графика и легенды -->
                <div class="flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
                  <!-- График -->
                  <div class="relative w-82 h-82">
                    <canvas ref="bitrixTimeChart"></canvas>
                    <!-- Центральный текст -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div class="text-3xl font-bold text-gray-900">
                        {{ formatPercentage(workDayData.bitrixTimePercentage) }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        времени в Bitrix24
                      </div>
                    </div>
                  </div>
                  <!-- Интерактивная легенда -->
                  <div class="flex-1">
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Распределение времени</h4>
                      <div class="space-y-3">
                        <div v-for="(item, index) in bitrixTimeLegend" :key="index"
                             class="legend-item p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                             :class="{ 'bg-gray-50 shadow-sm': hoveredLegendIndex === index }"
                             @mouseenter="hoverLegend(index)"
                             @mouseleave="hoverLegend(null)">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: item.color }"></div>
                              <div>
                                <div class="text-sm font-medium text-gray-900">{{ item.label }}</div>
                                <div class="text-xs text-gray-500">{{ item.description }}</div>
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="text-sm font-semibold" :style="{ color: item.color }">
                                {{ formatDuration(item.value) }}
                              </div>
                              <div class="text-xs text-gray-500">{{ item.percentage }}</div>
                            </div>
                          </div>
                          <div v-if="item.details" class="mt-2 text-xs text-gray-600">
                            {{ item.details }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- CRM статистика -->
                    <div class="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Активность CRM</h4>
                      <div class="grid grid-cols-2 gap-3">
                        <!-- Созданные -->
                        <div class="space-y-2">
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500"></div>
                              <span class="text-xs text-gray-700">Создано сделок</span>
                            </div>
                            <span class="text-sm font-semibold text-green-600">
                              {{ crmData.createdDealsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500"></div>
                              <span class="text-xs text-gray-700">Создано лидов</span>
                            </div>
                            <span class="text-sm font-semibold text-green-600">
                              {{ crmData.createdLeadsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500"></div>
                              <span class="text-xs text-gray-700">Создано контактов</span>
                            </div>
                            <span class="text-sm font-semibold text-green-600">
                              {{ crmData.createdContactsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500"></div>
                              <span class="text-xs text-gray-700">Создано компаний</span>
                            </div>
                            <span class="text-sm font-semibold text-green-600">
                              {{ crmData.createdCompaniesCount }}
                            </span>
                          </div>
                        </div>

                        <!-- Обновленные -->
                        <div class="space-y-2">
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500"></div>
                              <span class="text-xs text-gray-700">Обновлено сделок</span>
                            </div>
                            <span class="text-sm font-semibold text-blue-600">
                              {{ crmData.updatedDealsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500"></div>
                              <span class="text-xs text-gray-700">Обновлено лидов</span>
                            </div>
                            <span class="text-sm font-semibold text-blue-600">
                              {{ crmData.updatedLeadsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500"></div>
                              <span class="text-xs text-gray-700">Обновлено контактов</span>
                            </div>
                            <span class="text-sm font-semibold text-blue-600">
                              {{ crmData.updatedContactsCount }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex items-center">
                              <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500"></div>
                              <span class="text-xs text-gray-700">Обновлено компаний</span>
                            </div>
                            <span class="text-sm font-semibold text-blue-600">
                              {{ crmData.updatedCompaniesCount }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Статусы сделок и лидов -->
                      <div class="mt-4 pt-4 border-t border-gray-200">
                        <h5 class="text-xs font-medium text-gray-700 mb-2">Статусы сделок и лидов</h5>
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex items-center justify-between p-1">
                            <span class="text-xs text-gray-600">Успешные сделки:</span>
                            <span class="text-xs font-semibold text-green-600">{{ crmData.successfulDealsCount }}</span>
                          </div>
                          <div class="flex items-center justify-between p-1">
                            <span class="text-xs text-gray-600">Провальные сделки:</span>
                            <span class="text-xs font-semibold text-red-600">{{ crmData.failedDealsCount }}</span>
                          </div>
                          <div class="flex items-center justify-between p-1">
                            <span class="text-xs text-gray-600">Успешные лиды:</span>
                            <span class="text-xs font-semibold text-green-600">{{ crmData.convertedLeadsCount }}</span>
                          </div>
                          <div class="flex items-center justify-between p-1">
                            <span class="text-xs text-gray-600">Провальные лиды:</span>
                            <span class="text-xs font-semibold text-red-600">{{ crmData.junkLeadsCount }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Информация о рабочем дне -->
                <div class="mt-8 space-y-6">
                  <h4 class="text-lg font-semibold text-gray-900">Данные о рабочем дне</h4>
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">Настройки рабочего времени</h5>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Учет времени:</span>
                            <B24Badge :color="workDaySettings.UF_TIMEMAN ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TIMEMAN ? 'Включен' : 'Выключен' }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Свободный график:</span>
                            <B24Badge :color="workDaySettings.UF_TM_FREE ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TM_FREE ? 'Да' : 'Нет' }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Начало дня до:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MAX_START || 'Не задано' }}</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Конец дня после:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MIN_FINISH || 'Не задано' }}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">Текущий рабочий день</h5>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Статус:</span>
                            <B24Badge :class="getWorkDayStatusClass(workDayStatus.STATUS)">
                              {{ getWorkDayStatusText(workDayStatus.STATUS) }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Начало:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ formatDateTime(workDayStatus.TIME_START) || 'Не начат' }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Длительность:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ workDayStatus.DURATION || '00:00:00' }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Перерывы:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ workDayStatus.TIME_LEAKS || '00:00:00' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Контент для таба "Время задач" -->
              <div v-else-if="activeTab === 'task-time'">
                <!-- Контейнер для графика и легенды -->
                <div class="flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
                  <!-- График -->
                  <div class="relative w-82 h-82">
                    <canvas ref="taskTimeChart"></canvas>
                    <!-- Центральный текст -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div class="text-3xl font-bold text-gray-900">
                        {{ formatPercentage(taskTimeData.taskTimePercentage) }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        времени на задачи
                      </div>
                    </div>
                  </div>

                  <!-- Интерактивная легенда -->
                  <div class="flex-1">
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Распределение времени</h4>
                      <div class="space-y-3">
                        <div v-for="(item, index) in taskTimeLegend" :key="index"
                             class="legend-item p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                             :class="{ 'bg-gray-50 shadow-sm': hoveredLegendIndex === index }"
                             @mouseenter="hoverLegend(index)"
                             @mouseleave="hoverLegend(null)">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center">
                              <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: item.color }"></div>
                              <div>
                                <div class="text-sm font-medium text-gray-900">{{ item.label }}</div>
                                <div class="text-xs text-gray-500">{{ item.description }}</div>
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="text-sm font-semibold" :style="{ color: item.color }">
                                {{ formatDuration(item.value) }}
                              </div>
                              <div class="text-xs text-gray-500">{{ item.percentage }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Статистика по задачам -->
                    <div class="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Статистика задач</h4>
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-700">Всего задач:</span>
                          <span class="text-sm font-semibold text-orange-600">{{ taskTimeData.tasks.length }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Информация о рабочем дне -->
                <div class="mt-8 space-y-6">
                  <h4 class="text-lg font-semibold text-gray-900">Данные о рабочем дне</h4>
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">Настройки рабочего времени</h5>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Учет времени:</span>
                            <B24Badge :color="workDaySettings.UF_TIMEMAN ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TIMEMAN ? 'Включен' : 'Выключен' }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Свободный график:</span>
                            <B24Badge :color="workDaySettings.UF_TM_FREE ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TM_FREE ? 'Да' : 'Нет' }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Начало дня до:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MAX_START || 'Не задано' }}</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Конец дня после:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MIN_FINISH || 'Не задано' }}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">Текущий рабочий день</h5>
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Статус:</span>
                            <B24Badge :class="getWorkDayStatusClass(workDayStatus.STATUS)">
                              {{ getWorkDayStatusText(workDayStatus.STATUS) }}
                            </B24Badge>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Начало:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ formatDateTime(workDayStatus.TIME_START) || 'Не начат' }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Длительность:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ workDayStatus.DURATION || '00:00:00' }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-blue-700">Перерывы:</span>
                            <span class="text-sm font-medium text-blue-900">
                              {{ workDayStatus.TIME_LEAKS || '00:00:00' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Сообщение об отсутствии данных -->
              <div v-else-if="!isLoading && !hasData" class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm">Нет данных за выбранный день</p>
                <B24Button @click="refreshData" color="air-tertiary" class="mt-4">
                  Попробовать снова
                </B24Button>
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
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Chart from 'chart.js/auto'

export default {
  name: 'WorkDayStatistics',
  components: {
    Sidebar
  },
  setup() {
    const route = useRoute()

    // Получаем userId из query параметров
    const viewedUserId = ref(null)

    // Основные данные
    const activeTab = ref('bitrix-time')
    const selectedDay = ref(new Date().toISOString().split('T')[0])
    const calendarDate = ref(null)
    const isLoading = ref(false)
    const currentUserId = ref(null)
    const historyDays = ref(30)
    const hoveredLegendIndex = ref(null)

    // Refs для canvas элементов
    const bitrixTimeChart = ref(null)
    const taskTimeChart = ref(null)

    // Экземпляры Chart.js
    let bitrixChartInstance = null
    let taskChartInstance = null

    // Данные о рабочем дне
    const workDaySettings = ref({
      UF_TIMEMAN: false,
      UF_TM_FREE: false,
      UF_TM_MAX_START: null,
      UF_TM_MIN_FINISH: null,
      UF_TM_MIN_DURATION: null,
      UF_TM_ALLOWED_DELTA: null,
      ADMIN: false
    })

    const workDayStatus = ref({
      STATUS: 'CLOSED',
      TIME_START: null,
      TIME_FINISH: null,
      DURATION: '00:00:00',
      TIME_LEAKS: '00:00:00',
      ACTIVE: false
    })

    const workDayData = ref({
      totalWorkDaySeconds: 28800, // 8 часов по умолчанию
      bitrixTimeSeconds: 0,
      elapsedTaskTimeSeconds: 0,
      bitrixTimeNonTaskSeconds: 0,
      workDurationSeconds: 0,
      breakTimeSeconds: 0,

      bitrixTimePercentage: 0,
      workDurationPercentage: 0,
      bitrixTimeOfWorkedPercentage: 0,
      taskTimeOfBitrixPercentage: 0,
      nonBitrixTimeSeconds: 0,
      nonBitrixTimePercentage: 0,
      remainingWorkDaySeconds: 0,
      remainingPercentage: 0,
      averageActivityPerHour: 0,
      projectedBitrixTime: 0,
      projectedPercentage: 0
    })

    const taskTimeData = ref({
      totalWorkDaySeconds: 28800,
      workDurationSeconds: 0,
      elapsedTaskTimeSeconds: 0,
      tasks: [],

      taskTimePercentage: 0,
      workDurationPercentage: 0,
      taskTimeOfWorkedPercentage: 0,
      taskEfficiencyPercentage: 0,
      nonTaskTimeSeconds: 0,
      averageTimePerTask: 0,
      maxTaskTime: 0,
      projectedTaskTime: 0,
      projectedTaskPercentage: 0
    })

    const crmData = ref({
      // Созданные сущности
      createdDealsCount: 0,
      createdLeadsCount: 0,
      createdContactsCount: 0,
      createdCompaniesCount: 0,
      createdInvoicesCount: 0,
      createdQuotesCount: 0,

      // Обновленные сущности
      updatedDealsCount: 0,
      updatedLeadsCount: 0,
      updatedContactsCount: 0,
      updatedCompaniesCount: 0,
      updatedInvoicesCount: 0,
      updatedQuotesCount: 0,

      // Статусы сделок
      successfulDealsCount: 0,
      failedDealsCount: 0,

      // Статусы лидов
      convertedLeadsCount: 0,
      junkLeadsCount: 0
    })

    // Константы
    const minCalendarDate = new CalendarDate(2020, 1, 1)
    const maxCalendarDate = new CalendarDate(2030, 12, 31)

    // Цветовая схема согласно требованиям
    const CHART_COLORS = {
      WORK_DAY: '#f3f4f6', // Светло-серый - рабочий день по плану
      BITRIX_TIME: '#3b82f6', // Синий - время в Bitrix24
      BREAK_TIME: '#f97316', // Оранжевый - перерыв
      TASK_TIME: '#f97316', // Оранжевый - время на задачи
      NON_TASK_TIME: '#10b981' // Зеленый - время вне задач
    }

    // Вычисляемые свойства для легенды
    const bitrixTimeLegend = computed(() => {
      const data = workDayData.value
      const workDayStatusValue = workDayStatus.value

      // Проверяем, сегодняшний ли рабочий день
      const today = new Date().toISOString().split('T')[0]
      const workDayStart = workDayStatusValue.TIME_START
      const isTodayWorkDay = workDayStart && workDayStart.includes(today)

      // Если рабочий день не сегодняшний, используем totalWorkDaySeconds
      let baseTime = isTodayWorkDay ?
          (data.workDurationSeconds || data.totalWorkDaySeconds) :
          data.totalWorkDaySeconds

      let nonBitrixTime = Math.max(0, baseTime - data.bitrixTimeSeconds -
          (isTodayWorkDay ? data.breakTimeSeconds : 0))

      return [
        {
          label: 'Время в Bitrix24',
          description: 'Время всех записей',
          value: data.bitrixTimeSeconds,
          percentage: baseTime > 0 ? `${((data.bitrixTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.BITRIX_TIME
        },
        {
          label: 'Перерывы',
          description: 'Время перерывов',
          value: isTodayWorkDay ? data.breakTimeSeconds : 0,
          percentage: isTodayWorkDay && baseTime > 0 ?
              `${((data.breakTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.BREAK_TIME,
          details: !isTodayWorkDay ? 'Только для сегодняшних рабочих дней' : null
        },
        {
          label: isTodayWorkDay ? 'Вне Bitrix24' : 'Рабочее время',
          description: isTodayWorkDay ? 'Время вне системы' : 'Запланированное рабочее время',
          value: nonBitrixTime,
          percentage: baseTime > 0 ? `${((nonBitrixTime / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.WORK_DAY
        }
      ]
    })

    const taskTimeLegend = computed(() => {
      const data = taskTimeData.value
      const workDayStatusValue = workDayStatus.value

      // Проверяем, сегодняшний ли рабочий день
      const today = new Date().toISOString().split('T')[0]
      const workDayStart = workDayStatusValue.TIME_START
      const isTodayWorkDay = workDayStart && workDayStart.includes(today)

      // Если рабочий день не сегодняшний, используем totalWorkDaySeconds
      let baseTime = isTodayWorkDay ?
          (data.workDurationSeconds || data.totalWorkDaySeconds) :
          data.totalWorkDaySeconds

      let nonTaskTime = Math.max(0, baseTime - data.elapsedTaskTimeSeconds -
          (isTodayWorkDay ? workDayData.value.breakTimeSeconds : 0))

      return [
        {
          label: 'Время на задачи',
          description: 'Затраченное время на выполнение задач',
          value: data.elapsedTaskTimeSeconds,
          percentage: baseTime > 0 ? `${((data.elapsedTaskTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.TASK_TIME
        },
        {
          label: 'Перерывы',
          description: 'Время перерывов',
          value: isTodayWorkDay ? workDayData.value.breakTimeSeconds : 0,
          percentage: isTodayWorkDay && baseTime > 0 ?
              `${((workDayData.value.breakTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.BREAK_TIME,
          details: !isTodayWorkDay ? 'Только для сегодняшних рабочих дней' : null
        },
        {
          label: isTodayWorkDay ? 'Вне задач' : 'Рабочее время',
          description: isTodayWorkDay ? 'Время работы вне задач' : 'Запланированное рабочее время',
          value: nonTaskTime,
          percentage: baseTime > 0 ? `${((nonTaskTime / baseTime) * 100).toFixed(1)}%` : '0%',
          color: CHART_COLORS.WORK_DAY
        }
      ]
    })

    // Вычисляемые свойства
    const pageTitle = computed(() => {
      if (viewedUserId.value && viewedUserId.value !== currentUserId.value) {
        return `Статистика рабочего дня пользователя #${viewedUserId.value}`
      }
      return 'Статистика рабочего дня'
    })

    const hasData = computed(() => {
      return workDayData.value.bitrixTimeSeconds > 0 ||
          workDayData.value.elapsedTaskTimeSeconds > 0 ||
          workDayData.value.workDurationSeconds > 0 ||
          workDayStatus.value.STATUS !== 'CLOSED' ||
          taskTimeData.value.elapsedTaskTimeSeconds > 0
    })

    // Вспомогательные методы
    const getCalendarDateFromString = (dateString) => {
      if (!dateString) return null
      const date = new Date(dateString)
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }

    const getStringFromCalendarDate = (calendarDate) => {
      if (!calendarDate) return ''
      const year = calendarDate.year
      const month = calendarDate.month.toString().padStart(2, '0')
      const day = calendarDate.day.toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const formatDayDisplay = (dateString) => {
      if (!dateString) return 'Выберите дату'
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) return 'Сегодня'
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера'

      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const formatDuration = (seconds) => {
      if (!seconds || seconds <= 0) return '0 сек'
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60

      const parts = []
      if (hours > 0) parts.push(`${hours} ч`)
      if (minutes > 0) parts.push(`${minutes} мин`)
      if (secs > 0 || parts.length === 0) parts.push(`${secs} сек`)

      return parts.join(' ')
    }

    const formatPercentage = (value) => {
      return `${value.toFixed(1)}%`
    }

    const formatDateTime = (dateTime) => {
      if (!dateTime) return null
      return new Date(dateTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const timeStringToSeconds = (timeString) => {
      if (!timeString) return 0
      const parts = timeString.split(':')
      if (parts.length !== 3) return 0

      const hours = parseInt(parts[0])
      const minutes = parseInt(parts[1])
      const seconds = parseInt(parts[2])

      return hours * 3600 + minutes * 60 + seconds
    }

    const getWorkDayStatusClass = (status) => {
      const statusMap = {
        'OPENED': 'bg-green-100 text-green-800',
        'CLOSED': 'bg-gray-100 text-gray-800',
        'PAUSED': 'bg-yellow-100 text-yellow-800',
        'EXPIRED': 'bg-red-100 text-red-800'
      }
      return statusMap[status] || 'bg-gray-100 text-gray-800'
    }

    const getWorkDayStatusText = (status) => {
      const statusMap = {
        'OPENED': 'Открыт',
        'CLOSED': 'Закрыт',
        'PAUSED': 'Приостановлен',
        'EXPIRED': 'Истек'
      }
      return statusMap[status] || 'Неизвестно'
    }

    const isDateDisabled = (date) => {
      const dayOfWeek = date.toDate('UTC').getDay()
      return dayOfWeek === 0 || dayOfWeek === 6
    }

    const isDateUnavailable = (date) => {
      if (!historyDays.value || historyDays.value <= 0) return false

      const today = new Date()
      const selectedDate = date.toDate('UTC')
      const diffTime = today.getTime() - selectedDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > historyDays.value
    }

    // Методы для работы с Chart.js
    const hoverLegend = (index) => {
      hoveredLegendIndex.value = index

      if (activeTab.value === 'bitrix-time' && bitrixChartInstance) {
        const dataset = bitrixChartInstance.data.datasets[0]
        dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
            i === index ? lightenColor(color, 20) : bitrixTimeLegend.value[i].color
        )
        bitrixChartInstance.update('none')
      } else if (activeTab.value === 'task-time' && taskChartInstance) {
        const dataset = taskChartInstance.data.datasets[0]
        dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
            i === index ? lightenColor(color, 20) : taskTimeLegend.value[i].color
        )
        taskChartInstance.update('none')
      }
    }

    const lightenColor = (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) + amt
      const G = (num >> 8 & 0x00FF) + amt
      const B = (num & 0x0000FF) + amt

      return `#${(
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
          .toString(16)
          .slice(1)}`
    }

    const createBitrixTimeChart = () => {
      if (bitrixChartInstance) {
        bitrixChartInstance.destroy()
      }

      if (!bitrixTimeChart.value) return

      const chartData = {
        labels: bitrixTimeLegend.value.map(item => item.label),
        datasets: [{
          data: bitrixTimeLegend.value.map(item => item.value),
          backgroundColor: bitrixTimeLegend.value.map(item => item.color),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 15,
          hoverBorderWidth: 3
        }]
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = bitrixTimeLegend.value[context.dataIndex]
                return [
                  item.label,
                  `${formatDuration(context.raw)} (${item.percentage})`,
                  item.description
                ]
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }

      bitrixChartInstance = new Chart(bitrixTimeChart.value, {
        type: 'doughnut',
        data: chartData,
        options: options
      })

      bitrixTimeChart.value.addEventListener('mouseleave', () => {
        hoverLegend(null)
      })
    }

    const createTaskTimeChart = () => {
      if (taskChartInstance) {
        taskChartInstance.destroy()
      }

      if (!taskTimeChart.value) return

      const chartData = {
        labels: taskTimeLegend.value.map(item => item.label),
        datasets: [{
          data: taskTimeLegend.value.map(item => item.value),
          backgroundColor: taskTimeLegend.value.map(item => item.color),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 15,
          hoverBorderWidth: 3
        }]
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = taskTimeLegend.value[context.dataIndex]
                return [
                  item.label,
                  `${formatDuration(context.raw)} (${item.percentage})`,
                  item.description
                ]
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }

      taskChartInstance = new Chart(taskTimeChart.value, {
        type: 'doughnut',
        data: chartData,
        options: options
      })

      taskTimeChart.value.addEventListener('mouseleave', () => {
        hoverLegend(null)
      })
    }

    const updateCharts = () => {
      nextTick(() => {
        if (activeTab.value === 'bitrix-time') {
          createBitrixTimeChart()
        } else if (activeTab.value === 'task-time') {
          createTaskTimeChart()
        }
      })
    }

    // Основные методы
    const handleCalendarDateChange = (newDate) => {
      if (newDate) {
        selectedDay.value = getStringFromCalendarDate(newDate)
        loadData()
      }
    }

    const onTabChange = (newTab) => {
      activeTab.value = newTab
      updateCharts()
    }

    const refreshData = () => {
      // Сбрасываем данные перед загрузкой
      workDayData.value = {
        totalWorkDaySeconds: 28800,
        bitrixTimeSeconds: 0,
        elapsedTaskTimeSeconds: 0,
        bitrixTimeNonTaskSeconds: 0,
        workDurationSeconds: 0,
        breakTimeSeconds: 0,

        bitrixTimePercentage: 0,
        workDurationPercentage: 0,
        bitrixTimeOfWorkedPercentage: 0,
        taskTimeOfBitrixPercentage: 0,
        nonBitrixTimeSeconds: 0,
        nonBitrixTimePercentage: 0,
        remainingWorkDaySeconds: 0,
        remainingPercentage: 0,
        averageActivityPerHour: 0,
        projectedBitrixTime: 0,
        projectedPercentage: 0
      }

      taskTimeData.value = {
        totalWorkDaySeconds: 28800,
        workDurationSeconds: 0,
        elapsedTaskTimeSeconds: 0,
        tasks: [],

        taskTimePercentage: 0,
        workDurationPercentage: 0,
        taskTimeOfWorkedPercentage: 0,
        taskEfficiencyPercentage: 0,
        nonTaskTimeSeconds: 0,
        averageTimePerTask: 0,
        maxTaskTime: 0,
        projectedTaskTime: 0,
        projectedTaskPercentage: 0
      }

      crmData.value = {
        createdDealsCount: 0,
        createdLeadsCount: 0,
        createdContactsCount: 0,
        createdCompaniesCount: 0,
        createdInvoicesCount: 0,
        createdQuotesCount: 0,

        updatedDealsCount: 0,
        updatedLeadsCount: 0,
        updatedContactsCount: 0,
        updatedCompaniesCount: 0,
        updatedInvoicesCount: 0,
        updatedQuotesCount: 0,

        successfulDealsCount: 0,
        failedDealsCount: 0,

        convertedLeadsCount: 0,
        junkLeadsCount: 0
      }

      loadData()
    }

    // Методы загрузки данных
    const loadCurrentUser = () => {
      return new Promise((resolve, reject) => {
        // Проверяем, есть ли userId в query параметрах
        const userIdFromQuery = route.query.userId

        if (userIdFromQuery) {
          viewedUserId.value = parseInt(userIdFromQuery)
          currentUserId.value = viewedUserId.value

          // Загружаем профиль выбранного пользователя
          BX24.callMethod('user.get', {
            FILTER: { 'ID': currentUserId.value },
            SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL']
          }, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              const userData = result.data()
              if (userData.length > 0) {
                resolve(userData[0])
              } else {
                reject(new Error('Пользователь не найден'))
              }
            }
          })
        } else {
          // Иначе используем текущего пользователя
          viewedUserId.value = null
          BX24.callMethod('user.current', {}, (result) => {
            if (result.error()) {
              reject(result.error())
            } else {
              const userData = result.data()
              currentUserId.value = parseInt(userData.ID)
              resolve(userData)
            }
          })
        }
      })
    }

    const loadWorkDaySettings = () => {
      return new Promise((resolve, reject) => {
        BX24.callMethod('timeman.settings', {
          USER_ID: currentUserId.value
        }, (result) => {
          if (result.error()) {
            reject(result.error())
          } else {
            workDaySettings.value = result.data()

            if (workDaySettings.value.UF_TM_MIN_DURATION) {
              const totalSeconds = timeStringToSeconds(
                  workDaySettings.value.UF_TM_MIN_DURATION
              )
              workDayData.value.totalWorkDaySeconds = totalSeconds
              taskTimeData.value.totalWorkDaySeconds = totalSeconds
            }

            resolve(result.data())
          }
        })
      })
    }

    const loadWorkDayStatus = () => {
      return new Promise((resolve, reject) => {
        BX24.callMethod('timeman.status', {
          USER_ID: currentUserId.value
        }, (result) => {
          if (result.error()) {
            reject(result.error())
          } else {
            workDayStatus.value = result.data()

            const workDurationSeconds = timeStringToSeconds(
                workDayStatus.value.DURATION
            )
            const breakTimeSeconds = timeStringToSeconds(
                workDayStatus.value.TIME_LEAKS || '00:00:00'
            )

            workDayData.value.workDurationSeconds = workDurationSeconds
            taskTimeData.value.workDurationSeconds = workDurationSeconds

            // Ключевое изменение: проверяем, что рабочий день сегодняшний
            const today = new Date().toISOString().split('T')[0]
            const workDayStart = workDayStatus.value.TIME_START
            const isTodayWorkDay = workDayStart && workDayStart.includes(today)

            if (isTodayWorkDay) {
              // Сегодняшний рабочий день - учитываем перерывы
              workDayData.value.breakTimeSeconds = breakTimeSeconds
            } else {
              // Не сегодняшний день - игнорируем перерывы (baseTime = totalWorkDaySeconds)
              workDayData.value.breakTimeSeconds = 0
            }

            resolve(result.data())
          }
        })
      })
    }

    const loadBitrixTimeData = async () => {
      try {
        const sectionResult = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.section.get', {
            ENTITY: 'pr_tracking',
            FILTER: { 'NAME': selectedDay.value },
            SELECT: ['ID', 'NAME']
          }, (result) => {
            if (result.error()) {
              reject(result.error())
              return
            }
            resolve(result.data())
          })
        })

        const sections = sectionResult
        if (sections.length === 0) {
          workDayData.value.bitrixTimeSeconds = 0
          return []
        }

        const sectionId = sections[0].ID

        const itemsResult = await new Promise((resolve, reject) => {
          BX24.callMethod('entity.item.get', {
            ENTITY: 'pr_tracking',
            FILTER: {
              SECTION_ID: sectionId,
              'PROPERTY_USER_ID': currentUserId.value
            },
            SELECT: ['PROPERTY_VALUES']
          }, (result) => {
            if (result.error()) {
              reject(result.error())
              return
            }
            resolve(result.data())
          })
        })

        const items = itemsResult
        let totalBitrixTime = 0

        items.forEach(item => {
          const props = item.PROPERTY_VALUES || {}
          const pageTime = parseInt(props.PAGE_TIME) || 0
          totalBitrixTime += pageTime
        })

        workDayData.value.bitrixTimeSeconds = totalBitrixTime

        return items
      } catch (error) {
        console.error('Ошибка загрузки данных Bitrix24:', error)
        workDayData.value.bitrixTimeSeconds = 0
        return []
      }
    }

    const loadElapsedTaskTime = async () => {
      try {
        const startOfDay = new Date(selectedDay.value + 'T00:00:00')
        const endOfDay = new Date(selectedDay.value + 'T23:59:59')

        return new Promise((resolve, reject) => {
          BX24.callMethod('task.elapseditem.getlist', {
            'ORDER': {'ID': 'DESC'},
            'FILTER': {
              'USER_ID': currentUserId.value,
              '>=CREATED_DATE': startOfDay.toISOString(),
              '<=CREATED_DATE': endOfDay.toISOString()
            },
            'SELECT': ['TASK_ID', 'MINUTES', 'COMMENT_TEXT', 'CREATED_DATE']
          }, (result) => {
            if (result.error()) {
              reject(result.error())
              return
            }

            const elapsedItems = result.data()
            let totalTaskTime = 0

            elapsedItems.forEach(item => {
              const minutes = parseInt(item.MINUTES) || 0
              totalTaskTime += minutes * 60
            })

            resolve(totalTaskTime)
          })
        })
      } catch (error) {
        console.error('Ошибка загрузки времени задач:', error)
        return 0
      }
    }

    const loadTaskTimeData = async () => {
      try {
        const startOfDay = new Date(selectedDay.value + 'T00:00:00')
        const endOfDay = new Date(selectedDay.value + 'T23:59:59')

        const elapsedItemsResult = await new Promise((resolve, reject) => {
          BX24.callMethod('task.elapseditem.getlist', {
            'ORDER': {'ID': 'DESC'},
            'FILTER': {
              'USER_ID': currentUserId.value,
              '>=CREATED_DATE': startOfDay.toISOString(),
              '<=CREATED_DATE': endOfDay.toISOString()
            },
            'SELECT': ['TASK_ID', 'MINUTES', 'COMMENT_TEXT', 'CREATED_DATE']
          }, (result) => {
            if (result.error()) {
              reject(result.error())
              return
            }
            resolve(result.data())
          })
        })

        const elapsedItems = elapsedItemsResult
        const taskTimeMap = new Map()
        let totalElapsedTaskTime = 0

        elapsedItems.forEach(item => {
          const taskId = item.TASK_ID
          const minutes = parseInt(item.MINUTES) || 0
          const seconds = minutes * 60

          if (!taskTimeMap.has(taskId)) {
            taskTimeMap.set(taskId, {
              id: taskId,
              timeSpent: 0,
              elapsedItemsCount: 0,
              comments: []
            })
          }

          const taskData = taskTimeMap.get(taskId)
          taskData.timeSpent += seconds
          taskData.elapsedItemsCount++
          taskData.comments.push(item.COMMENT_TEXT || '')
          totalElapsedTaskTime += seconds
        })

        const taskIds = Array.from(taskTimeMap.keys())
        const tasksArray = []

        if (taskIds.length > 0) {
          const batchCalls = taskIds.map(taskId => ['task.get', { 'TASKID': taskId }])

          await new Promise((resolve, reject) => {
            BX24.callBatch(batchCalls, (results) => {
              taskIds.forEach((taskId, index) => {
                const result = results[index]
                if (result && !result.error()) {
                  const taskInfo = result.data()
                  const taskData = taskTimeMap.get(taskId)
                  tasksArray.push({
                    id: taskId,
                    title: taskInfo?.TITLE || `Задача #${taskId}`,
                    status: taskInfo?.STATUS || 'Неизвестен',
                    timeSpent: taskData.timeSpent,
                    elapsedItemsCount: taskData.elapsedItemsCount,
                    comments: taskData.comments
                  })
                }
              })
              resolve()
            })
          })
        }

        const maxTaskTime = tasksArray.length > 0
            ? Math.max(...tasksArray.map(t => t.timeSpent))
            : 0
        const averageTimePerTask = tasksArray.length > 0
            ? totalElapsedTaskTime / tasksArray.length
            : 0

        tasksArray.sort((a, b) => b.timeSpent - a.timeSpent)

        taskTimeData.value.tasks = tasksArray
        taskTimeData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime
        workDayData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime
        taskTimeData.value.maxTaskTime = maxTaskTime
        taskTimeData.value.averageTimePerTask = averageTimePerTask

        return tasksArray
      } catch (error) {
        console.error('Ошибка загрузки данных задач:', error)
        return []
      }
    }

    const loadCrmData = async () => {
      try {
        const startOfDay = new Date(selectedDay.value + 'T00:00:00')
        const endOfDay = new Date(selectedDay.value + 'T23:59:59')

        const formatDateForAPI = (date) => {
          return date.toISOString().replace('T', ' ').split('.')[0]
        }

        const startDateStr = formatDateForAPI(startOfDay)
        const endDateStr = formatDateForAPI(endOfDay)

        // Загружаем данные о сделках (созданные и обновленные)
        const dealsCreated = await new Promise((resolve) => {
          BX24.callMethod('crm.deal.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'STAGE_ID', 'CLOSED', 'DATE_MODIFY']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        const dealsUpdated = await new Promise((resolve) => {
          BX24.callMethod('crm.deal.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'STAGE_ID', 'CLOSED']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        // Загружаем данные о лидах
        const leadsCreated = await new Promise((resolve) => {
          BX24.callMethod('crm.lead.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'STATUS_ID', 'DATE_MODIFY']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        const leadsUpdated = await new Promise((resolve) => {
          BX24.callMethod('crm.lead.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'STATUS_ID']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        // Загружаем данные о контактах
        const contactsCreated = await new Promise((resolve) => {
          BX24.callMethod('crm.contact.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'DATE_MODIFY']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        const contactsUpdated = await new Promise((resolve) => {
          BX24.callMethod('crm.contact.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        // Загружаем данные о компаниях
        const companiesCreated = await new Promise((resolve) => {
          BX24.callMethod('crm.company.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'DATE_MODIFY']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        const companiesUpdated = await new Promise((resolve) => {
          BX24.callMethod('crm.company.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID']
          }, (result) => {
            if (result.error()) {
              resolve([])
            } else {
              resolve(result.data())
            }
          })
        })

        // Считаем успешные и провальные сделки
        let successfulDeals = 0
        let failedDeals = 0

        dealsCreated.forEach(deal => {
          if (deal.CLOSED === 'Y') {
            // Проверяем, успешная ли сделка (обычно STAGE_ID для успешных сделок содержит "WON" или "SUCCESS")
            if (deal.STAGE_ID && (deal.STAGE_ID.includes('WON') || deal.STAGE_ID.includes('SUCCESS'))) {
              successfulDeals++
            } else {
              failedDeals++
            }
          }
        })

        // Считаем конвертированные и провальные лиды
        let convertedLeads = 0
        let junkLeads = 0

        leadsCreated.forEach(lead => {
          if (lead.STATUS_ID === 'CONVERTED') {
            convertedLeads++
          } else if (lead.STATUS_ID === 'JUNK') {
            junkLeads++
          }
        })

        crmData.value = {
          createdDealsCount: dealsCreated.length,
          createdLeadsCount: leadsCreated.length,
          createdContactsCount: contactsCreated.length,
          createdCompaniesCount: companiesCreated.length,
          createdInvoicesCount: 0, // Можно добавить аналогичную логику для инвойсов
          createdQuotesCount: 0, // Можно добавить аналогичную логику для квот

          updatedDealsCount: dealsUpdated.length,
          updatedLeadsCount: leadsUpdated.length,
          updatedContactsCount: contactsUpdated.length,
          updatedCompaniesCount: companiesUpdated.length,
          updatedInvoicesCount: 0,
          updatedQuotesCount: 0,

          successfulDealsCount: successfulDeals,
          failedDealsCount: failedDeals,

          convertedLeadsCount: convertedLeads,
          junkLeadsCount: junkLeads
        }

      } catch (error) {
        console.error('Ошибка загрузки данных CRM:', error)
        // В случае ошибки устанавливаем нулевые значения
        Object.keys(crmData.value).forEach(key => {
          crmData.value[key] = 0
        })
      }
    }

    const calculateDerivedData = () => {
      const data = workDayData.value
      const totalBitrixTime = data.bitrixTimeSeconds

      // Проверяем, сегодняшний ли рабочий день
      const today = new Date().toISOString().split('T')[0]
      const workDayStart = workDayStatus.value.TIME_START
      const isTodayWorkDay = workDayStart && workDayStart.includes(today)

      const actualBreakTime = isTodayWorkDay ? data.breakTimeSeconds : 0

      // Базовое время зависит от того, сегодняшний ли день
      const baseTime = isTodayWorkDay ?
          (data.workDurationSeconds || data.totalWorkDaySeconds) :
          data.totalWorkDaySeconds

      // Время вне Bitrix24
      data.nonBitrixTimeSeconds = Math.max(0,
          baseTime - totalBitrixTime - actualBreakTime
      )

      // Процентные соотношения
      data.bitrixTimePercentage = baseTime > 0
          ? (totalBitrixTime / baseTime) * 100
          : 0

      data.workDurationPercentage = data.totalWorkDaySeconds > 0
          ? (data.workDurationSeconds / data.totalWorkDaySeconds) * 100
          : 0

      data.bitrixTimeOfWorkedPercentage = data.workDurationSeconds > 0
          ? (totalBitrixTime / data.workDurationSeconds) * 100
          : 0

      data.taskTimeOfBitrixPercentage = totalBitrixTime > 0
          ? (data.elapsedTaskTimeSeconds / totalBitrixTime) * 100
          : 0

      data.nonBitrixTimePercentage = baseTime > 0
          ? (data.nonBitrixTimeSeconds / baseTime) * 100
          : 0

      // Для сегодняшних дней считаем оставшееся время
      if (isTodayWorkDay) {
        data.remainingWorkDaySeconds = Math.max(0, data.totalWorkDaySeconds - data.workDurationSeconds)
      } else {
        // Для несегодняшних дней - рабочее время уже прошло полностью
        data.remainingWorkDaySeconds = 0
      }

      data.remainingPercentage = data.totalWorkDaySeconds > 0
          ? (data.remainingWorkDaySeconds / data.totalWorkDaySeconds) * 100
          : 0

      // Средняя активность в час
      const workDurationHours = data.workDurationSeconds / 3600
      data.averageActivityPerHour = workDurationHours > 0
          ? totalBitrixTime / 3600 / workDurationHours
          : 0

      // Прогнозируемое время
      const workDayProgress = isTodayWorkDay && data.totalWorkDaySeconds > 0
          ? data.workDurationSeconds / data.totalWorkDaySeconds
          : 1 // Для несегодняшних дней считаем, что рабочий день полностью отработан

      data.projectedBitrixTime = workDayProgress > 0
          ? totalBitrixTime / workDayProgress
          : totalBitrixTime

      data.projectedPercentage = data.totalWorkDaySeconds > 0
          ? (data.projectedBitrixTime / data.totalWorkDaySeconds) * 100
          : 0

      // Ограничиваем значения до 100%
      data.bitrixTimePercentage = Math.min(data.bitrixTimePercentage, 100)
      data.workDurationPercentage = Math.min(data.workDurationPercentage, 100)
      data.bitrixTimeOfWorkedPercentage = Math.min(data.bitrixTimeOfWorkedPercentage, 100)
      data.taskTimeOfBitrixPercentage = Math.min(data.taskTimeOfBitrixPercentage, 100)
      data.nonBitrixTimePercentage = Math.min(data.nonBitrixTimePercentage, 100)
      data.projectedPercentage = Math.min(data.projectedPercentage, 100)

      // Для несегодняшних дней устанавливаем некоторые значения более логично
      if (!isTodayWorkDay) {
        // Для прошлых дней прогресс всегда 100%
        data.workDurationPercentage = 100
        data.remainingPercentage = 0
        data.projectedBitrixTime = totalBitrixTime
      }
    }

    const calculateTaskTimeData = () => {
      const data = taskTimeData.value
      const elapsedTaskTime = data.elapsedTaskTimeSeconds

      // Проверяем, сегодняшний ли рабочий день
      const today = new Date().toISOString().split('T')[0]
      const workDayStart = workDayStatus.value.TIME_START
      const isTodayWorkDay = workDayStart && workDayStart.includes(today)

      const actualBreakTime = isTodayWorkDay ? workDayData.value.breakTimeSeconds : 0

      // Базовое время зависит от того, сегодняшний ли день
      const baseTime = isTodayWorkDay ?
          (data.workDurationSeconds || data.totalWorkDaySeconds) :
          data.totalWorkDaySeconds

      data.taskTimePercentage = baseTime > 0
          ? (elapsedTaskTime / baseTime) * 100
          : 0

      data.workDurationPercentage = data.totalWorkDaySeconds > 0
          ? (data.workDurationSeconds / data.totalWorkDaySeconds) * 100
          : 0

      data.taskTimeOfWorkedPercentage = data.workDurationSeconds > 0
          ? (elapsedTaskTime / data.workDurationSeconds) * 100
          : 0

      const totalBitrixTime = workDayData.value.bitrixTimeSeconds
      data.taskEfficiencyPercentage = totalBitrixTime > 0
          ? (elapsedTaskTime / totalBitrixTime) * 100
          : 0

      data.nonTaskTimeSeconds = Math.max(0, baseTime - elapsedTaskTime - actualBreakTime)

      const workDayProgress = isTodayWorkDay && data.totalWorkDaySeconds > 0
          ? data.workDurationSeconds / data.totalWorkDaySeconds
          : 1

      data.projectedTaskTime = workDayProgress > 0
          ? elapsedTaskTime / workDayProgress
          : 0

      data.projectedTaskPercentage = data.totalWorkDaySeconds > 0
          ? (data.projectedTaskTime / data.totalWorkDaySeconds) * 100
          : 0

      // Ограничиваем значения до 100%
      data.taskTimePercentage = Math.min(data.taskTimePercentage, 100)
      data.workDurationPercentage = Math.min(data.workDurationPercentage, 100)
      data.taskTimeOfWorkedPercentage = Math.min(data.taskTimeOfWorkedPercentage, 100)
      data.taskEfficiencyPercentage = Math.min(data.taskEfficiencyPercentage, 100)
      data.projectedTaskPercentage = Math.min(data.projectedTaskPercentage, 100)
    }

    const loadData = async () => {
      try {
        isLoading.value = true

        calendarDate.value = getCalendarDateFromString(selectedDay.value)

        await loadCurrentUser()
        await loadWorkDaySettings()
        await loadWorkDayStatus()
        await Promise.all([
          loadBitrixTimeData(),
          loadTaskTimeData(),
          loadCrmData()
        ])

        calculateDerivedData()
        calculateTaskTimeData()

        updateCharts()

        if (typeof toast !== 'undefined') {
          toast.add({
            description: 'Данные успешно загружены',
            variant: 'success'
          })
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)

        if (typeof toast !== 'undefined') {
          toast.add({
            description: 'Ошибка при загрузке данных',
            variant: 'error'
          })
        }
      } finally {
        isLoading.value = false
      }
    }

    const loadAppSettings = async () => {
      try {
        if (typeof BX24 !== 'undefined' && BX24.appOption) {
          const days = BX24.appOption.get('page_tracking_history_days')
          if (days) {
            historyDays.value = parseInt(days) || 30
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек приложения:', error)
      }
    }

    // Наблюдатели
    watch(workDayData, () => {
      if (activeTab.value === 'bitrix-time' && bitrixChartInstance && bitrixTimeChart.value) {
        const legend = bitrixTimeLegend.value
        bitrixChartInstance.data.datasets[0].data = legend.map(item => item.value)
        bitrixChartInstance.data.labels = legend.map(item => item.label)
        bitrixChartInstance.data.datasets[0].backgroundColor = legend.map(item => item.color)
        bitrixChartInstance.update()
      }
    }, { deep: true })

    watch(taskTimeData, () => {
      if (activeTab.value === 'task-time' && taskChartInstance && taskTimeChart.value) {
        const legend = taskTimeLegend.value
        taskChartInstance.data.datasets[0].data = legend.map(item => item.value)
        taskChartInstance.data.labels = legend.map(item => item.label)
        taskChartInstance.data.datasets[0].backgroundColor = legend.map(item => item.color)
        taskChartInstance.update()
      }
    }, { deep: true })

    // Наблюдатель за изменением query параметров
    watch(() => route.query.userId, (newUserId) => {
      if (newUserId) {
        refreshData()
      }
    })

    // Инициализация
    onMounted(async () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          try {
            await loadAppSettings()
            await loadData()
          } catch (error) {
            console.error('Ошибка инициализации:', error)
            isLoading.value = false
          }
        })
      } else {
        isLoading.value = false
      }
    })

    return {
      // Данные
      activeTab,
      selectedDay,
      calendarDate,
      isLoading,
      workDaySettings,
      workDayStatus,
      workDayData,
      taskTimeData,
      crmData,
      bitrixTimeChart,
      taskTimeChart,
      hoveredLegendIndex,
      viewedUserId,
      currentUserId,

      // Легенды
      bitrixTimeLegend,
      taskTimeLegend,

      // Константы
      minCalendarDate,
      maxCalendarDate,

      // Вычисляемые свойства
      hasData,
      pageTitle,

      // Методы
      handleCalendarDateChange,
      onTabChange,
      refreshData,
      formatDayDisplay,
      formatDuration,
      formatPercentage,
      formatDateTime,
      getWorkDayStatusClass,
      getWorkDayStatusText,
      isDateDisabled,
      isDateUnavailable,
      hoverLegend
    }
  }
}
</script>

<style scoped>
/* Стили для интерактивной легенды */
.legend-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.legend-item:hover {
  border-color: #e5e7eb;
  transform: translateY(-1px);
}

/* Анимация для графиков */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-container {
  animation: fadeIn 0.5s ease-out;
}

/* Стили для скроллбара */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Стиль для позиционирования текста поверх графика */
.relative .absolute {
  pointer-events: none;
}
</style>