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
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Обновить
                  </B24Button>
                  <B24Button
                      @click="exportToPDF"
                      :disabled="isLoading"
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
              <div id="work_day_statistic" v-else>
                <!-- Первая строка: График и легенда -->
                <div class="grid grid-cols-1 border border-gray-200 rounded-lg gap-6 md:gap-8">
                  <!-- График времени -->
                  <div>
                    <div class="bg-white p-4">
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
                            Времени не сохранено
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Интерактивная легенда -->
                  <div>
                    <div class="bg-white h-full flex flex-col">
                      <!-- Заголовок для мобилок -->
                      <div class="block md:hidden px-4 pt-4 pb-2">
                        <h3 class="text-sm font-medium text-gray-700">Распределение времени</h3>
                      </div>

                      <!-- Список элементов легенды -->
                      <div class="flex-1 overflow-y-auto px-4 py-2 md:p-4">
                        <div class="space-y-2 md:space-y-3">
                          <div v-for="(item, index) in bitrixTimeLegend" :key="index"
                               class="group relative p-3 rounded-xl transition-all duration-200"
                               :class="[
               hoveredLegendIndex === index
                 ? 'bg-gradient-to-br from-gray-50 to-white shadow-md border-gray-200 scale-[1.02]'
                 : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100'
             ]"
                               @mouseenter="hoverLegend(index)"
                               @mouseleave="hoverLegend(null)">

                            <!-- Активный индикатор -->
                            <div v-if="hoveredLegendIndex === index"
                                 class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                                 :style="{ backgroundColor: item.color }"></div>

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                              <!-- Левая часть с цветом и текстом -->
                              <div class="flex items-center min-w-0 flex-1">
                                <div class="relative flex-shrink-0">
                                  <div class="w-5 h-5 rounded-full mr-3 transition-transform duration-200 group-hover:scale-110"
                                       :style="{
                       backgroundColor: item.color,
                       boxShadow: hoveredLegendIndex === index ? `0 0 0 2px ${item.color}20` : 'none'
                     }">
                                  </div>
                                  <div v-if="item.icon"
                                       class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center text-[10px]"
                                       :style="{ color: item.color }">
                                    {{ item.icon }}
                                  </div>
                                </div>

                                <div class="min-w-0 flex-1">
                                  <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 truncate">{{ item.label }}</span>
                                    <span v-if="item.badge"
                                          class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                    {{ item.badge }}
                  </span>
                                  </div>
                                  <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <span class="truncate">{{ item.description }}</span>
                                    <span class="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                                    <span class="font-medium flex-shrink-0" :style="{ color: item.color }">
                    {{ item.percentage }}
                  </span>
                                  </div>
                                </div>
                              </div>

                              <!-- Правая часть со временем -->
                              <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:ml-4">
                                <div class="text-right">
                                  <div class="text-base md:text-lg font-bold leading-none" :style="{ color: item.color }">
                                    {{ formatDuration(item.value) }}
                                  </div>
                                </div>

                                <!-- Прогресс бар для мобилок -->
                                <div class="block sm:hidden w-16">
                                  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-300"
                                         :style="{
                         width: item.percentage,
                         backgroundColor: item.color
                       }"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Детали (если есть) -->
                            <div v-if="item.details"
                                 class="mt-2 ml-8 md:ml-8 text-xs text-gray-600 bg-gray-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100">
                              <div class="flex items-start gap-2">
                                <span class="text-gray-400">ⓘ</span>
                                <span>{{ item.details }}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Общая статистика -->
                        <div class="mt-6 pt-5 border-t border-gray-200">
                          <div class="grid grid-cols-2 gap-4 md:gap-6">
                            <!-- Рабочий день -->
                            <div class="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                              <div class="flex flex-col items-center text-center">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Рабочий день
              </span>
                                <span class="text-xl md:text-2xl font-bold text-gray-900 leading-none">
                {{ formatDuration(workDayData.totalWorkDaySeconds) }}
              </span>
                                <span class="text-[10px] text-gray-400 mt-1">общее время</span>
                              </div>
                              <!-- Декоративная полоска -->
                              <div class="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full opacity-50"></div>
                            </div>

                            <!-- Эффективность -->
                            <div class="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                              <div class="flex flex-col items-center text-center">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Потери
              </span>
                                <span class="text-xl md:text-2xl font-bold leading-none"
                                      :class="getEfficiencyColor(workDayData.bitrixTimePercentage)">
                {{ formatPercentage(workDayData.bitrixTimePercentage) }}
              </span>
                                <span class="text-[10px] text-gray-400 mt-1">времени не сохранено</span>
                              </div>
                              <!-- Круговая индикация эффективности -->
                              <div class="absolute -top-1 -right-1 w-8 h-8">
                                <svg class="w-full h-full" viewBox="0 0 36 36">
                                  <circle cx="18" cy="18" r="16" fill="none"
                                          stroke="#e5e7eb" stroke-width="2"/>
                                  <circle cx="18" cy="18" r="16" fill="none"
                                          :stroke="getEfficiencyColorValue(workDayData.bitrixTimePercentage)"
                                          stroke-width="2"
                                          :stroke-dasharray="`${workDayData.bitrixTimePercentage * 1.0048}, 100`"
                                          stroke-linecap="round"
                                          transform="rotate(-90 18 18)"/>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <!-- Дополнительная информация -->
                          <div class="mt-4 text-center">
                            <button class="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                              <span>Подробная статистика</span>
                              <span class="text-lg leading-none">→</span>
                            </button>
                          </div>
                        </div>
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

                    <!-- Таблица задач с использованием B24Table -->
                    <div class="overflow-x-auto">
                      <B24Table
                          :data="displayedTasks"
                          :columns="taskColumns"
                          :loading="isLoading"
                          class="w-full"
                          empty="Нет задач за выбранный день"
                      >
                        <template #task-cell="{ row }">
                          <div class="flex flex-col min-w-0">
                            <a
                                :href="`/company/personal/user/${currentUserId}/tasks/task/view/${row.original.id}/`"
                                target="_blank"
                                class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block"
                            >
                              {{ row.original.title || `Задача #${row.original.id}` }}
                            </a>
                            <div class="text-xs text-gray-500">
                              ID: {{ row.original.id }}
                            </div>
                          </div>
                        </template>

                        <template #status-cell="{ row }">
                          <B24Badge :color="getTaskStatusColor(row.original.status)" class="whitespace-nowrap overflow-scroll inline-block">
                            {{ getTaskStatusText(row.original.status) }}
                          </B24Badge>
                        </template>

                        <template #time-cell="{ row }">
                          <div class="flex flex-col">
                            <div class="text-sm font-semibold text-green-600">
                              {{ formatDuration(row.original.timeSpent) }}
                            </div>
                            <div class="text-xs text-gray-500">
                              {{ row.original.elapsedItemsCount }} записей
                            </div>
                          </div>
                        </template>

                        <template #responsible-cell="{ row }">
                          <a
                              :href="`/company/personal/user/${row.original.responsibleId || currentUserId}/`"
                              target="_blank"
                              class="text-sm text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {{ row.original.responsibleName || 'Текущий пользователь' }}
                          </a>
                        </template>
                      </B24Table>
                    </div>

                    <!-- Пагинация для задач -->
                    <div v-if="taskTimeData.tasks.length > 10" class="px-4 py-3 border-t border-gray-200">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                          Показано {{ Math.min(10, taskTimeData.tasks.length) }} из {{ taskTimeData.tasks.length }} задач
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

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <!-- Левая колонка - Создано -->
                      <div>
                        <div class="overflow-x-auto">
                          <B24Table
                              :data="createdCrmTableData"
                              :columns="crmColumns"
                              :loading="isLoading"
                              class="w-full"
                          >
                            <template #entity-cell="{ row }">
                              <span class="text-xs text-gray-700 truncate">{{ row.original.entity }}</span>
                            </template>
                            <template #count-cell="{ row }">
                              <span class="text-sm font-semibold text-green-600 ml-2">{{ row.original.count }}</span>
                            </template>
                          </B24Table>
                        </div>
                      </div>

                      <!-- Правая колонка - Обновлено -->
                      <div>
                        <div class="overflow-x-auto">
                          <B24Table
                              :data="updatedCrmTableData"
                              :columns="crmColumns"
                              :loading="isLoading"
                              class="w-full"
                          >
                            <template #entity-cell="{ row }">
                              <span class="text-xs text-gray-700 truncate">{{ row.original.entity }}</span>
                            </template>
                            <template #count-cell="{ row }">
                              <span class="text-sm font-semibold text-blue-600 ml-2">{{ row.original.count }}</span>
                            </template>
                          </B24Table>
                        </div>
                      </div>
                    </div>

                    <!-- Статусы сделок и лидов -->
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <h5 class="text-xs font-medium text-gray-700 mb-2">Статусы сделок и лидов</h5>
                      <div class="overflow-x-auto">
                        <B24Table
                            :data="crmStatusTableData"
                            :columns="crmStatusColumns"
                            :loading="isLoading"
                            class="w-full"
                        >
                          <template #status-cell="{ row }">
                            <span class="text-xs text-gray-600 truncate">{{ row.original.status }}</span>
                          </template>
                          <template #count-cell="{ row }">
                            <span class="text-xs font-semibold ml-2"
                                  :class="{
                                  'text-green-600': row.original.type === 'successful',
                                  'text-red-600': row.original.type === 'failed'
                                }">
                              {{ row.original.count }}
                            </span>
                          </template>
                        </B24Table>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Информация о рабочем дне -->
                <div class="mt-6 md:mt-8 space-y-4 md:space-y-6">
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <!-- Настройки рабочего времени -->
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

                        <!-- Таблица настроек рабочего времени -->
                        <div class="overflow-x-auto">
                          <B24Table
                              :data="workDaySettingsTableData"
                              :columns="workDaySettingsColumns"
                              :loading="isLoading"
                              class="w-full"
                          >
                            <template #value-cell="{ row }">
                              <span v-if="row.original.badge">
                                <B24Badge :color="row.original.badgeColor">
                                  {{ row.original.value }}
                                </B24Badge>
                              </span>
                              <span v-else class="text-sm font-medium text-blue-900">
                                {{ row.original.value }}
                              </span>
                            </template>
                          </B24Table>
                        </div>
                      </div>

                      <!-- Текущий рабочий день -->
                      <div>
                        <h5 class="text-sm font-medium text-blue-900 mb-4">
                          <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Текущий рабочий день
                          </span>
                        </h5>

                        <!-- Таблица статуса рабочего дня -->
                        <div class="overflow-x-auto">
                          <B24Table
                              :data="workDayStatusTableData"
                              :columns="workDayStatusColumns"
                              :loading="isLoading"
                              class="w-full"
                          >
                            <template #value-cell="{ row }">
                              <span v-if="row.original.badge">
                                <B24Badge :class="getWorkDayStatusClass(row.original.value)">
                                  {{ getWorkDayStatusText(row.original.value) }}
                                </B24Badge>
                              </span>
                              <span v-else class="text-sm font-medium text-blue-900 truncate">
                                {{ row.original.value }}
                              </span>
                            </template>
                          </B24Table>
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
import html2pdf from 'html2pdf.js'

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
      WORK_DAY: '#d1d5db',
      BITRIX_TIME: '#3b82f6',
      BREAK_TIME: '#f97316',
      TASK_TIME: '#10b981',
      OTHER_TIME: '#8b5cf6'
    }

    // Кэш профилей пользователей
    this.userProfilesCache = ref({})

    // Колонки для таблиц B24Table
    this.taskColumns = [
      {
        accessorKey: 'id',
        header: 'ID',
        meta: {
          class: {
            th: 'hidden',
            td: 'hidden'
          }
        }
      },
      {
        accessorKey: 'task',
        header: 'Задача',
        cell: 'task'
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        cell: 'status'
      },
      {
        accessorKey: 'time',
        header: 'Время',
        cell: 'time'
      },
      {
        accessorKey: 'responsible',
        header: 'Исполнитель',
        cell: 'responsible'
      }
    ]

    this.workDaySettingsColumns = [
      {
        accessorKey: 'setting',
        header: 'Настройка',
        meta: {
          class: {
            th: 'text-sm text-blue-700',
            td: 'text-sm text-blue-700'
          }
        }
      },
      {
        accessorKey: 'value',
        header: 'Значение',
        cell: 'value',
        meta: {
          class: {
            th: 'text-right',
            td: 'text-right'
          }
        }
      }
    ]

    this.workDayStatusColumns = [
      {
        accessorKey: 'setting',
        header: 'Параметр',
        meta: {
          class: {
            th: 'text-sm text-blue-700',
            td: 'text-sm text-blue-700'
          }
        }
      },
      {
        accessorKey: 'value',
        header: 'Значение',
        cell: 'value',
        meta: {
          class: {
            th: 'text-right',
            td: 'text-right'
          }
        }
      }
    ]

    this.crmColumns = [
      {
        accessorKey: 'entity',
        header: 'Тип',
        cell: 'entity',
        meta: {
          class: {
            th: 'text-xs text-gray-700',
            td: 'text-xs text-gray-700'
          }
        }
      },
      {
        accessorKey: 'count',
        header: 'Количество',
        cell: 'count',
        meta: {
          class: {
            th: 'text-right text-xs text-gray-700',
            td: 'text-right'
          }
        }
      }
    ]

    this.crmStatusColumns = [
      {
        accessorKey: 'status',
        header: 'Статус',
        cell: 'status',
        meta: {
          class: {
            th: 'text-xs text-gray-600',
            td: 'text-xs text-gray-600'
          }
        }
      },
      {
        accessorKey: 'count',
        header: 'Количество',
        cell: 'count',
        meta: {
          class: {
            th: 'text-right text-xs text-gray-600',
            td: 'text-right'
          }
        }
      }
    ]
  }

  // Вычисляемые свойства для таблиц
  get workDaySettingsTableData() {
    return [
      {
        setting: 'Учет времени',
        value: this.workDaySettings.value.UF_TIMEMAN ? 'Включен' : 'Выключен',
        badge: true,
        badgeColor: this.workDaySettings.value.UF_TIMEMAN ? 'air-primary-success' : 'air-secondary-accent'
      },
      {
        setting: 'Свободный график',
        value: this.workDaySettings.value.UF_TM_FREE ? 'Да' : 'Нет',
        badge: true,
        badgeColor: this.workDaySettings.value.UF_TM_FREE ? 'air-primary-success' : 'air-secondary-accent'
      },
      {
        setting: 'Начало дня до',
        value: this.workDaySettings.value.UF_TM_MAX_START || 'Не задано',
        badge: false
      },
      {
        setting: 'Конец дня после',
        value: this.workDaySettings.value.UF_TM_MIN_FINISH || 'Не задано',
        badge: false
      }
    ]
  }

  get workDayStatusTableData() {
    return [
      {
        setting: 'Статус',
        value: this.workDayStatus.value.STATUS,
        badge: true
      },
      {
        setting: 'Начало',
        value: this.formatDateTime(this.workDayStatus.value.TIME_START) || 'Не начат',
        badge: false
      },
      {
        setting: 'Длительность',
        value: this.workDayStatus.value.DURATION || '00:00:00',
        badge: false
      },
      {
        setting: 'Перерывы',
        value: this.workDayStatus.value.TIME_LEAKS || '00:00:00',
        badge: false
      }
    ]
  }

  get createdCrmTableData() {
    return [
      {
        entity: 'Создано сделок',
        count: this.crmData.value.createdDealsCount
      },
      {
        entity: 'Создано лидов',
        count: this.crmData.value.createdLeadsCount
      },
      {
        entity: 'Создано контактов',
        count: this.crmData.value.createdContactsCount
      },
      {
        entity: 'Создано компаний',
        count: this.crmData.value.createdCompaniesCount
      }
    ]
  }

  get updatedCrmTableData() {
    return [
      {
        entity: 'Обновлено сделок',
        count: this.crmData.value.updatedDealsCount
      },
      {
        entity: 'Обновлено лидов',
        count: this.crmData.value.updatedLeadsCount
      },
      {
        entity: 'Обновлено контактов',
        count: this.crmData.value.updatedContactsCount
      },
      {
        entity: 'Обновлено компаний',
        count: this.crmData.value.updatedCompaniesCount
      }
    ]
  }

  get crmStatusTableData() {
    return [
      {
        status: 'Успешные сделки',
        count: this.crmData.value.successfulDealsCount,
        type: 'successful'
      },
      {
        status: 'Провальные сделки',
        count: this.crmData.value.failedDealsCount,
        type: 'failed'
      },
      {
        status: 'Успешные лиды',
        count: this.crmData.value.convertedLeadsCount,
        type: 'successful'
      },
      {
        status: 'Провальные лиды',
        count: this.crmData.value.junkLeadsCount,
        type: 'failed'
      }
    ]
  }

  // Остальные вычисляемые свойства
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
      '1': 'air-secondary-accent',
      '2': 'air-warning',
      '3': 'air-waiting',
      '4': 'air-info',
      '5': 'air-primary-success',
      '6': 'air-secondary-accent',
      '7': 'air-critical',
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
      this.isLoading.value = true;

      const originalElement = document.getElementById('work_day_statistic');
      const clone = originalElement.cloneNode(true);

      // 1. Заменяем canvas на изображения
      const canvases = clone.querySelectorAll('canvas');
      for (let canvas of canvases) {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.cssText = canvas.style.cssText;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        canvas.parentNode.replaceChild(img, canvas);
      }

      // 2. Удаляем все интерактивные элементы - исправленный селектор
      const interactiveElements = clone.querySelectorAll('button, [class*="hover:"], [@click], [v-if], [v-show]');
      interactiveElements.forEach(el => {
        if (el.tagName === 'BUTTON') {
          const span = document.createElement('span');
          span.className = el.className;
          span.textContent = el.textContent;
          span.style.cssText = el.style.cssText;
          el.parentNode.replaceChild(span, el);
        } else {
          el.removeAttribute('@click');
          el.removeAttribute('disabled');
          el.removeAttribute('v-if');
          el.removeAttribute('v-show');
        }
      });

      // 3. Убираем попапы, выпадашки и Vue-специфичные атрибуты
      clone.querySelectorAll('[class*="popover"], [class*="dropdown"], [data-v-]').forEach(el => {
        el.remove();
      });

      // 4. Добавляем заголовок с датой
      const header = document.createElement('div');
      header.className = 'pdf-header';
      header.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
        ${this.pageTitle}
      </h1>
      <p style="color: #6b7280; margin-bottom: 20px;">
        ${this.formatDayDisplay(this.selectedDay.value)}
      </p>
    `;
      clone.prepend(header);

      // 5. Копируем стили
      const styleEl = document.createElement('style');
      const b24Styles = document.querySelector('style[data-b24ui]')?.innerHTML || '';
      const appStyles = Array.from(document.querySelectorAll('style'))
          .filter(s => s.innerHTML.includes('b24') || s.innerHTML.includes('bg-') || s.innerHTML.includes('text-'))
          .map(s => s.innerHTML)
          .join('');

      styleEl.innerHTML = `
      ${b24Styles}
      ${appStyles}
      .pdf-header { margin-bottom: 30px; }
      .b24-card, .bg-white {
        page-break-inside: avoid;
        box-shadow: none !important;
      }
    `;
      clone.prepend(styleEl);

      // 6. Временный контейнер
      const container = document.createElement('div');
      container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 1200px;
      background: white;
      padding: 30px;
    `;
      container.appendChild(clone);
      document.body.appendChild(container);

      // 7. Настройки PDF
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `bitrix24-статистика-${this.selectedDay.value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: false
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      // 8. Экспорт
      await html2pdf().from(container).set(opt).save();

      // 9. Очистка
      document.body.removeChild(container);

      this.showNotification('success', 'PDF успешно экспортирован');

    } catch (error) {
      console.error('Ошибка экспорта PDF:', error);
      this.showNotification('error', 'Ошибка при экспорте PDF: ' + error.message);
    } finally {
      this.isLoading.value = false;
    }
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

    if (!this.timelineChart.value) return

    const hourlyEvents = {}

    for (let i = 0; i < 24; i++) {
      hourlyEvents[i] = {
        created: 0,
        updated: 0,
        successful: 0,
        failed: 0
      }
    }

    if (this.crmData.value.timelineEvents.length > 0) {
      this.crmData.value.timelineEvents.forEach(event => {
        const date = new Date(event.timestamp)
        const hour = date.getHours()

        if (hourlyEvents[hour]) {
          if (event.type === 'created') hourlyEvents[hour].created++
          if (event.type === 'updated') hourlyEvents[hour].updated++
        }
      })
    }

    const currentHour = new Date().getHours()
    const hoursToShow = this.selectedDay.value === new Date().toISOString().split('T')[0]
        ? currentHour + 1
        : 24

    const labels = Array.from({ length: hoursToShow }, (_, i) => {
      const startHour = i.toString().padStart(2, '0')
      const endHour = ((i + 1) % 24).toString().padStart(2, '0')
      return `${startHour}:00-${endHour}:00`
    })

    const createdData = Array.from({ length: hoursToShow }, (_, i) => hourlyEvents[i]?.created || 0)
    const updatedData = Array.from({ length: hoursToShow }, (_, i) => hourlyEvents[i]?.updated || 0)

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
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Обновлено',
          data: updatedData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
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
            callback: function(value) {
              return Number.isInteger(value) ? value : ''
            }
          },
          min: 0,
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
          intersect: false
        }
      },
      elements: {
        line: {
          spanGaps: true
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
      if (this.bitrixChartInstance) {
        this.bitrixChartInstance.destroy()
        this.bitrixChartInstance = null
      }
      if (this.timelineChartInstance) {
        this.timelineChartInstance.destroy()
        this.timelineChartInstance = null
      }

      setTimeout(() => {
        if (this.bitrixTimeChart.value) {
          this.createBitrixTimeChart()
        }
        if (this.timelineChart.value) {
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
      const selectedDay = this.selectedDay.value

      let allElapsedItems = []
      let start = 0
      const pageSize = 50

      while (true) {
        const results = await this.executeBatch([
          ['task.elapseditem.getlist', [
            { 'ID': 'DESC' },
            {
              'USER_ID': this.currentUserId.value,
              '>=CREATED_DATE': selectedDay,
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
        const taskCalls = []
        taskIds.forEach(taskId => {
          taskCalls.push(['tasks.task.get', {
            taskId: parseInt(taskId),
            select: ['ID', 'TITLE', 'STATUS', 'RESPONSIBLE_ID']
          }])
        })

        const taskResults = await this.executeBatch(taskCalls)

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

        const userResults = userCalls.length > 0 ? await this.executeBatch(userCalls) : []
        const userMap = new Map()

        userResults.forEach((userList, index) => {
          if (userList && userList.length > 0) {
            const user = userList[0]
            userMap.set(uniqueResponsibleIds[index], user)
          }
        })

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
      console.error('Ошибка загрузки данных задач:', error)
      this.showNotification('error', 'Ошибка загрузки данных задач')
      return []
    }
  }

  async loadCrmData() {
    try {
      const startOfDay = new Date(this.selectedDay.value + 'T00:00:00')
      const endOfDay = this.selectedDay.value === new Date().toISOString().split('T')[0]
          ? new Date()
          : new Date(this.selectedDay.value + 'T23:59:59')

      const formatDateForAPI = (date) => {
        return date.toISOString().replace('T', ' ').split('.')[0]
      }

      const startDateStr = formatDateForAPI(startOfDay)
      const endDateStr = formatDateForAPI(endOfDay)

      const calls = [
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

      const timelineEvents = []

      dealsCreated.forEach(deal => {
        timelineEvents.push({
          timestamp: deal.DATE_CREATE,
          type: 'created',
          entity: 'deal',
          id: deal.ID
        })
      })

      dealsUpdated.forEach(deal => {
        timelineEvents.push({
          timestamp: deal.DATE_MODIFY,
          type: 'updated',
          entity: 'deal',
          id: deal.ID
        })
      })

      leadsCreated.forEach(lead => {
        timelineEvents.push({
          timestamp: lead.DATE_CREATE,
          type: 'created',
          entity: 'lead',
          id: lead.ID
        })
      })

      leadsUpdated.forEach(lead => {
        timelineEvents.push({
          timestamp: lead.DATE_MODIFY,
          type: 'updated',
          entity: 'lead',
          id: lead.ID
        })
      })

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

      timelineEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

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
    const pureBitrixTime = totalBitrixTime - taskTime

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
  getEfficiencyColorValue(percentage) {
    const num = parseFloat(percentage)
    if (num >= 80) return '#10b981'
    if (num >= 60) return '#f59e0b'
    return '#ef4444'
  }
}

export default {
  name: 'WorkDayStatistics',
  components: {
    Sidebar
  },
  setup() {
    const manager = new WorkDayStatisticsManager()

    watch(() => manager.route.query.userId, (newUserId) => {
      if (newUserId) {
        manager.refreshData()
      }
    })

    watch(() => manager.isLoading.value, (newValue, oldValue) => {
      if (oldValue === true && newValue === false) {
        setTimeout(() => {
          manager.updateCharts()
        }, 100)
      }
    })

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

      // Данные для таблиц B24Table
      displayedTasks: computed(() => manager.displayedTasks),
      workDaySettingsTableData: computed(() => manager.workDaySettingsTableData),
      workDayStatusTableData: computed(() => manager.workDayStatusTableData),
      createdCrmTableData: computed(() => manager.createdCrmTableData),
      updatedCrmTableData: computed(() => manager.updatedCrmTableData),
      crmStatusTableData: computed(() => manager.crmStatusTableData),

      // Колонки таблиц
      taskColumns: manager.taskColumns,
      workDaySettingsColumns: manager.workDaySettingsColumns,
      workDayStatusColumns: manager.workDayStatusColumns,
      crmColumns: manager.crmColumns,
      crmStatusColumns: manager.crmStatusColumns,

      // Легенды
      bitrixTimeLegend: computed(() => manager.bitrixTimeLegend),

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
      hoverLegend: manager.hoverLegend.bind(manager),
      getEfficiencyColorValue: manager.getEfficiencyColorValue.bind(manager)
    }
  }
}
</script>