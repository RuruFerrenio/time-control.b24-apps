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
                <div class="flex flex-row md:flex-col space-y-0 md:space-y-1 space-x-2 md:space-x-0 w-full md:w-40">
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
                  <B24Button
                      @click="exportToXLS"
                      :disabled="isLoading || getCurrentData().length === 0"
                      color="air-secondary"
                      size="sm"
                      class="flex-1 w-full sm:w-auto justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Экспорт XLS
                  </B24Button>
                </div>
              </div>

              <!-- Календарь для выбора диапазона -->
              <div>
                <div class="flex flex-col md:flex-row gap-2">
                  <div class="flex-1">
                    <B24Popover>
                      <B24Button
                          :disabled="isLoading"
                          color="air-secondary-accent"
                          size="lg"
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
                              :is-date-unavailable="isDateUnavailable"
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
                      size="lg"
                      class="flex-shrink-0"
                      :title="'Сбросить фильтр по дате'"
                  >
                    <svg
                        class="w-4 h-4"
                        :class="{ 'animate-spin': isLoading }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </B24Button>
                </div>
              </div>

              <!-- Табы для переключения режимов просмотра -->
              <B24Tabs
                  v-model="activeTab"
                  :items="[
                    { label: 'По страницам', value: 'pages' },
                    { label: 'По сотрудникам', value: 'users' },
                    { label: 'По категориям', value: 'categories' }
                  ]"
                  @update:modelValue="onTabChange"
                  class="w-full whitespace-nowrap overflow-hidden"
              />

              <!-- Прелоадер при загрузке -->
              <div v-if="isLoading" class="text-center py-12">
                <svg class="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <p class="text-sm text-gray-500">Загрузка данных...</p>
              </div>

              <!-- Режим просмотра: По страницам -->
              <div v-else-if="activeTab === 'pages'">
                <!-- Данные -->
                <div v-if="!isLoading && processedData.length > 0">
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
                      <!-- Заголовок таблицы с сортировкой -->
                      <thead class="bg-gray-50">
                      <tr>
                        <th
                            @click="sortBy('url')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Страница</span>
                            <span v-if="sortColumn === 'url'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('category')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Категория</span>
                            <span v-if="sortColumn === 'category'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('employeeCount')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Кол-во сотрудников</span>
                            <span v-if="sortColumn === 'employeeCount'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('totalTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Общее время</span>
                            <span v-if="sortColumn === 'totalTime'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('averageTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Среднее время</span>
                            <span v-if="sortColumn === 'averageTime'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('maxTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Максимальное время</span>
                            <span v-if="sortColumn === 'maxTime'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortBy('minTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Минимальное время</span>
                            <span v-if="sortColumn === 'minTime'" class="text-gray-400">
                              {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(page, index) in paginatedPages" :key="index" class="hover:bg-gray-50">
                        <!-- URL страницы -->
                        <td class="text-sm">
                          <a
                              :href="page.url"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-800 hover:underline"
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
              </div>

              <!-- Режим просмотра: По сотрудникам -->
              <div v-else-if="activeTab === 'users'">
                <!-- Данные по сотрудникам -->
                <div v-if="!isLoading && filteredUsersData.length > 0">
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
                      <!-- Заголовок таблицы с сортировкой -->
                      <thead class="bg-gray-50">
                      <tr>
                        <th
                            @click="sortUsersBy('userName')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Сотрудник</span>
                            <span v-if="usersSortColumn === 'userName'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('favoriteCategory')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Любимая категория</span>
                            <span v-if="usersSortColumn === 'favoriteCategory'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('totalTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Общее время</span>
                            <span v-if="usersSortColumn === 'totalTime'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('averageTimePerDay')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Среднее время в день</span>
                            <span v-if="usersSortColumn === 'averageTimePerDay'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('averageTimePerPage')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Среднее время на странице</span>
                            <span v-if="usersSortColumn === 'averageTimePerPage'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('maxTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Максимальное время</span>
                            <span v-if="usersSortColumn === 'maxTime'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortUsersBy('minTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Минимальное время</span>
                            <span v-if="usersSortColumn === 'minTime'" class="text-gray-400">
                              {{ usersSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(user, index) in paginatedUsers" :key="index" class="hover:bg-gray-50">
                        <!-- Сотрудник с B24User -->
                        <td class="text-sm">
                          <a
                              :href="getUserProfileUrl(user.userId)"
                              target="_blank"
                              class="inline-flex items-center hover:opacity-80 transition-opacity"
                          >
                            <B24User
                                :name="user.userName"
                                size="sm"
                                :avatar="{
                                      src: getUserPhoto(user.userId),
                                      initials: getUserInitials(user.userName)
                                  }"
                                :chip="{
                                      color: getOnlineStatus(user.userId) === 'Y'
                                          ? 'air-primary-success'
                                          : 'air-secondary-accent',
                                      position: 'top-right'
                                  }"
                                class="truncate cursor-pointer"
                            />
                          </a>
                        </td>

                        <!-- Любимая категория -->
                        <td class="text-sm">
                          <B24Badge :class="getCategoryBadgeClass(user.favoriteCategory)">
                            {{ user.favoriteCategory || 'Без категории' }}
                          </B24Badge>
                        </td>

                        <!-- Общее время -->
                        <td class="text-sm font-medium">{{ formatDuration(user.totalTime) }}</td>

                        <!-- Среднее время в день -->
                        <td class="text-sm">{{ formatDuration(user.averageTimePerDay) }}</td>

                        <!-- Среднее время на странице -->
                        <td class="text-sm">{{ formatDuration(user.averageTimePerPage) }}</td>

                        <!-- Максимальное время -->
                        <td class="text-sm">{{ formatDuration(user.maxTime) }}</td>

                        <!-- Минимальное время -->
                        <td class="text-sm">{{ formatDuration(user.minTime) }}</td>
                      </tr>
                      </tbody>
                      <tfoot class="bg-gray-50 font-semibold">
                      <tr>
                        <td colspan="2" class="text-right">Итого:</td>
                        <td>{{ formatDuration(usersTotalStats.totalTime) }}</td>
                        <td>{{ formatDuration(usersTotalStats.averageTimePerDay) }}</td>
                        <td>{{ formatDuration(usersTotalStats.averageTimePerPage) }}</td>
                        <td>{{ formatDuration(usersTotalStats.maxTime) }}</td>
                        <td>{{ formatDuration(usersTotalStats.minTime) }}</td>
                      </tr>
                      </tfoot>
                    </table>
                  </B24TableWrapper>

                  <!-- Пагинация для пользователей -->
                  <div v-if="filteredUsersData.length > itemsPerPage" class="flex justify-center mt-6">
                    <B24Pagination
                        v-model:page="currentUserPage"
                        :total="filteredUsersData.length"
                        :items-per-page="itemsPerPage"
                        :sibling-count="2"
                        show-edges
                        size="md"
                    />
                  </div>

                  <!-- Информация о количестве записей -->
                  <div class="mt-4 text-sm text-gray-600 text-center">
                    Показано {{ paginatedUsers.length }} из {{ filteredUsersData.length }} записей
                  </div>
                </div>

                <!-- Сообщение при отсутствии данных -->
                <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <p class="text-lg">Нет данных о сотрудниках за выбранный период</p>
                  <p class="text-sm mt-2">Попробуйте изменить период или дождитесь появления новых данных</p>
                </div>
              </div>

              <!-- Режим просмотра: По категориям -->
              <div v-else-if="activeTab === 'categories'">
                <!-- Данные по категориям -->
                <div v-if="!isLoading && filteredCategoriesData.length > 0">
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
                      <!-- Заголовок таблицы с сортировкой -->
                      <thead class="bg-gray-50">
                      <tr>
                        <th
                            @click="sortCategoriesBy('category')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Категория</span>
                            <span v-if="categoriesSortColumn === 'category'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('employeeCount')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Сотрудники</span>
                            <span v-if="categoriesSortColumn === 'employeeCount'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('pagesCount')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Страницы</span>
                            <span v-if="categoriesSortColumn === 'pagesCount'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('totalTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Общее время</span>
                            <span v-if="categoriesSortColumn === 'totalTime'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('averageTimePerPerson')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Среднее время (на человека)</span>
                            <span v-if="categoriesSortColumn === 'averageTimePerPerson'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('maxTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Максимальное время</span>
                            <span v-if="categoriesSortColumn === 'maxTime'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                        <th
                            @click="sortCategoriesBy('minTime')"
                            class="text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div class="flex items-center space-x-1">
                            <span>Минимальное время</span>
                            <span v-if="categoriesSortColumn === 'minTime'" class="text-gray-400">
                              {{ categoriesSortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(category, index) in paginatedCategories" :key="index" class="hover:bg-gray-50">
                        <!-- Категория с бейджем -->
                        <td class="text-sm">
                          <B24Badge :class="getCategoryBadgeClass(category.category)">
                            {{ category.category || 'Без категории' }}
                          </B24Badge>
                        </td>

                        <!-- Количество сотрудников (кликабельно) -->
                        <td class="text-sm">
                          <button
                              @click="showCategoryEmployeesModal(category)"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                          >
                            {{ category.employeeCount }}
                          </button>
                        </td>

                        <!-- Количество страниц (кликабельно) -->
                        <td class="text-sm">
                          <button
                              @click="showCategoryPagesModal(category)"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                          >
                            {{ category.pagesCount }}
                          </button>
                        </td>

                        <!-- Общее время -->
                        <td class="text-sm font-medium">{{ formatDuration(category.totalTime) }}</td>

                        <!-- Среднее время на человека -->
                        <td class="text-sm">{{ formatDuration(category.averageTimePerPerson) }}</td>

                        <!-- Максимальное время -->
                        <td class="text-sm">{{ formatDuration(category.maxTime) }}</td>

                        <!-- Минимальное время -->
                        <td class="text-sm">{{ formatDuration(category.minTime) }}</td>
                      </tr>
                      </tbody>
                      <tfoot class="bg-gray-50 font-semibold">
                      <tr>
                        <td colspan="3" class="text-right">Итого:</td>
                        <td>{{ formatDuration(categoriesTotalStats.totalTime) }}</td>
                        <td>{{ formatDuration(categoriesTotalStats.averageTimePerPerson) }}</td>
                        <td>{{ formatDuration(categoriesTotalStats.maxTime) }}</td>
                        <td>{{ formatDuration(categoriesTotalStats.minTime) }}</td>
                      </tr>
                      </tfoot>
                    </table>
                  </B24TableWrapper>

                  <!-- Пагинация для категорий -->
                  <div v-if="filteredCategoriesData.length > itemsPerPage" class="flex justify-center mt-6">
                    <B24Pagination
                        v-model:page="currentCategoryPage"
                        :total="filteredCategoriesData.length"
                        :items-per-page="itemsPerPage"
                        :sibling-count="2"
                        show-edges
                        size="md"
                    />
                  </div>

                  <!-- Информация о количестве записей -->
                  <div class="mt-4 text-sm text-gray-600 text-center">
                    Показано {{ paginatedCategories.length }} из {{ filteredCategoriesData.length }} записей
                  </div>
                </div>

                <!-- Сообщение при отсутствии данных -->
                <div v-else-if="!isLoading" class="text-center py-12 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                  </svg>
                  <p class="text-lg">Нет данных о категориях за выбранный период</p>
                  <p class="text-sm mt-2">Попробуйте изменить период или дождитесь появления новых данных</p>
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

    <!-- Модальное окно детальной информации по сотрудникам на странице -->
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

    <!-- Модальное окно сотрудников по категории -->
    <B24Modal
        v-model:open="isShowCategoryEmployeesModal"
        :title="`Сотрудники в категории`"
        description="Список сотрудников, посещавших страницы данной категории"
        size="lg"
        scrollable
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div v-if="modalCategoryData" class="space-y-6">
          <!-- Информация о категории -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о категории</div>
                <div class="text-sm text-blue-700">
                  <B24Badge :class="getCategoryBadgeClass(modalCategoryData.category)">
                    {{ modalCategoryData.category || 'Без категории' }}
                  </B24Badge>
                </div>
                <div class="mt-2 text-sm text-blue-700">
                  <span class="font-semibold">Всего времени:</span> {{ formatDuration(modalCategoryData.totalTime) }} |
                  <span class="font-semibold">Сотрудников:</span> {{ modalCategoryData.employeeCount }} |
                  <span class="font-semibold">Страниц:</span> {{ modalCategoryData.pagesCount }}
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
                <th class="text-left font-medium text-gray-700">Время в категории</th>
                <th class="text-left font-medium text-gray-700">Доля от общего времени</th>
                <th class="text-left font-medium text-gray-700">Кол-во посещений</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="employee in modalCategoryData.employees" :key="employee.userId" class="hover:bg-gray-50">
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
                    <span>{{ calculatePercentage(employee.time, modalCategoryData.totalTime) }}%</span>
                    <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                          class="h-full bg-blue-500 rounded-full"
                          :style="{ width: calculatePercentage(employee.time, modalCategoryData.totalTime) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="text-sm">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {{ employee.visits }}
                    </span>
                </td>
              </tr>
              </tbody>
              <tfoot class="bg-gray-50 font-semibold">
              <tr>
                <td colspan="2" class="text-right">Итого:</td>
                <td>{{ formatDuration(modalCategoryData.totalTime) }}</td>
                <td>{{ modalCategoryData.employees.reduce((sum, emp) => sum + emp.visits, 0) }} посещений</td>
              </tr>
              </tfoot>
            </table>
          </B24TableWrapper>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <B24Button @click="close" color="air-primary" class="w-full sm:w-auto">Закрыть</B24Button>
        </div>
      </template>
    </B24Modal>

    <!-- Модальное окно страниц по категории -->
    <B24Modal
        v-model:open="isShowCategoryPagesModal"
        :title="`Страницы в категории`"
        description="Список страниц в данной категории"
        size="lg"
        scrollable
        :dismissible="true"
        :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div v-if="modalCategoryData" class="space-y-6">
          <!-- Информация о категории -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
              </svg>
              <div class="min-w-0">
                <div class="text-sm font-medium text-blue-900 mb-1">Информация о категории</div>
                <div class="text-sm text-blue-700">
                  <B24Badge :class="getCategoryBadgeClass(modalCategoryData.category)">
                    {{ modalCategoryData.category || 'Без категории' }}
                  </B24Badge>
                </div>
                <div class="mt-2 text-sm text-blue-700">
                  <span class="font-semibold">Всего времени:</span> {{ formatDuration(modalCategoryData.totalTime) }} |
                  <span class="font-semibold">Сотрудников:</span> {{ modalCategoryData.employeeCount }} |
                  <span class="font-semibold">Страниц:</span> {{ modalCategoryData.pagesCount }}
                </div>
              </div>
            </div>
          </div>

          <!-- Таблица страниц -->
          <B24TableWrapper
              class="overflow-x-auto w-full border border-gray-200 rounded-lg"
              size="sm"
              zebra
              row-hover
          >
            <table class="min-w-full">
              <thead class="bg-gray-50">
              <tr>
                <th class="text-left font-medium text-gray-700">Страница</th>
                <th class="text-left font-medium text-gray-700">Время на странице</th>
                <th class="text-left font-medium text-gray-700">Доля от общего времени</th>
                <th class="text-left font-medium text-gray-700">Кол-во сотрудников</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="page in modalCategoryData.pages" :key="page.url" class="hover:bg-gray-50">
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
                <td class="text-sm font-medium">{{ formatDuration(page.time) }}</td>
                <td class="text-sm">
                  <div class="flex items-center space-x-2">
                    <span>{{ calculatePercentage(page.time, modalCategoryData.totalTime) }}%</span>
                    <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                          class="h-full bg-green-500 rounded-full"
                          :style="{ width: calculatePercentage(page.time, modalCategoryData.totalTime) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="text-sm">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ page.employeeCount }}
                    </span>
                </td>
              </tr>
              </tbody>
              <tfoot class="bg-gray-50 font-semibold">
              <tr>
                <td colspan="2" class="text-right">Итого:</td>
                <td>{{ formatDuration(modalCategoryData.totalTime) }}</td>
                <td>{{ modalCategoryData.pagesCount }} страниц</td>
              </tr>
              </tfoot>
            </table>
          </B24TableWrapper>
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
import * as XLSX from 'xlsx'
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
    this.processedData = ref([]) // Данные по страницам
    this.usersData = ref([]) // Данные по сотрудникам
    this.categoriesData = ref([]) // Данные по категориям
    this.filteredPages = ref([])
    this.filteredUsersData = ref([])
    this.filteredCategoriesData = ref([])
    this.userProfilesCache = ref({})
    this.categories = ref(categoriesData.categories)
    this.showAllEmployees = ref({})
    this.isLoadingProfile = ref(false)
    this.activeTab = ref('pages') // Активный таб: 'pages', 'users' или 'categories'
    this.historyDays = ref(30) // Количество дней истории для закрашивания дат

    // Сортировка для страниц
    this.sortColumn = ref('totalTime')
    this.sortDirection = ref('desc')

    // Сортировка для сотрудников
    this.usersSortColumn = ref('totalTime')
    this.usersSortDirection = ref('desc')

    // Сортировка для категорий
    this.categoriesSortColumn = ref('totalTime')
    this.categoriesSortDirection = ref('desc')

    // Пагинация для страниц
    this.currentPage = ref(1)
    this.itemsPerPage = ref(20)

    // Пагинация для сотрудников
    this.currentUserPage = ref(1)

    // Пагинация для категорий
    this.currentCategoryPage = ref(1)

    // Общая статистика по страницам
    this.totalStats = ref({
      totalTime: 0,
      totalEmployees: 0,
      totalVisits: 0,
      averageTimePerEmployee: 0,
      maxTime: 0,
      minTime: 0
    })

    // Общая статистика по сотрудникам
    this.usersTotalStats = ref({
      totalTime: 0,
      averageTimePerDay: 0,
      averageTimePerPage: 0,
      maxTime: 0,
      minTime: 0,
      totalUsers: 0
    })

    // Общая статистика по категориям
    this.categoriesTotalStats = ref({
      totalTime: 0,
      averageTimePerPerson: 0,
      maxTime: 0,
      minTime: 0,
      totalCategories: 0
    })

    // Модальные окна
    this.isShowEmployeesModal = ref(false)
    this.isShowCategoryEmployeesModal = ref(false)
    this.isShowCategoryPagesModal = ref(false)
    this.modalPageData = ref(null)
    this.modalCategoryData = ref(null)

    this.pageTrackingHistoryDays = 30

    // Календарь для диапазона
    const defaultHistoryDays = 30
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - defaultHistoryDays)

    this.selectedDateRange = ref({
      start: this.getCalendarDateFromString(this.formatDate(startDate)),
      end: this.getCalendarDateFromString(this.formatDate(today))
    })

    this.minCalendarDate = new CalendarDate(2020, 1, 1)
    this.maxCalendarDate = new CalendarDate(2030, 12, 31)
    this.isDateRangeActive = ref(false)
  }

  async updateDateRangeFromSettings() {
    try {
      const historyDays = await BX24.appOption.get('page_tracking_history_days')
      if (historyDays) {
        const days = parseInt(historyDays)
        if (!isNaN(days) && days >= 1) {
          this.pageTrackingHistoryDays = days
          this.historyDays.value = days
          const today = new Date()
          const startDate = new Date(today)
          startDate.setDate(today.getDate() - days)

          this.selectedDateRange.value = {
            start: this.getCalendarDateFromString(this.formatDate(startDate)),
            end: this.getCalendarDateFromString(this.formatDate(today))
          }
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек периода:', error)
    }
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
    if (!seconds && seconds !== 0) return '0 сек'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    const parts = []
    if (hours > 0) parts.push(`${hours} ч`)
    if (minutes > 0) parts.push(`${minutes} мин`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs} сек`)
    return parts.join(' ')
  }

  // Форматирование времени для Excel (в часах)
  formatDurationForExcel(seconds) {
    if (!seconds && seconds !== 0) return 0
    const hours = seconds / 3600
    return Math.round(hours * 100) / 100 // округляем до 2 знаков
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

  // Метод для определения недоступных дат (старше historyDays)
  isDateUnavailable(date) {
    const today = new Date()
    const selectedDate = date.toDate('UTC')
    const diffTime = today.getTime() - selectedDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > this.historyDays.value
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

    // Восстанавливаем диапазон из настроек (или значение по умолчанию)
    const today = new Date()
    let startDate = new Date(today)

    // Пытаемся получить значение из настроек (если уже загружено)
    const historyDays = this.pageTrackingHistoryDays || 30
    startDate.setDate(today.getDate() - historyDays)

    this.selectedDateRange.value = {
      start: this.getCalendarDateFromString(this.formatDate(startDate)),
      end: this.getCalendarDateFromString(this.formatDate(today))
    }

    this.isLoading.value = true
    this.loadAllData()
  }

  // Получение текущих данных для экспорта
  getCurrentData() {
    switch (this.activeTab.value) {
      case 'pages':
        return this.filteredPages.value
      case 'users':
        return this.filteredUsersData.value
      case 'categories':
        return this.filteredCategoriesData.value
      default:
        return []
    }
  }

  // Обработка смены таба
  onTabChange(newTab) {
    this.activeTab.value = newTab
    // Сбрасываем страницы пагинации при смене таба
    if (newTab === 'pages') {
      this.currentPage.value = 1
    } else if (newTab === 'users') {
      this.currentUserPage.value = 1
    } else if (newTab === 'categories') {
      this.currentCategoryPage.value = 1
    }
  }

  // Методы для сортировки страниц
  sortBy(column) {
    if (this.sortColumn.value === column) {
      this.sortDirection.value = this.sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortColumn.value = column
      this.sortDirection.value = 'desc'
    }
    this.applySorting()
  }

  applySorting() {
    const sorted = [...this.filteredPages.value]

    sorted.sort((a, b) => {
      let aVal = a[this.sortColumn.value]
      let bVal = b[this.sortColumn.value]

      if (typeof aVal === 'string') {
        const result = aVal.localeCompare(bVal, 'ru')
        return this.sortDirection.value === 'asc' ? result : -result
      }

      if (this.sortDirection.value === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    this.filteredPages.value = sorted
    this.currentPage.value = 1
  }

  // Методы для сортировки сотрудников
  sortUsersBy(column) {
    if (this.usersSortColumn.value === column) {
      this.usersSortDirection.value = this.usersSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      this.usersSortColumn.value = column
      this.usersSortDirection.value = 'desc'
    }
    this.applyUsersSorting()
  }

  applyUsersSorting() {
    const sorted = [...this.filteredUsersData.value]

    sorted.sort((a, b) => {
      let aVal = a[this.usersSortColumn.value]
      let bVal = b[this.usersSortColumn.value]

      if (typeof aVal === 'string') {
        const result = aVal.localeCompare(bVal, 'ru')
        return this.usersSortDirection.value === 'asc' ? result : -result
      }

      if (this.usersSortDirection.value === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    this.filteredUsersData.value = sorted
    this.currentUserPage.value = 1
  }

  // Методы для сортировки категорий
  sortCategoriesBy(column) {
    if (this.categoriesSortColumn.value === column) {
      this.categoriesSortDirection.value = this.categoriesSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      this.categoriesSortColumn.value = column
      this.categoriesSortDirection.value = 'desc'
    }
    this.applyCategoriesSorting()
  }

  applyCategoriesSorting() {
    const sorted = [...this.filteredCategoriesData.value]

    sorted.sort((a, b) => {
      let aVal = a[this.categoriesSortColumn.value]
      let bVal = b[this.categoriesSortColumn.value]

      if (typeof aVal === 'string') {
        const result = aVal.localeCompare(bVal, 'ru')
        return this.categoriesSortDirection.value === 'asc' ? result : -result
      }

      if (this.categoriesSortDirection.value === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    this.filteredCategoriesData.value = sorted
    this.currentCategoryPage.value = 1
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

  // Обработка данных для карты активности (по страницам)
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

      if (!pagesMap.has(url)) {
        pagesMap.set(url, {
          url,
          category,
          totalTime: 0,
          employees: new Map(),
          visits: 0,
          items: new Set(),
          maxTime: 0,
          minTime: Infinity
        })
      }

      const pageData = pagesMap.get(url)
      pageData.totalTime += time
      pageData.visits++
      pageData.items.add(item.ID)

      if (time > pageData.maxTime) pageData.maxTime = time
      if (time < pageData.minTime) pageData.minTime = time

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

    // Преобразуем в массив
    const result = []
    let totalTimeAll = 0
    let totalEmployeesAll = new Set()
    let totalVisitsAll = 0
    let globalMaxTime = 0
    let globalMinTime = Infinity

    pagesMap.forEach(pageData => {
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

      totalTimeAll += pageData.totalTime
      pageData.employees.forEach((_, userId) => totalEmployeesAll.add(userId))
      totalVisitsAll += pageData.visits
      if (pageData.maxTime > globalMaxTime) globalMaxTime = pageData.maxTime
      if (pageData.minTime < globalMinTime) globalMinTime = pageData.minTime
    })

    this.processedData.value = result
    this.filteredPages.value = [...result]

    this.sortBy('totalTime')

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

  // Обработка данных по сотрудникам
  processUsersData(items) {
    const filteredItems = this.filterItemsByDateRange(items)

    const usersMap = new Map() // userId -> данные пользователя
    const uniqueDates = new Set() // Уникальные даты для расчета среднего в день

    // Собираем уникальные даты
    filteredItems.forEach(item => {
      const dateStr = new Date(item.DATE_CREATE).toDateString()
      uniqueDates.add(dateStr)
    })

    const daysCount = uniqueDates.size || 1

    filteredItems.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const userId = parseInt(props.USER_ID) || 0
      const userName = props.USER_NAME || `Пользователь ${userId}`
      const time = parseInt(props.PAGE_TIME) || 0
      const category = props.PAGE_CATEGORY || 'Без категории'

      if (userId === 0) return

      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          userId,
          userName,
          totalTime: 0,
          visits: 0,
          categoriesCount: new Map(), // category -> количество посещений
          maxTime: 0,
          minTime: Infinity,
          items: new Set()
        })
      }

      const userData = usersMap.get(userId)
      userData.totalTime += time
      userData.visits++
      userData.items.add(item.ID)

      // Обновляем счетчик категорий
      const categoryCount = userData.categoriesCount.get(category) || 0
      userData.categoriesCount.set(category, categoryCount + 1)

      if (time > userData.maxTime) userData.maxTime = time
      if (time < userData.minTime) userData.minTime = time
    })

    // Преобразуем в массив
    const result = []
    let totalTimeAll = 0
    let totalMaxTime = 0
    let totalMinTime = Infinity
    let totalAverageTimePerPageSum = 0

    usersMap.forEach(userData => {
      if (userData.minTime === Infinity) userData.minTime = 0

      // Находим любимую категорию (с максимальным количеством посещений)
      let favoriteCategory = null
      let maxCount = 0
      userData.categoriesCount.forEach((count, category) => {
        if (count > maxCount) {
          maxCount = count
          favoriteCategory = category
        }
      })

      const userName = this.userProfilesCache.value[userData.userId]?.FULL_NAME || userData.userName

      const averageTimePerPage = userData.visits > 0
          ? Math.round(userData.totalTime / userData.visits)
          : 0

      const averageTimePerDay = Math.round(userData.totalTime / daysCount)

      const userInfo = {
        userId: userData.userId,
        userName,
        favoriteCategory,
        totalTime: userData.totalTime,
        averageTimePerDay,
        averageTimePerPage,
        maxTime: userData.maxTime,
        minTime: userData.minTime,
        visits: userData.visits
      }

      result.push(userInfo)

      totalTimeAll += userData.totalTime
      totalAverageTimePerPageSum += averageTimePerPage
      if (userData.maxTime > totalMaxTime) totalMaxTime = userData.maxTime
      if (userData.minTime < totalMinTime) totalMinTime = userData.minTime
    })

    this.usersData.value = result
    this.filteredUsersData.value = [...result]

    this.sortUsersBy('totalTime')

    this.usersTotalStats.value = {
      totalTime: totalTimeAll,
      averageTimePerDay: Math.round(totalTimeAll / daysCount),
      averageTimePerPage: result.length > 0
          ? Math.round(totalAverageTimePerPageSum / result.length)
          : 0,
      maxTime: totalMaxTime,
      minTime: totalMinTime !== Infinity ? totalMinTime : 0,
      totalUsers: result.length
    }
  }

  // Обработка данных по категориям
  processCategoriesData(items) {
    const filteredItems = this.filterItemsByDateRange(items)

    const categoriesMap = new Map() // category -> данные категории

    filteredItems.forEach(item => {
      const props = item.PROPERTY_VALUES || {}
      const category = props.PAGE_CATEGORY || 'Без категории'
      const time = parseInt(props.PAGE_TIME) || 0
      const userId = parseInt(props.USER_ID) || 0
      const url = props.PAGE_URL || ''

      if (userId === 0) return

      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, {
          category,
          totalTime: 0,
          employees: new Map(), // userId -> { time, visits }
          pages: new Map(), // url -> { time, employeeCount }
          maxTime: 0,
          minTime: Infinity,
          visits: 0
        })
      }

      const categoryData = categoriesMap.get(category)
      categoryData.totalTime += time
      categoryData.visits++

      if (time > categoryData.maxTime) categoryData.maxTime = time
      if (time < categoryData.minTime) categoryData.minTime = time

      // Обновляем данные по сотрудникам
      if (!categoryData.employees.has(userId)) {
        const userName = this.userProfilesCache.value[userId]?.FULL_NAME || props.USER_NAME || `Пользователь ${userId}`
        categoryData.employees.set(userId, {
          userId,
          userName,
          time: 0,
          visits: 0
        })
      }
      const employeeData = categoryData.employees.get(userId)
      employeeData.time += time
      employeeData.visits++

      // Обновляем данные по страницам
      if (!categoryData.pages.has(url)) {
        categoryData.pages.set(url, {
          url,
          time: 0,
          employeeCount: 0,
          employees: new Set()
        })
      }
      const pageData = categoryData.pages.get(url)
      pageData.time += time
      pageData.employees.add(userId)
      pageData.employeeCount = pageData.employees.size
    })

    // Преобразуем в массив
    const result = []
    let totalTimeAll = 0
    let totalMaxTime = 0
    let totalMinTime = Infinity
    let totalAverageTimePerPersonSum = 0

    categoriesMap.forEach(categoryData => {
      if (categoryData.minTime === Infinity) categoryData.minTime = 0

      const employeesArray = Array.from(categoryData.employees.values())
          .map(emp => ({
            ...emp,
            userName: this.userProfilesCache.value[emp.userId]?.FULL_NAME || emp.userName
          }))
          .sort((a, b) => b.time - a.time)

      const pagesArray = Array.from(categoryData.pages.values())
          .map(page => ({
            ...page,
            employees: Array.from(page.employees)
          }))
          .sort((a, b) => b.time - a.time)

      const averageTimePerPerson = categoryData.employees.size > 0
          ? Math.round(categoryData.totalTime / categoryData.employees.size)
          : 0

      const categoryInfo = {
        category: categoryData.category,
        totalTime: categoryData.totalTime,
        employeeCount: categoryData.employees.size,
        pagesCount: categoryData.pages.size,
        averageTimePerPerson,
        maxTime: categoryData.maxTime,
        minTime: categoryData.minTime,
        employees: employeesArray,
        pages: pagesArray,
        visits: categoryData.visits
      }

      result.push(categoryInfo)

      totalTimeAll += categoryData.totalTime
      totalAverageTimePerPersonSum += averageTimePerPerson
      if (categoryData.maxTime > totalMaxTime) totalMaxTime = categoryData.maxTime
      if (categoryData.minTime < totalMinTime) totalMinTime = categoryData.minTime
    })

    this.categoriesData.value = result
    this.filteredCategoriesData.value = [...result]

    this.sortCategoriesBy('totalTime')

    this.categoriesTotalStats.value = {
      totalTime: totalTimeAll,
      averageTimePerPerson: result.length > 0
          ? Math.round(totalAverageTimePerPersonSum / result.length)
          : 0,
      maxTime: totalMaxTime,
      minTime: totalMinTime !== Infinity ? totalMinTime : 0,
      totalCategories: result.length
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
        this.usersData.value = []
        this.filteredUsersData.value = []
        this.categoriesData.value = []
        this.filteredCategoriesData.value = []
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

      // Обрабатываем данные для всех представлений
      this.processActivityData(items)
      this.processUsersData(items)
      this.processCategoriesData(items)

      // Сбрасываем на первую страницу
      this.currentPage.value = 1
      this.currentUserPage.value = 1
      this.currentCategoryPage.value = 1

    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
      this.showNotification('error', 'Ошибка при загрузке данных')
    } finally {
      this.isLoading.value = false
    }
  }

  // Экспорт в XLS
  exportToXLS() {
    try {
      const currentData = this.getCurrentData()
      if (currentData.length === 0) {
        this.showNotification('warning', 'Нет данных для экспорта')
        return
      }

      let exportData = []
      let fileName = ''

      if (this.activeTab.value === 'pages') {
        // Экспорт данных по страницам
        exportData = this.filteredPages.value.map(page => ({
          'Страница': page.url,
          'Категория': page.category || 'Без категории',
          'Кол-во сотрудников': page.employeeCount,
          'Общее время (часы)': this.formatDurationForExcel(page.totalTime),
          'Среднее время (часы)': this.formatDurationForExcel(page.averageTime),
          'Максимальное время (часы)': this.formatDurationForExcel(page.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(page.minTime),
          'Общее время (текст)': this.formatDuration(page.totalTime),
          'Среднее время (текст)': this.formatDuration(page.averageTime),
          'Максимальное время (текст)': this.formatDuration(page.maxTime),
          'Минимальное время (текст)': this.formatDuration(page.minTime),
          'Кол-во посещений': page.visits
        }))

        // Добавляем итоговую строку
        exportData.push({
          'Страница': 'ИТОГО:',
          'Категория': '',
          'Кол-во сотрудников': this.totalStats.value.totalEmployees,
          'Общее время (часы)': this.formatDurationForExcel(this.totalStats.value.totalTime),
          'Среднее время (часы)': this.formatDurationForExcel(this.totalStats.value.averageTimePerEmployee),
          'Максимальное время (часы)': this.formatDurationForExcel(this.totalStats.value.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(this.totalStats.value.minTime),
          'Общее время (текст)': this.formatDuration(this.totalStats.value.totalTime),
          'Среднее время (текст)': this.formatDuration(this.totalStats.value.averageTimePerEmployee),
          'Максимальное время (текст)': this.formatDuration(this.totalStats.value.maxTime),
          'Минимальное время (текст)': this.formatDuration(this.totalStats.value.minTime),
          'Кол-во посещений': this.totalStats.value.totalVisits
        })

        fileName = `activity_map_pages_${this.formatDate(new Date())}.xlsx`

      } else if (this.activeTab.value === 'users') {
        // Экспорт данных по сотрудникам
        exportData = this.filteredUsersData.value.map(user => ({
          'Сотрудник': user.userName,
          'ID сотрудника': user.userId,
          'Любимая категория': user.favoriteCategory || 'Без категории',
          'Общее время (часы)': this.formatDurationForExcel(user.totalTime),
          'Среднее время в день (часы)': this.formatDurationForExcel(user.averageTimePerDay),
          'Среднее время на странице (часы)': this.formatDurationForExcel(user.averageTimePerPage),
          'Максимальное время (часы)': this.formatDurationForExcel(user.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(user.minTime),
          'Общее время (текст)': this.formatDuration(user.totalTime),
          'Среднее время в день (текст)': this.formatDuration(user.averageTimePerDay),
          'Среднее время на странице (текст)': this.formatDuration(user.averageTimePerPage),
          'Максимальное время (текст)': this.formatDuration(user.maxTime),
          'Минимальное время (текст)': this.formatDuration(user.minTime),
          'Кол-во посещений': user.visits
        }))

        // Добавляем итоговую строку
        exportData.push({
          'Сотрудник': 'ИТОГО:',
          'ID сотрудника': '',
          'Любимая категория': '',
          'Общее время (часы)': this.formatDurationForExcel(this.usersTotalStats.value.totalTime),
          'Среднее время в день (часы)': this.formatDurationForExcel(this.usersTotalStats.value.averageTimePerDay),
          'Среднее время на странице (часы)': this.formatDurationForExcel(this.usersTotalStats.value.averageTimePerPage),
          'Максимальное время (часы)': this.formatDurationForExcel(this.usersTotalStats.value.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(this.usersTotalStats.value.minTime),
          'Общее время (текст)': this.formatDuration(this.usersTotalStats.value.totalTime),
          'Среднее время в день (текст)': this.formatDuration(this.usersTotalStats.value.averageTimePerDay),
          'Среднее время на странице (текст)': this.formatDuration(this.usersTotalStats.value.averageTimePerPage),
          'Максимальное время (текст)': this.formatDuration(this.usersTotalStats.value.maxTime),
          'Минимальное время (текст)': this.formatDuration(this.usersTotalStats.value.minTime),
          'Кол-во посещений': this.filteredUsersData.value.reduce((sum, u) => sum + u.visits, 0)
        })

        fileName = `activity_map_users_${this.formatDate(new Date())}.xlsx`

      } else if (this.activeTab.value === 'categories') {
        // Экспорт данных по категориям
        exportData = this.filteredCategoriesData.value.map(category => ({
          'Категория': category.category || 'Без категории',
          'Кол-во сотрудников': category.employeeCount,
          'Кол-во страниц': category.pagesCount,
          'Общее время (часы)': this.formatDurationForExcel(category.totalTime),
          'Среднее время на человека (часы)': this.formatDurationForExcel(category.averageTimePerPerson),
          'Максимальное время (часы)': this.formatDurationForExcel(category.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(category.minTime),
          'Общее время (текст)': this.formatDuration(category.totalTime),
          'Среднее время на человека (текст)': this.formatDuration(category.averageTimePerPerson),
          'Максимальное время (текст)': this.formatDuration(category.maxTime),
          'Минимальное время (текст)': this.formatDuration(category.minTime),
          'Кол-во посещений': category.visits
        }))

        // Добавляем итоговую строку
        exportData.push({
          'Категория': 'ИТОГО:',
          'Кол-во сотрудников': '',
          'Кол-во страниц': '',
          'Общее время (часы)': this.formatDurationForExcel(this.categoriesTotalStats.value.totalTime),
          'Среднее время на человека (часы)': this.formatDurationForExcel(this.categoriesTotalStats.value.averageTimePerPerson),
          'Максимальное время (часы)': this.formatDurationForExcel(this.categoriesTotalStats.value.maxTime),
          'Минимальное время (часы)': this.formatDurationForExcel(this.categoriesTotalStats.value.minTime),
          'Общее время (текст)': this.formatDuration(this.categoriesTotalStats.value.totalTime),
          'Среднее время на человека (текст)': this.formatDuration(this.categoriesTotalStats.value.averageTimePerPerson),
          'Максимальное время (текст)': this.formatDuration(this.categoriesTotalStats.value.maxTime),
          'Минимальное время (текст)': this.formatDuration(this.categoriesTotalStats.value.minTime),
          'Кол-во посещений': this.filteredCategoriesData.value.reduce((sum, c) => sum + c.visits, 0)
        })

        fileName = `activity_map_categories_${this.formatDate(new Date())}.xlsx`
      }

      // Создаем рабочую книгу
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Настраиваем ширину колонок
      const colWidths = Object.keys(exportData[0] || {}).map(() => ({ wch: 25 }))
      ws['!cols'] = colWidths

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(wb, ws, this.getTabLabel())

      // Сохраняем файл
      XLSX.writeFile(wb, fileName)

      this.showNotification('success', 'Данные успешно экспортированы')
    } catch (error) {
      console.error('Ошибка при экспорте в XLS:', error)
      this.showNotification('error', 'Ошибка при экспорте данных')
    }
  }

  // Получение названия текущего таба для экспорта
  getTabLabel() {
    switch (this.activeTab.value) {
      case 'pages':
        return 'По страницам'
      case 'users':
        return 'По сотрудникам'
      case 'categories':
        return 'По категориям'
      default:
        return 'Карта активности'
    }
  }

  // Показать модальное окно с сотрудниками на странице
  showEmployeesModal(pageData) {
    this.modalPageData.value = pageData
    this.isShowEmployeesModal.value = true
  }

  // Показать модальное окно с сотрудниками в категории
  showCategoryEmployeesModal(categoryData) {
    this.modalCategoryData.value = categoryData
    this.isShowCategoryEmployeesModal.value = true
  }

  // Показать модальное окно со страницами в категории
  showCategoryPagesModal(categoryData) {
    this.modalCategoryData.value = categoryData
    this.isShowCategoryPagesModal.value = true
  }

  // Закрыть модальное окно сотрудников на странице
  closeEmployeesModal() {
    this.isShowEmployeesModal.value = false
    this.modalPageData.value = null
  }

  // Закрыть модальное окно сотрудников в категории
  closeCategoryEmployeesModal() {
    this.isShowCategoryEmployeesModal.value = false
    this.modalCategoryData.value = null
  }

  // Закрыть модальное окно страниц в категории
  closeCategoryPagesModal() {
    this.isShowCategoryPagesModal.value = false
    this.modalCategoryData.value = null
  }

  async initialize() {
    try {
      await this.loadAllData()
      await this.updateDateRangeFromSettings()
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
    const usersData = computed(() => activityMapManager.usersData.value)
    const filteredUsersData = computed(() => activityMapManager.filteredUsersData.value)
    const categoriesData = computed(() => activityMapManager.categoriesData.value)
    const filteredCategoriesData = computed(() => activityMapManager.filteredCategoriesData.value)
    const totalStats = computed(() => activityMapManager.totalStats.value)
    const usersTotalStats = computed(() => activityMapManager.usersTotalStats.value)
    const categoriesTotalStats = computed(() => activityMapManager.categoriesTotalStats.value)

    // Пагинированные данные по страницам
    const paginatedPages = computed(() => {
      const start = (activityMapManager.currentPage.value - 1) * activityMapManager.itemsPerPage.value
      const end = start + activityMapManager.itemsPerPage.value
      return filteredPages.value.slice(start, end)
    })

    // Пагинированные данные по сотрудникам
    const paginatedUsers = computed(() => {
      const start = (activityMapManager.currentUserPage.value - 1) * activityMapManager.itemsPerPage.value
      const end = start + activityMapManager.itemsPerPage.value
      return filteredUsersData.value.slice(start, end)
    })

    // Пагинированные данные по категориям
    const paginatedCategories = computed(() => {
      const start = (activityMapManager.currentCategoryPage.value - 1) * activityMapManager.itemsPerPage.value
      const end = start + activityMapManager.itemsPerPage.value
      return filteredCategoriesData.value.slice(start, end)
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
      usersData,
      filteredUsersData,
      categoriesData,
      filteredCategoriesData,
      showAllEmployees: activityMapManager.showAllEmployees,
      totalStats,
      usersTotalStats,
      categoriesTotalStats,
      currentPage: activityMapManager.currentPage,
      currentUserPage: activityMapManager.currentUserPage,
      currentCategoryPage: activityMapManager.currentCategoryPage,
      itemsPerPage: activityMapManager.itemsPerPage,
      paginatedPages,
      paginatedUsers,
      paginatedCategories,

      // Сортировка для страниц
      sortColumn: activityMapManager.sortColumn,
      sortDirection: activityMapManager.sortDirection,

      // Сортировка для сотрудников
      usersSortColumn: activityMapManager.usersSortColumn,
      usersSortDirection: activityMapManager.usersSortDirection,

      // Сортировка для категорий
      categoriesSortColumn: activityMapManager.categoriesSortColumn,
      categoriesSortDirection: activityMapManager.categoriesSortDirection,

      // Календарь и диапазон
      selectedDateRange: activityMapManager.selectedDateRange,
      minCalendarDate: activityMapManager.minCalendarDate,
      maxCalendarDate: activityMapManager.maxCalendarDate,

      // Модальные окна
      isShowEmployeesModal: activityMapManager.isShowEmployeesModal,
      isShowCategoryEmployeesModal: activityMapManager.isShowCategoryEmployeesModal,
      isShowCategoryPagesModal: activityMapManager.isShowCategoryPagesModal,
      modalPageData: activityMapManager.modalPageData,
      modalCategoryData: activityMapManager.modalCategoryData,

      // Табы
      activeTab: activityMapManager.activeTab,

      // Методы
      loadAllData: activityMapManager.loadAllData.bind(activityMapManager),
      sortBy: activityMapManager.sortBy.bind(activityMapManager),
      sortUsersBy: activityMapManager.sortUsersBy.bind(activityMapManager),
      sortCategoriesBy: activityMapManager.sortCategoriesBy.bind(activityMapManager),
      exportToXLS: activityMapManager.exportToXLS.bind(activityMapManager),
      showEmployeesModal: activityMapManager.showEmployeesModal.bind(activityMapManager),
      showCategoryEmployeesModal: activityMapManager.showCategoryEmployeesModal.bind(activityMapManager),
      showCategoryPagesModal: activityMapManager.showCategoryPagesModal.bind(activityMapManager),
      closeEmployeesModal: activityMapManager.closeEmployeesModal.bind(activityMapManager),
      closeCategoryEmployeesModal: activityMapManager.closeCategoryEmployeesModal.bind(activityMapManager),
      closeCategoryPagesModal: activityMapManager.closeCategoryPagesModal.bind(activityMapManager),
      onTabChange: activityMapManager.onTabChange.bind(activityMapManager),
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
      isDateDisabled: activityMapManager.isDateDisabled.bind(activityMapManager),
      isDateUnavailable: activityMapManager.isDateUnavailable.bind(activityMapManager)
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
  user-select: none;
}

td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

/* Стили для заголовков с сортировкой */
th.cursor-pointer {
  transition: background-color 0.2s ease;
}

th.cursor-pointer:hover {
  background-color: #f3f4f6;
}

/* Стили для бейджей категорий */
:deep(.B24Badge) {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стили для кликабельного счетчика сотрудников и страниц */
button.inline-flex {
  cursor: pointer;
  transition: all 0.2s ease;
}

button.inline-flex:hover {
  transform: scale(1.05);
}

/* Стили для прогресс-бара в модальном окне */
.bg-blue-500, .bg-green-500 {
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