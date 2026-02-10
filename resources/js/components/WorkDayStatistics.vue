<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        :title="pageTitle"
        description="Анализ времени в Bitrix24 относительно общего рабочего времени и задач"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- Основная часть со статистикой -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Основная карточка со статистикой -->
        <B24Card>
          <B24CardHeader>
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="flex-1">
                <B24CardTitle>Статистика рабочего времени</B24CardTitle>
                <B24CardDescription class="flex items-center gap-1">
                  Анализ времени в Bitrix24 относительно рабочего дня
                  <span v-if="viewedUserId && viewedUserId !== currentUserId" class="font-medium text-blue-600">
                    (Пользователь #{{ viewedUserId }})
                  </span>
                </B24CardDescription>
              </div>
              <div class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-40">
                <B24Button
                    @click="refreshData"
                    :disabled="isLoading"
                    color="air-primary"
                    size="sm"
                    class="flex-1 w-full sm:w-auto justify-center"
                >
                  <B24Icon :icon="RefreshIcon" :class="{ 'animate-spin': isLoading }" class="mr-2" />
                  Обновить
                </B24Button>
                <B24Button
                    @click="exportToPDF"
                    :disabled="isLoading"
                    color="air-secondary"
                    size="sm"
                    class="flex-1 w-full sm:w-auto justify-center"
                >
                  <B24Icon :icon="DownloadIcon" class="mr-2" />
                  Экспорт PDF
                </B24Button>
              </div>
            </div>
          </B24CardHeader>

          <B24CardContent class="space-y-4 md:space-y-6">
            <!-- Выбор дня -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Выберите день для анализа
              </label>
              <B24Popover>
                <B24Button
                    :disabled="isLoading"
                    color="air-tertiary"
                    size="lg"
                    class="w-full justify-between"
                    :b24ui="{
                    base: 'border border-gray-300 hover:border-gray-400'
                  }"
                >
                  <div class="flex items-center space-x-3">
                    <B24Icon :icon="CalendarIcon" class="text-gray-400" />
                    <span class="text-sm text-gray-700">{{ formatDayDisplay(selectedDay) }}</span>
                  </div>
                  <B24Icon :icon="ChevronDownIcon" class="text-gray-400" />
                </B24Button>

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

            <!-- Прелоадер -->
            <div v-if="isLoading" class="text-center py-8 md:py-12">
              <B24Spinner size="lg" color="air-primary" class="mx-auto mb-4" />
              <p class="text-sm text-gray-500">Загрузка данных...</p>
            </div>

            <!-- Основной контент -->
            <div v-else>
              <!-- Первая строка: График и легенда -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <!-- График времени -->
                <B24Card>
                  <B24CardHeader>
                    <B24CardTitle>
                      <div class="flex items-center gap-2">
                        <B24Icon :icon="PieChartIcon" />
                        Распределение времени
                      </div>
                    </B24CardTitle>
                  </B24CardHeader>
                  <B24CardContent>
                    <div class="relative w-full h-64">
                      <canvas ref="bitrixTimeChart"></canvas>
                      <!-- Центральный текст -->
                      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div class="text-2xl md:text-3xl font-bold text-gray-900">
                          {{ formatPercentage(workDayData.bitrixTimePercentage) }}
                        </div>
                        <div class="text-xs md:text-sm text-gray-500 mt-1">
                          времени в Bitrix24
                        </div>
                      </div>
                    </div>
                  </B24CardContent>
                </B24Card>

                <!-- Интерактивная легенда -->
                <B24Card>
                  <B24CardHeader>
                    <B24CardTitle>
                      <div class="flex items-center gap-2">
                        <B24Icon :icon="BarChartIcon" />
                        Распределение времени
                      </div>
                    </B24CardTitle>
                  </B24CardHeader>
                  <B24CardContent class="h-full">
                    <div class="space-y-3">
                      <div
                          v-for="(item, index) in bitrixTimeLegend"
                          :key="index"
                          class="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                          :class="{ 'bg-gray-50 shadow-sm border-gray-200': hoveredLegendIndex === index }"
                          @mouseenter="hoverLegend(index)"
                          @mouseleave="hoverLegend(null)"
                      >
                        <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
                          <div class="flex items-center min-w-0">
                            <div class="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-gray-200"
                                 :style="{ backgroundColor: item.color }"></div>
                            <div class="min-w-0">
                              <div class="text-sm font-medium text-gray-900 truncate">{{ item.label }}</div>
                              <div class="text-xs text-gray-500 truncate">{{ item.description }}</div>
                            </div>
                          </div>
                          <div class="text-right xs:text-left">
                            <div class="text-sm font-semibold" :style="{ color: item.color }">
                              {{ formatDuration(item.value) }}
                            </div>
                            <div class="text-xs text-gray-500">{{ item.percentage }}</div>
                          </div>
                        </div>
                        <div v-if="item.details" class="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {{ item.details }}
                        </div>
                      </div>
                    </div>

                    <!-- Общая статистика -->
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <div class="grid grid-cols-2 gap-3">
                        <div class="text-center">
                          <div class="text-xs text-gray-500">Рабочий день</div>
                          <div class="text-sm font-semibold text-gray-900">{{ formatDuration(workDayData.totalWorkDaySeconds) }}</div>
                        </div>
                        <div class="text-center">
                          <div class="text-xs text-gray-500">Эффективность</div>
                          <div class="text-sm font-semibold" :class="getEfficiencyColor(workDayData.bitrixTimePercentage)">
                            {{ formatPercentage(workDayData.bitrixTimePercentage) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </B24CardContent>
                </B24Card>
              </div>

              <!-- График временной шкалы CRM -->
              <B24Card>
                <B24CardHeader>
                  <B24CardTitle>
                    <div class="flex items-center gap-2">
                      <B24Icon :icon="TimelineIcon" />
                      Активность CRM в течение дня
                    </div>
                  </B24CardTitle>
                </B24CardHeader>
                <B24CardContent>
                  <div class="w-full h-48">
                    <canvas ref="timelineChart"></canvas>
                  </div>
                </B24CardContent>
              </B24Card>

              <!-- Список задач -->
              <B24Card>
                <B24CardHeader>
                  <B24CardTitle>
                    <div class="flex items-center gap-2">
                      <B24Icon :icon="TaskIcon" />
                      Задачи за день ({{ taskTimeData.tasks.length }})
                    </div>
                  </B24CardTitle>
                </B24CardHeader>
                <B24CardContent class="p-0">
                  <div v-if="taskTimeData.tasks.length > 0">
                    <B24Table
                        :data="displayedTasks"
                        :columns="taskColumns"
                        class="border-none"
                        :empty="{
                        content: 'Нет задач за выбранный день'
                      }"
                    >
                      <!-- Слот для пустого состояния -->
                      <template #empty>
                        <div class="px-4 py-8 text-center text-gray-500">
                          Нет задач за выбранный день
                        </div>
                      </template>
                    </B24Table>

                    <!-- Пагинация для задач -->
                    <div v-if="taskTimeData.tasks.length > 10" class="px-4 py-3 border-t border-gray-200">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                          Показано {{ displayedTasks.length }} из {{ taskTimeData.tasks.length }} задач
                        </div>
                        <B24Button
                            @click="showAllTasks = !showAllTasks"
                            size="sm"
                            color="air-tertiary"
                        >
                          {{ showAllTasks ? 'Скрыть' : 'Показать все' }}
                        </B24Button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="px-4 py-8 text-center text-gray-500">
                    Нет задач за выбранный день
                  </div>
                </B24CardContent>
              </B24Card>

              <!-- Информация о рабочем дне -->
              <div class="space-y-4 md:space-y-6">
                <h4 class="text-lg font-semibold text-gray-900">
                  <div class="flex items-center gap-2">
                    <B24Icon :icon="ClockIcon" />
                    Данные о рабочем дне
                  </div>
                </h4>
                <B24Card>
                  <B24CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <div class="flex items-center gap-2 mb-4">
                          <B24Icon :icon="SettingsIcon" class="text-blue-600" />
                          <h5 class="text-sm font-medium text-blue-900">Настройки рабочего времени</h5>
                        </div>
                        <div class="space-y-3">
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-blue-700">Учет времени:</span>
                            <B24Badge :color="workDaySettings.UF_TIMEMAN ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TIMEMAN ? 'Включен' : 'Выключен' }}
                            </B24Badge>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-blue-700">Свободный график:</span>
                            <B24Badge :color="workDaySettings.UF_TM_FREE ? 'air-primary-success' : 'air-secondary-accent'">
                              {{ workDaySettings.UF_TM_FREE ? 'Да' : 'Нет' }}
                            </B24Badge>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-blue-700">Начало дня до:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MAX_START || 'Не задано' }}</span>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-blue-700">Конец дня после:</span>
                            <span class="text-sm font-medium text-blue-900">{{ workDaySettings.UF_TM_MIN_FINISH || 'Не задано' }}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div class="flex items-center gap-2 mb-4">
                          <B24Icon :icon="CalendarDaysIcon" class="text-green-600" />
                          <h5 class="text-sm font-medium text-green-900">Текущий рабочий день</h5>
                        </div>
                        <div class="space-y-3">
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-green-700">Статус:</span>
                            <B24Badge :color="getWorkDayStatusBadgeColor(workDayStatus.STATUS)">
                              {{ getWorkDayStatusText(workDayStatus.STATUS) }}
                            </B24Badge>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-green-700">Начало:</span>
                            <span class="text-sm font-medium text-green-900 truncate">
                              {{ formatDateTime(workDayStatus.TIME_START) || 'Не начат' }}
                            </span>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-green-700">Длительность:</span>
                            <span class="text-sm font-medium text-green-900">
                              {{ workDayStatus.DURATION || '00:00:00' }}
                            </span>
                          </div>
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-green-700">Перерывы:</span>
                            <span class="text-sm font-medium text-green-900">
                              {{ workDayStatus.TIME_LEAKS || '00:00:00' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </B24CardContent>
                </B24Card>
              </div>

              <!-- CRM статистика -->
              <B24Card>
                <B24CardHeader>
                  <B24CardTitle>
                    <div class="flex items-center gap-2">
                      <B24Icon :icon="ChartBarIcon" />
                      Активность CRM
                    </div>
                  </B24CardTitle>
                </B24CardHeader>
                <B24CardContent>
                  <div class="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <!-- Созданные -->
                    <div class="space-y-2">
                      <B24Card v-for="(item, index) in crmCreatedItems" :key="'created-' + index"
                               :b24ui="{ root: 'p-2 hover:bg-gray-50' }">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">{{ item.label }}</span>
                          </div>
                          <span class="text-sm font-semibold text-green-600 ml-2">
                            {{ item.value }}
                          </span>
                        </div>
                      </B24Card>
                    </div>

                    <!-- Обновленные -->
                    <div class="space-y-2">
                      <B24Card v-for="(item, index) in crmUpdatedItems" :key="'updated-' + index"
                               :b24ui="{ root: 'p-2 hover:bg-gray-50' }">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">{{ item.label }}</span>
                          </div>
                          <span class="text-sm font-semibold text-blue-600 ml-2">
                            {{ item.value }}
                          </span>
                        </div>
                      </B24Card>
                    </div>
                  </div>

                  <!-- Статусы сделок и лидов -->
                  <div class="mt-4 pt-4 border-t border-gray-200">
                    <h5 class="text-xs font-medium text-gray-700 mb-2">Статусы сделок и лидов</h5>
                    <div class="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      <B24Card v-for="(item, index) in crmStatusItems" :key="'status-' + index"
                               :b24ui="{ root: 'p-1 hover:bg-gray-50' }">
                        <div class="flex items-center justify-between min-w-0">
                          <span class="text-xs text-gray-600 truncate">{{ item.label }}</span>
                          <span class="text-xs font-semibold ml-2" :class="item.colorClass">
                            {{ item.value }}
                          </span>
                        </div>
                      </B24Card>
                    </div>
                  </div>
                </B24CardContent>
              </B24Card>
            </div>

            <!-- Сообщение об отсутствии данных -->
            <div v-if="!isLoading && !hasData" class="text-center py-8 md:py-12 text-gray-500">
              <B24Icon :icon="DocumentTextIcon" class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
              <p class="text-sm">Нет данных за выбранный день</p>
              <B24Button @click="refreshData" color="air-tertiary" class="mt-4 w-full sm:w-auto">
                Попробовать снова
              </B24Button>
            </div>
          </B24CardContent>
        </B24Card>
      </div>

      <!-- Сайдбар -->
      <div class="lg:col-span-1">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, h, resolveComponent } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'
import { useRoute } from 'vue-router'
import type { TableColumn, TableRow } from '@bitrix24/b24ui-nuxt'
import Sidebar from './Sidebar.vue'
import Chart from 'chart.js/auto'
import html2pdf from 'html2pdf.js'

// Импортируем иконки
import RefreshIcon from '@bitrix24/b24icons-vue/outline/RefreshIcon'
import DownloadIcon from '@bitrix24/b24icons-vue/outline/DownloadIcon'
import CalendarIcon from '@bitrix24/b24icons-vue/outline/CalendarIcon'
import ChevronDownIcon from '@bitrix24/b24icons-vue/outline/ChevronDownIcon'
import PieChartIcon from '@bitrix24/b24icons-vue/outline/PieChartIcon'
import BarChartIcon from '@bitrix24/b24icons-vue/outline/BarChartIcon'
import TimelineIcon from '@bitrix24/b24icons-vue/outline/TimelineIcon'
import TaskIcon from '@bitrix24/b24icons-vue/outline/TaskIcon'
import ClockIcon from '@bitrix24/b24icons-vue/outline/ClockIcon'
import SettingsIcon from '@bitrix24/b24icons-vue/outline/SettingsIcon'
import CalendarDaysIcon from '@bitrix24/b24icons-vue/outline/CalendarDaysIcon'
import ChartBarIcon from '@bitrix24/b24icons-vue/outline/ChartBarIcon'
import DocumentTextIcon from '@bitrix24/b24icons-vue/outline/DocumentTextIcon'

const toast = useToast()
const route = useRoute()

// Компоненты из библиотеки
const B24Badge = resolveComponent('B24Badge')
const B24Spinner = resolveComponent('B24Spinner')
const B24Icon = resolveComponent('B24Icon')

// Данные
const viewedUserId = ref<number | null>(null)
const selectedDay = ref(new Date().toISOString().split('T')[0])
const calendarDate = ref<CalendarDate | null>(null)
const isLoading = ref(false)
const currentUserId = ref<number | null>(null)
const historyDays = ref(30)
const hoveredLegendIndex = ref<number | null>(null)
const showAllTasks = ref(false)

// Refs для canvas элементов
const bitrixTimeChart = ref<HTMLCanvasElement | null>(null)
const timelineChart = ref<HTMLCanvasElement | null>(null)

// Экземпляры Chart.js
let bitrixChartInstance: Chart | null = null
let timelineChartInstance: Chart | null = null

// Данные о рабочем дне
const workDaySettings = ref({
  UF_TIMEMAN: false,
  UF_TM_FREE: false,
  UF_TM_MAX_START: null as string | null,
  UF_TM_MIN_FINISH: null as string | null,
  UF_TM_MIN_DURATION: null as string | null,
  UF_TM_ALLOWED_DELTA: null as string | null,
  ADMIN: false
})

const workDayStatus = ref({
  STATUS: 'CLOSED',
  TIME_START: null as string | null,
  TIME_FINISH: null as string | null,
  DURATION: '00:00:00',
  TIME_LEAKS: '00:00:00',
  ACTIVE: false
})

const workDayData = ref({
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
})

// Тип для задач
interface Task {
  id: string | number
  title: string
  status: string
  timeSpent: number
  elapsedItemsCount: number
  responsibleName: string
  responsibleId: number
  comments?: string[]
}

const taskTimeData = ref({
  totalWorkDaySeconds: 28800,
  workDurationSeconds: 0,
  elapsedTaskTimeSeconds: 0,
  tasks: [] as Task[],

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
  createdDealsCount: 0,
  createdLeadsCount: 0,
  createdContactsCount: 0,
  createdCompaniesCount: 0,

  updatedDealsCount: 0,
  updatedLeadsCount: 0,
  updatedContactsCount: 0,
  updatedCompaniesCount: 0,

  successfulDealsCount: 0,
  failedDealsCount: 0,

  convertedLeadsCount: 0,
  junkLeadsCount: 0,

  timelineEvents: [] as any[]
})

// Константы
const minCalendarDate = new CalendarDate(2020, 1, 1)
const maxCalendarDate = new CalendarDate(2030, 12, 31)

// Цветовая схема
const CHART_COLORS = {
  WORK_DAY: '#d1d5db',
  BITRIX_TIME: '#3b82f6',
  BREAK_TIME: '#f97316',
  TASK_TIME: '#10b981',
  OTHER_TIME: '#8b5cf6'
}

// Определяем колонки для таблицы задач
const taskColumns: TableColumn<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Задача',
    cell: ({ row }) => {
      const task = row.original
      return h('div', [
        h('a', {
          href: `/company/personal/user/${currentUserId.value}/tasks/task/view/${task.id}/`,
          target: '_blank',
          class: 'text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs'
        }, task.title || `Задача #${task.id}`),
        h('div', { class: 'text-xs text-gray-500' }, `ID: ${task.id}`)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const colorMap = {
        '1': 'air-secondary-accent', // Новая
        '2': 'air-warning', // В работе
        '3': 'air-waiting', // Ждет выполнения
        '4': 'air-info', // Отложена
        '5': 'air-primary-success', // Выполнена
        '6': 'air-secondary-accent', // Отменена
        '7': 'air-critical', // Просрочена,
      }
      const textMap = {
        '1': 'Новая',
        '2': 'В работе',
        '3': 'Ждет выполнения',
        '4': 'Отложена',
        '5': 'Выполнена',
        '6': 'Отменена',
        '7': 'Просрочена',
      }

      const color = colorMap[status as keyof typeof colorMap] || 'air-secondary-accent'
      const text = textMap[status as keyof typeof textMap] || 'Неизвестен'

      return h(B24Badge, {
        color,
        class: 'whitespace-nowrap max-w-full inline-block'
      }, text)
    }
  },
  {
    accessorKey: 'timeSpent',
    header: 'Время',
    cell: ({ row }) => {
      const timeSpent = Number(row.getValue('timeSpent'))
      return h('div', [
        h('div', {
          class: 'text-sm font-semibold text-green-600'
        }, formatDuration(timeSpent)),
        h('div', {
          class: 'text-xs text-gray-500'
        }, `${row.original.elapsedItemsCount} записей`)
      ])
    }
  },
  {
    accessorKey: 'responsibleName',
    header: 'Исполнитель',
    cell: ({ row }) => {
      const task = row.original
      return h('a', {
        href: `/company/personal/user/${task.responsibleId || currentUserId.value}/`,
        target: '_blank',
        class: 'text-sm text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-2'
      }, [
        h(B24Icon, { icon: 'UserIcon' }),
        task.responsibleName || 'Текущий пользователь'
      ])
    }
  }
]

// Вычисляемые свойства
const bitrixTimeLegend = computed(() => {
  const data = workDayData.value
  const workDayStatusValue = workDayStatus.value

  const today = new Date().toISOString().split('T')[0]
  const workDayStart = workDayStatusValue.TIME_START
  const isTodayWorkDay = workDayStart && workDayStart.includes(today)

  let baseTime = isTodayWorkDay ?
      (data.workDurationSeconds || data.totalWorkDaySeconds) :
      data.totalWorkDaySeconds

  let otherTime = Math.max(0, baseTime - data.bitrixTimeSeconds - data.elapsedTaskTimeSeconds -
      (isTodayWorkDay ? data.breakTimeSeconds : 0))

  return [
    {
      label: 'Bitrix24 (без задач)',
      description: 'Время в системе без учета задач',
      value: data.bitrixTimeSeconds - data.elapsedTaskTimeSeconds,
      percentage: baseTime > 0 ? `${(((data.bitrixTimeSeconds - data.elapsedTaskTimeSeconds) / baseTime) * 100).toFixed(1)}%` : '0%',
      color: CHART_COLORS.BITRIX_TIME
    },
    {
      label: 'Время в задачах',
      description: 'Затраченное время на выполнение задач',
      value: data.elapsedTaskTimeSeconds,
      percentage: baseTime > 0 ? `${((data.elapsedTaskTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
      color: CHART_COLORS.TASK_TIME
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
      label: isTodayWorkDay ? 'Прочее время' : 'Рабочее время',
      description: isTodayWorkDay ? 'Другое рабочее время' : 'Запланированное рабочее время',
      value: otherTime,
      percentage: baseTime > 0 ? `${((otherTime / baseTime) * 100).toFixed(1)}%` : '0%',
      color: CHART_COLORS.WORK_DAY
    }
  ]
})

const displayedTasks = computed(() => {
  if (showAllTasks.value) {
    return taskTimeData.value.tasks
  }
  return taskTimeData.value.tasks.slice(0, 10)
})

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
      taskTimeData.value.elapsedTaskTimeSeconds > 0 ||
      crmData.value.timelineEvents.length > 0
})

// CRM данные для отображения
const crmCreatedItems = computed(() => [
  { label: 'Создано сделок', value: crmData.value.createdDealsCount },
  { label: 'Создано лидов', value: crmData.value.createdLeadsCount },
  { label: 'Создано контактов', value: crmData.value.createdContactsCount },
  { label: 'Создано компаний', value: crmData.value.createdCompaniesCount }
])

const crmUpdatedItems = computed(() => [
  { label: 'Обновлено сделок', value: crmData.value.updatedDealsCount },
  { label: 'Обновлено лидов', value: crmData.value.updatedLeadsCount },
  { label: 'Обновлено контактов', value: crmData.value.updatedContactsCount },
  { label: 'Обновлено компаний', value: crmData.value.updatedCompaniesCount }
])

const crmStatusItems = computed(() => [
  { label: 'Успешные сделки:', value: crmData.value.successfulDealsCount, colorClass: 'text-green-600' },
  { label: 'Провальные сделки:', value: crmData.value.failedDealsCount, colorClass: 'text-red-600' },
  { label: 'Успешные лиды:', value: crmData.value.convertedLeadsCount, colorClass: 'text-green-600' },
  { label: 'Провальные лиды:', value: crmData.value.junkLeadsCount, colorClass: 'text-red-600' }
])

// Вспомогательные методы
function getCalendarDateFromString(dateString: string): CalendarDate | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function getStringFromCalendarDate(calendarDate: CalendarDate | null): string {
  if (!calendarDate) return ''
  const year = calendarDate.year
  const month = calendarDate.month.toString().padStart(2, '0')
  const day = calendarDate.day.toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDayDisplay(dateString: string): string {
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

function formatDuration(seconds: number): string {
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

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatDateTime(dateTime: string | null): string | null {
  if (!dateTime) return null
  return new Date(dateTime).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function timeStringToSeconds(timeString: string | null): number {
  if (!timeString) return 0
  const parts = timeString.split(':')
  if (parts.length !== 3) return 0

  const hours = parseInt(parts[0])
  const minutes = parseInt(parts[1])
  const seconds = parseInt(parts[2])

  return hours * 3600 + minutes * 60 + seconds
}

function getWorkDayStatusBadgeColor(status: string): string {
  const statusMap = {
    'OPENED': 'air-primary-success',
    'CLOSED': 'air-secondary-accent',
    'PAUSED': 'air-warning',
    'EXPIRED': 'air-critical'
  }
  return statusMap[status as keyof typeof statusMap] || 'air-secondary-accent'
}

function getWorkDayStatusText(status: string): string {
  const statusMap = {
    'OPENED': 'Открыт',
    'CLOSED': 'Закрыт',
    'PAUSED': 'Приостановлен',
    'EXPIRED': 'Истек'
  }
  return statusMap[status as keyof typeof statusMap] || 'Неизвестно'
}

function getEfficiencyColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  if (percentage >= 40) return 'text-orange-600'
  return 'text-red-600'
}

function isDateDisabled(date: CalendarDate): boolean {
  const dayOfWeek = date.toDate('UTC').getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function isDateUnavailable(date: CalendarDate): boolean {
  if (!historyDays.value || historyDays.value <= 0) return false

  const today = new Date()
  const selectedDate = date.toDate('UTC')
  const diffTime = today.getTime() - selectedDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > historyDays.value
}

// Методы для работы с Chart.js
function hoverLegend(index: number | null) {
  hoveredLegendIndex.value = index

  if (bitrixChartInstance) {
    const dataset = bitrixChartInstance.data.datasets[0]
    dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
        i === index ? lightenColor(color, 20) : bitrixTimeLegend.value[i].color
    )
    bitrixChartInstance.update('none')
  }
}

function lightenColor(color: string, percent: number): string {
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

function createBitrixTimeChart() {
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
          label: (context: any) => {
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

function createTimelineChart() {
  if (timelineChartInstance) {
    timelineChartInstance.destroy()
  }

  if (!timelineChart.value) return

  const hourlyEvents: any = {}

  // Создаем интервалы 00:00-01:00, 01:00-02:00, ..., 23:00-00:00
  for (let i = 0; i < 24; i++) {
    hourlyEvents[i] = {
      created: 0,
      updated: 0,
      successful: 0,
      failed: 0
    }
  }

  // Если есть события - группируем их
  if (crmData.value.timelineEvents.length > 0) {
    crmData.value.timelineEvents.forEach(event => {
      const date = new Date(event.timestamp)
      const hour = date.getHours() // Получаем час (0-23)

      if (hourlyEvents[hour]) {
        if (event.type === 'created') hourlyEvents[hour].created++
        if (event.type === 'updated') hourlyEvents[hour].updated++
        if (event.type === 'successful') hourlyEvents[hour].successful++
        if (event.type === 'failed') hourlyEvents[hour].failed++
      }
    })
  }

  // Создаем метки для осей в формате "12:00-13:00"
  const labels = Array.from({ length: 24 }, (_, i) => {
    const startHour = i.toString().padStart(2, '0')
    const endHour = ((i + 1) % 24).toString().padStart(2, '0')
    return `${startHour}:00-${endHour}:00`
  })

  // Данные для графиков (всегда массив из 24 элементов, даже если нули)
  const createdData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].created)
  const updatedData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].updated)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Создано',
        data: createdData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Обновлено',
        data: updatedData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Часовые интервалы',
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество событий',
          color: '#6b7280'
        },
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            // Всегда показываем целые числа
            return Number.isInteger(value) ? value : ''
          }
        },
        // Устанавливаем минимальное значение 0
        min: 0,
        // Устанавливаем максимальное значение автоматически, но минимум 5
        suggestedMax: Math.max(5, Math.max(...createdData, ...updatedData) + 1)
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context: any) => {
            return context[0].label
          },
          label: (context: any) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value} событий`
          }
        }
      }
    },
    // Даже если все данные нулевые, показываем график
    elements: {
      line: {
        // Показывать линию даже если все точки в 0
        spanGaps: true
      }
    }
  }

  timelineChartInstance = new Chart(timelineChart.value, {
    type: 'line',
    data: chartData,
    options: options
  })
}

function updateCharts() {
  nextTick(() => {
    // Уничтожаем старые инстансы
    if (bitrixChartInstance) {
      bitrixChartInstance.destroy()
      bitrixChartInstance = null
    }
    if (timelineChartInstance) {
      timelineChartInstance.destroy()
      timelineChartInstance = null
    }

    // Создаем новые после рендера
    setTimeout(() => {
      if (bitrixTimeChart.value) {
        createBitrixTimeChart()
      }
      if (timelineChart.value) {
        createTimelineChart()
      }
    }, 50)
  })
}

// Основные методы
function handleCalendarDateChange(newDate: CalendarDate | null) {
  if (newDate) {
    selectedDay.value = getStringFromCalendarDate(newDate)
    loadData()
  }
}

async function refreshData() {
  // Сбрасываем данные
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

    updatedDealsCount: 0,
    updatedLeadsCount: 0,
    updatedContactsCount: 0,
    updatedCompaniesCount: 0,

    successfulDealsCount: 0,
    failedDealsCount: 0,

    convertedLeadsCount: 0,
    junkLeadsCount: 0,

    timelineEvents: []
  }

  await loadData()
}

// Вспомогательные методы
function getCalendarDateFromString(dateString: string): CalendarDate | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function getStringFromCalendarDate(calendarDate: CalendarDate | null): string {
  if (!calendarDate) return ''
  const year = calendarDate.year
  const month = calendarDate.month.toString().padStart(2, '0')
  const day = calendarDate.day.toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDayDisplay(dateString: string): string {
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

function formatDuration(seconds: number): string {
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

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatDateTime(dateTime: string | null): string | null {
  if (!dateTime) return null
  return new Date(dateTime).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function timeStringToSeconds(timeString: string | null): number {
  if (!timeString) return 0
  const parts = timeString.split(':')
  if (parts.length !== 3) return 0

  const hours = parseInt(parts[0])
  const minutes = parseInt(parts[1])
  const seconds = parseInt(parts[2])

  return hours * 3600 + minutes * 60 + seconds
}

function getWorkDayStatusBadgeColor(status: string): string {
  const statusMap = {
    'OPENED': 'air-primary-success',
    'CLOSED': 'air-secondary-accent',
    'PAUSED': 'air-warning',
    'EXPIRED': 'air-critical'
  }
  return statusMap[status as keyof typeof statusMap] || 'air-secondary-accent'
}

function getWorkDayStatusText(status: string): string {
  const statusMap = {
    'OPENED': 'Открыт',
    'CLOSED': 'Закрыт',
    'PAUSED': 'Приостановлен',
    'EXPIRED': 'Истек'
  }
  return statusMap[status as keyof typeof statusMap] || 'Неизвестно'
}

function getEfficiencyColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  if (percentage >= 40) return 'text-orange-600'
  return 'text-red-600'
}

function isDateDisabled(date: CalendarDate): boolean {
  const dayOfWeek = date.toDate('UTC').getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function isDateUnavailable(date: CalendarDate): boolean {
  if (!historyDays.value || historyDays.value <= 0) return false

  const today = new Date()
  const selectedDate = date.toDate('UTC')
  const diffTime = today.getTime() - selectedDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > historyDays.value
}

// Методы для работы с Chart.js
function hoverLegend(index: number | null) {
  hoveredLegendIndex.value = index

  if (bitrixChartInstance) {
    const dataset = bitrixChartInstance.data.datasets[0]
    dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
        i === index ? lightenColor(color, 20) : bitrixTimeLegend.value[i].color
    )
    bitrixChartInstance.update('none')
  }
}

function lightenColor(color: string, percent: number): string {
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

function createBitrixTimeChart() {
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
          label: (context: any) => {
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

function createTimelineChart() {
  if (timelineChartInstance) {
    timelineChartInstance.destroy()
  }

  if (!timelineChart.value) return

  const hourlyEvents: any = {}

  // Создаем интервалы 00:00-01:00, 01:00-02:00, ..., 23:00-00:00
  for (let i = 0; i < 24; i++) {
    hourlyEvents[i] = {
      created: 0,
      updated: 0,
      successful: 0,
      failed: 0
    }
  }

  // Если есть события - группируем их
  if (crmData.value.timelineEvents.length > 0) {
    crmData.value.timelineEvents.forEach(event => {
      const date = new Date(event.timestamp)
      const hour = date.getHours() // Получаем час (0-23)

      if (hourlyEvents[hour]) {
        if (event.type === 'created') hourlyEvents[hour].created++
        if (event.type === 'updated') hourlyEvents[hour].updated++
        if (event.type === 'successful') hourlyEvents[hour].successful++
        if (event.type === 'failed') hourlyEvents[hour].failed++
      }
    })
  }

  // Создаем метки для осей в формате "12:00-13:00"
  const labels = Array.from({ length: 24 }, (_, i) => {
    const startHour = i.toString().padStart(2, '0')
    const endHour = ((i + 1) % 24).toString().padStart(2, '0')
    return `${startHour}:00-${endHour}:00`
  })

  // Данные для графиков (всегда массив из 24 элементов, даже если нули)
  const createdData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].created)
  const updatedData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].updated)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Создано',
        data: createdData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Обновлено',
        data: updatedData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Часовые интервалы',
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество событий',
          color: '#6b7280'
        },
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            // Всегда показываем целые числа
            return Number.isInteger(value) ? value : ''
          }
        },
        // Устанавливаем минимальное значение 0
        min: 0,
        // Устанавливаем максимальное значение автоматически, но минимум 5
        suggestedMax: Math.max(5, Math.max(...createdData, ...updatedData) + 1)
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context: any) => {
            return context[0].label
          },
          label: (context: any) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value} событий`
          }
        }
      }
    },
    // Даже если все данные нулевые, показываем график
    elements: {
      line: {
        // Показывать линию даже если все точки в 0
        spanGaps: true
      }
    }
  }

  timelineChartInstance = new Chart(timelineChart.value, {
    type: 'line',
    data: chartData,
    options: options
  })
}

function updateCharts() {
  nextTick(() => {
    // Уничтожаем старые инстансы
    if (bitrixChartInstance) {
      bitrixChartInstance.destroy()
      bitrixChartInstance = null
    }
    if (timelineChartInstance) {
      timelineChartInstance.destroy()
      timelineChartInstance = null
    }

    // Создаем новые после рендера
    setTimeout(() => {
      if (bitrixTimeChart.value) {
        createBitrixTimeChart()
      }
      if (timelineChart.value) {
        createTimelineChart()
      }
    }, 50)
  })
}

// Основные методы
function handleCalendarDateChange(newDate: CalendarDate | null) {
  if (newDate) {
    selectedDay.value = getStringFromCalendarDate(newDate)
    loadData()
  }
}

async function refreshData() {
  // Сбрасываем данные
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

    updatedDealsCount: 0,
    updatedLeadsCount: 0,
    updatedContactsCount: 0,
    updatedCompaniesCount: 0,

    successfulDealsCount: 0,
    failedDealsCount: 0,

    convertedLeadsCount: 0,
    junkLeadsCount: 0,

    timelineEvents: []
  }

  await loadData()
}

// Полный метод экспорта в PDF
async function exportToPDF() {
  try {
    isLoading.value = true

    // Создаем элемент для экспорта
    const element = document.createElement('div')
    element.className = 'bg-white p-6'
    element.style.cssText = `
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    `

    // Заголовок
    const header = document.createElement('div')
    header.style.cssText = `
      margin-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
    `
    header.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${pageTitle.value}</h1>
      <p style="color: #6b7280; margin-bottom: 4px;"><strong>Дата:</strong> ${formatDayDisplay(selectedDay.value)}</p>
      <p style="color: #6b7280;">Сгенерировано: ${new Date().toLocaleString('ru-RU')}</p>
    `
    element.appendChild(header)

    // Статистика эффективности
    const statsHeader = document.createElement('div')
    statsHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
    `
    statsHeader.innerHTML = `
      <div>
        <div style="font-size: 14px; opacity: 0.9;">Эффективность работы в Bitrix24</div>
        <div style="font-size: 32px; font-weight: bold; margin-top: 8px;">
          ${formatPercentage(workDayData.value.bitrixTimePercentage)}
        </div>
        <div style="font-size: 14px; margin-top: 4px;">
          Рабочий день: ${formatDuration(workDayData.value.totalWorkDaySeconds)}
        </div>
      </div>
      <div style="text-align: center; padding-left: 30px; border-left: 1px solid rgba(255,255,255,0.2);">
        <div style="font-size: 14px;">Время в Bitrix24</div>
        <div style="font-size: 24px; font-weight: bold; margin-top: 4px;">
          ${formatDuration(workDayData.value.bitrixTimeSeconds)}
        </div>
        <div style="font-size: 14px; margin-top: 4px;">
          Задачи: ${formatDuration(workDayData.value.elapsedTaskTimeSeconds)}
        </div>
      </div>
    `
    element.appendChild(statsHeader)

    // График времени
    const chartContainer = document.createElement('div')
    chartContainer.style.cssText = `
      margin-bottom: 30px;
      page-break-inside: avoid;
    `

    // Получаем изображение графика
    let chartImage = ''
    if (bitrixTimeChart.value) {
      chartImage = bitrixTimeChart.value.toDataURL('image/png')
    }

    chartContainer.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
          Распределение рабочего времени
        </h2>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <!-- График -->
        <div style="flex: 1; min-width: 300px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: white;">
            <div style="position: relative; width: 100%; height: 300px;">
              ${chartImage ? `
                <img src="${chartImage}" style="width: 100%; height: 100%; object-fit: contain;" />
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                  <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${formatPercentage(workDayData.value.bitrixTimePercentage)}</div>
                  <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">времени в Bitrix24</div>
                </div>
              ` : '<div style="text-align: center; padding: 50px; color: #6b7280;">График недоступен</div>'}
            </div>
          </div>
        </div>

        <!-- Легенда -->
        <div style="flex: 1; min-width: 300px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: white;">
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">Детализация времени</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${bitrixTimeLegend.value.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center;
                    padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;
                    background: #f9fafb;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
                        style="background-color: ${item.color}"></div>
                    <div>
                      <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${item.label}</div>
                      <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: bold; color: ${item.color}; font-size: 14px;">
                      ${formatDuration(item.value)}
                    </div>
                    <div style="font-size: 12px; color: #6b7280;">${item.percentage}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Общая статистика -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Рабочий день</div>
                  <div style="font-size: 16px; font-weight: bold; color: #1f2937;">
                    ${formatDuration(workDayData.value.totalWorkDaySeconds)}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Эффективность</div>
                  <div style="font-size: 16px; font-weight: bold; ${getEfficiencyColor(workDayData.value.bitrixTimePercentage)}">
                    ${formatPercentage(workDayData.value.bitrixTimePercentage)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    element.appendChild(chartContainer)

    // Добавляем график временной шкалы если есть
    if (timelineChart.value && crmData.value.timelineEvents.length > 0) {
      const timelineImage = timelineChart.value.toDataURL('image/png')

      const timelineContainer = document.createElement('div')
      timelineContainer.style.cssText = `
        margin-bottom: 30px;
        page-break-inside: avoid;
      `
      timelineContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
            Активность CRM в течение дня
          </h2>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: white;">
          <div style="width: 100%; height: 300px;">
            <img src="${timelineImage}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #10b981;"></div>
              <span style="font-size: 14px; color: #6b7280;">Создано</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #3b82f6;"></div>
              <span style="font-size: 14px; color: #6b7280;">Обновлено</span>
            </div>
          </div>
        </div>
      `
      element.appendChild(timelineContainer)
    }

    // Рабочий день информация
    const workDayContainer = document.createElement('div')
    workDayContainer.style.cssText = `
      margin-bottom: 30px;
      page-break-inside: avoid;
    `
    workDayContainer.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
          Данные о рабочем дне
        </h2>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Настройки рабочего времени -->
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 14px;">⚙️</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; color: #1e40af;">Настройки рабочего времени</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #1e40af;">Учет времени:</span>
              <span style="font-size: 14px; font-weight: 600; padding: 4px 12px; border-radius: 16px;
                  background: ${workDaySettings.value.UF_TIMEMAN ? '#d1fae5' : '#f3f4f6'};
                  color: ${workDaySettings.value.UF_TIMEMAN ? '#065f46' : '#374151'};">
                ${workDaySettings.value.UF_TIMEMAN ? 'Включен' : 'Выключен'}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #1e40af;">Свободный график:</span>
              <span style="font-size: 14px; font-weight: 600; padding: 4px 12px; border-radius: 16px;
                  background: ${workDaySettings.value.UF_TM_FREE ? '#d1fae5' : '#f3f4f6'};
                  color: ${workDaySettings.value.UF_TM_FREE ? '#065f46' : '#374151'};">
                ${workDaySettings.value.UF_TM_FREE ? 'Да' : 'Нет'}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #1e40af;">Начало дня до:</span>
              <span style="font-size: 14px; font-weight: 600; color: #1e40af;">${workDaySettings.value.UF_TM_MAX_START || 'Не задано'}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #1e40af;">Конец дня после:</span>
              <span style="font-size: 14px; font-weight: 600; color: #1e40af;">${workDaySettings.value.UF_TM_MIN_FINISH || 'Не задано'}</span>
            </div>
          </div>
        </div>

        <!-- Текущий рабочий день -->
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 14px;">📅</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; color: #065f46;">Текущий рабочий день</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #065f46;">Статус:</span>
              <span style="font-size: 14px; font-weight: 600; padding: 4px 12px; border-radius: 16px;
                  background: ${workDayStatus.value.STATUS === 'OPENED' ? '#d1fae5' :
        workDayStatus.value.STATUS === 'PAUSED' ? '#fef3c7' :
            workDayStatus.value.STATUS === 'EXPIRED' ? '#fee2e2' : '#f3f4f6'};
                  color: ${workDayStatus.value.STATUS === 'OPENED' ? '#065f46' :
        workDayStatus.value.STATUS === 'PAUSED' ? '#92400e' :
            workDayStatus.value.STATUS === 'EXPIRED' ? '#991b1b' : '#374151'};">
                ${getWorkDayStatusText(workDayStatus.value.STATUS)}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #065f46;">Начало:</span>
              <span style="font-size: 14px; font-weight: 600; color: #065f46; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                ${formatDateTime(workDayStatus.value.TIME_START) || 'Не начат'}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #065f46;">Длительность:</span>
              <span style="font-size: 14px; font-weight: 600; color: #065f46;">${workDayStatus.value.DURATION || '00:00:00'}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; color: #065f46;">Перерывы:</span>
              <span style="font-size: 14px; font-weight: 600; color: #065f46;">${workDayStatus.value.TIME_LEAKS || '00:00:00'}</span>
            </div>
          </div>
        </div>
      </div>
    `
    element.appendChild(workDayContainer)

    // CRM статистика
    const crmContainer = document.createElement('div')
    crmContainer.style.cssText = `
      margin-bottom: 30px;
      page-break-inside: avoid;
    `
    crmContainer.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
          Активность CRM
        </h2>
      </div>

      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
          <!-- Созданные -->
          <div>
            <h3 style="font-size: 16px; font-weight: 600; color: #10b981; margin-bottom: 15px;
                padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
              Создано
            </h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${crmCreatedItems.value.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center;
                    padding: 10px; border-radius: 6px; background: #f0fdf4; border: 1px solid #d1fae5;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></div>
                    <span style="font-size: 14px; color: #374151;">${item.label}</span>
                  </div>
                  <span style="font-size: 16px; font-weight: bold; color: #10b981;">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Обновленные -->
          <div>
            <h3 style="font-size: 16px; font-weight: 600; color: #3b82f6; margin-bottom: 15px;
                padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
              Обновлено
            </h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${crmUpdatedItems.value.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center;
                    padding: 10px; border-radius: 6px; background: #eff6ff; border: 1px solid #dbeafe;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6;"></div>
                    <span style="font-size: 14px; color: #374151;">${item.label}</span>
                  </div>
                  <span style="font-size: 16px; font-weight: bold; color: #3b82f6;">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Статусы сделок и лидов -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px;">
            Статусы сделок и лидов
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${crmStatusItems.value.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center;
                  padding: 8px; border-radius: 6px; background: #f9fafb;">
                <span style="font-size: 14px; color: #6b7280;">${item.label}</span>
                <span style="font-size: 14px; font-weight: bold; ${item.colorClass}">${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `
    element.appendChild(crmContainer)

    // Список задач
    if (taskTimeData.value.tasks.length > 0) {
      const tasksContainer = document.createElement('div')
      tasksContainer.style.cssText = `
        margin-bottom: 30px;
        page-break-inside: avoid;
      `

      const tasksToShow = taskTimeData.value.tasks.slice(0, 50)

      tasksContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
            Задачи за день (${taskTimeData.value.tasks.length})
          </h2>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white;">
          <!-- Заголовок таблицы -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
              background: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase;">Задача</div>
            <div style="font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase;">Статус</div>
            <div style="font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase;">Время</div>
            <div style="font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase;">Исполнитель</div>
          </div>

          <!-- Строки таблицы -->
          <div>
            ${tasksToShow.map((task, index) => `
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
                  padding: 12px 16px; border-bottom: 1px solid #f3f4f6;
                  ${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                <div style="min-width: 0;">
                  <div style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 2px;
                      overflow: hidden; text-overflow: ellipsis;">
                    ${task.title || `Задача #${task.id}`}
                  </div>
                  <div style="font-size: 12px; color: #6b7280;">ID: ${task.id}</div>
                </div>

                <div>
                  <span style="font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 12px;
                      background: ${getWorkDayStatusBadgeColor(task.status).includes('success') ? '#d1fae5' :
          getWorkDayStatusBadgeColor(task.status).includes('warning') ? '#fef3c7' :
              getWorkDayStatusBadgeColor(task.status).includes('critical') ? '#fee2e2' : '#f3f4f6'};
                      color: ${getWorkDayStatusBadgeColor(task.status).includes('success') ? '#065f46' :
          getWorkDayStatusBadgeColor(task.status).includes('warning') ? '#92400e' :
              getWorkDayStatusBadgeColor(task.status).includes('critical') ? '#991b1b' : '#374151'};">
                    ${getTaskStatusText(task.status)}
                  </span>
                </div>

                <div>
                  <div style="font-size: 14px; font-weight: 600; color: #10b981;">
                    ${formatDuration(task.timeSpent)}
                  </div>
                  <div style="font-size: 12px; color: #6b7280;">${task.elapsedItemsCount} записей</div>
                </div>

                <div style="font-size: 14px; color: #374151; overflow: hidden; text-overflow: ellipsis;">
                  ${task.responsibleName || 'Текущий пользователь'}
                </div>
              </div>
            `).join('')}

            ${taskTimeData.value.tasks.length > 50 ? `
              <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; border-top: 1px solid #e5e7eb;">
                ...и еще ${taskTimeData.value.tasks.length - 50} задач
              </div>
            ` : ''}
          </div>
        </div>
      `
      element.appendChild(tasksContainer)
    }

    // Футер
    const footer = document.createElement('div')
    footer.style.cssText = `
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    `
    footer.innerHTML = `
      <p>Bitrix24 Статистика рабочего дня</p>
      <p>Сгенерировано автоматически • ${new Date().toLocaleString('ru-RU')}</p>
    `
    element.appendChild(footer)

    // Настройки PDF
    const opt = {
      margin: 0.5,
      filename: `bitrix24-статистика-${selectedDay.value}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    }

    // Генерация PDF
    await html2pdf().set(opt).from(element).save()

    toast.add({
      description: 'PDF успешно экспортирован',
      variant: 'success'
    })

  } catch (error: any) {
    console.error('Ошибка экспорта PDF:', error)
    toast.add({
      description: 'Ошибка при экспорте PDF: ' + error.message,
      variant: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Метод загрузки данных (полная версия)
async function loadData() {
  try {
    isLoading.value = true

    calendarDate.value = getCalendarDateFromString(selectedDay.value)

    // 1. Загрузка текущего пользователя
    await loadCurrentUser()

    // 2. Загрузка настроек рабочего дня
    await loadWorkDaySettings()

    // 3. Загрузка статуса рабочего дня
    await loadWorkDayStatus()

    // 4. Параллельная загрузка данных
    await Promise.all([
      loadBitrixTimeData(),
      loadTaskTimeData(),
      loadCrmData()
    ])

    // 5. Расчет производных данных
    calculateDerivedData()

    // 6. Обновление графиков
    updateCharts()

    toast.add({
      description: 'Данные успешно загружены',
      variant: 'success'
    })
  } catch (error: any) {
    console.error('Ошибка загрузки данных:', error)
    toast.add({
      description: 'Ошибка при загрузке данных',
      variant: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Инициализация
onMounted(() => {
  calendarDate.value = getCalendarDateFromString(selectedDay.value)
  loadData()
})

// Наблюдатель для обновления графиков при загрузке данных
watch(() => isLoading.value, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    // Задержка для гарантии рендера DOM
    setTimeout(() => {
      updateCharts()
    }, 100)
  }
})

// Дополнительные вспомогательные функции
function getTaskStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    '1': 'Новая',
    '2': 'В работе',
    '3': 'Ждет выполнения',
    '4': 'Отложена',
    '5': 'Выполнена',
    '6': 'Отменена',
    '7': 'Просрочена',
  }
  return statusMap[status] || 'Неизвестен'
}

</script>