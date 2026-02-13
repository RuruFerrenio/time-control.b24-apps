<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        title="История посещений"
        description="Иерархичное отображение статистики посещений страниц сотрудниками"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2">
        <!-- Иерархичный История посещений -->
        <B24Card>
          <div class="p-0 md:p-6">
            <div class="space-y-4 md:space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    История посещений
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Список посещенных сотрудниками страниц с возможностью привязки времени к задачам.
                  </p>
                </div>
                <div class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-40">
                  <B24Button
                      @click="refreshCurrentTabData"
                      :disabled="isProcessingData"
                      color="air-primary"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isProcessingData }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Обновить
                  </B24Button>
                  <B24Button
                      @click="actualizeAllTimes"
                      :disabled="isProcessingData"
                      color="air-primary-success"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                      title="Обновить время во всех закрепленных задачах за сегодня"
                  >
                    <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': isProcessingData }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Актуализировать
                  </B24Button>
                </div>
              </div>

              <!-- Календарь для выбора дня -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Выберите день для просмотра
                </label>
                <B24Popover class="w-full">
                  <button
                      type="button"
                      :disabled="isProcessingData"
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

              <!-- Табы для переключения режимов просмотра -->
              <B24Tabs
                  v-model="activeTab"
                  :items="[
                    { label: 'Мое время', value: 'my-time' },
                    { label: 'Время всех сотрудников', value: 'all-time' }
                  ]"
                  @update:modelValue="onTabChange"
                  class="w-full whitespace-nowrap overflow-hidden"
              />

              <!-- Режим просмотра: Мое время -->
              <div v-if="activeTab === 'my-time'">
                <!-- Прелоадер при загрузке -->
                <div v-if="isProcessingData" class="text-center py-8">
                  <svg class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <p class="text-sm text-gray-500">Загрузка данных...</p>
                </div>

                <!-- Данные -->
                <div v-else-if="!isProcessingData && myTimeData.length > 0" class="space-y-2">
                  <div
                      v-for="userData in myTimeData"
                      :key="userData.userId"
                      class="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <!-- Заголовок пользователя -->
                    <B24Collapsible
                        :unmount-on-hide="false"
                        v-model:open="expandedUsersMyTime[userData.userId]"
                        @update:open="(value) => handleUserCollapsibleUpdate(userData.userId, value, 'my-time')"
                    >
                      <button
                          class="w-full bg-blue-50 px-4 py-3 border-b border-blue-100 hover:bg-blue-100 transition-colors text-left"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3 min-w-0 flex-1">
                            <B24User
                                :name="userData.userName"
                                :description="`ID: ${userData.userId}`"
                                size="sm"
                                :avatar="{
                                    src: getUserPhoto(userData.userId),
                                    initials: getUserInitials(userData.userName)
                                }"
                                :chip="{
                                    color: getOnlineStatus(userData.userId) === 'Y'
                                        ? 'air-primary-success'
                                        : 'air-secondary-accent',
                                    position: 'top-right'
                                }"
                                class="truncate"
                            />
                          </div>
                          <div class="flex items-center space-x-4 ml-2">
                            <div class="text-right hidden sm:block">
                              <div class="text-xs text-gray-600">Общее время</div>
                              <div class="text-sm font-semibold text-gray-900">{{ formatDuration(userData.totalTime) }}</div>
                            </div>
                            <svg
                                class="w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0"
                                :class="{ 'transform rotate-180': expandedUsersMyTime[userData.userId] }"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                          </div>
                        </div>
                        <!-- Общее время для мобильных -->
                        <div class="sm:hidden text-left mt-2">
                          <div class="text-xs text-gray-600">Общее время</div>
                          <div class="text-sm font-semibold text-gray-900">{{ formatDuration(userData.totalTime) }}</div>
                        </div>
                      </button>

                      <template #content>
                        <!-- Категории пользователя -->
                        <div class="divide-y divide-gray-100">
                          <div
                              v-for="categoryData in userData.categories"
                              :key="`${userData.userId}-${categoryData.category || 'uncategorized'}`"
                          >
                            <!-- Заголовок категории -->
                            <B24Collapsible
                                :unmount-on-hide="false"
                                v-model:open="expandedCategoriesMyTime[`${userData.userId}-${categoryData.category}`]"
                                @update:open="(value) => handleCategoryCollapsibleUpdate(userData.userId, categoryData.category, value, 'my-time')"
                            >
                              <button
                                  class="w-full px-4 py-3 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors text-left"
                              >
                                <div class="flex items-center justify-between">
                                  <div class="flex items-center space-x-3 min-w-0 flex-1">
                                    <svg
                                        class="w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0"
                                        :class="{ 'transform rotate-90': expandedCategoriesMyTime[`${userData.userId}-${categoryData.category}`] }"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                    <div class="flex items-center space-x-2 min-w-0">
                                      <B24Badge
                                          :class="getCategoryBadgeClass(categoryData.category)"
                                          class="whitespace-nowrap overflow-scroll max-w-full inline-block"
                                      >
                                        {{ categoryData.category || 'Не указана' }}
                                      </B24Badge>
                                    </div>
                                  </div>
                                  <div class="text-right ml-2">
                                    <div class="text-xs text-gray-600">Время</div>
                                    <div class="text-sm font-semibold text-gray-900">
                                      {{ formatDuration(categoryData.totalTime) }}
                                    </div>
                                  </div>
                                </div>
                              </button>

                              <template #content>
                                <!-- Страницы в категории -->
                                <div class="divide-y divide-gray-100">
                                  <div
                                      v-for="pageData in categoryData.pages"
                                      :key="pageData.itemId"
                                      class="px-4 py-3 hover:bg-gray-50"
                                  >
                                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                      <div class="flex-1 min-w-0">
                                        <div class="flex items-start space-x-3">
                                          <div class="flex-shrink-0 mt-1">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                            </svg>
                                          </div>
                                          <div class="flex-1 min-w-0">
                                            <div class="flex items-center space-x-2 mb-1">
                                              <a
                                                  :href="pageData.pageUrl"
                                                  target="_blank"
                                                  class="text-sm text-blue-600 hover:text-blue-800 break-all md:truncate block"
                                                  :title="pageData.pageUrl"
                                              >
                                                {{ pageData.pageUrl }}
                                              </a>
                                              <div
                                                  v-if="pageData.isLatest"
                                                  class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                                                  title="Самое свежее посещение"
                                              ></div>
                                            </div>
                                            <div class="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-1 md:gap-2 lg:gap-4 text-xs text-gray-500">
                                              <!-- Основная информация - всегда видна -->
                                              <div class="flex items-center gap-2">
                                                <span>Время на странице: {{ formatDuration(pageData.pageTime) }}</span>
                                                <span v-if="pageData.count > 1">({{ pageData.count }} посещений)</span>
                                              </div>

                                              <!-- Дополнительная информация - на новой строке на мобильных -->
                                              <div class="flex flex-col xs:flex-row gap-1 xs:gap-3 md:hidden">
                                                <span>Первое посещение: {{ formatTime(pageData.createdAt) }}</span>
                                                <span>Последнее посещение: {{ formatTime(pageData.updatedAt) }}</span>
                                              </div>

                                              <!-- Дополнительная информация для десктопов -->
                                              <div class="hidden md:flex items-center gap-4">
                                                <span>Первое посещение: {{ formatTime(pageData.createdAt) }}</span>
                                                <span>Последнее посещение: {{ formatTime(pageData.updatedAt) }}</span>
                                              </div>
                                            </div>
                                            <!-- Привязанная задача -->
                                            <div v-if="pageData.taskId" class="mt-2">
                                              <a
                                                  :href="getTaskUrl(pageData.taskId)"
                                                  target="_blank"
                                                  class="inline-flex items-center text-xs text-green-600 hover:text-green-800"
                                              >
                                                Связанная задача
                                                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M5 13l4 4L19 7"/>
                                                </svg>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <!-- Кнопки для привязанных записей -->
                                        <div v-if="pageData.taskId && pageData.elapsedItemId" class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-28">
                                          <B24Button
                                              @click="showUpdateTimeModal(pageData, userData)"
                                              size="xs"
                                              color="air-primary-success"
                                              class="text-xs flex-1 md:w-full justify-center"
                                              title="Обновить время, прикрепленное к задаче"
                                          >
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            Обновить
                                          </B24Button>
                                          <B24Button
                                              @click="showUnlinkTaskModal(pageData)"
                                              size="xs"
                                              color="air-secondary-alert"
                                              class="text-xs flex-1 md:w-full justify-center"
                                              title="Открепить время от задачи"
                                          >
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                            Открепить
                                          </B24Button>
                                        </div>
                                        <!-- Кнопки для непривязанных записей -->
                                        <div v-else class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-28">
                                          <B24Button
                                              @click="showAttachTaskModal(pageData, userData)"
                                              size="xs"
                                              color="air-primary-success"
                                              class="text-xs flex-1 md:w-full justify-center"
                                              title="Прикрепить время к задаче"
                                          >
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                            </svg>
                                            Прикрепить
                                          </B24Button>
                                          <B24Button
                                              @click="showCreateTaskModal(pageData, userData)"
                                              size="xs"
                                              color="air-primary"
                                              class="text-xs flex-1 md:w-full justify-center"
                                              title="Создать задачу и прикрепить к ней время"
                                          >
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                            </svg>
                                            Создать
                                          </B24Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </B24Collapsible>
                          </div>
                        </div>
                      </template>
                    </B24Collapsible>
                  </div>
                </div>

                <!-- Сообщение при отсутствии данных -->
                <div v-else-if="!isProcessingData" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm">Нет данных за выбранный день</p>
                </div>
              </div>

              <!-- Режим просмотра: Время всех сотрудников -->
              <div v-else-if="activeTab === 'all-time'">
                <!-- Поиск пользователей -->
                <div v-if="!isProcessingData && filteredHierarchicalData.length > 0" class="mb-4">
                  <B24Input
                      v-model="userSearchQuery"
                      placeholder="Поиск по имени пользователя..."
                      @change="filterUsers"
                      class="w-full"
                  >
                    <template #prefix>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </template>
                  </B24Input>
                </div>

                <!-- Прелоадер при загрузке -->
                <div v-if="isProcessingData" class="text-center py-8">
                  <svg class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <p class="text-sm text-gray-500">Загрузка данных...</p>
                </div>

                <!-- Данные -->
                <div v-else-if="!isProcessingData && paginatedUsers.length > 0" class="space-y-2">
                  <div
                      v-for="userData in paginatedUsers"
                      :key="userData.userId"
                      class="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <!-- Заголовок пользователя -->
                    <div
                        class="px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors"
                        :class="userData.userId === currentUserId ? 'bg-blue-50 border-blue-100 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-50'"
                        @click="toggleUser(userData.userId, 'all-time')"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 min-w-0 flex-1">
                          <B24User
                              :name="userData.userName"
                              :description="`ID: ${userData.userId}`"
                              size="sm"
                              :avatar="{
                                  src: getUserPhoto(userData.userId),
                                  initials: getUserInitials(userData.userName)
                              }"
                              :chip="{
                                  color: getOnlineStatus(userData.userId) === 'Y'
                                      ? 'air-primary-success'
                                      : 'air-secondary-accent',
                                  position: 'top-right'
                              }"
                              class="truncate"
                          />
                          <!-- Кнопка запроса отчета (только для других пользователей, если включено в настройках) -->
                          <div v-if="userData.userId !== currentUserId && subordinateReportsEnabled" class="ml-2 hidden sm:block">
                            <B24Button
                                @click="showRequestReportModal(userData)"
                                size="sm"
                                color="air-primary-warning"
                                title="Запросить отчет"
                            >
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              Запросить отчет
                            </B24Button>
                          </div>
                          <!-- Кнопка "Посмотреть статистику" -->
                          <router-link
                              v-if="userData.userId !== currentUserId && bitrixHelper && bitrixHelper.isStatisticsAvailable()"
                              :to="{ path: '/workday-statistics', query: { userId: userData.userId } }"
                              class="inline-block hidden sm:block ml-2"
                          >
                            <B24Button
                                size="xs"
                                color="air-primary-warning"
                                class="text-xs"
                                title="Посмотреть статистику"
                            >
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                              </svg>
                              Статистика
                            </B24Button>
                          </router-link>
                        </div>
                        <div class="flex items-center space-x-4 ml-2">
                          <div class="text-right hidden sm:block">
                            <div class="text-xs text-gray-600">Общее время</div>
                            <div class="text-sm font-semibold text-gray-900">{{ formatDuration(userData.totalTime) }}</div>
                          </div>
                          <svg
                              class="w-5 h-5 text-gray-500 transition-transform flex-shrink-0"
                              :class="{ 'transform rotate-180': expandedUsersAllTime[userData.userId] }"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </div>
                      <!-- Мобильные кнопки и время -->
                      <div class="sm:hidden mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div class="text-left">
                          <div class="text-xs text-gray-600">Общее время</div>
                          <div class="text-sm font-semibold text-gray-900">{{ formatDuration(userData.totalTime) }}</div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <div v-if="userData.userId !== currentUserId && subordinateReportsEnabled">
                            <B24Button
                                @click="showRequestReportModal(userData)"
                                size="md"
                                color="air-primary-warning"
                                title="Запросить отчет"
                            >
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              Отчет
                            </B24Button>
                          </div>
                          <router-link
                              v-if="userData.userId !== currentUserId && bitrixHelper && bitrixHelper.isStatisticsAvailable()"
                              :to="{ path: '/workday-statistics', query: { userId: userData.userId } }"
                              class="inline-block"
                          >
                            <B24Button
                                size="xs"
                                color="air-primary-warning"
                                class="text-xs"
                                title="Посмотреть статистику"
                            >
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                              </svg>
                              Статистика
                            </B24Button>
                          </router-link>
                        </div>
                      </div>
                    </div>

                    <!-- Категории пользователя -->
                    <div v-if="expandedUsersAllTime[userData.userId]" class="divide-y divide-gray-100">
                      <div
                          v-for="categoryData in userData.categories"
                          :key="`${userData.userId}-${categoryData.category || 'uncategorized'}`"
                      >
                        <!-- Заголовок категории -->
                        <div
                            class="px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                            @click="toggleCategory(userData.userId, categoryData.category, 'all-time')"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3 min-w-0 flex-1">
                              <svg
                                  class="w-4 h-4 text-gray-500 transition-transform flex-shrink-0"
                                  :class="{ 'transform rotate-90': expandedCategoriesAllTime[`${userData.userId}-${categoryData.category}`] }"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                              >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                              </svg>
                              <div class="flex items-center space-x-2 min-w-0">
                                <B24Badge
                                    :class="getCategoryBadgeClass(categoryData.category)"
                                    class="whitespace-nowrap overflow-scroll max-w-full inline-block"
                                >
                                  {{ categoryData.category || 'Не указана' }}
                                </B24Badge>
                              </div>
                            </div>
                            <div class="text-right ml-2">
                              <div class="text-xs text-gray-600">Время</div>
                              <div class="text-sm font-semibold text-gray-900">
                                {{ formatDuration(categoryData.totalTime) }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Страницы в категории -->
                        <div
                            v-if="expandedCategoriesAllTime[`${userData.userId}-${categoryData.category}`]"
                            class="divide-y divide-gray-100"
                        >
                          <div
                              v-for="pageData in categoryData.pages"
                              :key="pageData.itemId"
                              class="px-4 py-3 hover:bg-gray-50"
                          >
                            <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
                              <div class="flex-1 min-w-0">
                                <div class="flex items-start space-x-3">
                                  <div class="flex-shrink-0 mt-1">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                    </svg>
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="flex items-center space-x-2 mb-1">
                                      <a
                                          :href="pageData.pageUrl"
                                          target="_blank"
                                          class="text-sm text-blue-600 hover:text-blue-800 break-all md:truncate block"
                                          :title="pageData.pageUrl"
                                      >
                                        {{ pageData.pageUrl }}
                                      </a>
                                      <div
                                          v-if="pageData.isLatest"
                                          class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                                          title="Самое свежее посещение"
                                      ></div>
                                    </div>
                                    <div class="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-1 md:gap-2 lg:gap-4 text-xs text-gray-500">
                                      <!-- Основная информация - всегда видна -->
                                      <div class="flex items-center gap-2">
                                        <span>Время на странице: {{ formatDuration(pageData.pageTime) }}</span>
                                        <span v-if="pageData.count > 1">({{ pageData.count }} посещений)</span>
                                      </div>

                                      <!-- Дополнительная информация - на новой строке на мобильных -->
                                      <div class="flex flex-col xs:flex-row gap-1 xs:gap-3 md:hidden">
                                        <span>Первое посещение: {{ formatTime(pageData.createdAt) }}</span>
                                        <span>Последнее посещение: {{ formatTime(pageData.updatedAt) }}</span>
                                      </div>

                                      <!-- Дополнительная информация для десктопов -->
                                      <div class="hidden md:flex items-center gap-4">
                                        <span>Первое посещение: {{ formatTime(pageData.createdAt) }}</span>
                                        <span>Последнее посещение: {{ formatTime(pageData.updatedAt) }}</span>
                                      </div>
                                    </div>
                                    <!-- Привязанная задача -->
                                    <div v-if="pageData.taskId" class="mt-2">
                                      <a
                                          :href="getTaskUrl(pageData.taskId)"
                                          target="_blank"
                                          class="inline-flex items-center text-xs text-green-600 hover:text-green-800"
                                      >
                                        Связанная задача
                                        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7"/>
                                        </svg>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Пагинация для пользователей -->
                  <div v-if="filteredUsers.length > itemsPerPage" class="flex justify-center mt-6">
                    <B24Pagination
                        v-model:page="currentUserPage"
                        :total="filteredUsers.length"
                        :items-per-page="itemsPerPage"
                        :sibling-count="2"
                        show-edges
                        size="md"
                    />
                  </div>
                </div>

                <!-- Сообщение при отсутствии данных -->
                <div v-else-if="!isProcessingData && filteredHierarchicalData.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm">Нет данных за выбранный день</p>
                </div>

                <!-- Сообщение при поиске -->
                <div v-else-if="!isProcessingData && filteredUsers.length === 0 && filteredHierarchicalData.length > 0" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <p class="text-sm">Пользователи не найдены</p>
                </div>
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

    <!-- Модальные окна -->
    <!-- Модальное окно создания задачи -->
    <B24Modal
        v-model:open="isShowCreateTaskModal"
        title="Создание задачи"
        description="Создайте задачу на основе времени, проведенного на странице"
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <B24Form
            ref="createTaskFormRef"
            :state="taskFormData"
            :validate="validateTaskForm"
            class="space-y-6 px-4"
            @submit="createTask"
        >
          <!-- Заголовок задачи -->
          <B24FormField label="Заголовок задачи" name="title" required>
            <B24Input
                v-model="taskFormData.title"
                placeholder="Введите заголовок задачи"
                required
                class="w-full"
            />
          </B24FormField>

          <!-- Описание задачи -->
          <B24FormField label="Описание задачи" name="description">
            <B24Textarea
                v-model="taskFormData.description"
                rows="3"
                placeholder="Введите описание задачи"
                class="w-full"
            />
            <template #description>
              <span class="text-xs text-gray-500">
                Будет автоматически добавлена информация о времени, проведенном на странице
              </span>
            </template>
          </B24FormField>

          <!-- Исполнитель -->
          <B24FormField label="Исполнитель" name="responsibleId" required>
            <div class="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
              <div v-if="selectedUser" class="flex-1">
                <B24User
                    :name="selectedUser.name"
                    :description="`ID: ${selectedUser.id}`"
                    size="md"
                    :avatar="{
                        src: getUserPhoto(selectedUser.userId),
                        initials: getUserInitials(selectedUser.userName)
                    }"
                    class="truncate"
                />
              </div>
              <B24Button
                  type="button"
                  @click="openResponsibleSelector"
                  color="air-tertiary"
                  size="sm"
                  class="w-full md:w-auto"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.137a4 4 0 01-3.67 2.363"/>
                </svg>
                Сменить исполнителя
              </B24Button>
            </div>
          </B24FormField>

          <!-- Наблюдатели -->
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <B24FormLabel>Наблюдатели</B24FormLabel>
              <B24Button
                  type="button"
                  @click="openAuditorsSelector"
                  color="air-tertiary"
                  size="sm"
                  variant="link"
                  class="w-full sm:w-auto"
              >
                + Добавить наблюдателей
              </B24Button>
            </div>

            <!-- Список выбранных наблюдателей -->
            <div v-if="taskFormData.auditors.length > 0" class="space-y-2 mb-4">
              <div class="text-xs text-gray-600">Выбранные наблюдатели:</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2">
                <div
                    v-for="user in taskFormData.auditors"
                    :key="user.id"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <B24User
                      :name="user.name"
                      size="sm"
                      :avatar="{
                        src: getUserPhoto(user.userId),
                        initials: getUserInitials(user.userName)
                      }"
                      class="truncate"
                  />
                  <button
                      type="button"
                      @click="removeAuditor(user.id)"
                      class="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                      title="Удалить"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-500">
              Наблюдатели будут получать уведомления об изменениях в задаче
            </p>
          </div>

          <!-- Информация о времени -->
          <div v-if="modalPageData" class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о времени</div>
                <div class="text-sm text-blue-700">
                  Пользователь провел <span class="font-semibold">{{ formatDuration(modalPageData.pageTime) }}</span> на странице:<br />
                  <a
                      :href="modalPageData.pageUrl"
                      target="_blank"
                      class="underline break-all"
                  >
                    {{ modalPageData.pageUrl }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Крайний срок -->
          <B24FormField label="Крайний срок" name="deadline">
            <B24Popover class="w-full">
              <button
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-sm text-gray-700 truncate">
                    {{ taskFormData.deadline ? formatDate(taskFormData.deadline) : 'Выберите дату' }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <template #content>
                <div class="p-2">
                  <B24Calendar
                      v-model="taskDeadlineCalendarDate"
                      @update:modelValue="handleTaskDeadlineChange"
                      color="air-primary"
                      size="sm"
                      :month-controls="true"
                      :year-controls="true"
                      :min-value="minCalendarDate"
                      :max-value="maxCalendarDate"
                      class="rounded-lg"
                  />
                </div>
              </template>
            </B24Popover>
            <template #description>
              <span class="text-xs text-gray-500">
                Если не указать, будет установлен срок через 7 дней
              </span>
            </template>
          </B24FormField>

          <!-- Приоритет -->
          <B24FormField label="Приоритет" name="priority">
            <B24Select v-model="taskFormData.priority" :items="priorityOptions" class="w-full" />
          </B24FormField>
        </B24Form>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-tertiary" class="w-full sm:w-auto">Отмена</B24Button>
          <B24Button
              @click="createTaskFormRef?.submit()"
              :disabled="isCreatingTask"
              color="air-primary"
              class="w-full sm:w-auto"
          >
            <span v-if="isCreatingTask">
              <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Создание...
            </span>
            <span v-else>Создать задачу</span>
          </B24Button>
        </div>
      </template>
    </B24Modal>

    <!-- Модальное окно прикрепления к задаче -->
    <B24Modal
        v-model:open="isShowAttachTaskModal"
        title="Прикрепить время к задаче"
        description="Выберите задачу для прикрепления информации о времени"
        scrollable
        :ui="{ footer: 'justify-end' }"
        size="lg"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Информация о времени -->
          <div v-if="modalPageData" class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о времени</div>
                <div class="text-sm text-blue-700">
                  Пользователь <span class="font-semibold">{{ selectedUser?.name }}</span> провел
                  <span class="font-semibold">{{ formatDuration(modalPageData.pageTime) }}</span> на странице:<br />
                  <a
                      :href="modalPageData.pageUrl"
                      target="_blank"
                      class="underline break-all"
                  >
                    {{ modalPageData.pageUrl }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Поиск и фильтры -->
          <div>
            <div class="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
              <div class="flex-1">
                <B24Input
                    v-model="taskFilter.search"
                    placeholder="Поиск по названию задачи..."
                    @change="filterTasks"
                />
              </div>
              <div class="w-full md:w-auto">
                <B24Select
                    v-model="taskFilter.status"
                    :items="taskStatusOptions"
                    placeholder="Все статусы"
                    @update:modelValue="filterTasks"
                    class="w-full md:w-48"
                />
              </div>
            </div>
          </div>

          <!-- Список задач -->
          <div class="overflow-y-auto max-h-[40vh]">
            <div v-if="paginatedTasks.length > 0" class="space-y-3">
              <div
                  v-for="task in paginatedTasks"
                  :key="task.id"
                  class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="selectTask(task)"
                  :class="{ 'border-blue-500 bg-blue-50': selectedTask?.id === task.id }"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="font-medium text-gray-900 truncate">{{ task.title }}</span>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-2">
                      <B24Badge
                          size="sm"
                          :class="getTaskStatusClass(task.status)"
                      >
                        {{ getTaskStatusText(task.status) }}
                      </B24Badge>
                      <B24Badge
                          v-if="task.priority === '3'"
                          size="sm"
                          color="air-primary-alert"
                      >
                        Высокий
                      </B24Badge>
                    </div>

                    <div class="text-xs text-gray-600 space-y-2">
                      <div class="flex flex-wrap items-center gap-2 md:gap-4">
                        <div class="flex items-center">
                          <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span class="truncate">Исполнитель: {{ task.responsible?.name || 'Не указан' }}</span>
                        </div>
                        <div v-if="task.accomplices?.length > 0" class="flex items-center">
                          <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.137a4 4 0 01-3.67 2.363"/>
                          </svg>
                          <span>Соисполнители: {{ task.accomplices?.length || 0 }}</span>
                        </div>
                        <div v-if="task.auditors?.length > 0" class="flex items-center">
                          <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          <span>Наблюдатели: {{ task.auditors?.length || 0 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="ml-2 flex-shrink-0">
                    <svg
                        v-if="selectedTask?.id === task.id"
                        class="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="isLoadingTasks" class="text-center py-8">
              <svg class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <p class="text-sm text-gray-500">Загрузка задач...</p>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-sm">Задачи не найдены</p>
            </div>
          </div>

          <!-- Пагинация для задач -->
          <div v-if="filteredTasks.length > tasksPerPage" class="mt-6 flex justify-center">
            <B24Pagination
                v-model:page="currentTaskPage"
                :total="filteredTasks.length"
                :items-per-page="tasksPerPage"
                :sibling-count="2"
                show-edges
                size="md"
            />
          </div>

          <!-- Статистика по задачам -->
          <div v-if="filteredTasks.length > 0" class="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="text-sm text-gray-700">
              Найдено: <span class="font-medium">{{ filteredTasks.length }}</span> задач
            </div>
            <div class="text-sm text-gray-500">
              Страница: <span class="font-medium">{{ currentTaskPage }}</span> из <span class="font-medium">{{ Math.ceil(filteredTasks.length / tasksPerPage) }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-tertiary" class="w-full sm:w-auto">Отмена</B24Button>
          <B24Button
              @click="attachToTask"
              :disabled="!selectedTask || isAttachingToTask"
              color="air-primary-success"
              class="w-full sm:w-auto"
          >
            <span v-if="isAttachingToTask">
              <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Прикрепление...
            </span>
            <span v-else>Прикрепить время</span>
          </B24Button>
        </div>
      </template>
    </B24Modal>

    <!-- Модальное окно обновления времени -->
    <B24Modal
        v-model:open="isShowUpdateTimeModal"
        title="Обновление времени в задаче"
        description="Обновите запись времени в привязанной задаче"
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Информация о времени -->
          <div v-if="modalPageData" class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о времени</div>
                <div class="text-sm text-blue-700">
                  <div>Текущее время в задаче: <span class="font-semibold">{{ formatDuration(modalPageData.pageTime) }}</span></div>
                  <div>Задача: <a
                      :href="getTaskUrl(modalPageData.taskId)"
                      target="_blank"
                      class="underline"
                  >#{{ modalPageData.taskId }}</a></div>
                  <div>Запись времени: #{{ modalPageData.elapsedItemId }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Новое время -->
          <B24FormField label="Новое время (секунды)" name="newTime" required class="hidden">
            <B24Input
                v-model.number="updateTimeData.newTime"
                type="number"
                placeholder="Введите новое время в секундах"
                required
                :min="1"
            />
            <template #description>
              <span class="text-xs text-gray-500">
                Текущее время: {{ formatDuration(modalPageData.pageTime) }}
              </span>
            </template>
          </B24FormField>

          <!-- Комментарий -->
          <B24FormField label="Комментарий к обновлению" name="comment">
            <B24Textarea
                v-model="updateTimeData.comment"
                rows="3"
                placeholder="Введите комментарий (необязательно)"
                class="w-full"
            />
          </B24FormField>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-tertiary" class="w-full sm:w-auto">Отмена</B24Button>
          <B24Button
              @click="updateTaskTime"
              :disabled="isUpdatingTime"
              color="air-primary-success"
              class="w-full sm:w-auto"
          >
            <span v-if="isUpdatingTime">
              <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Обновление...
            </span>
            <span v-else>Обновить время</span>
          </B24Button>
        </div>
      </template>
    </B24Modal>

    <!-- Модальное окно удаления связи -->
    <B24Modal
        v-model:open="isShowUnlinkTaskModal"
        title="Удаление связи с задачей"
        description="Вы действительно хотите удалить связь с задачей?"
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-yellow-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-yellow-900 mb-1">Внимание!</div>
                <div class="text-sm text-yellow-700">
                  Вы собираетесь удалить связь записи с задачей. Это действие:
                  <ul class="list-disc list-inside mt-1 ml-2">
                    <li>Удалит запись времени из задачи</li>
                    <li>Удалит ID задачи и записи времени из хранилища</li>
                    <li>Не изменит саму запись посещения</li>
                    <li>Позволит создать новую связь с этой или другой задачей</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-700">
              <div>Задача: <a
                  :href="getTaskUrl(modalPageData.taskId)"
                  target="_blank"
                  class="underline"
              >#{{ modalPageData.taskId }}</a></div>
              <div>Запись времени: #{{ modalPageData.elapsedItemId }}</div>
              <div>Время: {{ formatDuration(modalPageData.pageTime) }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-tertiary" class="w-full sm:w-auto">Отмена</B24Button>
          <B24Button
              @click="unlinkTask"
              :disabled="isUnlinkingTask"
              color="air-primary-alert"
              class="w-full sm:w-auto"
          >
            <span v-if="isUnlinkingTask">
              <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Удаление...
            </span>
            <span v-else>Удалить связь</span>
          </B24Button>
        </div>
      </template>
    </B24Modal>

    <!-- Модальное окно запроса отчета -->
    <B24Modal
        v-model:open="isShowRequestReportModal"
        title="Запрос отчета о деятельности"
        description="Отправьте запрос на получение отчета о деятельности сотрудника"
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Информация о сотруднике -->
          <div v-if="selectedUserForReport" class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <B24User
                    :name="selectedUserForReport.userName"
                    :description="`ID: ${selectedUserForReport.userId}`"
                    size="sm"
                    :avatar="{
                        src: getUserPhoto(selectedUserForReport.userId),
                        initials: getUserInitials(selectedUserForReport.userName)
                    }"
                    :chip="{
                        color: getOnlineStatus(selectedUserForReport.userId) === 'Y'
                            ? 'air-primary-success'
                            : 'air-secondary-accent',
                        position: 'top-right'
                    }"
                />
              </div>
            </div>
          </div>

          <!-- Настройки запроса -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Сообщение для сотрудника
              </label>
              <B24Textarea
                  v-model="reportRequestMessage"
                  rows="4"
                  placeholder="Введите сообщение, которое будет отправлено сотруднику..."
                  class="w-full"
              />
              <p class="mt-2 text-sm text-gray-500">
                Сообщение будет автоматически дополнено информацией о запросе отчета
              </p>
            </div>

            <!-- Способ отправки -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Способ отправки запроса
              </label>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-700 space-y-2">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Способ отправки: <span class="font-medium">{{ getDeliveryMethodText() }}</span></span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Время на подготовку отчета: <span class="font-medium">{{ employeeReactionTime }} секунд</span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Предварительный просмотр -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Предварительный просмотр
              </label>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="text-sm text-gray-700 space-y-2">
                  <p><strong>От:</strong> {{ currentUserProfile?.FULL_NAME || 'Текущий пользователь' }}</p>
                  <p><strong>Кому:</strong> {{ selectedUserForReport?.userName || 'Сотрудник' }}</p>
                  <p><strong>Сообщение:</strong> {{ reportRequestMessage }}</p>
                  <p class="text-xs text-gray-500 mt-2">
                    * Будет автоматически добавлена ссылка на приложение для просмотра отчета
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-tertiary" class="w-full sm:w-auto">Отмена</B24Button>
          <B24Button
              @click="sendReportRequest"
              :disabled="isSendingReportRequest"
              color="air-primary-warning"
              class="w-full sm:w-auto"
          >
            <span v-if="isSendingReportRequest">
              <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Отправка...
            </span>
            <span v-else>Отправить запрос</span>
          </B24Button>
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

class HierarchicalDataManager {
  constructor() {
    this.currentUserId = ref(null)
    this.currentUserProfile = ref(null)
    this.myTimeData = ref([])
    this.filteredHierarchicalData = ref([])
    this.allPortalUsers = ref([])
    this.activeTab = ref('my-time')
    this.selectedDay = ref(this.getTodayDate())
    this.isProcessingData = ref(false)
    this.expandedUsersMyTime = ref({})
    this.expandedCategoriesMyTime = ref({})
    this.expandedUsersAllTime = ref({})
    this.expandedCategoriesAllTime = ref({})
    this.calendarDate = ref(this.getCalendarDateFromString(this.getTodayDate()))
    this.taskDeadlineCalendarDate = ref(null)
    this.minCalendarDate = new CalendarDate(2020, 1, 1)
    this.maxCalendarDate = new CalendarDate(2030, 12, 31)
    this.priorityOptions = ref([
      { label: 'Низкий', value: '1' },
      { label: 'Средний', value: '2' },
      { label: 'Высокий', value: '3' }
    ])
    this.taskStatusOptions = ref([
      { label: 'Все статусы', value: null },
      { label: 'Ждет выполнения', value: '2' },
      { label: 'Выполняется', value: '3' },
      { label: 'Ожидает контроля', value: '4' },
      { label: 'Завершена', value: '5' },
      { label: 'Отложена', value: '6' }
    ])
    this.isShowCreateTaskModal = ref(false)
    this.isShowAttachTaskModal = ref(false)
    this.isShowUpdateTimeModal = ref(false)
    this.isShowUnlinkTaskModal = ref(false)
    this.isShowRequestReportModal = ref(false)
    this.isCreatingTask = ref(false)
    this.isAttachingToTask = ref(false)
    this.isUpdatingTime = ref(false)
    this.isUnlinkingTask = ref(false)
    this.isSendingReportRequest = ref(false)
    this.modalPageData = ref(null)
    this.selectedUser = ref(null)
    this.selectedUserForReport = ref(null)
    this.selectedTask = ref(null)
    this.allUserTasks = ref([])
    this.filteredTasks = ref([])
    this.filteredTasksCount = ref(0)
    this.isLoadingTasks = ref(false)
    this.taskStart = ref(0)
    this.hasMoreTasks = ref(true)
    this.updateTimeData = ref({ newTime: 0, comment: '' })
    this.taskFilter = ref({ search: '', status: '' })
    this.createTaskFormRef = ref(null)
    this.categories = ref(categoriesData.categories)
    this.isLoadingProfile = ref(false)
    this.historyDays = ref(null)
    this.userProfilesCache = ref({})

    // Настройки отчетов
    this.subordinateReportsEnabled = ref(true)
    this.employeeReactionTime = ref(300)
    this.deliveryMethod = ref('chat')
    this.responseMethod = ref('chat')

    // Новые переменные для поиска и пагинации
    this.userSearchQuery = ref('')
    this.filteredUsers = ref([])
    this.currentUserPage = ref(1)
    this.itemsPerPage = ref(25)

    // Пагинация для задач в модалке
    this.currentTaskPage = ref(1)
    this.tasksPerPage = ref(25)

    // Данные для запроса отчета
    this.reportRequestMessage = ref('')

    this.lastExpandedStates = {
      'my-time': { users: {}, categories: {} },
      'all-time': { users: {}, categories: {} }
    }

    this.taskFormData = ref({
      title: '',
      description: '',
      responsibleId: null,
      auditors: [],
      deadline: '',
      priority: '2'
    })
  }

  // Вычисляемые свойства для пагинированных данных
  get paginatedUsers() {
    const startIndex = (this.currentUserPage.value - 1) * this.itemsPerPage.value
    const endIndex = startIndex + this.itemsPerPage.value
    return this.filteredUsers.value.slice(startIndex, endIndex)
  }

  get paginatedTasks() {
    const startIndex = (this.currentTaskPage.value - 1) * this.tasksPerPage.value
    const endIndex = startIndex + this.tasksPerPage.value
    return this.filteredTasks.value.slice(startIndex, endIndex)
  }

  getTaskUrl(taskId) {
    if (!taskId || !this.currentUserId.value) return '#'
    const domain = BX24.getDomain();
    return `https://${domain}/company/personal/user/${this.currentUserId.value}/tasks/task/view/${taskId}/`;
  }

  // Получение текста способа доставки
  getDeliveryMethodText() {
    const methods = {
      'chat': 'Чат',
      'push': 'Push-уведомление',
      'all': 'Чат и Push-уведомление'
    }
    return methods[this.deliveryMethod.value] || 'чат'
  }

  createStructuredReportRequest() {
    const settings = this.getAppSettings()
    const reactionTime = parseInt(settings.employeeReactionTime) || 300

    // Формируем URL для отчета
    const reportParams = {
      parameters: JSON.stringify({
        mode: 'activity-report',
        timestamp: new Date().toISOString(),
        requesterId: this.currentUserId.value,
        selectedDay: this.selectedDay.value,
        userId: this.selectedUserForReport.value.userId,
      })
    }

    const reportUrl = `/marketplace/view/local.6953c3c26d1bd5.96725557/?params[parameters]=${reportParams.parameters}`

    // Форматируем сообщение с BB-кодами
    const fullMessage = `[SIZE=16][B]📋 Запрос отчета о деятельности[/B][/SIZE]\n\n`
        + `👤 [B]От:[/B] ${this.currentUserProfile?.FULL_NAME || 'Руководитель'}\n`
        + `👤 [B]Кому:[/B] ${this.selectedUserForReport?.userName || 'Сотрудник'}\n`
        + `📅 [B]Дата запроса:[/B] ${new Date().toLocaleString('ru-RU')}\n\n`
        + `[B]💬 Сообщение:[/B]\n${this.reportRequestMessage.value}\n\n`
        + `⏰ [B]Время на ответ:[/B] ${reactionTime} секунд\n`
        + `[URL=${reportUrl}]📝 Нажмите здесь, чтобы открыть форму отчета[/URL]\n\n`
        + `────────────────────\n`
        + `[SIZE=12][COLOR=#666666]Запрос сгенерирован автоматически[/COLOR][/SIZE]`

    return {
      shortMessage: `📋 Запрос отчета от ${this.currentUserProfile?.FULL_NAME || 'Руководителя'}`,
      detailedMessage: fullMessage,
      attach: [{ MESSAGE: fullMessage, COLOR_TOKEN: "warning" }]
    }
  }

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

  getFullName(userData) {
    const parts = []
    if (userData.NAME) parts.push(userData.NAME)
    if (userData.LAST_NAME) parts.push(userData.LAST_NAME)
    if (userData.SECOND_NAME) parts.push(userData.SECOND_NAME)
    return parts.join(' ') || `Пользователь ${userData.ID}`
  }

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

  getDateIn7Days() {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().split('T')[0]
  }

  handleCalendarDateChange(newDate) {
    if (newDate) {
      this.selectedDay.value = this.getStringFromCalendarDate(newDate)
      this.loadDataForSelectedDay()
    }
  }

  handleTaskDeadlineChange(newDate) {
    if (newDate) {
      this.taskFormData.value.deadline = this.getStringFromCalendarDate(newDate)
    }
  }

  isDateDisabled(date) {
    const dayOfWeek = date.toDate('UTC').getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  isDateUnavailable(date) {
    const today = new Date()
    const selectedDate = date.toDate('UTC')
    const diffTime = today.getTime() - selectedDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > this.historyDays
  }

  handleUserCollapsibleUpdate(userId, isOpen, tab) {
    if (tab === 'my-time') {
      this.expandedUsersMyTime.value[userId] = isOpen

      if (isOpen) {
        const userData = this.myTimeData.value.find(u => u.userId === userId)
        if (userData) {
          userData.categories.forEach(categoryData => {
            const key = `${userId}-${categoryData.category || 'uncategorized'}`
            this.expandedCategoriesMyTime.value[key] = true
          })
        }
      } else {
        Object.keys(this.expandedCategoriesMyTime.value).forEach(key => {
          if (key.startsWith(`${userId}-`)) {
            this.expandedCategoriesMyTime.value[key] = false
          }
        })
      }
    } else if (tab === 'all-time') {
      this.expandedUsersAllTime.value[userId] = isOpen
      if (!isOpen) {
        Object.keys(this.expandedCategoriesAllTime.value).forEach(key => {
          if (key.startsWith(`${userId}-`)) {
            this.expandedCategoriesAllTime.value[key] = false
          }
        })
      }
    }
  }

  handleCategoryCollapsibleUpdate(userId, category, isOpen, tab) {
    const key = `${userId}-${category || 'uncategorized'}`
    if (tab === 'my-time') {
      this.expandedCategoriesMyTime.value[key] = isOpen
    } else if (tab === 'all-time') {
      this.expandedCategoriesAllTime.value[key] = isOpen
    }
  }

  formatTime(timestamp) {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  formatDate(dateString) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

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

  formatDayDisplay(dateString) {
    if (!dateString) return 'Выберите дату'
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Сегодня'
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
    return date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  getCategoryBadgeClass(category) {
    if (!category) return 'bg-gray-100 text-gray-800'
    const mainCategory = category.split(' › ')[0]
    const categoryData = this.categories.value.find(cat => cat.name === mainCategory)
    return categoryData?.color || 'bg-gray-100 text-gray-800'
  }

  getTaskStatusClass(status) {
    const statusMap = {
      '2': 'bg-yellow-100 text-yellow-800',
      '3': 'bg-blue-100 text-blue-800',
      '4': 'bg-purple-100 text-purple-800',
      '5': 'bg-green-100 text-green-800',
      '6': 'bg-gray-100 text-gray-800'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-800'
  }

  getTaskStatusText(status) {
    const statusMap = {
      '2': 'Ждет выполнения',
      '3': 'Выполняется',
      '4': 'Ожидает контроля',
      '5': 'Завершена',
      '6': 'Отложена'
    }
    return statusMap[status] || 'Неизвестно'
  }

  onTabChange(newTab) {
    this.activeTab.value = newTab
    if (newTab === 'all-time') {
      this.userSearchQuery.value = ''
      this.filteredUsers.value = [...this.filteredHierarchicalData.value]
      this.currentUserPage.value = 1
    }
    this.loadDataForSelectedDay()
  }

  refreshCurrentTabData() {
    this.loadDataForSelectedDay()
  }

  saveCurrentExpandedStates() {
    const tab = this.activeTab.value
    if (tab === 'my-time') {
      this.lastExpandedStates['my-time'] = {
        users: { ...this.expandedUsersMyTime.value },
        categories: { ...this.expandedCategoriesMyTime.value }
      }
    } else if (tab === 'all-time') {
      this.lastExpandedStates['all-time'] = {
        users: { ...this.expandedUsersAllTime.value },
        categories: { ...this.expandedCategoriesAllTime.value }
      }
    }
  }

  restoreExpandedStates() {
    const tab = this.activeTab.value
    const states = this.lastExpandedStates[tab]
    if (!states) return
    if (tab === 'my-time') {
      this.expandedUsersMyTime.value = { ...states.users }
      this.expandedCategoriesMyTime.value = { ...states.categories }
    } else if (tab === 'all-time') {
      this.expandedUsersAllTime.value = { ...states.users }
      this.expandedCategoriesAllTime.value = { ...states.categories }
    }
  }

  async forceExpandFirstUserInMyTime() {
    if (this.myTimeData.value.length > 0 && this.activeTab.value === 'my-time') {
      const userData = this.myTimeData.value[0]
      if (userData) {
        this.expandedUsersMyTime.value[userData.userId] = true

        userData.categories.forEach(categoryData => {
          const key = `${userData.userId}-${categoryData.category || 'uncategorized'}`
          this.expandedCategoriesMyTime.value[key] = true
        })

        this.forceUIUpdate()
      }
    }
  }

  toggleUser(userId, tab) {
    if (tab === 'my-time') {
      this.expandedUsersMyTime.value[userId] = !this.expandedUsersMyTime.value[userId]

      if (this.expandedUsersMyTime.value[userId]) {
        const userData = this.myTimeData.value.find(u => u.userId === userId)
        if (userData) {
          userData.categories.forEach(categoryData => {
            const key = `${userId}-${categoryData.category || 'uncategorized'}`
            this.expandedCategoriesMyTime.value[key] = true
          })
        }
      } else {
        Object.keys(this.expandedCategoriesMyTime.value).forEach(key => {
          if (key.startsWith(`${userId}-`)) {
            this.expandedCategoriesMyTime.value[key] = false
          }
        })
      }

      this.forceUIUpdate()
    } else if (tab === 'all-time') {
      this.expandedUsersAllTime.value[userId] = !this.expandedUsersAllTime.value[userId]
      if (!this.expandedUsersAllTime.value[userId]) {
        Object.keys(this.expandedCategoriesAllTime.value).forEach(key => {
          if (key.startsWith(`${userId}-`)) {
            this.expandedCategoriesAllTime.value[key] = false
          }
        })
      }
      this.forceUIUpdate()
    }
  }

  toggleCategory(userId, category, tab) {
    const key = `${userId}-${category || 'uncategorized'}`
    if (tab === 'my-time') {
      this.expandedCategoriesMyTime.value[key] = !this.expandedCategoriesMyTime.value[key]
      this.forceUIUpdate()
    } else if (tab === 'all-time') {
      this.expandedCategoriesAllTime.value[key] = !this.expandedCategoriesAllTime.value[key]
      this.forceUIUpdate()
    }
  }

  // Метод для фильтрации пользователей
  filterUsers() {
    const query = this.userSearchQuery.value.toLowerCase().trim()

    if (!query) {
      this.filteredUsers.value = [...this.filteredHierarchicalData.value]
    } else {
      this.filteredUsers.value = this.filteredHierarchicalData.value.filter(userData => {
        return userData.userName.toLowerCase().includes(query) ||
            userData.userId.toString().includes(query)
      })
    }

    this.currentUserPage.value = 1
  }

  filterTasks() {
    if (this.allUserTasks.value.length === 0) {
      this.filteredTasks.value = []
      this.filteredTasksCount.value = 0
      return
    }

    const search = this.taskFilter.value.search.toLowerCase().trim()
    const status = this.taskFilter.value.status

    if (!search && !status) {
      this.filteredTasks.value = [...this.allUserTasks.value]
    } else {
      this.filteredTasks.value = this.allUserTasks.value.filter(task => {
        const matchesSearch = !search ||
            task.title.toLowerCase().includes(search) ||
            (task.description && task.description.toLowerCase().includes(search))

        const matchesStatus = !status || task.status === status

        return matchesSearch && matchesStatus
      })
    }

    this.filteredTasksCount.value = this.filteredTasks.value.length
    this.currentTaskPage.value = 1
  }

  showCreateTaskModal(pageData, userData) {
    this.modalPageData.value = {
      ...pageData,
      originalItemId: pageData.itemId,
      userId: userData.userId
    }
    this.selectedUser.value = { id: userData.userId, name: userData.userName }
    this.taskFormData.value = {
      title: `Время на странице: ${pageData.pageUrl.substring(0, 50)}${pageData.pageUrl.length > 50 ? '...' : ''}`,
      description: `Пользователь провел ${this.formatDuration(pageData.pageTime)} на странице: ${pageData.pageUrl}`,
      responsibleId: userData.userId,
      auditors: [],
      deadline: this.getDateIn7Days(),
      priority: '2'
    }
    this.taskDeadlineCalendarDate.value = this.getCalendarDateFromString(this.getDateIn7Days())
    this.isShowCreateTaskModal.value = true
  }

  closeCreateTaskModal() {
    this.modalPageData.value = null
    this.selectedUser.value = null
    this.taskFormData.value = {
      title: '',
      description: '',
      responsibleId: null,
      auditors: [],
      deadline: '',
      priority: '2'
    }
    this.taskDeadlineCalendarDate.value = null
    this.isShowCreateTaskModal.value = false
  }

  showAttachTaskModal(pageData, userData) {
    this.modalPageData.value = {
      ...pageData,
      originalItemId: pageData.itemId
    }
    this.selectedUser.value = { id: userData.userId, name: userData.userName }
    this.selectedTask.value = null
    this.allUserTasks.value = []
    this.filteredTasks.value = []
    this.taskFilter.value = { search: '', status: '' }
    this.taskStart.value = 0
    this.hasMoreTasks.value = true
    this.filteredTasksCount.value = 0
    this.currentTaskPage.value = 1
    this.isShowAttachTaskModal.value = true
    this.loadUserTasks()
  }

  closeAttachTaskModal() {
    this.modalPageData.value = null
    this.selectedUser.value = null
    this.selectedTask.value = null
    this.allUserTasks.value = []
    this.filteredTasks.value = []
    this.taskFilter.value = { search: '', status: '' }
    this.filteredTasksCount.value = 0
    this.currentTaskPage.value = 1
    this.isShowAttachTaskModal.value = false
  }

  showUpdateTimeModal(pageData, userData) {
    this.modalPageData.value = {
      ...pageData,
      originalItemId: pageData.itemId,
      userId: userData.userId
    }
    this.selectedUser.value = { id: userData.userId, name: userData.userName }
    this.updateTimeData.value = {
      newTime: pageData.pageTime,
      comment: `Обновлено время на странице: ${pageData.pageUrl}`
    }
    this.isShowUpdateTimeModal.value = true
  }

  closeUpdateTimeModal() {
    this.modalPageData.value = null
    this.selectedUser.value = null
    this.updateTimeData.value = { newTime: 0, comment: '' }
    this.isShowUpdateTimeModal.value = false
  }

  showUnlinkTaskModal(pageData) {
    this.modalPageData.value = {
      ...pageData,
      originalItemId: pageData.itemId,
      taskId: pageData.taskId,
      userId: pageData.userId
    }
    this.isShowUnlinkTaskModal.value = true
  }

  closeUnlinkTaskModal() {
    this.modalPageData.value = null
    this.isShowUnlinkTaskModal.value = false
  }

  // Показать модальное окно запроса отчета
  showRequestReportModal(userData) {
    this.selectedUserForReport.value = userData
    this.reportRequestMessage.value = `Запрошен отчет об активности \nПожалуйста, подготовьте отчет о том, чем Вы в данный момент занимаетесь.`
    this.isShowRequestReportModal.value = true
  }

  closeRequestReportModal() {
    this.selectedUserForReport.value = null
    this.reportRequestMessage.value = ''
    this.isShowRequestReportModal.value = false
  }

  openResponsibleSelector() {
    if (BX24 && BX24.selectUsers) {
      BX24.selectUsers((users) => {
        if (Array.isArray(users) && users.length > 0) {
          const user = users[0]
          this.selectedUser.value = { id: user.id, name: user.name }
          this.taskFormData.value.responsibleId = user.id
        }
      })
    }
  }

  openAuditorsSelector() {
    if (BX24 && BX24.selectUsers) {
      BX24.selectUsers((users) => {
        if (Array.isArray(users) && users.length > 0) {
          const existingIds = new Set(this.taskFormData.value.auditors.map(u => u.id))
          const newUsers = users.filter(user => !existingIds.has(user.id))
          if (newUsers.length > 0) {
            this.taskFormData.value.auditors.push(...newUsers.map(user => ({
              id: user.id,
              name: user.name
            })))
          }
        }
      })
    }
  }

  removeAuditor(userId) {
    this.taskFormData.value.auditors = this.taskFormData.value.auditors.filter(user => user.id !== userId)
  }

  validateTaskForm(state) {
    const errors = []
    if (!state.title || state.title.trim().length === 0) {
      errors.push({
        name: 'title',
        message: 'Заголовок задачи обязателен'
      })
    }
    if (!state.responsibleId) {
      errors.push({
        name: 'responsibleId',
        message: 'Выберите исполнителя'
      })
    }
    return errors
  }

  showNotification(type, message) {
    if (typeof toast !== 'undefined') {
      toast.add({
        description: message,
        variant: type
      })
    } else {
      // Fallback для случаев, когда toast не доступен
      console[type === 'error' ? 'error' : type === 'success' ? 'log' : 'info'](message)
    }
  }

  async createTask() {
    try {
      this.isCreatingTask.value = true
      BX24.callBatch({
        create_task: ['tasks.task.add', {
          fields: {
            TITLE: this.taskFormData.value.title,
            DESCRIPTION: this.taskFormData.value.description,
            RESPONSIBLE_ID: this.taskFormData.value.responsibleId,
            CREATED_BY: BX24.getAuth().user_id,
            DEADLINE: this.taskFormData.value.deadline ? `${this.taskFormData.value.deadline}T23:59:00` : null,
            PRIORITY: this.taskFormData.value.priority,
            AUDITORS: this.taskFormData.value.auditors.map(a => a.id)
          }
        }]
      }, (result) => {
        if (result.create_task.error()) {
          this.showNotification('error', 'Ошибка при создании задачи')
          this.isCreatingTask.value = false
        } else {
          const taskId = result.create_task.data().task.id
          this.addTimeToTask(
              taskId,
              this.modalPageData.value,
              this.selectedUser.value,
              true
          )
        }
      }, true)
    } catch (error) {
      this.showNotification('error', 'Ошибка при создании задачи')
      this.isCreatingTask.value = false
    }
  }

  async actualizeAllTimes() {
    try {
      this.isProcessingData.value = true;

      const today = this.getTodayDate();
      const sectionId = await this.findSectionForDate(today);

      if (!sectionId) {
        this.showNotification('info', 'Нет данных за сегодня для актуализации');
        this.isProcessingData.value = false;
        return;
      }

      // Получаем все элементы за сегодня
      const items = await new Promise((resolve, reject) => {
        BX24.callBatch({
          items: [
            'entity.item.get',
            {
              ENTITY: 'pr_tracking',
              FILTER: { SECTION_ID: sectionId },
              SELECT: ['ID', 'PROPERTY_VALUES']
            }
          ]
        }, (result) => {
          if (result.items.error()) {
            reject(result.items.error());
          } else {
            resolve(result.items.data());
          }
        }, true);
      });

      // Фильтруем только те, у которых есть привязка к задаче
      const taskItems = items.filter(item =>
          item.PROPERTY_VALUES?.TASK_ID &&
          item.PROPERTY_VALUES?.ELAPSED_ITEM_ID
      );

      if (taskItems.length === 0) {
        this.showNotification('info', 'Нет записей, привязанных к задачам');
        this.isProcessingData.value = false;
        return;
      }

      // Группируем по пользователям для обновления счетчиков
      const userTimeDifferences = {};

      for (const item of taskItems) {
        const props = item.PROPERTY_VALUES || {};
        const {
          TASK_ID,
          ELAPSED_ITEM_ID,
          PAGE_TIME,
          PAGE_URL,
          USER_ID
        } = props;

        // Пропускаем, если нет USER_ID
        if (!USER_ID) {
          console.warn(`Пропуск записи ${item.ID}: нет USER_ID`);
          continue;
        }

        try {
          // Получаем текущее время из задачи
          const currentTime = await new Promise((resolve) => {
            BX24.callBatch({
              get_time: [
                'task.elapseditem.get',
                {
                  TASKID: TASK_ID,
                  ITEMID: ELAPSED_ITEM_ID
                }
              ]
            }, (result) => {
              if (result.get_time.error()) {
                resolve(0);
              } else {
                resolve(parseInt(result.get_time.data().SECONDS) || 0);
              }
            }, true);
          });

          // Обновляем время в задаче
          await new Promise((resolve, reject) => {
            BX24.callBatch({
              update_time: [
                'task.elapseditem.update',
                {
                  TASKID: TASK_ID,
                  ITEMID: ELAPSED_ITEM_ID,
                  ARFIELDS: {
                    SECONDS: PAGE_TIME,
                    COMMENT_TEXT: `Актуализировано время на странице: ${PAGE_URL}`
                  }
                }
              ]
            }, (result) => {
              if (result.update_time.error()) {
                reject(result.update_time.error());
              } else {
                resolve();
              }
            }, true);
          });

          // Вычисляем разницу и сохраняем для пользователя
          const timeDifference = PAGE_TIME - (currentTime || 0);
          if (!userTimeDifferences[USER_ID]) {
            userTimeDifferences[USER_ID] = 0;
          }
          userTimeDifferences[USER_ID] += timeDifference;

        } catch (error) {
          console.warn(`Ошибка при обработке записи ${item.ID}:`, error);
        }
      }

      // Обновляем счетчики для каждого пользователя через bitrixHelper
      if (bitrixHelper && Object.keys(userTimeDifferences).length > 0) {
        try {
          for (const [userId, timeDiff] of Object.entries(userTimeDifferences)) {
            if (timeDiff !== 0) {
              await bitrixHelper.updateUserSavedTime(parseInt(userId), timeDiff);
            }
          }
          this.refreshSidebarSavedTimeCounter();
        } catch (error) {
          console.warn('Ошибка обновления счетчиков:', error);
          this.showNotification('error', 'Ошибка обновления счетчиков');
        }
      }

      this.showNotification(
          'success',
          `Актуализировано ${taskItems.length} записей времени`
      );

    } catch (error) {
      console.error('Ошибка при актуализации времени:', error);
      this.showNotification('error', 'Ошибка при актуализации времени');
    } finally {
      this.isProcessingData.value = false;
      await this.refreshCurrentTabData();
    }
  }

  async getCurrentTaskTime(taskId, elapsedItemId) {
    return new Promise((resolve) => {
      BX24.callBatch({
        get_time: [
          'task.elapseditem.get',
          {
            TASKID: taskId,
            ITEMID: elapsedItemId
          }
        ]
      }, (result) => {
        if (result.get_time.error()) {
          resolve(0);
        } else {
          resolve(parseInt(result.get_time.data().SECONDS) || 0);
        }
      }, true);
    });
  }

  async updateTaskTimeInBitrix(taskId, elapsedItemId, newTime, pageUrl) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        update_time: [
          'task.elapseditem.update',
          {
            TASKID: taskId,
            ITEMID: elapsedItemId,
            ARFIELDS: {
              SECONDS: newTime,
              COMMENT_TEXT: `Обновлено время на странице: ${pageUrl}`
            }
          }
        ]
      }, (result) => {
        if (result.update_time.error()) {
          reject(result.update_time.error());
        } else {
          resolve();
        }
      }, true);
    });
  }

  async getUserProfile(userId) {
    if (this.userProfilesCache.value[userId]) {
      return this.userProfilesCache.value[userId]
    }

    return new Promise((resolve, reject) => {
      if (!BX24) {
        reject(new Error('BX24 не инициализирован'))
        return
      }

      BX24.callBatch({
        user: [
          'user.get',
          {
            FILTER: { 'ID': userId },
            SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL', 'WORK_POSITION', 'ACTIVE', 'PERSONAL_PHOTO', 'IS_ONLINE']
          }
        ]
      }, (result) => {
        if (result.user.error()) {
          this.showNotification('error', 'Ошибка загрузки профиля пользователя')
          reject(result.user.error())
          return
        }

        const users = result.user.data()
        if (users.length > 0) {
          const userData = users[0]
          userData.FULL_NAME = this.getFullName(userData)
          this.userProfilesCache.value[userId] = userData
          resolve(userData)
        } else {
          const defaultUserData = {
            ID: userId,
            FULL_NAME: `Пользователь ${userId}`,
            NAME: 'Пользователь',
            PERSONAL_PHOTO: null,
            IS_ONLINE: 'N'
          }
          this.userProfilesCache.value[userId] = defaultUserData
          resolve(defaultUserData)
        }
      }, true)
    })
  }

  async getUserProfilesBatch(userIds) {
    if (!BX24) {
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

  async loadUserTasks() {
    if (!this.selectedUser.value || this.isLoadingTasks.value) return;

    try {
      this.isLoadingTasks.value = true;
      this.allUserTasks.value = [];

      const loadTasksBatch = (page) => {
        return new Promise((resolve, reject) => {
          BX24.callBatch({
            tasks: [
              'task.item.list',
              [
                { 'ID': 'desc' },
                { 'RESPONSIBLE_ID': this.selectedUser.value.id },
                {
                  'NAV_PARAMS': {
                    'nPageSize': 50,
                    'iNumPage': page
                  }
                },
                ['ID', 'TITLE', 'DESCRIPTION', 'REAL_STATUS', 'DEADLINE', 'CREATED_DATE', 'RESPONSIBLE_ID', 'ACCOMPLICES', 'AUDITORS', 'PRIORITY']
              ]
            ]
          }, (result) => {
            if (result.tasks.error()) {
              this.showNotification('error', 'Ошибка загрузки задач')
              reject(result.tasks.error());
            } else {
              resolve(result.tasks.data());
            }
          }, true);
        });
      };

      let allTasks = [];
      let page = 1;
      let hasMore = true;
      const MAX_TASKS = 200;

      while (hasMore && allTasks.length < MAX_TASKS) {
        const data = await loadTasksBatch(page);

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          data.forEach(task => {
            allTasks.push({
              id: task.ID,
              title: task.TITLE,
              description: task.DESCRIPTION,
              status: task.REAL_STATUS,
              deadline: task.DEADLINE,
              createdDate: task.CREATED_DATE,
              responsible: {
                id: task.RESPONSIBLE_ID,
                name: this.getUserNameById(task.RESPONSIBLE_ID)
              },
              accomplices: task.ACCOMPLICES || [],
              auditors: task.AUDITORS || [],
              priority: task.PRIORITY || '2'
            });
          });

          if (data.length < 50) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }

      this.allUserTasks.value = allTasks;
      this.filterTasks();
      this.hasMoreTasks.value = false;

    } catch (error) {
      this.showNotification('error', 'Ошибка при загрузке задач')
    } finally {
      this.isLoadingTasks.value = false;
    }
  }

  getUserNameById(userId) {
    if (this.currentUserProfile.value && this.currentUserProfile.value.ID == userId) {
      return this.currentUserProfile.value.FULL_NAME
    }

    const cachedProfile = this.userProfilesCache.value[userId]
    if (cachedProfile) {
      return cachedProfile.FULL_NAME
    }

    return `Пользователь ${userId}`
  }

  loadMoreTasks() {
    this.loadUserTasks()
  }

  selectTask(task) {
    this.selectedTask.value = task
  }

  async attachToTask() {
    if (!this.selectedTask || !this.modalPageData.value || !this.selectedUser.value) {
      this.showNotification('warning', 'Пожалуйста, выберите задачу')
      return
    }
    try {
      this.isAttachingToTask.value = true
      await this.addTimeToTask(
          this.selectedTask.value.id,
          this.modalPageData.value,
          this.selectedUser.value,
          false
      )
    } catch (error) {
      this.showNotification('error', 'Ошибка при прикреплении времени к задаче')
      this.isAttachingToTask.value = false
    }
  }

  async addTimeToTask(taskId, pageData, userData, isNewTask = false) {
    try {
      // Проверка инициализации bitrixHelper
      if (!bitrixHelper || !bitrixHelper.isReady()) {
        console.warn('bitrixHelper не инициализирован');
      }

      BX24.callBatch({
        add_time: [
          'task.elapseditem.add',
          {
            TASKID: taskId,
            ARFIELDS: {
              SECONDS: pageData.pageTime,
              COMMENT_TEXT: `Время на странице: ${pageData.pageUrl}`,
              USER_ID: userData.id
            }
          }
        ]
      }, async (result) => {
        if (result.add_time.error()) {
          this.showNotification('error', 'Ошибка при добавлении времени к задаче');
          this.isCreatingTask.value = false;
          this.isAttachingToTask.value = false;
          return;
        }

        try {
          const elapsedItemId = result.add_time.data();
          const originalItemId = pageData.originalItemId || pageData.itemId;

          // 1. Обновляем хранилище
          await this.updateStorageAndLocalData(originalItemId, taskId, elapsedItemId);

          // 2. Увеличиваем счетчик сохраненного времени через bitrixHelper
          if (pageData.pageTime && pageData.pageTime > 0 && bitrixHelper) {
            try {
              await bitrixHelper.updateUserSavedTime(userData.id, pageData.pageTime);
              this.refreshSidebarSavedTimeCounter();
            } catch (error) {
              console.error('Ошибка обновления счетчика:', error);
              this.showNotification('error', 'Ошибка обновления счетчика');
            }
          }

          // 3. Показываем успешное уведомление
          this.showNotification('success', 'Время успешно добавлено к задаче!');

          // 4. Закрываем модальное окно
          if (isNewTask) {
            this.isShowCreateTaskModal.value = false;
          } else {
            this.isShowAttachTaskModal.value = false;
          }

          // 5. Сбрасываем состояния
          this.isCreatingTask.value = false;
          this.isAttachingToTask.value = false;
          this.modalPageData.value = null;

          // 6. Принудительно обновляем UI
          this.forceUIUpdate();

        } catch (error) {
          console.error('Ошибка при обработке результата:', error);
          this.showNotification('error', 'Ошибка при обновлении хранилища');
          this.isCreatingTask.value = false;
          this.isAttachingToTask.value = false;
        }
      }, true);

    } catch (error) {
      console.error('Ошибка при добавлении времени к задаче:', error);
      this.showNotification('error', 'Ошибка при добавлении времени к задаче');
      this.isCreatingTask.value = false;
      this.isAttachingToTask.value = false;
    }
  }

  async updateStorageAndLocalData(itemId, taskId, elapsedItemId) {
    try {
      await new Promise((resolve, reject) => {
        BX24.callBatch({
          update_storage: [
            'entity.item.update',
            {
              ENTITY: 'pr_tracking',
              ID: itemId,
              PROPERTY_VALUES: {
                TASK_ID: taskId,
                ELAPSED_ITEM_ID: elapsedItemId
              }
            }
          ]
        }, (result) => {
          if (result.update_storage.error()) {
            this.showNotification('error', 'Ошибка обновления хранилища')
            reject(result.update_storage.error())
          } else {
            this.updateLocalDataWithTaskInfo(itemId, taskId, elapsedItemId)
            resolve()
          }
        }, true)
      })
    } catch (error) {
      this.showNotification('error', 'Ошибка обновления хранилища')
      this.updateLocalDataWithTaskInfo(itemId, taskId, elapsedItemId)
    }
  }

  updateLocalDataWithTaskInfo(itemId, taskId, elapsedItemId) {
    this.myTimeData.value = this.myTimeData.value.map(userData => ({
      ...userData,
      categories: userData.categories.map(categoryData => ({
        ...categoryData,
        pages: categoryData.pages.map(page =>
            page.itemId === itemId
                ? { ...page, taskId, elapsedItemId }
                : page
        )
      }))
    }))
    this.filteredHierarchicalData.value = this.filteredHierarchicalData.value.map(userData => ({
      ...userData,
      categories: userData.categories.map(categoryData => ({
        ...categoryData,
        pages: categoryData.pages.map(page =>
            page.itemId === itemId
                ? { ...page, taskId, elapsedItemId }
                : page
        )
      }))
    }))
  }

  async updateTaskTime() {
    if (!this.modalPageData.value || !this.modalPageData.value.taskId || !this.modalPageData.value.elapsedItemId) {
      this.showNotification('warning', 'Нет данных для обновления');
      return;
    }

    // Проверка наличия userId
    const userId = this.modalPageData.value?.userId || this.selectedUser.value?.id;
    if (!userId) {
      this.showNotification('warning', 'Не удалось определить пользователя');
      return;
    }

    // Проверка инициализации bitrixHelper
    if (!bitrixHelper || !bitrixHelper.isReady()) {
      console.warn('bitrixHelper не инициализирован');
    }

    try {
      this.isUpdatingTime.value = true;

      const newTime = this.updateTimeData.value.newTime;

      // Используем callBatch для получения текущего времени и его обновления за один запрос
      BX24.callBatch({
        // 1. Получаем текущее время из существующей записи
        get_current_time: [
          'task.elapseditem.get',
          {
            TASKID: this.modalPageData.value.taskId,
            ITEMID: this.modalPageData.value.elapsedItemId
          }
        ],
        // 2. Обновляем время в задаче
        update_time: [
          'task.elapseditem.update',
          {
            TASKID: this.modalPageData.value.taskId,
            ITEMID: this.modalPageData.value.elapsedItemId,
            ARFIELDS: {
              SECONDS: newTime,
              COMMENT_TEXT: this.updateTimeData.value.comment || `Обновлено время на странице: ${this.modalPageData.value.pageUrl}`
            }
          }
        ]
      }, async (result) => {
        // Проверяем ошибки обоих вызовов
        if (result.get_current_time.error() || result.update_time.error()) {
          let errorMessage = 'Ошибка при обновлении времени в задаче';

          if (result.get_current_time.error()) {
            errorMessage = 'Ошибка при получении текущего времени задачи';
          }

          if (result.update_time.error()) {
            errorMessage = 'Ошибка при обновлении времени в задаче';
          }

          this.showNotification('error', errorMessage);
          this.isUpdatingTime.value = false;
          return;
        }

        try {
          // 3. Получаем старое значение времени из существующей записи
          const oldTime = parseInt(result.get_current_time.data().SECONDS) || 0;

          // 4. Обновляем время в хранилище
          await this.updateStorageItemTime(this.modalPageData.value.itemId, newTime);

          // 5. Обновляем локальные данные
          this.modalPageData.value.pageTime = newTime;

          // 6. Обновляем счетчик сохраненного времени на разницу через bitrixHelper
          const timeDifference = newTime - oldTime;
          if (timeDifference !== 0 && bitrixHelper) {
            try {
              await bitrixHelper.updateUserSavedTime(userId, timeDifference);
              this.refreshSidebarSavedTimeCounter();
            } catch (error) {
              console.error('Ошибка обновления счетчика:', error);
              this.showNotification('error', 'Ошибка обновления счетчика');
            }
          }

          // 7. Показываем успешное уведомление
          this.showNotification('success', 'Время успешно обновлено!');

          // 8. Закрываем модальное окно
          this.closeUpdateTimeModal();

          // 9. Принудительно обновляем UI
          this.forceUIUpdate();

          this.isUpdatingTime.value = false;

        } catch (error) {
          console.error('Ошибка при обработке результатов обновления:', error);
          this.showNotification('error', 'Ошибка при обработке результатов обновления');
          this.isUpdatingTime.value = false;
        }
      }, true);

    } catch (error) {
      console.error('Ошибка при обновлении времени в задаче:', error);
      this.showNotification('error', 'Ошибка при обновлении времени в задаче');
      this.isUpdatingTime.value = false;
    }
  }

  async updateStorageItemTime(itemId, newTime) {
    try {
      await new Promise((resolve, reject) => {
        BX24.callBatch({
          update_storage: [
            'entity.item.update',
            {
              ENTITY: 'pr_tracking',
              ID: itemId,
              FIELDS: {
                PROPERTY_VALUES: {
                  PAGE_TIME: newTime
                }
              }
            }
          ]
        }, (result) => {
          if (result.update_storage.error()) {
            this.showNotification('error', 'Ошибка обновления времени в хранилище')
            reject(result.update_storage.error())
          } else {
            resolve()
          }
        }, true)
      })
    } catch (error) {
      this.showNotification('error', 'Ошибка обновления времени в хранилище')
    }
  }

  async unlinkTask() {
    if (!this.modalPageData.value || !this.modalPageData.value.taskId || !this.modalPageData.value.elapsedItemId) {
      this.showNotification('warning', 'Нет данных для удаления связи');
      return;
    }

    // Получаем userId
    const userId = this.modalPageData.value?.userId || this.selectedUser.value?.id;
    if (!userId) {
      this.showNotification('warning', 'Не удалось определить пользователя');
      return;
    }

    // Проверка инициализации bitrixHelper
    if (!bitrixHelper || !bitrixHelper.isReady()) {
      console.warn('bitrixHelper не инициализирован');
    }

    try {
      this.isUnlinkingTask.value = true;
      const { itemId, taskId, elapsedItemId, pageTime } = this.modalPageData.value;

      // 1. Получаем детали записи времени перед удалением, чтобы узнать точное время
      let elapsedTimeToDeduct = 0;

      try {
        // Получаем информацию о записи времени
        const elapsedItemInfo = await new Promise((resolve, reject) => {
          BX24.callBatch({
            get_elapsed_item: [
              'task.elapseditem.get',
              {
                TASKID: taskId,
                ITEMID: elapsedItemId
              }
            ]
          }, (result) => {
            if (result.get_elapsed_item.error()) {
              resolve(null);
            } else {
              resolve(result.get_elapsed_item.data());
            }
          }, true);
        });

        if (elapsedItemInfo && elapsedItemInfo.SECONDS) {
          elapsedTimeToDeduct = parseInt(elapsedItemInfo.SECONDS) || 0;
        }
      } catch (error) {
        console.warn('Ошибка получения информации о записи времени:', error);
        // Продолжаем с имеющимися данными
      }

      // 2. Удаляем запись времени из задачи
      await new Promise((resolve, reject) => {
        BX24.callBatch({
          delete_time: [
            'task.elapseditem.delete',
            {
              TASKID: taskId,
              ITEMID: elapsedItemId
            }
          ]
        }, (result) => {
          if (result.delete_time.error()) {
            console.error('Ошибка удаления записи времени:', result.delete_time.error());
            this.showNotification('error', 'Ошибка удаления записи времени');
          }
          resolve();
        }, true);
      });

      // 3. Обновляем хранилище - удаляем связь
      await new Promise((resolve, reject) => {
        BX24.callBatch({
          unlink: [
            'entity.item.update',
            {
              ENTITY: 'pr_tracking',
              ID: itemId,
              PROPERTY_VALUES: {
                TASK_ID: '',
                ELAPSED_ITEM_ID: ''
              }
            }
          ]
        }, (result) => {
          if (result.unlink.error()) {
            console.error('Ошибка удаления связи из хранилища:', result.unlink.error());
            this.showNotification('error', 'Ошибка удаления связи из хранилища');
            reject(result.unlink.error());
          } else {
            resolve();
          }
        }, true);
      });

      // 4. Уменьшаем счетчик сохраненного времени через bitrixHelper
      const timeToDeduct = elapsedTimeToDeduct > 0 ? elapsedTimeToDeduct : pageTime;
      if (timeToDeduct > 0 && bitrixHelper) {
        try {
          await bitrixHelper.updateUserSavedTime(userId, -timeToDeduct);
          this.refreshSidebarSavedTimeCounter();
        } catch (error) {
          console.error('Ошибка уменьшения счетчика:', error);
          this.showNotification('error', 'Ошибка уменьшения счетчика');
        }
      }

      // 5. Обновляем локальные данные
      this.removeTaskInfoFromLocalData(itemId);

      // 6. Показываем уведомление
      this.showNotification('success', 'Связь с задачей удалена и запись времени удалена!');

      // 7. Закрываем модальное окно и сбрасываем состояние
      this.isShowUnlinkTaskModal.value = false;
      this.isUnlinkingTask.value = false;
      this.modalPageData.value = null;

      // 8. Принудительно обновляем UI
      this.forceUIUpdate();

    } catch (error) {
      console.error('Ошибка при удалении связи с задачей:', error);
      this.showNotification('error', 'Ошибка при удалении связи с задачей');
      this.isUnlinkingTask.value = false;
    }
  }

  removeTaskInfoFromLocalData(itemId) {
    this.myTimeData.value = this.myTimeData.value.map(userData => ({
      ...userData,
      categories: userData.categories.map(categoryData => ({
        ...categoryData,
        pages: categoryData.pages.map(page =>
            page.itemId === itemId
                ? { ...page, taskId: null, elapsedItemId: null }
                : page
        )
      }))
    }))
    this.filteredHierarchicalData.value = this.filteredHierarchicalData.value.map(userData => ({
      ...userData,
      categories: userData.categories.map(categoryData => ({
        ...categoryData,
        pages: categoryData.pages.map(page =>
            page.itemId === itemId
                ? { ...page, taskId: null, elapsedItemId: null }
                : page
        )
      }))
    }))
  }

  async updateDataAndRestoreStates() {
    this.saveCurrentExpandedStates()
    await this.loadDataForSelectedDay()
    this.restoreExpandedStates()
  }

  async loadDataForSelectedDay() {
    if (!this.selectedDay.value || !this.currentUserId.value) {
      this.clearTabData(this.activeTab.value)
      this.isProcessingData.value = false
      return
    }

    try {
      this.isProcessingData.value = true
      this.clearTabData(this.activeTab.value)

      const sectionId = await this.findSectionForDate(this.selectedDay.value)

      if (!sectionId) {
        this.isProcessingData.value = false
        return
      }

      if (this.activeTab.value === 'my-time') {
        await this.loadMyTimeDataFromSection(sectionId)
      } else if (this.activeTab.value === 'all-time') {
        await this.loadAllTimeDataFromSection(sectionId)
      }

    } catch (error) {
      this.showNotification('error', 'Ошибка при загрузке данных')
      this.clearTabData(this.activeTab.value)
    } finally {
      this.isProcessingData.value = false
    }
  }

  async findSectionForDate(dateString) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        section: [
          'entity.section.get',
          {
            ENTITY: 'pr_tracking',
            FILTER: { 'NAME': dateString },
            SELECT: ['ID', 'NAME']
          }
        ]
      }, (result) => {
        if (result.section.error()) {
          this.showNotification('error', 'Ошибка поиска раздела')
          reject(result.section.error())
          return
        }

        const sections = result.section.data()
        if (sections.length > 0) {
          resolve(sections[0].ID)
        } else {
          resolve(null)
        }
      }, true)
    })
  }

  async loadMyTimeDataFromSection(sectionId) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        items: [
          'entity.item.get',
          {
            ENTITY: 'pr_tracking',
            FILTER: {
              SECTION_ID: sectionId,
              'PROPERTY_USER_ID': this.currentUserId.value
            },
            SELECT: ['ID', 'DATE_CREATE', 'TIMESTAMP_X', 'PROPERTY_VALUES', 'NAME']
          }
        ]
      }, async (result) => {
        if (result.items.error()) {
          this.showNotification('error', 'Ошибка загрузки данных')
          reject(result.items.error())
          return
        }

        const items = result.items.data()
        this.processMyTimeData(items)

        await this.forceExpandFirstUserInMyTime()

        resolve(items)
      }, true)
    })
  }

  async loadAllTimeDataFromSection(sectionId) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        items: [
          'entity.item.get',
          {
            ENTITY: 'pr_tracking',
            FILTER: { SECTION_ID: sectionId },
            SELECT: ['ID', 'DATE_CREATE', 'TIMESTAMP_X', 'PROPERTY_VALUES', 'NAME']
          }
        ]
      }, async (result) => {
        if (result.items.error()) {
          this.showNotification('error', 'Ошибка загрузки данных')
          reject(result.items.error())
          return
        }

        const items = result.items.data()

        if (items.length === 0) {
          this.filteredHierarchicalData.value = []
          this.filteredUsers.value = []
          resolve([])
          return
        }

        const uniqueUserIds = [...new Set(items.map(item =>
            parseInt(item.PROPERTY_VALUES?.USER_ID || 0)
        ).filter(id => id > 0))]

        if (uniqueUserIds.length > 0) {
          await this.getUserProfilesBatch(uniqueUserIds)
        }

        this.processAllTimeData(items)
        this.filteredUsers.value = [...this.filteredHierarchicalData.value]
        resolve(items)
      }, true)
    })
  }

  processMyTimeData(items) {
    const usersMap = new Map()

    items.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const userId = parseInt(props.USER_ID) || 0
      const userName = props.USER_NAME || 'Неизвестный пользователь'
      const pageTime = parseInt(props.PAGE_TIME) || 0
      const pageUrl = props.PAGE_URL || ''
      const pageCategory = props.PAGE_CATEGORY || null
      const createdAt = item.DATE_CREATE
      const updatedAt = item.TIMESTAMP_X || createdAt
      const taskId = props.TASK_ID || null
      const elapsedItemId = props.ELAPSED_ITEM_ID || null

      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          userId,
          userName,
          totalTime: 0,
          categories: new Map(),
          latestUpdatedAt: null
        })
      }

      const userData = usersMap.get(userId)
      userData.totalTime += pageTime

      const categoryKey = pageCategory || 'uncategorized'
      if (!userData.categories.has(categoryKey)) {
        userData.categories.set(categoryKey, {
          category: pageCategory,
          totalTime: 0,
          pages: new Map()
        })
      }

      const categoryData = userData.categories.get(categoryKey)
      categoryData.totalTime += pageTime

      const pageKey = pageUrl
      if (!categoryData.pages.has(pageKey)) {
        categoryData.pages.set(pageKey, {
          itemId: item.ID,
          pageUrl,
          pageTime: 0,
          count: 0,
          createdAt,
          updatedAt,
          taskId,
          elapsedItemId,
          isLatest: false,
          userId: userId // Добавляем userId в данные страницы
        })
      }

      const pageData = categoryData.pages.get(pageKey)
      pageData.pageTime += pageTime
      pageData.count++
      pageData.userId = userId // Обновляем userId

      if (new Date(updatedAt) > new Date(pageData.updatedAt)) {
        pageData.updatedAt = updatedAt
      }

      if (!userData.latestUpdatedAt || new Date(updatedAt) > new Date(userData.latestUpdatedAt)) {
        userData.latestUpdatedAt = updatedAt
      }
    })

    usersMap.forEach(userData => {
      userData.categories.forEach(categoryData => {
        categoryData.pages.forEach(pageData => {
          if (pageData.updatedAt === userData.latestUpdatedAt) {
            pageData.isLatest = true
          }
        })
      })
    })

    this.myTimeData.value = Array.from(usersMap.values()).map(userData => ({
      ...userData,
      categories: Array.from(userData.categories.values()).map(categoryData => ({
        ...categoryData,
        pages: Array.from(categoryData.pages.values())
            .sort((a, b) => b.pageTime - a.pageTime)
      })).sort((a, b) => b.totalTime - a.totalTime)
    })).sort((a, b) => b.totalTime - a.totalTime)
  }

  processAllTimeData(items) {
    const usersMap = new Map()

    items.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const userId = parseInt(props.USER_ID) || 0
      const userName = props.USER_NAME || 'Неизвестный пользователь'
      const pageTime = parseInt(props.PAGE_TIME) || 0
      const pageUrl = props.PAGE_URL || ''
      const pageCategory = props.PAGE_CATEGORY || null
      const createdAt = item.DATE_CREATE
      const updatedAt = item.TIMESTAMP_X || createdAt
      const taskId = props.TASK_ID || null
      const elapsedItemId = props.ELAPSED_ITEM_ID || null

      let displayName = userName
      const userProfile = this.userProfilesCache.value[userId]
      if (userProfile) {
        displayName = userProfile.FULL_NAME
      }

      let userData = usersMap.get(userId)
      if (!userData) {
        userData = {
          userId,
          userName: displayName,
          totalTime: 0,
          categories: new Map(),
          latestUpdatedAt: null
        }
        usersMap.set(userId, userData)
      }

      userData.totalTime += pageTime

      const categoryKey = pageCategory || 'uncategorized'
      if (!userData.categories.has(categoryKey)) {
        userData.categories.set(categoryKey, {
          category: pageCategory,
          totalTime: 0,
          pages: new Map()
        })
      }

      const categoryData = userData.categories.get(categoryKey)
      categoryData.totalTime += pageTime

      const pageKey = pageUrl
      if (!categoryData.pages.has(pageKey)) {
        categoryData.pages.set(pageKey, {
          itemId: item.ID,
          pageUrl,
          pageTime: 0,
          count: 0,
          createdAt,
          updatedAt,
          taskId,
          elapsedItemId,
          isLatest: false,
          userId: userId // Добавляем userId в данные страницы
        })
      }

      const pageData = categoryData.pages.get(pageKey)
      pageData.pageTime += pageTime
      pageData.count++
      pageData.userId = userId // Обновляем userId

      if (new Date(updatedAt) > new Date(pageData.updatedAt)) {
        pageData.updatedAt = updatedAt
      }

      if (!userData.latestUpdatedAt || new Date(updatedAt) > new Date(userData.latestUpdatedAt)) {
        userData.latestUpdatedAt = updatedAt
      }
    })

    usersMap.forEach(userData => {
      if (userData.latestUpdatedAt) {
        userData.categories.forEach(categoryData => {
          categoryData.pages.forEach(pageData => {
            if (pageData.updatedAt === userData.latestUpdatedAt) {
              pageData.isLatest = true
            }
          })
        })
      }
    })

    this.filteredHierarchicalData.value = Array.from(usersMap.values())
        .filter(userData => userData.totalTime > 0)
        .map(userData => ({
          ...userData,
          categories: Array.from(userData.categories.values())
              .map(categoryData => ({
                ...categoryData,
                pages: Array.from(categoryData.pages.values())
                    .sort((a, b) => b.pageTime - a.pageTime)
              }))
              .sort((a, b) => b.totalTime - a.totalTime)
        }))
        .sort((a, b) => b.totalTime - a.totalTime)
  }

  clearTabData(tab) {
    if (tab === 'my-time') {
      this.myTimeData.value = []
      this.expandedUsersMyTime.value = {}
      this.expandedCategoriesMyTime.value = {}
    } else if (tab === 'all-time') {
      this.filteredHierarchicalData.value = []
      this.filteredUsers.value = []
      this.userSearchQuery.value = ''
      this.currentUserPage.value = 1
      this.expandedUsersAllTime.value = {}
      this.expandedCategoriesAllTime.value = {}
    }
  }

  async getAppSettings() {
    return new Promise((resolve, reject) => {
      if (!BX24 || !BX24.appOption) {
        resolve({})
        return
      }

      const settings = {}
      try {
        settings.historyDays = BX24.appOption.get('page_tracking_history_days')
        settings.subordinateReportsEnabled = BX24.appOption.get('subordinate_reports_enabled')
        settings.employeeReactionTime = BX24.appOption.get('employee_reaction_time')
        settings.deliveryMethod = BX24.appOption.get('delivery_method')
        settings.responseMethod = BX24.appOption.get('response_method')
        resolve(settings)
      } catch (error) {
        resolve({})
      }
    })
  }

  async initialize() {
    try {
      await this.loadCurrentUserProfile()
      const appSettings = await this.getAppSettings()
      this.historyDays = parseInt(appSettings.historyDays) || 3

      // Загружаем настройки отчетов
      this.subordinateReportsEnabled.value = appSettings.subordinateReportsEnabled === 'Y'

      if (appSettings.employeeReactionTime) {
        const seconds = parseInt(appSettings.employeeReactionTime)
        if (!isNaN(seconds) && seconds >= 10 && seconds <= 300) {
          this.employeeReactionTime.value = seconds
        }
      }

      if (appSettings.deliveryMethod && ['chat', 'push', 'all'].includes(appSettings.deliveryMethod)) {
        this.deliveryMethod.value = appSettings.deliveryMethod
      }

      if (appSettings.responseMethod && ['chat', 'push', 'all'].includes(appSettings.responseMethod)) {
        this.responseMethod.value = appSettings.responseMethod
      }

      const today = this.getTodayDate()
      this.selectedDay.value = today
      this.calendarDate.value = this.getCalendarDateFromString(today)
      await this.loadDataForSelectedDay()
    } catch (error) {
      this.showNotification('error', 'Ошибка инициализации приложения')
      this.isProcessingData.value = false
    }
  }

  forceUIUpdate() {
    this.myTimeData.value = [...this.myTimeData.value]
    this.filteredHierarchicalData.value = [...this.filteredHierarchicalData.value]
    this.filteredUsers.value = [...this.filteredUsers.value]
    if (this.activeTab.value === 'my-time') {
      this.expandedUsersMyTime.value = { ...this.expandedUsersMyTime.value }
      this.expandedCategoriesMyTime.value = { ...this.expandedCategoriesMyTime.value }
    } else if (this.activeTab.value === 'all-time') {
      this.expandedUsersAllTime.value = { ...this.expandedUsersAllTime.value }
      this.expandedCategoriesAllTime.value = { ...this.expandedCategoriesAllTime.value }
    }
    if (this.modalPageData.value) {
      this.modalPageData.value = { ...this.modalPageData.value }
    }
  }

  // Метод для отправки запроса отчета
  async sendReportRequest() {
    if (!this.selectedUserForReport.value || !this.currentUserId.value) {
      this.showNotification('warning', 'Не выбран сотрудник для запроса отчета')
      return
    }

    try {
      this.isSendingReportRequest.value = true

      // Используем структурированный формат сообщения
      const { shortMessage, attach } = this.createStructuredReportRequest()

      const sendPromises = []

      // Отправляем уведомления в зависимости от настроек
      if (['push', 'all'].includes(this.deliveryMethod.value)) {
        sendPromises.push(this.sendPersonalNotification(
            this.selectedUserForReport.value.userId,
            shortMessage,
            attach
        ))
      }

      if (['chat', 'all'].includes(this.deliveryMethod.value)) {
        sendPromises.push(this.sendChatMessage(
            this.selectedUserForReport.value.userId,
            '',
            attach
        ))
      }

      await Promise.all(sendPromises)
      this.showNotification('success', 'Запрос отчета успешно отправлен!')
      this.closeRequestReportModal()

    } catch (error) {
      this.showNotification('error', 'Ошибка при отправке запроса отчета')
    } finally {
      this.isSendingReportRequest.value = false
    }
  }

  // Метод для отправки персонального уведомления
  async sendPersonalNotification(userId, title, attach) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        notification: [
          'im.notify.personal.add',
          {
            USER_ID: userId,
            MESSAGE: title,
            ATTACH: attach,
            TAG: `REPORT_REQUEST_${Date.now()}`,
            SUB_TAG: `REPORT|${this.selectedDay.value}|${this.currentUserId.value}`
          }
        ]
      }, (result) => {
        if (result.notification.error()) {
          this.showNotification('error', 'Ошибка отправки уведомления')
          reject(result.notification.error())
        } else {
          resolve(result.notification.data())
        }
      }, true)
    })
  }

  async sendChatMessage(userId, title, attach) {
    return new Promise((resolve, reject) => {
      BX24.callBatch({
        message: [
          'im.message.add',
          {
            DIALOG_ID: userId.toString(),
            MESSAGE: title,
            ATTACH: attach,
            SYSTEM: 'N'
          }
        ]
      }, (result) => {
        if (result.message.error()) {
          this.showNotification('error', 'Ошибка отправки сообщения в чат')
          reject(result.message.error())
        } else {
          resolve(result.message.data())
        }
      }, true)
    })
  }

  // Обновить счетчик в сайдбаре
  refreshSidebarSavedTimeCounter() {
    if (typeof window.updateSidebarSavedTime === 'function') {
      try {
        window.updateSidebarSavedTime();
      } catch (error) {
        console.warn('Ошибка обновления сайдбара:', error);
      }
    }

    // Также отправляем событие для обновления других компонентов
    try {
      const event = new CustomEvent('saved-time-update', {
        detail: { timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Игнорируем ошибки DOM события
    }
  }

}

export default {
  name: 'TimeList',
  methods: {
    bitrixHelper() {
      return bitrixHelper
    }
  },
  components: {
    Sidebar
  },
  setup() {
    const hierarchicalDataManager = new HierarchicalDataManager()

    const getUserInitials = (name) => {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return name.substring(0, 2).toUpperCase()
    }

    onMounted(async () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          try {
            await hierarchicalDataManager.initialize()
          } catch (error) {
            hierarchicalDataManager.showNotification('error', 'Ошибка инициализации приложения')
            hierarchicalDataManager.isProcessingData.value = false
          }
        })
      } else {
        hierarchicalDataManager.isProcessingData.value = false
      }
    })

    // Вычисляемые свойства для шаблона
    const paginatedUsers = computed(() => hierarchicalDataManager.paginatedUsers)
    const paginatedTasks = computed(() => hierarchicalDataManager.paginatedTasks)

    return {
      bitrixHelper: bitrixHelper,
      currentUserId: hierarchicalDataManager.currentUserId,
      currentUserProfile: hierarchicalDataManager.currentUserProfile,
      isLoadingProfile: hierarchicalDataManager.isLoadingProfile,
      myTimeData: hierarchicalDataManager.myTimeData,
      filteredHierarchicalData: hierarchicalDataManager.filteredHierarchicalData,
      activeTab: hierarchicalDataManager.activeTab,
      selectedDay: hierarchicalDataManager.selectedDay,
      calendarDate: hierarchicalDataManager.calendarDate,
      taskDeadlineCalendarDate: hierarchicalDataManager.taskDeadlineCalendarDate,
      isProcessingData: hierarchicalDataManager.isProcessingData,
      categories: hierarchicalDataManager.categories,
      expandedUsersMyTime: hierarchicalDataManager.expandedUsersMyTime,
      expandedCategoriesMyTime: hierarchicalDataManager.expandedCategoriesMyTime,
      expandedUsersAllTime: hierarchicalDataManager.expandedUsersAllTime,
      expandedCategoriesAllTime: hierarchicalDataManager.expandedCategoriesAllTime,
      priorityOptions: hierarchicalDataManager.priorityOptions,
      taskStatusOptions: hierarchicalDataManager.taskStatusOptions,
      isShowCreateTaskModal: hierarchicalDataManager.isShowCreateTaskModal,
      isShowAttachTaskModal: hierarchicalDataManager.isShowAttachTaskModal,
      isShowUpdateTimeModal: hierarchicalDataManager.isShowUpdateTimeModal,
      isShowUnlinkTaskModal: hierarchicalDataManager.isShowUnlinkTaskModal,
      isShowRequestReportModal: hierarchicalDataManager.isShowRequestReportModal,
      isCreatingTask: hierarchicalDataManager.isCreatingTask,
      isAttachingToTask: hierarchicalDataManager.isAttachingToTask,
      isUpdatingTime: hierarchicalDataManager.isUpdatingTime,
      isUnlinkingTask: hierarchicalDataManager.isUnlinkingTask,
      isSendingReportRequest: hierarchicalDataManager.isSendingReportRequest,
      modalPageData: hierarchicalDataManager.modalPageData,
      selectedUser: hierarchicalDataManager.selectedUser,
      selectedUserForReport: hierarchicalDataManager.selectedUserForReport,
      selectedTask: hierarchicalDataManager.selectedTask,
      allUserTasks: hierarchicalDataManager.allUserTasks,
      filteredTasks: hierarchicalDataManager.filteredTasks,
      filteredTasksCount: hierarchicalDataManager.filteredTasksCount,
      isLoadingTasks: hierarchicalDataManager.isLoadingTasks,
      taskFilter: hierarchicalDataManager.taskFilter,
      createTaskFormRef: hierarchicalDataManager.createTaskFormRef,
      updateTimeData: hierarchicalDataManager.updateTimeData,
      taskFormData: hierarchicalDataManager.taskFormData,
      userSearchQuery: hierarchicalDataManager.userSearchQuery,
      filteredUsers: hierarchicalDataManager.filteredUsers,
      currentUserPage: hierarchicalDataManager.currentUserPage,
      itemsPerPage: hierarchicalDataManager.itemsPerPage,
      currentTaskPage: hierarchicalDataManager.currentTaskPage,
      tasksPerPage: hierarchicalDataManager.tasksPerPage,
      subordinateReportsEnabled: hierarchicalDataManager.subordinateReportsEnabled,
      employeeReactionTime: hierarchicalDataManager.employeeReactionTime,
      deliveryMethod: hierarchicalDataManager.deliveryMethod,
      reportRequestMessage: hierarchicalDataManager.reportRequestMessage,
      paginatedUsers,
      paginatedTasks,

      getTaskUrl: hierarchicalDataManager.getTaskUrl.bind(hierarchicalDataManager),
      getUserInitials,
      getDeliveryMethodText: hierarchicalDataManager.getDeliveryMethodText.bind(hierarchicalDataManager),
      getUserPhoto: (userId) => {
        const userProfile = hierarchicalDataManager.userProfilesCache.value[userId]
        return userProfile?.PERSONAL_PHOTO || null
      },
      getOnlineStatus: (userId) => {
        const userProfile = hierarchicalDataManager.userProfilesCache.value[userId]
        return userProfile?.IS_ONLINE || 'N'
      },
      validateTaskForm: hierarchicalDataManager.validateTaskForm.bind(hierarchicalDataManager),
      getCategoryBadgeClass: hierarchicalDataManager.getCategoryBadgeClass.bind(hierarchicalDataManager),
      getTaskStatusClass: hierarchicalDataManager.getTaskStatusClass.bind(hierarchicalDataManager),
      getTaskStatusText: hierarchicalDataManager.getTaskStatusText.bind(hierarchicalDataManager),
      formatTime: hierarchicalDataManager.formatTime.bind(hierarchicalDataManager),
      formatDate: hierarchicalDataManager.formatDate.bind(hierarchicalDataManager),
      formatDuration: hierarchicalDataManager.formatDuration.bind(hierarchicalDataManager),
      formatDayDisplay: hierarchicalDataManager.formatDayDisplay.bind(hierarchicalDataManager),
      onTabChange: hierarchicalDataManager.onTabChange.bind(hierarchicalDataManager),
      toggleUser: hierarchicalDataManager.toggleUser.bind(hierarchicalDataManager),
      toggleCategory: hierarchicalDataManager.toggleCategory.bind(hierarchicalDataManager),
      filterTasks: hierarchicalDataManager.filterTasks.bind(hierarchicalDataManager),
      filterUsers: hierarchicalDataManager.filterUsers.bind(hierarchicalDataManager),
      handleCalendarDateChange: hierarchicalDataManager.handleCalendarDateChange.bind(hierarchicalDataManager),
      handleTaskDeadlineChange: hierarchicalDataManager.handleTaskDeadlineChange.bind(hierarchicalDataManager),
      handleUserCollapsibleUpdate: hierarchicalDataManager.handleUserCollapsibleUpdate.bind(hierarchicalDataManager),
      handleCategoryCollapsibleUpdate: hierarchicalDataManager.handleCategoryCollapsibleUpdate.bind(hierarchicalDataManager),
      isDateDisabled: hierarchicalDataManager.isDateDisabled.bind(hierarchicalDataManager),
      isDateUnavailable: hierarchicalDataManager.isDateUnavailable.bind(hierarchicalDataManager),
      minCalendarDate: hierarchicalDataManager.minCalendarDate,
      maxCalendarDate: hierarchicalDataManager.maxCalendarDate,
      showCreateTaskModal: hierarchicalDataManager.showCreateTaskModal.bind(hierarchicalDataManager),
      showAttachTaskModal: hierarchicalDataManager.showAttachTaskModal.bind(hierarchicalDataManager),
      showUpdateTimeModal: hierarchicalDataManager.showUpdateTimeModal.bind(hierarchicalDataManager),
      showUnlinkTaskModal: hierarchicalDataManager.showUnlinkTaskModal.bind(hierarchicalDataManager),
      showRequestReportModal: hierarchicalDataManager.showRequestReportModal.bind(hierarchicalDataManager),
      closeCreateTaskModal: hierarchicalDataManager.closeCreateTaskModal.bind(hierarchicalDataManager),
      closeAttachTaskModal: hierarchicalDataManager.closeAttachTaskModal.bind(hierarchicalDataManager),
      closeUpdateTimeModal: hierarchicalDataManager.closeUpdateTimeModal.bind(hierarchicalDataManager),
      closeUnlinkTaskModal: hierarchicalDataManager.closeUnlinkTaskModal.bind(hierarchicalDataManager),
      closeRequestReportModal: hierarchicalDataManager.closeRequestReportModal.bind(hierarchicalDataManager),
      openResponsibleSelector: hierarchicalDataManager.openResponsibleSelector.bind(hierarchicalDataManager),
      openAuditorsSelector: hierarchicalDataManager.openAuditorsSelector.bind(hierarchicalDataManager),
      removeAuditor: hierarchicalDataManager.removeAuditor.bind(hierarchicalDataManager),
      createTask: hierarchicalDataManager.createTask.bind(hierarchicalDataManager),
      loadUserTasks: hierarchicalDataManager.loadUserTasks.bind(hierarchicalDataManager),
      loadMoreTasks: hierarchicalDataManager.loadMoreTasks.bind(hierarchicalDataManager),
      selectTask: hierarchicalDataManager.selectTask.bind(hierarchicalDataManager),
      attachToTask: hierarchicalDataManager.attachToTask.bind(hierarchicalDataManager),
      updateTaskTime: hierarchicalDataManager.updateTaskTime.bind(hierarchicalDataManager),
      unlinkTask: hierarchicalDataManager.unlinkTask.bind(hierarchicalDataManager),
      sendReportRequest: hierarchicalDataManager.sendReportRequest.bind(hierarchicalDataManager),
      refreshCurrentTabData: hierarchicalDataManager.refreshCurrentTabData.bind(hierarchicalDataManager),
      createStructuredReportRequest: hierarchicalDataManager.createStructuredReportRequest?.bind(hierarchicalDataManager),
      refreshSidebarSavedTimeCounter: hierarchicalDataManager.refreshSidebarSavedTimeCounter?.bind(hierarchicalDataManager),
      actualizeAllTimes: hierarchicalDataManager.actualizeAllTimes?.bind(hierarchicalDataManager)
    }
  }
}
</script>

<style>
  button {
    cursor: pointer!important;
  }
</style>