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
                <div class="flex items-center space-x-2">
                  <B24Button
                      @click="exportToPDF"
                      :disabled="isLoading"
                      color="air-secondary"
                      size="sm"
                      class="w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Экспорт PDF
                  </B24Button>
                  <B24Button
                      @click="refreshData"
                      :disabled="isLoading"
                      color="air-primary"
                      size="sm"
                      class="w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm text-gray-700">{{ formatDayDisplay(selectedDay) }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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

              <!-- Прелоадер -->
              <div v-if="isLoading" class="text-center py-8 md:py-12">
                <svg class="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p class="text-sm text-gray-500">Загрузка данных...</p>
              </div>

              <!-- Основной контент -->
              <div v-else>
                <!-- Первая строка: График и легенда -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <!-- График времени -->
                  <div>
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Распределение времени
                        </span>
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
                    </div>
                  </div>

                  <!-- Интерактивная легенда -->
                  <div>
                    <div class="bg-white border border-gray-200 rounded-lg p-4 h-full">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Распределение времени
                        </span>
                      </h4>
                      <div class="space-y-3">
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
                </div>

                <!-- График временной шкалы CRM -->
                <div class="mt-6 md:mt-8">
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Активность CRM в течение дня
                      </span>
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
                </div>

                <!-- Список задач -->
                <div class="mt-6 md:mt-8">
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div class="p-4 border-b border-gray-200">
                      <h4 class="text-sm font-medium text-gray-900">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Задачи за день ({{ taskTimeData.tasks.length }})
                        </span>
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
                        <tr v-for="task in taskTimeData.tasks" :key="task.id" class="hover:bg-gray-50">
                          <td class="px-4 py-3 whitespace-nowrap">
                            <a
                                :href="`/company/personal/user/${currentUserId}/tasks/task/view/${task.id}/`"
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
                                :href="`/company/personal/user/${task.responsibleId || currentUserId}/`"
                                target="_blank"
                                class="text-sm text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-2"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
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
                          Показано 10 из {{ taskTimeData.tasks.length }} задач
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
                </div>

                <!-- Информация о рабочем дне -->
                <div class="mt-6 md:mt-8 space-y-4 md:space-y-6">
                  <h4 class="text-lg font-semibold text-gray-900">
                    <span class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Данные о рабочем дне
                    </span>
                  </h4>
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">
                          <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Настройки рабочего времени
                          </span>
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
                        <h5 class="text-sm font-medium text-blue-900 mb-4">
                          <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Текущий рабочий день
                          </span>
                        </h5>
                        <div class="space-y-3">
                          <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0">
                            <span class="text-sm text-blue-700">Статус:</span>
                            <B24Badge :class="getWorkDayStatusClass(workDayStatus.STATUS)">
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
                <div class="mt-6 md:mt-8">
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Активность CRM
                      </span>
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
              <div v-if="!isLoading && !hasData" class="text-center py-8 md:py-12 text-gray-500">
                <svg class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
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

const toast = useToast()

class WorkDayStatisticsManager {
  constructor() {
    this.route = useRoute()
    this.viewedUserId = ref(null)
    this.selectedDay = ref(new Date().toISOString().split('T')[0])
    this.calendarDate = ref(null)
    this.isLoading = ref(false)
    this.currentUserId = ref(null)
    this.historyDays = ref(30)
    this.hoveredLegendIndex = ref(null)
    this.showAllTasks = ref(false)

    // Refs для canvas элементов
    this.bitrixTimeChart = ref(null)
    this.timelineChart = ref(null)

    // Экземпляры Chart.js
    this.bitrixChartInstance = null
    this.timelineChartInstance = null

    // Данные о рабочем дне
    this.workDaySettings = ref({
      UF_TIMEMAN: false,
      UF_TM_FREE: false,
      UF_TM_MAX_START: null,
      UF_TM_MIN_FINISH: null,
      UF_TM_MIN_DURATION: null,
      UF_TM_ALLOWED_DELTA: null,
      ADMIN: false
    })

    this.workDayStatus = ref({
      STATUS: 'CLOSED',
      TIME_START: null,
      TIME_FINISH: null,
      DURATION: '00:00:00',
      TIME_LEAKS: '00:00:00',
      ACTIVE: false
    })

    this.workDayData = ref({
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

    this.taskTimeData = ref({
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

    this.crmData = ref({
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

      // Данные для временной шкалы
      timelineEvents: []
    })

    // Константы
    this.minCalendarDate = new CalendarDate(2020, 1, 1)
    this.maxCalendarDate = new CalendarDate(2030, 12, 31)

    // Цветовая схема - улучшенные цвета
    this.CHART_COLORS = {
      WORK_DAY: '#d1d5db', // Посветлел серый цвет
      BITRIX_TIME: '#3b82f6',
      BREAK_TIME: '#f97316',
      TASK_TIME: '#10b981', // Зеленый для задач
      OTHER_TIME: '#8b5cf6'
    }

    // Кэш профилей пользователей
    this.userProfilesCache = ref({})
  }

  // Вычисляемые свойства
  get bitrixTimeLegend() {
    const data = this.workDayData.value
    const workDayStatusValue = this.workDayStatus.value

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
        color: this.CHART_COLORS.BITRIX_TIME
      },
      {
        label: 'Время в задачах',
        description: 'Затраченное время на выполнение задач',
        value: data.elapsedTaskTimeSeconds,
        percentage: baseTime > 0 ? `${((data.elapsedTaskTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
        color: this.CHART_COLORS.TASK_TIME
      },
      {
        label: 'Перерывы',
        description: 'Время перерывов',
        value: isTodayWorkDay ? data.breakTimeSeconds : 0,
        percentage: isTodayWorkDay && baseTime > 0 ?
            `${((data.breakTimeSeconds / baseTime) * 100).toFixed(1)}%` : '0%',
        color: this.CHART_COLORS.BREAK_TIME,
        details: !isTodayWorkDay ? 'Только для сегодняшних рабочих дней' : null
      },
      {
        label: isTodayWorkDay ? 'Прочее время' : 'Рабочее время',
        description: isTodayWorkDay ? 'Другое рабочее время' : 'Запланированное рабочее время',
        value: otherTime,
        percentage: baseTime > 0 ? `${((otherTime / baseTime) * 100).toFixed(1)}%` : '0%',
        color: this.CHART_COLORS.WORK_DAY
      }
    ]
  }

  get displayedTasks() {
    if (this.showAllTasks.value) {
      return this.taskTimeData.value.tasks
    }
    return this.taskTimeData.value.tasks.slice(0, 10)
  }

  get pageTitle() {
    if (this.viewedUserId.value && this.viewedUserId.value !== this.currentUserId.value) {
      return `Статистика рабочего дня пользователя #${this.viewedUserId.value}`
    }
    return 'Статистика рабочего дня'
  }

  get hasData() {
    return this.workDayData.value.bitrixTimeSeconds > 0 ||
        this.workDayData.value.elapsedTaskTimeSeconds > 0 ||
        this.workDayData.value.workDurationSeconds > 0 ||
        this.workDayStatus.value.STATUS !== 'CLOSED' ||
        this.taskTimeData.value.elapsedTaskTimeSeconds > 0 ||
        this.crmData.value.timelineEvents.length > 0
  }

  // Вспомогательные методы
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

  formatDayDisplay(dateString) {
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

  formatDuration(seconds) {
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

  formatPercentage(value) {
    return `${value.toFixed(1)}%`
  }

  formatDateTime(dateTime) {
    if (!dateTime) return null
    return new Date(dateTime).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  formatTime(timeString) {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  timeStringToSeconds(timeString) {
    if (!timeString) return 0
    const parts = timeString.split(':')
    if (parts.length !== 3) return 0

    const hours = parseInt(parts[0])
    const minutes = parseInt(parts[1])
    const seconds = parseInt(parts[2])

    return hours * 3600 + minutes * 60 + seconds
  }

  getWorkDayStatusClass(status) {
    const statusMap = {
      'OPENED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'EXPIRED': 'bg-red-100 text-red-800'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-800'
  }

  getWorkDayStatusText(status) {
    const statusMap = {
      'OPENED': 'Открыт',
      'CLOSED': 'Закрыт',
      'PAUSED': 'Приостановлен',
      'EXPIRED': 'Истек'
    }
    return statusMap[status] || 'Неизвестно'
  }

  getTaskStatusColor(status) {
    const statusMap = {
      '1': 'air-secondary-accent', // Новая
      '2': 'air-warning', // В работе
      '3': 'air-waiting', // Ждет выполнения
      '4': 'air-info', // Отложена
      '5': 'air-primary-success', // Выполнена
      '6': 'air-secondary-accent', // Отменена
      '7': 'air-critical', // Просрочена
    }
    return statusMap[status] || 'air-secondary-accent'
  }

  getTaskStatusText(status) {
    const statusMap = {
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

  getEfficiencyColor(percentage) {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  isDateDisabled(date) {
    const dayOfWeek = date.toDate('UTC').getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  isDateUnavailable(date) {
    if (!this.historyDays.value || this.historyDays.value <= 0) return false

    const today = new Date()
    const selectedDate = date.toDate('UTC')
    const diffTime = today.getTime() - selectedDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > this.historyDays.value
  }

  // Метод для экспорта в PDF
  async exportToPDF() {
    try {
      this.isLoading.value = true

      // Создаем временный элемент для рендеринга
      const element = document.createElement('div')
      element.style.width = '210mm'
      element.style.padding = '20px'
      element.style.backgroundColor = 'white'
      element.style.color = 'black'
      element.style.fontFamily = 'Arial, sans-serif'

      // Генерируем HTML для PDF
      element.innerHTML = this.generatePDFContent()

      // Добавляем в DOM для рендеринга
      document.body.appendChild(element)

      // Используем браузерную печать для экспорта в PDF
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Статистика рабочего дня</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                color: #000;
              }
              .container {
                max-width: 210mm;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
              }
              .stat-card {
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 8px;
              }
              .legend-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
              }
              .legend-color {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 10px;
                border: 1px solid #ddd;
              }
              .task-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .task-table th,
              .task-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .task-table th {
                background-color: #f3f4f6;
                font-weight: bold;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${this.generatePDFContent()}
          </body>
        </html>
      `)

      printWindow.document.close()

      // Даем время на загрузку стилей
      setTimeout(() => {
        printWindow.print()
        printWindow.onafterprint = () => {
          printWindow.close()
          document.body.removeChild(element)
        }
      }, 500)

      this.showNotification('success', 'Подготовка к печати... Сохраните как PDF')

    } catch (error) {
      console.error('Ошибка экспорта:', error)
      this.showNotification('error', 'Ошибка при экспорте')
    } finally {
      this.isLoading.value = false
    }
  }

  generatePDFContent() {
    const today = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return `
      <div class="container">
        <div class="header">
          <h1>${this.pageTitle}</h1>
          <p><strong>Дата:</strong> ${this.formatDayDisplay(this.selectedDay.value)}</p>
          <p><strong>Сгенерировано:</strong> ${today}</p>
        </div>

        <div class="stat-card">
          <h2>Распределение времени</h2>
          <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 24px; font-weight: bold;">${this.formatPercentage(this.workDayData.value.bitrixTimePercentage)}</div>
            <div>времени в Bitrix24</div>
          </div>

          ${this.bitrixTimeLegend.map(item => `
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${item.color}"></div>
              <div style="flex-grow: 1">
                <strong>${item.label}</strong><br>
                <small>${item.description}</small>
              </div>
              <div style="text-align: right">
                <strong>${this.formatDuration(item.value)}</strong><br>
                <small>${item.percentage}</small>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Настройки рабочего времени</h3>
            <p><strong>Учет времени:</strong> ${this.workDaySettings.value.UF_TIMEMAN ? 'Включен' : 'Выключен'}</p>
            <p><strong>Свободный график:</strong> ${this.workDaySettings.value.UF_TM_FREE ? 'Да' : 'Нет'}</p>
            <p><strong>Начало дня до:</strong> ${this.workDaySettings.value.UF_TM_MAX_START || 'Не задано'}</p>
            <p><strong>Конец дня после:</strong> ${this.workDaySettings.value.UF_TM_MIN_FINISH || 'Не задано'}</p>
          </div>

          <div class="stat-card">
            <h3>Текущий рабочий день</h3>
            <p><strong>Статус:</strong> ${this.getWorkDayStatusText(this.workDayStatus.value.STATUS)}</p>
            <p><strong>Начало:</strong> ${this.formatDateTime(this.workDayStatus.value.TIME_START) || 'Не начат'}</p>
            <p><strong>Длительность:</strong> ${this.workDayStatus.value.DURATION || '00:00:00'}</p>
            <p><strong>Перерывы:</strong> ${this.workDayStatus.value.TIME_LEAKS || '00:00:00'}</p>
          </div>
        </div>

        <div class="stat-card">
          <h3>Активность CRM</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4>Создано</h4>
              <p>Сделки: ${this.crmData.value.createdDealsCount}</p>
              <p>Лиды: ${this.crmData.value.createdLeadsCount}</p>
              <p>Контакты: ${this.crmData.value.createdContactsCount}</p>
              <p>Компании: ${this.crmData.value.createdCompaniesCount}</p>
            </div>
            <div>
              <h4>Обновлено</h4>
              <p>Сделки: ${this.crmData.value.updatedDealsCount}</p>
              <p>Лиды: ${this.crmData.value.updatedLeadsCount}</p>
              <p>Контакты: ${this.crmData.value.updatedContactsCount}</p>
              <p>Компании: ${this.crmData.value.updatedCompaniesCount}</p>
            </div>
          </div>
        </div>

        ${this.generateTasksPDFContent()}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>Bitrix24 Статистика рабочего дня</p>
        </div>
      </div>
    `
  }

  generateTasksPDFContent() {
    if (this.taskTimeData.value.tasks.length === 0) return ''

    const tasksToShow = this.taskTimeData.value.tasks.slice(0, 20)

    return `
      <div class="stat-card" style="margin-top: 20px;">
        <h3>Задачи за день (${this.taskTimeData.value.tasks.length})</h3>
        <table class="task-table">
          <thead>
            <tr>
              <th>Задача</th>
              <th>Статус</th>
              <th>Время</th>
              <th>Исполнитель</th>
            </tr>
          </thead>
          <tbody>
            ${tasksToShow.map(task => `
              <tr>
                <td>${task.title || `Задача #${task.id}`}</td>
                <td>${this.getTaskStatusText(task.status)}</td>
                <td>${this.formatDuration(task.timeSpent)}</td>
                <td>${task.responsibleName || 'Текущий пользователь'}</td>
              </tr>
            `).join('')}
            ${this.taskTimeData.value.tasks.length > 20 ?
        `<tr><td colspan="4" style="text-align: center; color: #666;">...и еще ${this.taskTimeData.value.tasks.length - 20} задач</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    `
  }

  // Методы для работы с Chart.js
  hoverLegend(index) {
    this.hoveredLegendIndex.value = index

    if (this.bitrixChartInstance) {
      const dataset = this.bitrixChartInstance.data.datasets[0]
      dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
          i === index ? this.lightenColor(color, 20) : this.bitrixTimeLegend[i].color
      )
      this.bitrixChartInstance.update('none')
    }
  }

  lightenColor(color, percent) {
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

  createBitrixTimeChart() {
    if (this.bitrixChartInstance) {
      this.bitrixChartInstance.destroy()
    }

    if (!this.bitrixTimeChart.value) return

    const chartData = {
      labels: this.bitrixTimeLegend.map(item => item.label),
      datasets: [{
        data: this.bitrixTimeLegend.map(item => item.value),
        backgroundColor: this.bitrixTimeLegend.map(item => item.color),
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
              const item = this.bitrixTimeLegend[context.dataIndex]
              return [
                item.label,
                `${this.formatDuration(context.raw)} (${item.percentage})`,
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

    this.bitrixChartInstance = new Chart(this.bitrixTimeChart.value, {
      type: 'doughnut',
      data: chartData,
      options: options
    })

    this.bitrixTimeChart.value.addEventListener('mouseleave', () => {
      this.hoverLegend(null)
    })
  }

  createTimelineChart() {
    if (this.timelineChartInstance) {
      this.timelineChartInstance.destroy()
    }

    if (!this.timelineChart.value || this.crmData.value.timelineEvents.length === 0) return

    // Группируем события по часам
    const hourlyEvents = {}
    for (let i = 0; i < 24; i++) {
      hourlyEvents[i] = {
        created: 0,
        updated: 0,
        successful: 0,
        failed: 0
      }
    }

    this.crmData.value.timelineEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours()
      if (hourlyEvents[hour]) {
        if (event.type === 'created') hourlyEvents[hour].created++
        if (event.type === 'updated') hourlyEvents[hour].updated++
        if (event.type === 'successful') hourlyEvents[hour].successful++
        if (event.type === 'failed') hourlyEvents[hour].failed++
      }
    })

    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    const createdData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].created)
    const updatedData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].updated)
    const successfulData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].successful)
    const failedData = Array.from({ length: 24 }, (_, i) => hourlyEvents[i].failed)

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
          tension: 0.4
        },
        {
          label: 'Обновлено',
          data: updatedData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
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
            }
          }
        }
      }
    }

    this.timelineChartInstance = new Chart(this.timelineChart.value, {
      type: 'line',
      data: chartData,
      options: options
    })
  }

  updateCharts() {
    nextTick(() => {
      // Уничтожаем старые инстансы
      if (this.bitrixChartInstance) {
        this.bitrixChartInstance.destroy()
        this.bitrixChartInstance = null
      }
      if (this.timelineChartInstance) {
        this.timelineChartInstance.destroy()
        this.timelineChartInstance = null
      }

      // Создаем новые после рендера
      setTimeout(() => {
        if (this.bitrixTimeChart.value) {
          this.createBitrixTimeChart()
        }
        if (this.timelineChart.value && this.crmData.value.timelineEvents.length > 0) {
          this.createTimelineChart()
        }
      }, 50)
    })
  }

  // Основные методы
  handleCalendarDateChange(newDate) {
    if (newDate) {
      this.selectedDay.value = this.getStringFromCalendarDate(newDate)
      this.loadData()
    }
  }

  refreshData() {
    // Сбрасываем данные
    this.workDayData.value = {
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

    this.taskTimeData.value = {
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

    this.crmData.value = {
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

    this.loadData()
  }

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

  // Методы для batch запросов
  async executeBatch(calls) {
    const batchSize = 50
    const results = []

    for (let i = 0; i < calls.length; i += batchSize) {
      const batchCalls = calls.slice(i, i + batchSize)
      const batchResult = await this.executeSingleBatch(batchCalls)
      results.push(...batchResult)
    }

    return results
  }

  executeSingleBatch(calls) {
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

  // Методы загрузки данных с использованием batch
  async loadCurrentUser() {
    try {
      const userIdFromQuery = this.route.query.userId

      if (userIdFromQuery) {
        this.viewedUserId.value = parseInt(userIdFromQuery)
        this.currentUserId.value = this.viewedUserId.value

        const results = await this.executeBatch([
          ['user.get', {
            FILTER: { 'ID': this.currentUserId.value },
            SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL']
          }]
        ])

        if (results[0] && results[0].length > 0) {
          return results[0][0]
        } else {
          throw new Error('Пользователь не найден')
        }
      } else {
        const results = await this.executeBatch([
          ['user.current', {}]
        ])

        if (results[0]) {
          const userData = results[0]
          this.currentUserId.value = parseInt(userData.ID)
          return userData
        } else {
          throw new Error('Ошибка загрузки текущего пользователя')
        }
      }
    } catch (error) {
      this.showNotification('error', 'Ошибка загрузки пользователя')
      throw error
    }
  }

  async loadWorkDaySettings() {
    try {
      const results = await this.executeBatch([
        ['timeman.settings', {
          USER_ID: this.currentUserId.value
        }]
      ])

      if (results[0]) {
        this.workDaySettings.value = results[0]

        if (this.workDaySettings.value.UF_TM_MIN_DURATION) {
          const totalSeconds = this.timeStringToSeconds(
              this.workDaySettings.value.UF_TM_MIN_DURATION
          )
          this.workDayData.value.totalWorkDaySeconds = totalSeconds
          this.taskTimeData.value.totalWorkDaySeconds = totalSeconds
        }
      }
    } catch (error) {
      this.showNotification('error', 'Ошибка загрузки настроек рабочего дня')
    }
  }

  async loadWorkDayStatus() {
    try {
      const results = await this.executeBatch([
        ['timeman.status', {
          USER_ID: this.currentUserId.value
        }]
      ])

      if (results[0]) {
        this.workDayStatus.value = results[0]

        const workDurationSeconds = this.timeStringToSeconds(
            this.workDayStatus.value.DURATION
        )
        const breakTimeSeconds = this.timeStringToSeconds(
            this.workDayStatus.value.TIME_LEAKS || '00:00:00'
        )

        this.workDayData.value.workDurationSeconds = workDurationSeconds
        this.taskTimeData.value.workDurationSeconds = workDurationSeconds

        const today = new Date().toISOString().split('T')[0]
        const workDayStart = this.workDayStatus.value.TIME_START
        const isTodayWorkDay = workDayStart && workDayStart.includes(today)

        if (isTodayWorkDay) {
          this.workDayData.value.breakTimeSeconds = breakTimeSeconds
        } else {
          this.workDayData.value.breakTimeSeconds = 0
        }
      }
    } catch (error) {
      this.showNotification('error', 'Ошибка загрузки статуса рабочего дня')
    }
  }

  async loadBitrixTimeData() {
    try {
      const sectionResults = await this.executeBatch([
        ['entity.section.get', {
          ENTITY: 'pr_tracking',
          FILTER: { 'NAME': this.selectedDay.value },
          SELECT: ['ID', 'NAME']
        }]
      ])

      const sections = sectionResults[0] || []
      if (sections.length === 0) {
        this.workDayData.value.bitrixTimeSeconds = 0
        return []
      }

      const sectionId = sections[0].ID
      let allItems = []
      let start = 0
      const pageSize = 50

      while (true) {
        const itemsResults = await this.executeBatch([
          ['entity.item.get', {
            ENTITY: 'pr_tracking',
            FILTER: {
              SECTION_ID: sectionId,
              'PROPERTY_USER_ID': this.currentUserId.value
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

      this.workDayData.value.bitrixTimeSeconds = totalBitrixTime

      return allItems
    } catch (error) {
      this.showNotification('error', 'Ошибка загрузки данных Bitrix24')
      this.workDayData.value.bitrixTimeSeconds = 0
      return []
    }
  }

  async loadTaskTimeData() {
    try {
      const startOfDay = new Date(this.selectedDay.value + 'T00:00:00')
      const endOfDay = new Date(this.selectedDay.value + 'T23:59:59')

      let allElapsedItems = []
      let start = 0
      const pageSize = 50

      while (true) {
        const results = await this.executeBatch([
          ['task.elapseditem.getlist', {
            'ORDER': {'ID': 'DESC'},
            'FILTER': {
              'USER_ID': this.currentUserId.value,
              '>=DATE_START': startOfDay.toISOString(),
              '<=DATE_START': endOfDay.toISOString()
            },
            'SELECT': ['TASK_ID', 'MINUTES', 'COMMENT_TEXT', 'DATE_START'],
            NAV_PARAMS: {
              nPageSize: pageSize,
              iNumPage: Math.floor(start / pageSize) + 1
            }
          }]
        ])

        const elapsedItems = results[0] || []
        if (elapsedItems.length === 0) break

        allElapsedItems = allElapsedItems.concat(elapsedItems)
        if (elapsedItems.length < pageSize) break
        start += pageSize
      }

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
        // Загружаем информацию о задачах
        const taskCalls = []
        taskIds.forEach(taskId => {
          taskCalls.push(['task.get', { 'TASKID': taskId }])
        })

        const taskResults = await this.executeBatch(taskCalls)

        // Загружаем информацию об исполнителях
        const responsibleIds = []
        taskResults.forEach((taskInfo, index) => {
          if (taskInfo && taskInfo.RESPONSIBLE_ID) {
            responsibleIds.push(taskInfo.RESPONSIBLE_ID)
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

        const userResults = userCalls.length > 0 ? await this.executeBatch(userCalls) : []
        const userMap = new Map()

        userResults.forEach((userList, index) => {
          if (userList && userList.length > 0) {
            const user = userList[0]
            userMap.set(uniqueResponsibleIds[index], user)
          }
        })

        // Формируем массив задач
        taskIds.forEach((taskId, index) => {
          const taskInfo = taskResults[index]
          if (taskInfo) {
            const taskData = taskTimeMap.get(taskId)
            const responsibleId = taskInfo.RESPONSIBLE_ID
            const responsibleUser = userMap.get(responsibleId)

            tasksArray.push({
              id: taskId,
              title: taskInfo?.TITLE || `Задача #${taskId}`,
              status: taskInfo?.STATUS || '1',
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

      const maxTaskTime = tasksArray.length > 0
          ? Math.max(...tasksArray.map(t => t.timeSpent))
          : 0
      const averageTimePerTask = tasksArray.length > 0
          ? totalElapsedTaskTime / tasksArray.length
          : 0

      tasksArray.sort((a, b) => b.timeSpent - a.timeSpent)

      this.taskTimeData.value.tasks = tasksArray
      this.taskTimeData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime
      this.workDayData.value.elapsedTaskTimeSeconds = totalElapsedTaskTime
      this.taskTimeData.value.maxTaskTime = maxTaskTime
      this.taskTimeData.value.averageTimePerTask = averageTimePerTask

      return tasksArray
    } catch (error) {
      this.showNotification('error', 'Ошибка загрузки данных задач')
      return []
    }
  }

  async loadCrmData() {
    try {
      const startOfDay = new Date(this.selectedDay.value + 'T00:00:00')
      const endOfDay = new Date(this.selectedDay.value + 'T23:59:59')

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
            'ASSIGNED_BY_ID': this.currentUserId.value
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
            'ASSIGNED_BY_ID': this.currentUserId.value,
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
            'ASSIGNED_BY_ID': this.currentUserId.value
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
            'ASSIGNED_BY_ID': this.currentUserId.value,
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
            'ASSIGNED_BY_ID': this.currentUserId.value
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
            'ASSIGNED_BY_ID': this.currentUserId.value,
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
            'ASSIGNED_BY_ID': this.currentUserId.value
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
            'ASSIGNED_BY_ID': this.currentUserId.value,
            '!DATE_CREATE': startDateStr
          },
          'SELECT': ['ID', 'DATE_MODIFY'],
          NAV_PARAMS: { nPageSize: 50 }
        }]
      ]

      const results = await this.executeBatch(calls)

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

      this.crmData.value = {
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
      this.showNotification('error', 'Ошибка загрузки данных CRM')
      Object.keys(this.crmData.value).forEach(key => {
        if (key !== 'timelineEvents') {
          this.crmData.value[key] = 0
        }
      })
      this.crmData.value.timelineEvents = []
    }
  }

  calculateDerivedData() {
    const data = this.workDayData.value
    const totalBitrixTime = data.bitrixTimeSeconds
    const taskTime = data.elapsedTaskTimeSeconds
    const pureBitrixTime = totalBitrixTime - taskTime // Время в Bitrix без учета задач

    const today = new Date().toISOString().split('T')[0]
    const workDayStart = this.workDayStatus.value.TIME_START
    const isTodayWorkDay = workDayStart && workDayStart.includes(today)

    const actualBreakTime = isTodayWorkDay ? data.breakTimeSeconds : 0

    const baseTime = isTodayWorkDay ?
        (data.workDurationSeconds || data.totalWorkDaySeconds) :
        data.totalWorkDaySeconds

    data.nonBitrixTimeSeconds = Math.max(0,
        baseTime - pureBitrixTime - taskTime - actualBreakTime
    )

    data.bitrixTimePercentage = baseTime > 0
        ? (pureBitrixTime / baseTime) * 100
        : 0

    data.workDurationPercentage = data.totalWorkDaySeconds > 0
        ? (data.workDurationSeconds / data.totalWorkDaySeconds) * 100
        : 0

    data.bitrixTimeOfWorkedPercentage = data.workDurationSeconds > 0
        ? (pureBitrixTime / data.workDurationSeconds) * 100
        : 0

    data.taskTimeOfBitrixPercentage = pureBitrixTime > 0
        ? (taskTime / pureBitrixTime) * 100
        : 0

    data.nonBitrixTimePercentage = baseTime > 0
        ? (data.nonBitrixTimeSeconds / baseTime) * 100
        : 0

    if (isTodayWorkDay) {
      data.remainingWorkDaySeconds = Math.max(0, data.totalWorkDaySeconds - data.workDurationSeconds)
    } else {
      data.remainingWorkDaySeconds = 0
    }

    data.remainingPercentage = data.totalWorkDaySeconds > 0
        ? (data.remainingWorkDaySeconds / data.totalWorkDaySeconds) * 100
        : 0

    const workDurationHours = data.workDurationSeconds / 3600
    data.averageActivityPerHour = workDurationHours > 0
        ? pureBitrixTime / 3600 / workDurationHours
        : 0

    const workDayProgress = isTodayWorkDay && data.totalWorkDaySeconds > 0
        ? data.workDurationSeconds / data.totalWorkDaySeconds
        : 1

    data.projectedBitrixTime = workDayProgress > 0
        ? pureBitrixTime / workDayProgress
        : pureBitrixTime

    data.projectedPercentage = data.totalWorkDaySeconds > 0
        ? (data.projectedBitrixTime / data.totalWorkDaySeconds) * 100
        : 0

    data.bitrixTimePercentage = Math.min(data.bitrixTimePercentage, 100)
    data.workDurationPercentage = Math.min(data.workDurationPercentage, 100)
    data.bitrixTimeOfWorkedPercentage = Math.min(data.bitrixTimeOfWorkedPercentage, 100)
    data.taskTimeOfBitrixPercentage = Math.min(data.taskTimeOfBitrixPercentage, 100)
    data.nonBitrixTimePercentage = Math.min(data.nonBitrixTimePercentage, 100)
    data.projectedPercentage = Math.min(data.projectedPercentage, 100)

    if (!isTodayWorkDay) {
      data.workDurationPercentage = 100
      data.remainingPercentage = 0
      data.projectedBitrixTime = pureBitrixTime
    }
  }

  async loadData() {
    try {
      this.isLoading.value = true

      this.calendarDate.value = this.getCalendarDateFromString(this.selectedDay.value)

      await this.loadCurrentUser()
      await this.loadWorkDaySettings()
      await this.loadWorkDayStatus()
      await Promise.all([
        this.loadBitrixTimeData(),
        this.loadTaskTimeData(),
        this.loadCrmData()
      ])

      this.calculateDerivedData()

      this.updateCharts()

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
      this.isLoading.value = false
    }
  }

  async loadAppSettings() {
    try {
      if (typeof BX24 !== 'undefined' && BX24.appOption) {
        const days = BX24.appOption.get('page_tracking_history_days')
        if (days) {
          this.historyDays.value = parseInt(days) || 30
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек приложения:', error)
    }
  }

  async initialize() {
    if (typeof BX24 !== 'undefined' && BX24.init) {
      BX24.init(async () => {
        try {
          await this.loadAppSettings()
          await this.loadData()
        } catch (error) {
          console.error('Ошибка инициализации:', error)
          this.isLoading.value = false
        }
      })
    } else {
      this.isLoading.value = false
    }
  }
}

export default {
  name: 'WorkDayStatistics',
  components: {
    Sidebar
  },
  setup() {
    const manager = new WorkDayStatisticsManager()

    // Наблюдатели
    watch(() => manager.route.query.userId, (newUserId) => {
      if (newUserId) {
        manager.refreshData()
      }
    })

    // Наблюдатель для обновления графиков при загрузке данных
    watch(() => manager.isLoading.value, (newValue, oldValue) => {
      if (oldValue === true && newValue === false) {
        // Задержка для гарантии рендера DOM
        setTimeout(() => {
          manager.updateCharts()
        }, 100)
      }
    })

    // Инициализация
    onMounted(async () => {
      await manager.initialize()
    })

    return {
      // Данные
      selectedDay: manager.selectedDay,
      calendarDate: manager.calendarDate,
      isLoading: manager.isLoading,
      workDaySettings: manager.workDaySettings,
      workDayStatus: manager.workDayStatus,
      workDayData: manager.workDayData,
      taskTimeData: manager.taskTimeData,
      crmData: manager.crmData,
      bitrixTimeChart: manager.bitrixTimeChart,
      timelineChart: manager.timelineChart,
      hoveredLegendIndex: manager.hoveredLegendIndex,
      viewedUserId: manager.viewedUserId,
      currentUserId: manager.currentUserId,
      showAllTasks: manager.showAllTasks,

      // Легенды
      bitrixTimeLegend: computed(() => manager.bitrixTimeLegend),
      displayedTasks: computed(() => manager.displayedTasks),

      // Константы
      minCalendarDate: manager.minCalendarDate,
      maxCalendarDate: manager.maxCalendarDate,

      // Вычисляемые свойства
      hasData: computed(() => manager.hasData),
      pageTitle: computed(() => manager.pageTitle),

      // Методы
      handleCalendarDateChange: manager.handleCalendarDateChange.bind(manager),
      refreshData: manager.refreshData.bind(manager),
      exportToPDF: manager.exportToPDF.bind(manager),
      formatDayDisplay: manager.formatDayDisplay.bind(manager),
      formatDuration: manager.formatDuration.bind(manager),
      formatPercentage: manager.formatPercentage.bind(manager),
      formatDateTime: manager.formatDateTime.bind(manager),
      formatTime: manager.formatTime.bind(manager),
      getWorkDayStatusClass: manager.getWorkDayStatusClass.bind(manager),
      getWorkDayStatusText: manager.getWorkDayStatusText.bind(manager),
      getTaskStatusColor: manager.getTaskStatusColor.bind(manager),
      getTaskStatusText: manager.getTaskStatusText.bind(manager),
      getEfficiencyColor: manager.getEfficiencyColor.bind(manager),
      isDateDisabled: manager.isDateDisabled.bind(manager),
      isDateUnavailable: manager.isDateUnavailable.bind(manager),
      hoverLegend: manager.hoverLegend.bind(manager)
    }
  }
}
</script>