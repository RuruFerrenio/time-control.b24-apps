<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        :title="pageTitle"
        description="Анализ времени в Bitrix24 относительно общего рабочего времени и задач"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- Основная часть со статистикой -->
      <div class="lg:col-span-2">
        <!-- Основная карточка со статистикой -->
        <B24Card class="bg-white">
          <div class="p-0 md:p-6">
            <div class="space-y-4 md:space-y-6">
              <!-- Заголовок и кнопки -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Статистика рабочего времени
                  </h3>
                  <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    Анализ времени в Bitrix24 относительно рабочего дня
                    <span v-if="viewedUserId && viewedUserId !== currentUserId" class="font-medium text-blue-600">
                      (Пользователь #{{ viewedUserId }})
                    </span>
                  </p>
                </div>
                <div class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-40">
                  <B24Button
                      @click="refreshData"
                      :disabled="isLoading"
                      color="air-primary"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                  >
                    <B24Spinner v-if="isLoading" size="sm" class="mr-2" />
                    <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ isLoading ? 'Загрузка...' : 'Обновить' }}
                  </B24Button>
                  <B24Button
                      @click="exportToPDF"
                      :disabled="isLoading || !hasData"
                      color="air-secondary"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Экспорт PDF
                  </B24Button>
                </div>
              </div>

              <!-- Выбор дня -->
              <div>
                <B24FormField label="Выберите день для анализа" size="sm">
                  <B24Popover class="w-full">
                    <template #trigger>
                      <B24Button
                          type="button"
                          :disabled="isLoading"
                          variant="outline"
                          color="air-tertiary"
                          class="w-full justify-between"
                      >
                        <div class="flex items-center space-x-3">
                          <B24Icon name="calendar" size="sm" />
                          <span class="text-sm text-gray-700">{{ formatDayDisplay(selectedDay) }}</span>
                        </div>
                        <B24Icon name="chevron-down" size="sm" />
                      </B24Button>
                    </template>
                    <template #content>
                      <div class="p-2">
                        <B24Calendar
                            v-model="calendarDate"
                            @update:modelValue="handleCalendarDateChange"
                            color="air-primary"
                            size="sm"
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
                </B24FormField>
              </div>

              <!-- Прелоадер -->
              <div v-if="isLoading" class="text-center py-8 md:py-12">
                <B24Spinner size="lg" class="mx-auto mb-3 md:mb-4" />
                <p class="text-sm text-gray-500">Загрузка данных...</p>
              </div>

              <!-- Основной контент -->
              <div v-else-if="hasData">
                <!-- Первая строка: График сверху, легенда снизу -->
                <div class="space-y-6">
                  <!-- График времени -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <B24Icon name="chart-pie" size="sm" />
                      Распределение времени
                    </h4>
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

                    <!-- Интерактивная легенда под графиком -->
                    <div class="mt-6">
                      <div class="space-y-2">
                        <div v-for="(item, index) in bitrixTimeLegend" :key="index"
                             class="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                             :class="{ 'bg-gray-50 shadow-sm border-gray-200': hoveredLegendIndex === index }"
                             @mouseenter="hoverLegend(index)"
                             @mouseleave="hoverLegend(null)">
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
                            <div class="flex items-center min-w-0">
                              <div class="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-gray-200" :style="{ backgroundColor: item.color }"></div>
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
                    </div>
                  </div>

                  <!-- График временной шкалы CRM -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <B24Icon name="clock" size="sm" />
                      Активность CRM в течение дня
                    </h4>
                    <div class="w-full h-48">
                      <canvas ref="timelineChart"></canvas>
                    </div>
                    <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span class="text-xs text-gray-600">Создано</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span class="text-xs text-gray-600">Обновлено</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span class="text-xs text-gray-600">Успешные</span>
                      </div>
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span class="text-xs text-gray-600">Провальные</span>
                      </div>
                    </div>
                  </div>

                  <!-- Список задач -->
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div class="p-4 border-b border-gray-200">
                      <h4 class="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <B24Icon name="check-square" size="sm" />
                        Задачи за день ({{ taskTimeData.tasks.length }})
                      </h4>
                    </div>

                    <!-- Таблица задач -->
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Задача
                          </th>
                          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Статус
                          </th>
                          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Время
                          </th>
                          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Исполнитель
                          </th>
                        </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="task in displayedTasks" :key="task.id" class="hover:bg-gray-50">
                          <td class="px-4 py-3 whitespace-nowrap">
                            <a
                                :href="getTaskUrl(task.id)"
                                target="_blank"
                                class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs"
                            >
                              {{ task.title || `Задача #${task.id}` }}
                            </a>
                            <div class="text-xs text-gray-500">
                              ID: {{ task.id }}
                            </div>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <B24Badge :color="getTaskStatusColor(task.status)">
                              {{ getTaskStatusText(task.status) }}
                            </B24Badge>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <div class="text-sm font-semibold text-green-600">
                              {{ formatDuration(task.timeSpent) }}
                            </div>
                            <div class="text-xs text-gray-500">
                              {{ task.elapsedItemsCount }} записей
                            </div>
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <a
                                :href="getUserUrl(task.responsibleId || currentUserId)"
                                target="_blank"
                                class="text-sm text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-2"
                            >
                              <B24Icon name="user" size="sm" />
                              {{ task.responsibleName || 'Текущий пользователь' }}
                            </a>
                          </td>
                        </tr>
                        <tr v-if="taskTimeData.tasks.length === 0">
                          <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                            Нет задач за выбранный день
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Пагинация для задач -->
                    <div v-if="taskTimeData.tasks.length > 10" class="px-4 py-3 border-t border-gray-200">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                          Показано {{ Math.min(displayedTasks.length, taskTimeData.tasks.length) }} из {{ taskTimeData.tasks.length }} задач
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

                  <!-- Информация о рабочем дне -->
                  <div class="space-y-4">
                    <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <B24Icon name="settings" size="sm" />
                      Данные о рабочем дне
                    </h4>
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <h5 class="text-sm font-medium text-blue-900 mb-4 flex items-center gap-2">
                            <B24Icon name="cog" size="sm" />
                            Настройки рабочего времени
                          </h5>
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
                          <h5 class="text-sm font-medium text-blue-900 mb-4 flex items-center gap-2">
                            <B24Icon name="briefcase" size="sm" />
                            Текущий рабочий день
                          </h5>
                          <div class="space-y-3">
                            <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                              <span class="text-sm text-blue-700">Статус:</span>
                              <B24Badge :color="getWorkDayStatusBadgeColor(workDayStatus.STATUS)">
                                {{ getWorkDayStatusText(workDayStatus.STATUS) }}
                              </B24Badge>
                            </div>
                            <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                              <span class="text-sm text-blue-700">Начало:</span>
                              <span class="text-sm font-medium text-blue-900 truncate">
                                {{ formatDateTime(workDayStatus.TIME_START) || 'Не начат' }}
                              </span>
                            </div>
                            <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                              <span class="text-sm text-blue-700">Длительность:</span>
                              <span class="text-sm font-medium text-blue-900">
                                {{ workDayStatus.DURATION || '00:00:00' }}
                              </span>
                            </div>
                            <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
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

                  <!-- CRM статистика -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <B24Icon name="trending-up" size="sm" />
                      Активность CRM
                    </h4>
                    <div class="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      <!-- Созданные -->
                      <div class="space-y-2">
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Создано сделок</span>
                          </div>
                          <span class="text-sm font-semibold text-green-600 ml-2">
                            {{ crmData.createdDealsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Создано лидов</span>
                          </div>
                          <span class="text-sm font-semibold text-green-600 ml-2">
                            {{ crmData.createdLeadsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Создано контактов</span>
                          </div>
                          <span class="text-sm font-semibold text-green-600 ml-2">
                            {{ crmData.createdContactsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-green-100 border border-green-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Создано компаний</span>
                          </div>
                          <span class="text-sm font-semibold text-green-600 ml-2">
                            {{ crmData.createdCompaniesCount }}
                          </span>
                        </div>
                      </div>

                      <!-- Обновленные -->
                      <div class="space-y-2">
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Обновлено сделок</span>
                          </div>
                          <span class="text-sm font-semibold text-blue-600 ml-2">
                            {{ crmData.updatedDealsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Обновлено лидов</span>
                          </div>
                          <span class="text-sm font-semibold text-blue-600 ml-2">
                            {{ crmData.updatedLeadsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Обновлено контактов</span>
                          </div>
                          <span class="text-sm font-semibold text-blue-600 ml-2">
                            {{ crmData.updatedContactsCount }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div class="flex items-center min-w-0">
                            <div class="w-3 h-3 rounded-full mr-2 bg-blue-100 border border-blue-500 flex-shrink-0"></div>
                            <span class="text-xs text-gray-700 truncate">Обновлено компаний</span>
                          </div>
                          <span class="text-sm font-semibold text-blue-600 ml-2">
                            {{ crmData.updatedCompaniesCount }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Статусы сделок и лидов -->
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <h5 class="text-xs font-medium text-gray-700 mb-2">Статусы сделок и лидов</h5>
                      <div class="grid grid-cols-1 xs:grid-cols-2 gap-2">
                        <div class="flex items-center justify-between p-1 min-w-0">
                          <span class="text-xs text-gray-600 truncate">Успешные сделки:</span>
                          <span class="text-xs font-semibold text-green-600 ml-2">{{ crmData.successfulDealsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between p-1 min-w-0">
                          <span class="text-xs text-gray-600 truncate">Провальные сделки:</span>
                          <span class="text-xs font-semibold text-red-600 ml-2">{{ crmData.failedDealsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between p-1 min-w-0">
                          <span class="text-xs text-gray-600 truncate">Успешные лиды:</span>
                          <span class="text-xs font-semibold text-green-600 ml-2">{{ crmData.convertedLeadsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between p-1 min-w-0">
                          <span class="text-xs text-gray-600 truncate">Провальные лиды:</span>
                          <span class="text-xs font-semibold text-red-600 ml-2">{{ crmData.junkLeadsCount }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Сообщение об отсутствии данных -->
              <div v-else class="text-center py-8 md:py-12 text-gray-500">
                <B24Icon name="file-text" size="lg" class="mx-auto mb-3 md:mb-4 text-gray-300" />
                <p class="text-sm">Нет данных за выбранный день</p>
                <B24Button @click="refreshData" color="air-tertiary" class="mt-3 md:mt-4 w-full sm:w-auto">
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
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  name: 'WorkDayStatistics',
  components: {
    Sidebar
  },
  setup() {
    const route = useRoute()
    const toast = useToast()

    const viewedUserId = ref(null)
    const selectedDay = ref(new Date().toISOString().split('T')[0])
    const calendarDate = ref(null)
    const isLoading = ref(false)
    const currentUserId = ref(null)
    const historyDays = ref(30)
    const hoveredLegendIndex = ref(null)
    const showAllTasks = ref(false)

    // Refs для canvas элементов
    const bitrixTimeChart = ref(null)
    const timelineChart = ref(null)

    // Экземпляры Chart.js
    let bitrixChartInstance = null
    let timelineChartInstance = null

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
      totalWorkDaySeconds: 28800,
      bitrixTimeSeconds: 0,
      elapsedTaskTimeSeconds: 0,
      bitrixTimeNonTaskSeconds: 0,
      workDurationSeconds: 0,
      breakTimeSeconds: 0,
      bitrixTimePercentage: 0
    })

    const taskTimeData = ref({
      totalWorkDaySeconds: 28800,
      workDurationSeconds: 0,
      elapsedTaskTimeSeconds: 0,
      tasks: []
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
      timelineEvents: []
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

    // Кэш профилей пользователей
    const userProfilesCache = ref({})

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

    // Вспомогательные функции
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

    const getWorkDayStatusBadgeColor = (status) => {
      const statusMap = {
        'OPENED': 'air-primary-success',
        'CLOSED': 'air-secondary-accent',
        'PAUSED': 'air-warning',
        'EXPIRED': 'air-critical'
      }
      return statusMap[status] || 'air-secondary-accent'
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

    const getTaskStatusColor = (status) => {
      const statusMap = {
        '1': 'air-secondary-accent',
        '2': 'air-warning',
        '3': 'air-waiting',
        '4': 'air-info',
        '5': 'air-primary-success',
        '6': 'air-secondary-accent',
        '7': 'air-critical'
      }
      return statusMap[status] || 'air-secondary-accent'
    }

    const getTaskStatusText = (status) => {
      const statusMap = {
        '1': 'Новая',
        '2': 'В работе',
        '3': 'Ждет выполнения',
        '4': 'Отложена',
        '5': 'Выполнена',
        '6': 'Отменена',
        '7': 'Просрочена'
      }
      return statusMap[status] || 'Неизвестен'
    }

    const getEfficiencyColor = (percentage) => {
      if (percentage >= 80) return 'text-green-600'
      if (percentage >= 60) return 'text-yellow-600'
      if (percentage >= 40) return 'text-orange-600'
      return 'text-red-600'
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

    const getTaskUrl = (taskId) => {
      if (!taskId) return '#'
      const domain = window.location.hostname
      const userId = viewedUserId.value || currentUserId.value
      return `https://${domain}/company/personal/user/${userId}/tasks/task/view/${taskId}/`
    }

    const getUserUrl = (userId) => {
      if (!userId) return '#'
      const domain = window.location.hostname
      return `https://${domain}/company/personal/user/${userId}/`
    }

    // Методы для работы с Chart.js
    const hoverLegend = (index) => {
      hoveredLegendIndex.value = index

      if (bitrixChartInstance) {
        const dataset = bitrixChartInstance.data.datasets[0]
        dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
            i === index ? lightenColor(color, 20) : bitrixTimeLegend.value[i].color
        )
        bitrixChartInstance.update('none')
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

    const createTimelineChart = () => {
      if (timelineChartInstance) {
        timelineChartInstance.destroy()
      }

      if (!timelineChart.value || crmData.value.timelineEvents.length === 0) return

      // Группируем события по часам, точки между часами (13:00-14:00 = 13.5)
      const hourlyEvents = {}
      for (let i = 0; i < 24; i++) {
        // Создаем точки для каждого получаса
        hourlyEvents[`${i}.0`] = {
          hour: i,
          minute: 0,
          created: 0,
          updated: 0,
          successful: 0,
          failed: 0
        }
        hourlyEvents[`${i}.5`] = {
          hour: i,
          minute: 30,
          created: 0,
          updated: 0,
          successful: 0,
          failed: 0
        }
      }

      crmData.value.timelineEvents.forEach(event => {
        const date = new Date(event.timestamp)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const halfHour = minute >= 30 ? 0.5 : 0
        const timeKey = `${hour + halfHour}`

        if (hourlyEvents[timeKey]) {
          if (event.type === 'created') hourlyEvents[timeKey].created++
          if (event.type === 'updated') hourlyEvents[timeKey].updated++
          if (event.type === 'successful') hourlyEvents[timeKey].successful++
          if (event.type === 'failed') hourlyEvents[timeKey].failed++
        }
      })

      // Создаем метки для оси X (формат 13:30)
      const labels = []
      const dataPoints = []
      for (let i = 0; i < 24; i++) {
        labels.push(`${i.toString().padStart(2, '0')}:00`)
        dataPoints.push(i)
        labels.push(`${i.toString().padStart(2, '0')}:30`)
        dataPoints.push(i + 0.5)
      }

      const createdData = dataPoints.map(point => hourlyEvents[point]?.created || 0)
      const updatedData = dataPoints.map(point => hourlyEvents[point]?.updated || 0)
      const successfulData = dataPoints.map(point => hourlyEvents[point]?.successful || 0)
      const failedData = dataPoints.map(point => hourlyEvents[point]?.failed || 0)

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
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Обновлено',
            data: updatedData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Успешные',
            data: successfulData,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Провальные',
            data: failedData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
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
              text: 'Время суток',
              color: '#6b7280'
            },
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 12,
              callback: function(value, index) {
                // Показываем только каждый 4-й тик (каждые 2 часа)
                return index % 4 === 0 ? labels[index] : '';
              }
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
              stepSize: 1
            }
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
              label: (context) => {
                const label = context.dataset.label || ''
                const value = context.parsed.y
                return `${label}: ${value} событий`
              },
              title: (tooltipItems) => {
                const dataIndex = tooltipItems[0].dataIndex
                return labels[dataIndex]
              }
            }
          }
        }
      }

      timelineChartInstance = new Chart(timelineChart.value, {
        type: 'line',
        data: chartData,
        options: options
      })
    }

    const updateCharts = () => {
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
          if (timelineChart.value && crmData.value.timelineEvents.length > 0) {
            createTimelineChart()
          }
        }, 50)
      })
    }

    // Основные методы
    const handleCalendarDateChange = (newDate) => {
      if (newDate) {
        selectedDay.value = getStringFromCalendarDate(newDate)
        loadData()
      }
    }

    const refreshData = () => {
      // Сбрасываем данные
      workDayData.value = {
        totalWorkDaySeconds: 28800,
        bitrixTimeSeconds: 0,
        elapsedTaskTimeSeconds: 0,
        bitrixTimeNonTaskSeconds: 0,
        workDurationSeconds: 0,
        breakTimeSeconds: 0,
        bitrixTimePercentage: 0
      }

      taskTimeData.value = {
        totalWorkDaySeconds: 28800,
        workDurationSeconds: 0,
        elapsedTaskTimeSeconds: 0,
        tasks: []
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

      loadData()
    }

    const showNotification = (type, message) => {
      if (toast) {
        toast.add({
          description: message,
          variant: type
        })
      }
    }

    // Методы для batch запросов
    const executeBatch = async (calls) => {
      const batchSize = 50
      const results = []

      for (let i = 0; i < calls.length; i += batchSize) {
        const batchCalls = calls.slice(i, i + batchSize)
        const batchResult = await executeSingleBatch(batchCalls)
        results.push(...batchResult)
      }

      return results
    }

    const executeSingleBatch = (calls) => {
      return new Promise((resolve, reject) => {
        const batchCommands = {}
        calls.forEach((call, index) => {
          batchCommands[`call_${index}`] = call
        })

        BX24.callBatch(batchCommands, (results) => {
          const resultArray = []
          for (let i = 0; i < calls.length; i++) {
            const key = `call_${i}`
            if (results[key] && !results[key].error()) {
              resultArray.push(results[key].data())
            } else {
              resultArray.push(null)
            }
          }
          resolve(resultArray)
        }, true)
      })
    }

    // Метод для экспорта в PDF с графиками
    const exportToPDF = async () => {
      try {
        isLoading.value = true

        // Создаем временный контейнер для PDF
        const element = document.createElement('div')
        element.style.position = 'absolute'
        element.style.left = '-9999px'
        element.style.width = '210mm'
        element.style.padding = '20mm'
        element.style.backgroundColor = 'white'
        element.style.color = 'black'
        element.style.fontFamily = "'Segoe UI', 'Arial', sans-serif"

        // Копируем содержимое для PDF
        element.innerHTML = await generatePDFContent()
        document.body.appendChild(element)

        // Ждем рендера изображений и графиков
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Конвертируем в canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        })

        // Создаем PDF
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const pdf = new jsPDF('p', 'mm', 'a4')

        // Добавляем изображение
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

        // Сохраняем PDF
        const fileName = `Статистика_рабочего_дня_${selectedDay.value}.pdf`
        pdf.save(fileName)

        // Удаляем временный элемент
        document.body.removeChild(element)

        showNotification('success', 'PDF успешно экспортирован')

      } catch (error) {
        console.error('Ошибка экспорта:', error)
        showNotification('error', 'Ошибка при экспорте PDF')
      } finally {
        isLoading.value = false
      }
    }

    const generatePDFContent = async () => {
      const today = new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      // Получаем данные графиков как base64
      let bitrixChartImage = ''
      let timelineChartImage = ''

      if (bitrixChartInstance) {
        bitrixChartImage = bitrixChartInstance.toBase64Image()
      }

      if (timelineChartInstance) {
        timelineChartImage = timelineChartInstance.toBase64Image()
      }

      return `
        <div style="max-width: 210mm; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #1f2937; font-size: 24px;">${pageTitle.value}</h1>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
              <strong>Дата анализа:</strong> ${formatDayDisplay(selectedDay.value)}
            </p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">
              <strong>Сгенерировано:</strong> ${today}
            </p>
          </div>

          <div style="margin: 30px 0; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #1f2937;">
              ${formatPercentage(workDayData.value.bitrixTimePercentage)}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">
              времени проведено в Bitrix24
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div>
              <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 15px;">Распределение времени</h3>
              ${bitrixChartImage ? `<img src="${bitrixChartImage}" style="width: 100%; max-width: 300px; margin: 0 auto 20px; display: block;" />` : ''}
              <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
                <strong>Общее время рабочего дня:</strong> ${formatDuration(workDayData.value.totalWorkDaySeconds)}
              </div>
            </div>

            <div>
              <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 15px;">Активность CRM</h3>
              ${timelineChartImage ? `<img src="${timelineChartImage}" style="width: 100%; max-width: 300px; margin: 0 auto 20px; display: block;" />` : ''}
              <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
                <strong>Всего событий за день:</strong> ${crmData.value.timelineEvents.length}
              </div>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              Детализация времени
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
              ${bitrixTimeLegend.value.map(item => `
                <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; background-color: #f9fafb;">
                  <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${item.color}; margin-right: 8px;"></div>
                    <div style="font-size: 12px; font-weight: bold; color: #1f2937;">${item.label}</div>
                  </div>
                  <div style="font-size: 11px; color: #6b7280; margin-bottom: 3px;">${item.description}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; font-weight: bold; color: ${item.color};">${formatDuration(item.value)}</span>
                    <span style="font-size: 11px; color: #6b7280;">${item.percentage}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              Задачи за день (${taskTimeData.value.tasks.length})
            </h3>
            <div style="font-size: 12px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Задача</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Статус</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Время</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Исполнитель</th>
                  </tr>
                </thead>
                <tbody>
                  ${displayedTasks.value.map(task => `
                    <tr>
                      <td style="border: 1px solid #d1d5db; padding: 8px;">${task.title || `Задача #${task.id}`}</td>
                      <td style="border: 1px solid #d1d5db; padding: 8px;">${getTaskStatusText(task.status)}</td>
                      <td style="border: 1px solid #d1d5db; padding: 8px; color: #059669; font-weight: bold;">${formatDuration(task.timeSpent)}</td>
                      <td style="border: 1px solid #d1d5db; padding: 8px;">${task.responsibleName || 'Текущий пользователь'}</td>
                    </tr>
                  `).join('')}
                  ${taskTimeData.value.tasks.length === 0 ? `
                    <tr>
                      <td colspan="4" style="border: 1px solid #d1d5db; padding: 20px; text-align: center; color: #9ca3af;">
                        Нет задач за выбранный день
                      </td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              Статистика CRM
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 12px;">
              <div>
                <div style="margin-bottom: 10px; font-weight: bold; color: #1f2937;">Создано:</div>
                <div style="display: grid; gap: 5px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Сделки:</span>
                    <span style="font-weight: bold; color: #059669;">${crmData.value.createdDealsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Лиды:</span>
                    <span style="font-weight: bold; color: #059669;">${crmData.value.createdLeadsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Контакты:</span>
                    <span style="font-weight: bold; color: #059669;">${crmData.value.createdContactsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Компании:</span>
                    <span style="font-weight: bold; color: #059669;">${crmData.value.createdCompaniesCount}</span>
                  </div>
                </div>
              </div>

              <div>
                <div style="margin-bottom: 10px; font-weight: bold; color: #1f2937;">Обновлено:</div>
                <div style="display: grid; gap: 5px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Сделки:</span>
                    <span style="font-weight: bold; color: #3b82f6;">${crmData.value.updatedDealsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Лиды:</span>
                    <span style="font-weight: bold; color: #3b82f6;">${crmData.value.updatedLeadsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Контакты:</span>
                    <span style="font-weight: bold; color: #3b82f6;">${crmData.value.updatedContactsCount}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Компании:</span>
                    <span style="font-weight: bold; color: #3b82f6;">${crmData.value.updatedCompaniesCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; font-size: 12px;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 10px;">Результаты:</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Успешные сделки:</span>
                  <span style="font-weight: bold; color: #059669;">${crmData.value.successfulDealsCount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Провальные сделки:</span>
                  <span style="font-weight: bold; color: #dc2626;">${crmData.value.failedDealsCount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Успешные лиды:</span>
                  <span style="font-weight: bold; color: #059669;">${crmData.value.convertedLeadsCount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Провальные лиды:</span>
                  <span style="font-weight: bold; color: #dc2626;">${crmData.value.junkLeadsCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
            <p>Bitrix24 • Статистика рабочего дня • Сгенерировано автоматически</p>
            <p>${window.location.hostname}</p>
          </div>
        </div>
      `
    }

    // Методы загрузки данных (остаются без изменений, как в вашем коде)
    const loadCurrentUser = async () => {
      try {
        const userIdFromQuery = route.query.userId

        if (userIdFromQuery) {
          viewedUserId.value = parseInt(userIdFromQuery)
          currentUserId.value = viewedUserId.value

          const results = await executeBatch([
            ['user.get', {
              FILTER: { 'ID': currentUserId.value },
              SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL']
            }]
          ])

          if (results[0] && results[0].length > 0) {
            return results[0][0]
          } else {
            throw new Error('Пользователь не найден')
          }
        } else {
          const results = await executeBatch([
            ['user.current', {}]
          ])

          if (results[0]) {
            const userData = results[0]
            currentUserId.value = parseInt(userData.ID)
            viewedUserId.value = currentUserId.value
            return userData
          } else {
            throw new Error('Ошибка загрузки текущего пользователя')
          }
        }
      } catch (error) {
        showNotification('error', 'Ошибка загрузки пользователя')
        throw error
      }
    }

    const loadWorkDaySettings = async () => {
      try {
        const results = await executeBatch([
          ['timeman.settings', {
            USER_ID: currentUserId.value
          }]
        ])

        if (results[0]) {
          workDaySettings.value = results[0]

          if (workDaySettings.value.UF_TM_MIN_DURATION) {
            const totalSeconds = timeStringToSeconds(
                workDaySettings.value.UF_TM_MIN_DURATION
            )
            workDayData.value.totalWorkDaySeconds = totalSeconds
            taskTimeData.value.totalWorkDaySeconds = totalSeconds
          }
        }
      } catch (error) {
        showNotification('error', 'Ошибка загрузки настроек рабочего дня')
      }
    }

    const loadWorkDayStatus = async () => {
      try {
        const results = await executeBatch([
          ['timeman.status', {
            USER_ID: currentUserId.value
          }]
        ])

        if (results[0]) {
          workDayStatus.value = results[0]

          const workDurationSeconds = timeStringToSeconds(
              workDayStatus.value.DURATION
          )
          const breakTimeSeconds = timeStringToSeconds(
              workDayStatus.value.TIME_LEAKS || '00:00:00'
          )

          workDayData.value.workDurationSeconds = workDurationSeconds
          taskTimeData.value.workDurationSeconds = workDurationSeconds

          const today = new Date().toISOString().split('T')[0]
          const workDayStart = workDayStatus.value.TIME_START
          const isTodayWorkDay = workDayStart && workDayStart.includes(today)

          if (isTodayWorkDay) {
            workDayData.value.breakTimeSeconds = breakTimeSeconds
          } else {
            workDayData.value.breakTimeSeconds = 0
          }
        }
      } catch (error) {
        showNotification('error', 'Ошибка загрузки статуса рабочего дня')
      }
    }

    const loadBitrixTimeData = async () => {
      try {
        const sectionResults = await executeBatch([
          ['entity.section.get', {
            ENTITY: 'pr_tracking',
            FILTER: { 'NAME': selectedDay.value },
            SELECT: ['ID', 'NAME']
          }]
        ])

        const sections = sectionResults[0] || []
        if (sections.length === 0) {
          workDayData.value.bitrixTimeSeconds = 0
          return []
        }

        const sectionId = sections[0].ID
        let allItems = []
        let start = 0
        const pageSize = 50

        while (true) {
          const itemsResults = await executeBatch([
            ['entity.item.get', {
              ENTITY: 'pr_tracking',
              FILTER: {
                SECTION_ID: sectionId,
                'PROPERTY_USER_ID': currentUserId.value
              },
              SELECT: ['PROPERTY_VALUES'],
              NAV_PARAMS: {
                nPageSize: pageSize,
                iNumPage: Math.floor(start / pageSize) + 1
              }
            }]
          ])

          const items = itemsResults[0] || []
          if (items.length === 0) break

          allItems = allItems.concat(items)
          if (items.length < pageSize) break
          start += pageSize
        }

        let totalBitrixTime = 0
        allItems.forEach(item => {
          const props = item.PROPERTY_VALUES || {}
          const pageTime = parseInt(props.PAGE_TIME) || 0
          totalBitrixTime += pageTime
        })

        workDayData.value.bitrixTimeSeconds = totalBitrixTime

        return allItems
      } catch (error) {
        showNotification('error', 'Ошибка загрузки данных Bitrix24')
        workDayData.value.bitrixTimeSeconds = 0
        return []
      }
    }

    const loadTaskTimeData = async () => {
      try {
        const selectedDayValue = selectedDay.value

        let allElapsedItems = []
        let start = 0
        const pageSize = 50

        // Загрузка всех elapsed items с постраничной навигацией
        while (true) {
          const results = await executeBatch([
            ['task.elapseditem.getlist', [
              { 'ID': 'DESC' },
              {
                'USER_ID': currentUserId.value,
                '>=CREATED_DATE': selectedDayValue,
              },
              ['TASK_ID', 'ID', 'CREATED_DATE', 'DATE_START', 'DATE_STOP', 'MINUTES', 'COMMENT_TEXT'],
              {
                "NAV_PARAMS": {
                  "nPageSize": pageSize,
                  "iNumPage": Math.floor(start / pageSize) + 1
                }
              }
            ]]
          ])

          const elapsedItems = results[0] || []

          if (elapsedItems.length === 0) break

          allElapsedItems = allElapsedItems.concat(elapsedItems)
          if (elapsedItems.length < pageSize) break
          start += pageSize
        }

        // Группировка данных по задачам
        const taskTimeMap = new Map()
        let totalElapsedTaskTime = 0

        allElapsedItems.forEach(item => {
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
          // Загружаем информацию о задачах через tasks.task.get
          const taskCalls = []
          taskIds.forEach(taskId => {
            taskCalls.push(['tasks.task.get', {
              taskId: parseInt(taskId),
              select: ['ID', 'TITLE', 'STATUS', 'RESPONSIBLE_ID']
            }])
          })

          const taskResults = await executeBatch(taskCalls)

          // Загружаем информацию об исполнителях
          const responsibleIds = []
          taskResults.forEach((result, index) => {
            if (result && result.task && result.task.responsibleId) {
              responsibleIds.push(parseInt(result.task.responsibleId))
            }
          })

          const uniqueResponsibleIds = [...new Set(responsibleIds)]
          const userCalls = []
          uniqueResponsibleIds.forEach(userId => {
            userCalls.push(['user.get', {
              FILTER: { 'ID': userId },
              SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME']
            }])
          })

          const userResults = userCalls.length > 0 ? await executeBatch(userCalls) : []
          const userMap = new Map()

          userResults.forEach((userList, index) => {
            if (userList && userList.length > 0) {
              const user = userList[0]
              userMap.set(uniqueResponsibleIds[index], user)
            }
          })

          // Формируем массив задач
          taskIds.forEach((taskId, index) => {
            const result = taskResults[index]
            if (result && result.task) {
              const taskInfo = result.task
              const taskData = taskTimeMap.get(taskId)
              const responsibleId = parseInt(taskInfo.responsibleId)
              const responsibleUser = userMap.get(responsibleId)

              tasksArray.push({
                id: taskId,
                title: taskInfo.title || `Задача #${taskId}`,
                status: taskInfo.status || '1',
                timeSpent: taskData.timeSpent,
                elapsedItemsCount: taskData.elapsedItemsCount,
                comments: taskData.comments,
                responsibleId: responsibleId,
                responsibleName: responsibleUser ?
                    `${responsibleUser.NAME} ${responsibleUser.LAST_NAME}`.trim() :
                    'Текущий пользователь'
              })
            }
          })
        }

        // Сортировка по времени
        tasksArray.sort((a, b) => b.timeSpent - a.timeSpent)

        // Обновление состояния
        taskTimeData.value.tasks = tasksArray
        taskTimeData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime
        workDayData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime

        return tasksArray
      } catch (error) {
        console.error('Ошибка загрузки данных задач:', error)
        showNotification('error', 'Ошибка загрузки данных задач')
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

        // Загружаем данные пачками
        const calls = [
          // Сделки созданные
          ['crm.deal.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'STAGE_ID', 'CLOSED', 'DATE_MODIFY', 'DATE_CREATE'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Сделки обновленные
          ['crm.deal.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'STAGE_ID', 'CLOSED', 'DATE_MODIFY'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Лиды созданные
          ['crm.lead.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'STATUS_ID', 'DATE_MODIFY', 'DATE_CREATE'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Лиды обновленные
          ['crm.lead.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'STATUS_ID', 'DATE_MODIFY'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Контакты созданные
          ['crm.contact.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'DATE_MODIFY', 'DATE_CREATE'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Контакты обновленные
          ['crm.contact.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'DATE_MODIFY'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Компании созданные
          ['crm.company.list', {
            'ORDER': {'DATE_CREATE': 'DESC'},
            'FILTER': {
              '>=DATE_CREATE': startDateStr,
              '<=DATE_CREATE': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value
            },
            'SELECT': ['ID', 'DATE_MODIFY', 'DATE_CREATE'],
            NAV_PARAMS: { nPageSize: 50 }
          }],
          // Компании обновленные
          ['crm.company.list', {
            'ORDER': {'DATE_MODIFY': 'DESC'},
            'FILTER': {
              '>=DATE_MODIFY': startDateStr,
              '<=DATE_MODIFY': endDateStr,
              'ASSIGNED_BY_ID': currentUserId.value,
              '!DATE_CREATE': startDateStr
            },
            'SELECT': ['ID', 'DATE_MODIFY'],
            NAV_PARAMS: { nPageSize: 50 }
          }]
        ]

        const results = await executeBatch(calls)

        const dealsCreated = results[0] || []
        const dealsUpdated = results[1] || []
        const leadsCreated = results[2] || []
        const leadsUpdated = results[3] || []
        const contactsCreated = results[4] || []
        const contactsUpdated = results[5] || []
        const companiesCreated = results[6] || []
        const companiesUpdated = results[7] || []

        // Собираем события для временной шкалы
        const timelineEvents = []

        // Обрабатываем созданные сделки
        dealsCreated.forEach(deal => {
          timelineEvents.push({
            timestamp: deal.DATE_CREATE,
            type: 'created',
            entity: 'deal',
            id: deal.ID,
            successful: deal.CLOSED === 'Y' && deal.STAGE_ID &&
                (deal.STAGE_ID.includes('WON') || deal.STAGE_ID.includes('SUCCESS'))
          })

          if (deal.CLOSED === 'Y') {
            if (deal.STAGE_ID && (deal.STAGE_ID.includes('WON') || deal.STAGE_ID.includes('SUCCESS'))) {
              timelineEvents.push({
                timestamp: deal.DATE_MODIFY,
                type: 'successful',
                entity: 'deal',
                id: deal.ID
              })
            } else {
              timelineEvents.push({
                timestamp: deal.DATE_MODIFY,
                type: 'failed',
                entity: 'deal',
                id: deal.ID
              })
            }
          }
        })

        // Обрабатываем обновленные сделки
        dealsUpdated.forEach(deal => {
          timelineEvents.push({
            timestamp: deal.DATE_MODIFY,
            type: 'updated',
            entity: 'deal',
            id: deal.ID
          })
        })

        // Обрабатываем лиды
        leadsCreated.forEach(lead => {
          timelineEvents.push({
            timestamp: lead.DATE_CREATE,
            type: 'created',
            entity: 'lead',
            id: lead.ID
          })

          if (lead.STATUS_ID === 'CONVERTED') {
            timelineEvents.push({
              timestamp: lead.DATE_MODIFY,
              type: 'successful',
              entity: 'lead',
              id: lead.ID
            })
          } else if (lead.STATUS_ID === 'JUNK') {
            timelineEvents.push({
              timestamp: lead.DATE_MODIFY,
              type: 'failed',
              entity: 'lead',
              id: lead.ID
            })
          }
        })

        leadsUpdated.forEach(lead => {
          timelineEvents.push({
            timestamp: lead.DATE_MODIFY,
            type: 'updated',
            entity: 'lead',
            id: lead.ID
          })
        })

        // Обрабатываем контакты и компании
        contactsCreated.forEach(contact => {
          timelineEvents.push({
            timestamp: contact.DATE_CREATE,
            type: 'created',
            entity: 'contact',
            id: contact.ID
          })
        })

        contactsUpdated.forEach(contact => {
          timelineEvents.push({
            timestamp: contact.DATE_MODIFY,
            type: 'updated',
            entity: 'contact',
            id: contact.ID
          })
        })

        companiesCreated.forEach(company => {
          timelineEvents.push({
            timestamp: company.DATE_CREATE,
            type: 'created',
            entity: 'company',
            id: company.ID
          })
        })

        companiesUpdated.forEach(company => {
          timelineEvents.push({
            timestamp: company.DATE_MODIFY,
            type: 'updated',
            entity: 'company',
            id: company.ID
          })
        })

        // Сортируем события по времени
        timelineEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        // Считаем успешные и провальные сделки
        let successfulDeals = 0
        let failedDeals = 0

        dealsCreated.forEach(deal => {
          if (deal.CLOSED === 'Y') {
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

          updatedDealsCount: dealsUpdated.length,
          updatedLeadsCount: leadsUpdated.length,
          updatedContactsCount: contactsUpdated.length,
          updatedCompaniesCount: companiesUpdated.length,

          successfulDealsCount: successfulDeals,
          failedDealsCount: failedDeals,

          convertedLeadsCount: convertedLeads,
          junkLeadsCount: junkLeads,

          timelineEvents: timelineEvents
        }

      } catch (error) {
        showNotification('error', 'Ошибка загрузки данных CRM')
        Object.keys(crmData.value).forEach(key => {
          if (key !== 'timelineEvents') {
            crmData.value[key] = 0
          }
        })
        crmData.value.timelineEvents = []
      }
    }

    const calculateDerivedData = () => {
      const data = workDayData.value
      const totalBitrixTime = data.bitrixTimeSeconds
      const taskTime = data.elapsedTaskTimeSeconds
      const pureBitrixTime = totalBitrixTime - taskTime

      const today = new Date().toISOString().split('T')[0]
      const workDayStart = workDayStatus.value.TIME_START
      const isTodayWorkDay = workDayStart && workDayStart.includes(today)

      const actualBreakTime = isTodayWorkDay ? data.breakTimeSeconds : 0

      const baseTime = isTodayWorkDay ?
          (data.workDurationSeconds || data.totalWorkDaySeconds) :
          data.totalWorkDaySeconds

      const nonBitrixTimeSeconds = Math.max(0,
          baseTime - pureBitrixTime - taskTime - actualBreakTime
      )

      data.bitrixTimePercentage = baseTime > 0
          ? (pureBitrixTime / baseTime) * 100
          : 0

      // Ограничиваем процент 100%
      data.bitrixTimePercentage = Math.min(data.bitrixTimePercentage, 100)

      if (!isTodayWorkDay) {
        data.workDurationSeconds = data.totalWorkDaySeconds
      }
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

        updateCharts()

        showNotification('success', 'Данные успешно загружены')
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        showNotification('error', 'Ошибка при загрузке данных')
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

    const initialize = async () => {
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
    }

    // Наблюдатели
    watch(() => route.query.userId, (newUserId) => {
      if (newUserId) {
        refreshData()
      }
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

    // Инициализация
    onMounted(async () => {
      await initialize()
    })

    return {
      // Данные
      selectedDay,
      calendarDate,
      isLoading,
      workDaySettings,
      workDayStatus,
      workDayData,
      taskTimeData,
      crmData,
      bitrixTimeChart,
      timelineChart,
      hoveredLegendIndex,
      viewedUserId,
      currentUserId,
      showAllTasks,

      // Легенды
      bitrixTimeLegend,
      displayedTasks,

      // Константы
      minCalendarDate,
      maxCalendarDate,

      // Вычисляемые свойства
      hasData,
      pageTitle,

      // Методы
      handleCalendarDateChange,
      refreshData,
      exportToPDF,
      formatDayDisplay,
      formatDuration,
      formatPercentage,
      formatDateTime,
      getWorkDayStatusBadgeColor,
      getWorkDayStatusText,
      getTaskStatusColor,
      getTaskStatusText,
      getEfficiencyColor,
      getTaskUrl,
      getUserUrl,
      isDateDisabled,
      isDateUnavailable,
      hoverLegend
    }
  }
}
</script>