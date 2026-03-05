<template>
  <div class="p-6">
    <B24PageHeader
        title="Отчет о деятельности"
        description="Форма для предоставления отчета о текущей деятельности"
    />

    <!-- Заглушка для мобильных устройств -->
    <div v-if="isMobileDevice" class="mt-8">
      <B24Card>
        <div class="p-6 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Отчет доступен только с компьютера
          </h3>
          <p class="text-gray-500 mb-4">
            Заполнение отчета о деятельности возможно только с настольного компьютера
          </p>
          <B24Button @click="closeApp" color="air-primary">
            Закрыть
          </B24Button>
        </div>
      </B24Card>
    </div>

    <!-- Основной контент (только для десктопа) -->
    <div v-else class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Основная часть с формой отчета -->
      <div class="lg:col-span-2">
        <B24Card>
          <div class="p-6">
            <!-- Прелоадер во время загрузки -->
            <div v-if="isLoading" class="text-center py-12">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Загрузка данных отчета</h3>
              <p class="text-gray-500">Пожалуйста, подождите...</p>
            </div>

            <!-- Контент после загрузки -->
            <div v-else class="space-y-6">
              <!-- Заголовок -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Отчет о деятельности</h3>
                <p class="text-sm text-gray-500">Заполните отчет о том, чем Вы занимаетесь в данный момент</p>
              </div>

              <!-- Информация о запросе -->
              <div v-if="reportRequestInfo" class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="flex-1">
                    <div class="text-sm text-blue-700">
                      <div>Запрос от: <span class="font-semibold">{{ reportRequestInfo.requesterName }}</span></div>
                      <div>Время запроса: <span class="font-semibold">{{ formatDateTime(reportRequestInfo.requestTime) }}</span></div>
                      <div v-if="!isTimeExpired" class="mt-1">
                        Оставшееся время: <span class="font-semibold">{{ formatTime(timeRemaining) }}</span>
                      </div>
                      <div v-else class="mt-1 text-red-600 font-semibold">Время на отправку отчета истекло</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Заглушка при истечении времени -->
              <div v-if="isTimeExpired" class="text-center py-8">
                <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Время на заполнение отчета истекло</h3>
                <p class="text-gray-500 mb-4">К сожалению, вы не успели заполнить отчет в установленный срок</p>
                <B24Button @click="closeApp" color="air-primary">Закрыть</B24Button>
              </div>

              <!-- Форма отчета -->
              <div v-else>
                <!-- Таймер -->
                <div v-if="timeRemaining > 0" class="text-center">
                  <div class="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700">
                      Осталось времени: {{ formatTime(timeRemaining) }}
                    </span>
                  </div>
                </div>

                <!-- Форма отчета -->
                <B24Form
                    ref="reportFormRef"
                    :state="reportFormData"
                    :validate="validateReportForm"
                    class="space-y-6"
                    @submit="submitReport"
                >
                  <!-- Текущая задача -->
                  <B24FormField label="Над чем Вы сейчас работаете?" name="currentTask" required>
                    <B24Textarea
                        v-model="reportFormData.currentTask"
                        rows="3"
                        placeholder="Опишите текущую задачу, над которой Вы работаете..."
                        required
                        class="w-full"
                    />
                    <template #description>
                      <span class="text-xs text-gray-500">Кратко опишите задачу, которую выполняете в данный момент</span>
                    </template>
                  </B24FormField>

                  <!-- Выбор задачи -->
                  <B24FormField label="Привязать к задаче" name="taskId">
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <B24Button type="button" @click="openTaskSelector" color="air-tertiary" size="sm">
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                          Выбрать задачу
                        </B24Button>
                        <B24Button
                            v-if="selectedTask"
                            type="button"
                            @click="clearSelectedTask"
                            color="air-tertiary"
                            size="sm"
                            variant="ghost"
                        >
                          Очистить
                        </B24Button>
                      </div>

                      <!-- Выбранная задача -->
                      <div v-if="selectedTask" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                              <span class="font-medium text-gray-900">{{ selectedTask.title }}</span>
                              <B24Badge
                                  size="sm"
                                  :class="getTaskStatusClass(selectedTask.status)"
                              >
                                {{ getTaskStatusText(selectedTask.status) }}
                              </B24Badge>
                              <B24Badge
                                  v-if="selectedTask.priority === '3'"
                                  size="sm"
                                  color="air-primary-alert"
                              >
                                Высокий
                              </B24Badge>
                            </div>
                            <div class="text-sm text-gray-600">
                              <div class="flex items-center space-x-4">
                                <div class="flex items-center">
                                  <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                  </svg>
                                  <span>Исполнитель: {{ selectedTask.responsible?.name || 'Не указан' }}</span>
                                </div>
                                <div v-if="selectedTask.auditors?.length > 0" class="flex items-center">
                                  <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                  <span>Наблюдатели: {{ selectedTask.auditors?.length || 0 }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <a
                              :href="getTaskUrl(selectedTask.id)"
                              target="_blank"
                              class="ml-4 text-blue-600 hover:text-blue-800"
                              title="Открыть задачу"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <template #description>
                      <span class="text-xs text-gray-500">Выберите задачу для прикрепления отчета (необязательно)</span>
                    </template>
                  </B24FormField>

                  <!-- Прогресс -->
                  <B24FormField label="Какой прогресс по задаче?" name="progress">
                    <B24Textarea
                        v-model="reportFormData.progress"
                        rows="3"
                        placeholder="Опишите, что уже сделано и что планируете сделать..."
                        class="w-full"
                    />
                    <template #description>
                      <span class="text-xs text-gray-500">Укажите процент выполнения или конкретные результаты</span>
                    </template>
                  </B24FormField>

                  <!-- Проблемы -->
                  <B24FormField label="Есть ли проблемы или блокеры?" name="problems">
                    <B24Textarea
                        v-model="reportFormData.problems"
                        rows="3"
                        placeholder="Если есть проблемы, опишите их и что нужно для решения..."
                        class="w-full"
                    />
                    <template #description>
                      <span class="text-xs text-gray-500">Укажите, что мешает работе и требуется ли помощь</span>
                    </template>
                  </B24FormField>

                  <!-- Следующие шаги -->
                  <B24FormField label="Какие следующие шаги?" name="nextSteps">
                    <B24Textarea
                        v-model="reportFormData.nextSteps"
                        rows="3"
                        placeholder="Опишите планы на ближайшее время..."
                        class="w-full"
                    />
                    <template #description>
                      <span class="text-xs text-gray-500">Что планируете делать дальше и когда ожидаете завершение</span>
                    </template>
                  </B24FormField>

                  <!-- Дополнительные комментарии -->
                  <B24FormField label="Дополнительные комментарии" name="comments">
                    <B24Textarea
                        v-model="reportFormData.comments"
                        rows="3"
                        placeholder="Любая дополнительная информация..."
                        class="w-full"
                    />
                  </B24FormField>

                  <!-- Кнопки отправки -->
                  <div class="pt-4 border-t border-gray-200">
                    <div class="flex justify-end space-x-3">
                      <B24Button type="button" @click="closeApp" color="air-tertiary" :disabled="isSubmitting">
                        Отмена
                      </B24Button>
                      <B24Button type="submit" :disabled="isSubmitting" color="air-primary">
                        <span v-if="isSubmitting">
                          <svg class="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                          Отправка...
                        </span>
                        <span v-else>Отправить отчет</span>
                      </B24Button>
                    </div>
                  </div>
                </B24Form>
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

    <!-- Модальное окно выбора задачи -->
    <B24Modal
        v-model:open="isShowTaskSelectorModal"
        title="Выбор задачи"
        description="Выберите задачу для прикрепления отчета"
        scrollable
        :ui="{ footer: 'justify-end' }"
        size="lg"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Поиск и фильтры -->
          <div>
            <div class="flex space-x-4">
              <div class="flex-1">
                <B24Input
                    v-model="taskFilter.search"
                    placeholder="Поиск по названию задачи..."
                    @input="filterTasks"
                />
              </div>
              <div>
                <B24Select
                    v-model="taskFilter.status"
                    :items="taskStatusOptions"
                    placeholder="Все статусы"
                    @update:modelValue="filterTasks"
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
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="font-medium text-gray-900">{{ task.title }}</span>
                    </div>

                    <div class="text-gray-500 mb-2">
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

                    <div class="text-xs text-gray-600">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                          <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span>Исполнитель: {{ task.responsible?.name || 'Не указан' }}</span>
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

                  <div class="ml-4">
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
          <div v-if="filteredTasks.length > 0" class="mt-6 flex items-center justify-between">
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
        <B24Button @click="close" color="air-tertiary">Отмена</B24Button>
        <B24Button
            @click="confirmTaskSelection"
            :disabled="!selectedTask"
            color="air-primary"
        >
          Выбрать
        </B24Button>
      </template>
    </B24Modal>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'
import Sidebar from './Sidebar.vue'

// Константы для статусов задач
const TASK_STATUS_MAP = {
  '2': { text: 'Ждет выполнения', class: 'bg-yellow-100 text-yellow-800' },
  '3': { text: 'Выполняется', class: 'bg-blue-100 text-blue-800' },
  '4': { text: 'Ожидает контроля', class: 'bg-purple-100 text-purple-800' },
  '5': { text: 'Завершена', class: 'bg-green-100 text-green-800' },
  '6': { text: 'Отложена', class: 'bg-gray-100 text-gray-800' }
}

export default {
  name: 'ActivityReport',

  components: {
    Sidebar
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    // Реактивные переменные
    const reportFormRef = ref(null)
    const reportFormData = ref({
      currentTask: '',
      progress: '',
      problems: '',
      nextSteps: '',
      comments: '',
      taskId: null
    })

    const isSubmitting = ref(false)
    const timeRemaining = ref(0)
    const timerInterval = ref(null)
    const reportRequestInfo = ref(null)
    const isTimeExpired = ref(false)
    const isMobileDevice = ref(false)
    const currentUserProfile = ref(null)
    const selectedTask = ref(null)
    const isShowTaskSelectorModal = ref(false)
    const isLoading = ref(true) // Новый флаг для прелоадера

    // Переменные для работы с задачами
    const allUserTasks = ref([])
    const filteredTasks = ref([])
    const isLoadingTasks = ref(false)
    const taskFilter = ref({ search: '', status: '' })
    const currentTaskPage = ref(1)
    const tasksPerPage = ref(25)

    const taskStatusOptions = [
      { label: 'Все статусы', value: '' },
      { label: 'Ждет выполнения', value: '2' },
      { label: 'Выполняется', value: '3' },
      { label: 'Ожидает контроля', value: '4' },
      { label: 'Завершена', value: '5' },
      { label: 'Отложена', value: '6' }
    ]

    // Проверка на мобильное устройство
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    }

    // Расшифровка параметров из URL
    const decodeParameters = () => {
      try {
        const encodedParams = window.bitrixData?.placementOptions
        if (!encodedParams) return null

        const decodedString = JSON.parse(encodedParams)
        const params = JSON.parse(decodedString.parameters)

        return {
          requestTime: new Date(params.timestamp),
          requesterId: parseInt(params.requesterId),
          userId: parseInt(params.userId)
        }
      } catch {
        return null
      }
    }

    // Инициализация таймера
    const initializeTimer = (requestTime, reactionTimeSeconds) => {
      const timeDiff = (Date.now() - new Date(requestTime)) / 1000

      if (timeDiff >= reactionTimeSeconds) {
        isTimeExpired.value = true
        return
      }

      timeRemaining.value = Math.max(0, Math.floor(reactionTimeSeconds - timeDiff))
      timerInterval.value = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--
        } else {
          isTimeExpired.value = true
          clearInterval(timerInterval.value)
        }
      }, 1000)
    }

    // Форматирование времени
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Валидация формы
    const validateReportForm = (state) => {
      const errors = []
      if (!state.currentTask?.trim()) {
        errors.push({ name: 'currentTask', message: 'Поле обязательно для заполнения' })
      }
      return errors
    }

    // Загрузка профиля пользователя
    const loadUserProfile = async (userId) => {
      return new Promise((resolve) => {
        BX24.callBatch({
          user: [
            'user.get',
            {
              FILTER: { 'ID': userId },
              SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME']
            }
          ]
        }, (result) => {
          const users = result.user.error() ? [] : result.user.data()
          const userData = users[0] || { ID: userId, NAME: 'Пользователь' }
          userData.FULL_NAME = [userData.NAME, userData.LAST_NAME, userData.SECOND_NAME]
              .filter(Boolean)
              .join(' ') || `Пользователь ${userId}`
          resolve(userData)
        }, true)
      })
    }

    // Получение настроек приложения
    const getAppSettings = async () => {
      return {
        employeeReactionTime: BX24?.appOption?.get?.('employee_reaction_time') || 300,
        responseMethod: BX24?.appOption?.get?.('response_method') || 'chat'
      }
    }

    // Функции для работы со статусами задач
    const getTaskStatusClass = (status) => {
      return TASK_STATUS_MAP[status]?.class || 'bg-gray-100 text-gray-800'
    }

    const getTaskStatusText = (status) => {
      return TASK_STATUS_MAP[status]?.text || 'Неизвестно'
    }

    const getTaskUrl = (taskId) => {
      if (!taskId || !currentUserProfile.value) return '#'
      const domain = BX24.getDomain();
      return `https://${domain}/company/personal/user/${currentUserProfile.value.ID}/tasks/task/view/${taskId}/`
    }

    // Загрузка задач пользователя
    const loadUserTasks = async () => {
      if (isLoadingTasks.value || !currentUserProfile.value) return

      try {
        isLoadingTasks.value = true
        allUserTasks.value = []

        const loadTasksBatch = (page) => {
          return new Promise((resolve, reject) => {
            BX24.callBatch({
              tasks: [
                'task.item.list',
                [
                  { 'ID': 'desc' },
                  { 'RESPONSIBLE_ID': currentUserProfile.value.ID },
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
                reject(result.tasks.error())
              } else {
                resolve(result.tasks.data())
              }
            }, true)
          })
        }

        let allTasks = []
        let page = 1
        let hasMore = true
        const MAX_TASKS = 200

        while (hasMore && allTasks.length < MAX_TASKS) {
          const data = await loadTasksBatch(page)

          if (!data || data.length === 0) {
            hasMore = false
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
                  name: getUserNameById(task.RESPONSIBLE_ID)
                },
                accomplices: task.ACCOMPLICES || [],
                auditors: task.AUDITORS || [],
                priority: task.PRIORITY || '2'
              })
            })

            if (data.length < 50) {
              hasMore = false
            } else {
              page++
            }
          }
        }

        allUserTasks.value = allTasks
        filterTasks()

      } catch (error) {
        console.error('Error loading tasks:', error)
        toast.add({
          description: 'Ошибка при загрузке задач',
          variant: 'error'
        })
      } finally {
        isLoadingTasks.value = false
      }
    }

    const getUserNameById = (userId) => {
      if (currentUserProfile.value && currentUserProfile.value.ID == userId) {
        return currentUserProfile.value.FULL_NAME
      }
      return `Пользователь ${userId}`
    }

    // Фильтрация задач
    const filterTasks = () => {
      if (allUserTasks.value.length === 0) {
        filteredTasks.value = []
        return
      }

      const search = taskFilter.value.search.toLowerCase().trim()
      const status = taskFilter.value.status

      if (!search && !status) {
        filteredTasks.value = [...allUserTasks.value]
      } else {
        filteredTasks.value = allUserTasks.value.filter(task => {
          const matchesSearch = !search ||
              task.title.toLowerCase().includes(search) ||
              (task.description && task.description.toLowerCase().includes(search))

          const matchesStatus = !status || task.status === status

          return matchesSearch && matchesStatus
        })
      }

      currentTaskPage.value = 1
    }

    // Вычисляемые свойство для пагинированных задач
    const paginatedTasks = computed(() => {
      const startIndex = (currentTaskPage.value - 1) * tasksPerPage.value
      const endIndex = startIndex + tasksPerPage.value
      return filteredTasks.value.slice(startIndex, endIndex)
    })

    // Методы для работы с задачами
    const openTaskSelector = async () => {
      isShowTaskSelectorModal.value = true
      await loadUserTasks()
    }

    const selectTask = (task) => {
      selectedTask.value = task
    }

    const confirmTaskSelection = () => {
      if (selectedTask.value) {
        reportFormData.value.taskId = selectedTask.value.id
        isShowTaskSelectorModal.value = false
      }
    }

    const clearSelectedTask = () => {
      selectedTask.value = null
      reportFormData.value.taskId = null
    }

    // Формирование сообщения для отправки
    const createStructuredMessage = () => {
      const fullMessage = `[SIZE=16][B]📋 Отчет о деятельности[/B][/SIZE]\n\n`
          + `👤 [B]Сотрудник:[/B] ${currentUserProfile.value?.FULL_NAME || 'Неизвестно'}\n`
          + `📅 [B]Время отправки:[/B] ${new Date().toLocaleString('ru-RU')}\n\n`
          + `[B]📌 Текущая задача:[/B]\n${reportFormData.value.currentTask}\n\n`
          + (reportFormData.value.progress ? `[B]📊 Прогресс:[/B]\n${reportFormData.value.progress}\n\n` : '')
          + (reportFormData.value.problems ? `[B]⚠️ Проблемы/Блокеры:[/B]\n${reportFormData.value.problems}\n\n` : '')
          + (reportFormData.value.nextSteps ? `[B]➡️ Следующие шаги:[/B]\n${reportFormData.value.nextSteps}\n\n` : '')
          + (reportFormData.value.comments ? `[B]💭 Комментарии:[/B]\n${reportFormData.value.comments}\n\n` : '')
          + (selectedTask.value ? createTaskAttachment() : '')
          + `────────────────────\n`
          + `[SIZE=12][COLOR=#666666]Отчет сформирован автоматически[/COLOR][/SIZE]`

      return {
        shortMessage: `📋 Отчет о деятельности от ${currentUserProfile.value?.FULL_NAME || 'Сотрудника'}`,
        detailedMessage: fullMessage,
        attach: [{ MESSAGE: fullMessage, COLOR_TOKEN: "primary" }]
      }
    }

    const createTaskAttachment = () => {
      const task = selectedTask.value
      const taskUrl = getTaskUrl(task.id)
      const priorityInfo = getTaskPriorityInfo(task.priority)

      return `[B]📎 Прикрепленная задача[/B]\n\n`
          + `[B]🔗 Задача:[/B] [URL=${taskUrl}]${task.title}[/URL]\n`
          + `[B]📊 Статус:[/B] ${getTaskStatusText(task.status)}\n`
          + `[B]🎯 Приоритет:[/B] [COLOR=${priorityInfo.color}]${priorityInfo.text}[/COLOR]\n`
          + `[B]👨‍💻 Исполнитель:[/B] ${task.responsible?.name || 'Не указан'}\n\n`
    }

    const getTaskPriorityInfo = (priority) => {
      const priorityMap = {
        '1': { text: 'Низкий', color: '#00B050' },
        '2': { text: 'Средний', color: '#FFC000' },
        '3': { text: 'Высокий', color: '#FF0000' }
      }
      return priorityMap[priority] || priorityMap['2']
    }

    // Отправка отчета
    const submitReport = async () => {
      if (isTimeExpired.value) {
        toast.add({ description: 'Время на отправку отчета истекло', variant: 'error' })
        return
      }

      try {
        isSubmitting.value = true
        const { shortMessage, attach } = createStructuredMessage()
        const settings = await getAppSettings()
        const params = decodeParameters()
        const requesterId = params?.requesterId

        const sendPromises = []

        if (['chat', 'all'].includes(settings.responseMethod)) {
          sendPromises.push(sendChatMessage(requesterId, '', attach))
        }

        if (['push', 'all'].includes(settings.responseMethod)) {
          sendPromises.push(sendPushNotification(requesterId, shortMessage, attach))
        }

        await Promise.all(sendPromises)

        toast.add({ description: 'Отчет успешно отправлен!', variant: 'success' })
        setTimeout(closeApp, 2000)

      } catch (error) {
        console.error('Ошибка отправки отчета:', error)
        toast.add({ description: 'Ошибка при отправке отчета', variant: 'error' })
      } finally {
        isSubmitting.value = false
      }
    }

    // Отправка сообщения в чат
    const sendChatMessage = (userId, message, attach) => {
      return new Promise((resolve, reject) => {
        BX24.callBatch({
          message: [
            'im.message.add',
            {
              DIALOG_ID: userId.toString(),
              MESSAGE: message,
              ATTACH: attach,
              SYSTEM: 'N'
            }
          ]
        }, (result) => {
          result.message.error() ? reject(result.message.error()) : resolve(result.message.data())
        }, true)
      })
    }

    // Отправка push-уведомления
    const sendPushNotification = (userId, title, attach) => {
      return new Promise((resolve, reject) => {
        BX24.callBatch({
          notification: [
            'im.notify.personal.add',
            {
              USER_ID: userId,
              MESSAGE: title,
              ATTACH: attach,
              TAG: `ACTIVITY_REPORT_${Date.now()}`,
              PARAMS: {
                REPORT_TYPE: 'activity',
                SENDER_ID: currentUserProfile.value?.ID,
                SENDER_NAME: currentUserProfile.value?.FULL_NAME
              }
            }
          ]
        }, (result) => {
          result.notification.error() ? reject(result.notification.error()) : resolve(result.notification.data())
        }, true)
      })
    }

    // Закрытие приложения
    const closeApp = () => {
      BX24?.closeApplication?.() || router.push('/time-list')
    }

    // Инициализация компонента
    const initializeComponent = async () => {
      isLoading.value = true // Включаем прелоадер

      try {
        checkMobileDevice()
        if (isMobileDevice.value) {
          isLoading.value = false
          return
        }

        // Загружаем текущего пользователя
        if (BX24?.callBatch) {
          const result = await new Promise((resolve) => {
            BX24.callBatch({
              current_user: ['user.current', {}]
            }, (result) => {
              const userData = result.current_user.error() ? {} : result.current_user.data()
              userData.FULL_NAME = [userData.NAME, userData.LAST_NAME, userData.SECOND_NAME]
                  .filter(Boolean)
                  .join(' ') || `Пользователь ${userData.ID}`
              currentUserProfile.value = userData
              resolve(userData)
            }, true)
          })
        }

        const params = decodeParameters()
        if (!params) {
          toast.add({ description: 'Неверные параметры запроса', variant: 'error' })
          isLoading.value = false
          return
        }

        const settings = await getAppSettings()
        const reactionTime = parseInt(settings.employeeReactionTime) || 300

        // Загружаем информацию о запросе
        const requesterProfile = await loadUserProfile(params.requesterId)
        reportRequestInfo.value = {
          requesterName: requesterProfile.FULL_NAME,
          requestTime: params.requestTime
        }

        // Проверяем время
        const timeDiff = (Date.now() - new Date(params.requestTime)) / 1000
        if (timeDiff >= reactionTime) {
          isTimeExpired.value = true
          toast.add({ description: 'Время на отправку отчета истекло', variant: 'warning' })
        } else {
          // Инициализируем таймер
          initializeTimer(params.requestTime, reactionTime)
        }

      } catch (error) {
        console.error('Ошибка инициализации:', error)
        toast.add({ description: 'Ошибка при загрузке данных', variant: 'error' })
      } finally {
        isLoading.value = false // Выключаем прелоадер
      }
    }

    // Хуки жизненного цикла
    onMounted(() => {
      if (typeof BX24 !== 'undefined') {
        BX24.init ? BX24.init(initializeComponent) : initializeComponent()
      } else {
        initializeComponent()
      }
    })

    onUnmounted(() => {
      clearInterval(timerInterval.value)
    })

    return {
      reportFormRef,
      reportFormData,
      isSubmitting,
      timeRemaining,
      reportRequestInfo,
      isTimeExpired,
      isMobileDevice,
      currentUserProfile,
      selectedTask,
      isShowTaskSelectorModal,
      paginatedTasks,
      isLoadingTasks,
      taskFilter,
      currentTaskPage,
      tasksPerPage,
      taskStatusOptions,
      filteredTasks,
      isLoading, // Экспортируем флаг загрузки
      validateReportForm,
      formatTime,
      formatDateTime,
      submitReport,
      openTaskSelector,
      selectTask,
      confirmTaskSelection,
      clearSelectedTask,
      filterTasks,
      getTaskStatusClass,
      getTaskStatusText,
      getTaskUrl,
      closeApp
    }
  }
}
</script>