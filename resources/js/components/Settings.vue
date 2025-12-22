<template>
  <div class="p-6">
    <B24PageHeader
        title="Настройки приложения"
        description="Настройте параметры работы вашего приложения"
    />

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Основная часть с настройками -->
      <div class="lg:col-span-2">
        <!-- Карточка калькулятора в чате -->
        <B24Card class="mb-6">
          <div class="p-6">
            <div class="space-y-6">
              <!-- Основной переключатель -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    Калькулятор в чате
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Включите эту опцию, чтобы добавить калькулятор в чаты
                  </p>
                </div>
                <div class="ml-4">
                  <!-- Индикатор загрузки при проверке статуса -->
                  <div v-if="isLoadingChatPlacements" class="flex items-center justify-center w-10">
                    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <B24Switch
                      v-else
                      v-model="settings.chatCalculatorEnabled"
                      @update:modelValue="toggleChatCalculator"
                      :disabled="isSaving || isProcessingChat"
                  />
                </div>
              </div>

              <!-- Индикатор загрузки при обработке -->
              <div v-if="isProcessingChat" class="flex items-center text-sm text-blue-600">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </div>

              <!-- Дополнительные настройки (только если включено) -->
              <div v-if="settings.chatCalculatorEnabled" class="space-y-4 pt-4 border-t">
                <h4 class="text-sm font-medium text-gray-900 mb-4">Дополнительные параметры</h4>

                <!-- Калькулятор в панели чата -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Калькулятор в панели чата</p>
                    <p class="text-xs text-gray-500">Отображать калькулятор в панели ввода сообщения чата</p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.chatPanelEnabled"
                        @update:modelValue="toggleChatPanel"
                        size="small"
                        :disabled="isSaving || isProcessingChatPanel"
                    />
                    <div v-if="isProcessingChatPanel" class="ml-2">
                      <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Калькулятор в сайдбаре чата -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Калькулятор в сайдбаре чате</p>
                    <p class="text-xs text-gray-500">Отображать калькулятор в правой боковой панели чата</p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.chatSidebarEnabled"
                        @update:modelValue="toggleChatSidebar"
                        size="small"
                        :disabled="isSaving || isProcessingChatSidebar"
                    />
                    <div v-if="isProcessingChatSidebar" class="ml-2">
                      <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Карточка калькулятора в задачах -->
        <B24Card class="mb-6">
          <div class="p-6">
            <div class="space-y-6">
              <!-- Основной переключатель -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    Калькулятор в задачах
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Включите эту опцию, чтобы добавить калькулятор в задачи
                  </p>
                </div>
                <div class="ml-4">
                  <!-- Индикатор загрузки при проверке статуса -->
                  <div v-if="isLoadingTaskPlacements" class="flex items-center justify-center w-10">
                    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <B24Switch
                      v-else
                      v-model="settings.taskCalculatorEnabled"
                      @update:modelValue="toggleTaskCalculator"
                      :disabled="isSaving || isProcessingTask"
                  />
                </div>
              </div>

              <!-- Индикатор загрузки при обработке -->
              <div v-if="isProcessingTask" class="flex items-center text-sm text-blue-600">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </div>

              <!-- Дополнительные настройки (только если включено) -->
              <div v-if="settings.taskCalculatorEnabled" class="space-y-4 pt-4 border-t">
                <h4 class="text-sm font-medium text-gray-900 mb-4">Дополнительные параметры</h4>

                <!-- Калькулятор в сайдбаре задачи -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Калькулятор в сайдбаре задачи</p>
                    <p class="text-xs text-gray-500">Отображать калькулятор в боковой панели просмотра задачи</p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.taskSidebarEnabled"
                        @update:modelValue="toggleTaskSidebar"
                        size="small"
                        :disabled="isSaving || isProcessingTaskSidebar"
                    />
                    <div v-if="isProcessingTaskSidebar" class="ml-2">
                      <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Калькулятор во вкладке задачи -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Калькулятор в табе задачи</p>
                    <p class="text-xs text-gray-500">Отображать калькулятор в отдельной вкладке при просмотре задачи</p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.taskTabEnabled"
                        @update:modelValue="toggleTaskTab"
                        size="small"
                        :disabled="isSaving || isProcessingTaskTab"
                    />
                    <div v-if="isProcessingTaskTab" class="ml-2">
                      <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Карточка пользовательского типа поля -->
        <B24Card>
          <div class="p-6">
            <div class="space-y-6">
              <!-- Основной переключатель -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    Пользовательский тип поля "Калькулятор"
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Зарегистрировать новый тип пользовательского поля для использования калькулятора в сущностях CRM
                  </p>
                </div>
                <div class="ml-4">
                  <!-- Индикатор загрузки при проверке статуса -->
                  <div v-if="isLoadingUserFieldType" class="flex items-center justify-center w-10">
                    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <B24Switch
                      v-else
                      v-model="settings.userFieldTypeEnabled"
                      @update:modelValue="toggleUserFieldType"
                      :disabled="isSaving || isProcessingUserFieldType"
                  />
                </div>
              </div>

              <!-- Индикатор загрузки при обработке -->
              <div v-if="isProcessingUserFieldType" class="flex items-center text-sm text-blue-600">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </div>

              <!-- Информация о типе поля -->
              <div v-if="settings.userFieldTypeEnabled" class="space-y-4 pt-4 border-t">
                <div class="bg-blue-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-blue-800 mb-2">Информация о типе поля</h4>
                  <div class="space-y-2 text-sm text-blue-700">
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">Код типа:</span>
                      <span class="font-mono bg-white px-2 py-0.5 rounded">calculator_crm</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">Название:</span>
                      <span>Калькулятор в CRM</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">Описание:</span>
                      <span>Поле с калькулятором для проведения расчетов</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Информация о пользовательских полях -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Что такое пользовательские типы полей?
            </h4>
            <p class="text-sm text-blue-700">
              После включения этих опций в настройках сделок и лидов появится новый тип поля "Калькулятор CRM".
              Администратор сможет добавить это поле в карточку сделки или лида для выполнения расчетов прямо в CRM.
            </p>
          </div>
        </B24Card>
      </div>

      <!-- Сайдбар с информацией и слайдером -->
      <div class="lg:col-span-1">
        <!-- Контейнер для фиксированного сайдбара -->
        <div class="lg:sticky lg:top-6 space-y-6">
          <!-- Карточка информации о приложении -->
          <B24Card>
            <div class="p-1">
              <div class="space-y-6">
                <!-- Логотип и название -->
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Калькулятор в CRM</h3>
                    <p class="text-sm text-gray-500">Версия 1.0.0</p>
                  </div>
                </div>

                <!-- Быстрые ссылки -->
                <div class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-900">Полезные ссылки</h4>
                  <div class="space-y-2">
                    <a href="#"
                       class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Руководство пользователя
                    </a>
                    <a href="#"
                       class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      Поддержка
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </B24Card>

          <!-- Слайдер с другими решениями -->
          <B24Card>
            <div class="p-1">
              <div class="space-y-4">
                <!-- Заголовок слайдера -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Другие наши решения</h3>
                  <p class="text-sm text-gray-500">Расширьте возможности вашего Битрикс24</p>
                </div>

                <!-- Текущая карточка слайдера -->
                <div class="relative">
                  <div
                      class="overflow-hidden rounded-lg"
                      @mouseenter="stopAutoplay"
                      @mouseleave="startAutoplay"
                  >
                    <B24Card class="border-0 shadow-none">
                      <div class="p-0">
                        <!-- Иконка решения -->
                        <div class="p-4 pb-0 flex items-center justify-between">
                          <div
                              class="w-12 h-12 rounded-lg flex items-center justify-center"
                              :class="currentSolution.color"
                          >
                            <component :is="currentSolution.iconComponent" class="w-6 h-6 text-white"/>
                          </div>
                          <div class="flex items-center space-x-2">
                            <span
                                v-if="currentSolution.badge"
                                class="px-2 py-1 text-xs font-medium rounded-full"
                                :class="currentSolution.badgeClass"
                            >
                              {{ currentSolution.badge }}
                            </span>
                            <div class="flex items-center space-x-1">
                              <button
                                  @click="prevSlide"
                                  class="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  :disabled="currentSlide === 0"
                                  :class="{ 'opacity-50 cursor-not-allowed': currentSlide === 0 }"
                              >
                                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7"/>
                                </svg>
                              </button>
                              <button
                                  @click="nextSlide"
                                  class="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  :disabled="currentSlide >= totalSlides - 1"
                                  :class="{ 'opacity-50 cursor-not-allowed': currentSlide >= totalSlides - 1 }"
                              >
                                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- Название и описание -->
                        <div class="p-4 pt-3">
                          <h4 class="text-base font-semibold text-gray-900 mb-2">
                            {{ currentSolution.title }}
                          </h4>
                          <p class="text-sm text-gray-600 mb-4">
                            {{ currentSolution.description }}
                          </p>

                          <!-- Особенности -->
                          <div class="space-y-1.5 mb-4">
                            <div
                                v-for="(feature, index) in currentSolution.features.slice(0, 2)"
                                :key="index"
                                class="flex items-center text-sm text-gray-500"
                            >
                              <svg class="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" fill="none"
                                   stroke="currentColor"
                                   viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M5 13l4 4L19 7"/>
                              </svg>
                              <span class="truncate">{{ feature }}</span>
                            </div>
                          </div>

                          <!-- Кнопка действия -->
                          <div>
                            <B24Button
                                :variant="currentSolution.installed ? 'outline' : 'primary'"
                                :href="currentSolution.link"
                                target="_blank"
                                class="w-full justify-center"
                                size="small"
                            >
                              {{ currentSolution.installed ? 'Открыть' : 'Подробнее' }}
                              <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 5l7 7-7 7"/>
                              </svg>
                            </B24Button>
                          </div>
                        </div>
                      </div>
                    </B24Card>
                  </div>

                  <!-- Индикаторы прогресса -->
                  <div class="mt-4 flex items-center justify-between">
                    <div class="text-xs text-gray-500">
                      {{ currentSlide + 1 }} из {{ totalSlides }}
                    </div>
                    <div class="flex space-x-1">
                      <button
                          v-for="index in totalSlides"
                          :key="index"
                          @click="goToSlide(index - 1)"
                          class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                          :class="currentSlide === index - 1 ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'"
                          :aria-label="`Перейти к слайду ${index}`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </B24Card>
        </div>
      </div>
    </div>

    <!-- Уведомление об успешном сохранении -->
    <B24NotificationContainer position="top-right"/>
  </div>
</template>

<script>
import {ref, computed, onMounted, onUnmounted, markRaw} from 'vue'
import {useToast} from '@bitrix24/b24ui-nuxt/composables/useToast'

// Иконки для решений
const ChartBarIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const CalendarIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `
}

const ChatAlt2Icon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  `
}

const DeviceMobileIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
}

const MailIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  `
}

const TrendingUpIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  `
}

const VideoCameraIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  `
}

const DocumentTextIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

// Конфигурации встроек
const PLACEMENT_CONFIGS = {
  IM_TEXTAREA: {
    title: 'Калькулятор в CRM',
    description: 'Расчеты прямо в панели ввода сообщения',
    options: {
      iconName: 'fa-calculator',
      context: 'USER;LINES',
      role: 'ADMIN',
      color: 'AQUA',
      extranet: 'N',
      width: 300,
      height: 500
    }
  },
  IM_SIDEBAR: {
    title: 'Калькулятор в CRM',
    description: 'Расчеты в боковой панели чата',
    options: {
      iconName: 'fa-calculator',
      color: 'AQUA',
      extranet: 'N',
      role: 'ADMIN',
      width: 300,
      height: 500,
    }
  },
  TASK_VIEW_SIDEBAR: {
    title: 'Калькулятор в задачах',
    description: 'Расчеты в боковой панели задачи',
    options: {
      iconName: 'fa-calculator',
      color: 'AQUA',
      extranet: 'N',
      role: 'ADMIN',
      width: 300,
      height: 500,
    }
  },
  TASK_VIEW_TAB: {
    title: 'Калькулятор',
    description: 'Расчеты во вкладке задачи',
    options: {
      iconName: 'fa-calculator',
      color: 'AQUA',
      extranet: 'N',
      role: 'ADMIN',
      width: 300,
      height: 500,
    }
  }
}

// Константы для пользовательского типа поля
const USER_FIELD_CONFIG = {
  TYPE_ID: 'calculator_crm',
  TITLE: 'Калькулятор в CRM',
  DESCRIPTION: 'Поле с калькулятором для проведения расчетов',
  OPTIONS: {
    height: 500
  }
}

export default {
  name: 'Settings',
  setup() {
    const toast = useToast()
    const isSaving = ref(false)

    // Флаги загрузки
    const loadingStates = {
      chat: {
        isProcessing: ref(false),
        isProcessingPanel: ref(false),
        isProcessingSidebar: ref(false),
        isLoadingPlacements: ref(false)
      },
      task: {
        isProcessing: ref(false),
        isProcessingSidebar: ref(false),
        isProcessingTab: ref(false),
        isLoadingPlacements: ref(false)
      },
      userField: {
        isProcessing: ref(false),
        isLoading: ref(false)
      }
    }

    // URL обработчиков
    const HANDLERS = {
      chatPanel: `${window.location.origin}/placements/chat-panel`,
      chatSidebar: `${window.location.origin}/placements/chat-sidebar`,
      taskSidebar: `${window.location.origin}/placements/task-sidebar`,
      taskTab: `${window.location.origin}/placements/task-tab`,
      userField: `${window.location.origin}/placements/task-sidebar`
    }

    // Настройки
    const settings = ref({
      chatCalculatorEnabled: false,
      chatPanelEnabled: false,
      chatSidebarEnabled: false,
      taskCalculatorEnabled: false,
      taskSidebarEnabled: false,
      taskTabEnabled: false,
      userFieldTypeEnabled: false
    })

    // Данные для слайдера
    const solutions = ref([
      {
        id: 1,
        title: 'Умные отчёты',
        description: 'Автоматическая генерация отчётов и аналитика продаж',
        icon: 'chart-bar',
        iconComponent: markRaw(ChartBarIcon),
        color: 'bg-purple-500',
        features: ['Автоматические отчёты', 'Аналитика в реальном времени', 'Интеграция с CRM'],
        link: 'https://marketplace.bitrix24.ru/smart-reports',
        installed: false,
        badge: 'Новинка',
        badgeClass: 'bg-purple-100 text-purple-800'
      },
      {
        id: 2,
        title: 'Планировщик задач',
        description: 'Интеллектуальное распределение задач и управление проектами',
        icon: 'calendar',
        iconComponent: markRaw(CalendarIcon),
        color: 'bg-green-500',
        features: ['Автораспределение задач', 'Гант-диаграммы', 'Контроль сроков'],
        link: 'https://marketplace.bitrix24.ru/task-planner',
        installed: true,
        badge: 'Установлено',
        badgeClass: 'bg-green-100 text-green-800'
      },
      {
        id: 3,
        title: 'Чат-бот AI',
        description: 'Искусственный интеллект для автоматизации общения с клиентами',
        icon: 'chat-alt-2',
        iconComponent: markRaw(ChatAlt2Icon),
        color: 'bg-blue-500',
        features: ['24/7 поддержка', 'Обучение на базе данных', 'Мультиязычность'],
        link: 'https://marketplace.bitrix24.ru/ai-chatbot',
        installed: false,
        badge: 'Популярное',
        badgeClass: 'bg-blue-100 text-blue-800'
      },
      {
        id: 4,
        title: 'Мобильное приложение',
        description: 'Полный функционал CRM в вашем смартфоне',
        icon: 'device-mobile',
        iconComponent: markRaw(DeviceMobileIcon),
        color: 'bg-orange-500',
        features: ['Офлайн-режим', 'Push-уведомления', 'Быстрый поиск'],
        link: 'https://marketplace.bitrix24.ru/mobile-app',
        installed: false
      },
      {
        id: 5,
        title: 'Интеграция с почтой',
        description: 'Синхронизация всех почтовых ящиков в одном интерфейсе',
        icon: 'mail',
        iconComponent: markRaw(MailIcon),
        color: 'bg-red-500',
        features: ['Несколько аккаунтов', 'Шаблоны писем', 'Автоответчик'],
        link: 'https://marketplace.bitrix24.ru/email-integration',
        installed: true,
        badge: 'Установлено',
        badgeClass: 'bg-green-100 text-green-800'
      },
      {
        id: 6,
        title: 'Автоматизация маркетинга',
        description: 'Создание воронок продаж и автоматических рассылок',
        icon: 'trending-up',
        iconComponent: markRaw(TrendingUpIcon),
        color: 'bg-indigo-500',
        features: ['Воронки продаж', 'Email-рассылки', 'A/B тестирование'],
        link: 'https://marketplace.bitrix24.ru/marketing-automation',
        installed: false
      },
      {
        id: 7,
        title: 'Видеоконференции',
        description: 'HD видеозвонки и совещания прямо из CRM',
        icon: 'video-camera',
        iconComponent: markRaw(VideoCameraIcon),
        color: 'bg-teal-500',
        features: ['HD качество', 'Запись встреч', 'До 100 участников'],
        link: 'https://marketplace.bitrix24.ru/video-conference',
        installed: false
      },
      {
        id: 8,
        title: 'Документооборот',
        description: 'Электронный документооборот и цифровые подписи',
        icon: 'document-text',
        iconComponent: markRaw(DocumentTextIcon),
        color: 'bg-yellow-500',
        features: ['Электронные подписи', 'Шаблоны документов', 'Архивирование'],
        link: 'https://marketplace.bitrix24.ru/document-flow',
        installed: false
      }
    ])

    // Управление слайдером
    const currentSlide = ref(0)
    const autoplayInterval = ref(null)

    // Вычисляемые свойства
    const currentSolution = computed(() => solutions.value[currentSlide.value] || solutions.value[0])
    const totalSlides = computed(() => solutions.value.length)

    // Утилиты для уведомлений
    const notification = {
      success: (message) => {
        toast.add({
          description: message,
          variant: 'success'
        })
      },
      error: (message) => {
        toast.add({
          description: message,
          variant: 'error'
        })
      },
      warning: (message) => {
        toast.add({
          description: message,
          variant: 'warning'
        })
      },
      info: (message) => {
        toast.add({
          description: message,
          variant: 'info'
        })
      }
    }

    // Утилиты для Bitrix24 API
    const bitrixAPI = {
      call: (method, params) => {
        return new Promise((resolve, reject) => {
          if (typeof BX24 === 'undefined' || typeof BX24.callMethod === 'undefined') {
            reject(new Error('Библиотека Bitrix24 не доступна'))
            return
          }

          BX24.callMethod(method, params, (result) => {
            if (result.error()) {
              reject(new Error(result.error().getError()))
            } else {
              resolve(result.data())
            }
          })
        })
      },

      getPlacements: async () => {
        try {
          const result = await bitrixAPI.call('placement.get', {})
          console.log('Список встроек:', result)
          return result || []
        } catch (error) {
          console.error('Ошибка при получении списка встроек:', error)
          throw error
        }
      },

      getUserFieldTypes: async () => {
        try {
          const result = await bitrixAPI.call('userfieldtype.list', {})
          console.log('Список пользовательских типов полей:', result)
          return result || []
        } catch (error) {
          console.error('Ошибка при получении списка типов полей:', error)
          throw error
        }
      }
    }

    // Функции для работы с встройками
    const placementManager = {
      getConfig: (placementType) => {
        const config = PLACEMENT_CONFIGS[placementType]
        if (!config) {
          throw new Error(`Неизвестный тип встройки: ${placementType}`)
        }
        return config
      },

      bind: async (placementType, handler) => {
        try {
          const config = placementManager.getConfig(placementType)
          const placementConfig = {
            PLACEMENT: placementType,
            HANDLER: handler,
            LANG_ALL: {
              ru: {
                TITLE: config.title,
                DESCRIPTION: config.description,
                GROUP_NAME: 'Инструменты'
              }
            },
            OPTIONS: config.options
          }

          const result = await bitrixAPI.call('placement.bind', placementConfig)
          console.log(`Встройка ${placementType} зарегистрирована:`, result)
          return true
        } catch (error) {
          console.error(`Ошибка регистрации встройки ${placementType}:`, error)
          throw error
        }
      },

      unbind: async (placementType, handler) => {
        try {
          const result = await bitrixAPI.call('placement.unbind', {
            PLACEMENT: placementType,
            HANDLER: handler
          })

          console.log(`Встройка ${placementType} удалена:`, result)
          return true
        } catch (error) {
          console.error(`Ошибка удаления встройки ${placementType}:`, error)
          throw error
        }
      },

      checkStatus: async (placementType, handler) => {
        try {
          const placements = await bitrixAPI.getPlacements()

          if (!Array.isArray(placements)) {
            console.warn('Получен некорректный формат данных встроек:', placements)
            return false
          }

          const placement = placements.find(p =>
              p.placement === placementType &&
              p.handler === handler
          )

          return !!placement
        } catch (error) {
          console.error(`Ошибка при проверке статуса встройки ${placementType}:`, error)
          return false
        }
      }
    }

    // Функции для работы с пользовательскими типами полей
    const userFieldManager = {
      checkStatus: async () => {
        try {
          loadingStates.userField.isLoading.value = true
          const userFieldTypes = await bitrixAPI.getUserFieldTypes()

          if (!Array.isArray(userFieldTypes)) {
            console.warn('Получен некорректный формат данных типов полей:', userFieldTypes)
            return false
          }

          const existingType = userFieldTypes.find(type =>
              type.USER_TYPE_ID === USER_FIELD_CONFIG.TYPE_ID &&
              type.HANDLER === HANDLERS.userField
          )

          return !!existingType
        } catch (error) {
          console.error('Ошибка при проверке статуса типа поля:', error)
          return false
        } finally {
          loadingStates.userField.isLoading.value = false
        }
      },

      add: async () => {
        try {
          const result = await bitrixAPI.call('userfieldtype.add', {
            USER_TYPE_ID: USER_FIELD_CONFIG.TYPE_ID,
            HANDLER: HANDLERS.userField,
            TITLE: USER_FIELD_CONFIG.TITLE,
            DESCRIPTION: USER_FIELD_CONFIG.DESCRIPTION,
            OPTIONS: USER_FIELD_CONFIG.OPTIONS
          })

          console.log('Пользовательский тип поля зарегистрирован:', result)
          return true
        } catch (error) {
          console.error('Ошибка регистрации типа поля:', error)
          throw error
        }
      },

      delete: async () => {
        try {
          const result = await bitrixAPI.call('userfieldtype.delete', {
            USER_TYPE_ID: USER_FIELD_CONFIG.TYPE_ID
          })

          console.log('Пользовательский тип поля удален:', result)
          return true
        } catch (error) {
          console.error('Ошибка удаления типа поля:', error)
          throw error
        }
      }
    }

    // Функции синхронизации статуса
    const syncStatus = {
      chat: async () => {
        try {
          loadingStates.chat.isLoadingPlacements.value = true
          const panelStatus = await placementManager.checkStatus('IM_TEXTAREA', HANDLERS.chatPanel)
          const sidebarStatus = await placementManager.checkStatus('IM_SIDEBAR', HANDLERS.chatSidebar)

          settings.value.chatCalculatorEnabled = panelStatus || sidebarStatus
          settings.value.chatPanelEnabled = panelStatus
          settings.value.chatSidebarEnabled = sidebarStatus
        } catch (error) {
          console.error('Ошибка синхронизации статуса встроек чата:', error)
        } finally {
          loadingStates.chat.isLoadingPlacements.value = false
        }
      },

      task: async () => {
        try {
          loadingStates.task.isLoadingPlacements.value = true
          const sidebarStatus = await placementManager.checkStatus('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
          const tabStatus = await placementManager.checkStatus('TASK_VIEW_TAB', HANDLERS.taskTab)

          settings.value.taskCalculatorEnabled = sidebarStatus || tabStatus
          settings.value.taskSidebarEnabled = sidebarStatus
          settings.value.taskTabEnabled = tabStatus
        } catch (error) {
          console.error('Ошибка синхронизации статуса встроек задач:', error)
        } finally {
          loadingStates.task.isLoadingPlacements.value = false
        }
      },

      userField: async () => {
        try {
          const isRegistered = await userFieldManager.checkStatus()
          settings.value.userFieldTypeEnabled = isRegistered
        } catch (error) {
          console.error('Ошибка синхронизации статуса типа поля:', error)
        }
      }
    }

    // Основные функции переключения
    const toggleFunctions = {
      chatCalculator: async (newValue) => {
        if (loadingStates.chat.isProcessing.value) return
        loadingStates.chat.isProcessing.value = true

        try {
          if (newValue) {
            await Promise.all([
              placementManager.bind('IM_TEXTAREA', HANDLERS.chatPanel),
              placementManager.bind('IM_SIDEBAR', HANDLERS.chatSidebar)
            ])
            settings.value.chatPanelEnabled = true
            settings.value.chatSidebarEnabled = true
            notification.success('Калькулятор успешно добавлен в чат')
          } else {
            await Promise.all([
              placementManager.unbind('IM_TEXTAREA', HANDLERS.chatPanel),
              placementManager.unbind('IM_SIDEBAR', HANDLERS.chatSidebar)
            ])
            settings.value.chatPanelEnabled = false
            settings.value.chatSidebarEnabled = false
            notification.success('Калькулятор успешно удален из чата')
          }

          settings.value.chatCalculatorEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.chat()
          notification.error('Ошибка при обновлении настроек чата')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.chat.isProcessing.value = false
        }
      },

      chatPanel: async (newValue) => {
        if (loadingStates.chat.isProcessingPanel.value) return
        loadingStates.chat.isProcessingPanel.value = true

        try {
          if (newValue) {
            await placementManager.bind('IM_TEXTAREA', HANDLERS.chatPanel)
            notification.success('Калькулятор добавлен в панель чата')
          } else {
            await placementManager.unbind('IM_TEXTAREA', HANDLERS.chatPanel)
            notification.info('Калькулятор удален из панели чата')
          }

          settings.value.chatPanelEnabled = newValue
          updateMainToggle('chat')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('IM_TEXTAREA', HANDLERS.chatPanel)
          settings.value.chatPanelEnabled = status
          notification.error('Ошибка при обновлении панели чата')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.chat.isProcessingPanel.value = false
        }
      },

      chatSidebar: async (newValue) => {
        if (loadingStates.chat.isProcessingSidebar.value) return
        loadingStates.chat.isProcessingSidebar.value = true

        try {
          if (newValue) {
            await placementManager.bind('IM_SIDEBAR', HANDLERS.chatSidebar)
            notification.success('Калькулятор добавлен в сайдбар чата')
          } else {
            await placementManager.unbind('IM_SIDEBAR', HANDLERS.chatSidebar)
            notification.info('Калькулятор удален из сайдбара чата')
          }

          settings.value.chatSidebarEnabled = newValue
          updateMainToggle('chat')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('IM_SIDEBAR', HANDLERS.chatSidebar)
          settings.value.chatSidebarEnabled = status
          notification.error('Ошибка при обновлении сайдбара чата')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.chat.isProcessingSidebar.value = false
        }
      },

      taskCalculator: async (newValue) => {
        if (loadingStates.task.isProcessing.value) return
        loadingStates.task.isProcessing.value = true

        try {
          if (newValue) {
            await Promise.all([
              placementManager.bind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
              placementManager.bind('TASK_VIEW_TAB', HANDLERS.taskTab)
            ])
            settings.value.taskSidebarEnabled = true
            settings.value.taskTabEnabled = true
            notification.success('Калькулятор успешно добавлен в задачи')
          } else {
            await Promise.all([
              placementManager.unbind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
              placementManager.unbind('TASK_VIEW_TAB', HANDLERS.taskTab)
            ])
            settings.value.taskSidebarEnabled = false
            settings.value.taskTabEnabled = false
            notification.success('Калькулятор успешно удален из задач')
          }

          settings.value.taskCalculatorEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.task()
          notification.error('Ошибка при обновлении настроек задач')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.task.isProcessing.value = false
        }
      },

      taskSidebar: async (newValue) => {
        if (loadingStates.task.isProcessingSidebar.value) return
        loadingStates.task.isProcessingSidebar.value = true

        try {
          if (newValue) {
            await placementManager.bind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
            notification.success('Калькулятор добавлен в сайдбар задачи')
          } else {
            await placementManager.unbind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
            notification.info('Калькулятор удален из сайдбара задачи')
          }

          settings.value.taskSidebarEnabled = newValue
          updateMainToggle('task')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
          settings.value.taskSidebarEnabled = status
          notification.error('Ошибка при обновлении сайдбара задачи')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.task.isProcessingSidebar.value = false
        }
      },

      taskTab: async (newValue) => {
        if (loadingStates.task.isProcessingTab.value) return
        loadingStates.task.isProcessingTab.value = true

        try {
          if (newValue) {
            await placementManager.bind('TASK_VIEW_TAB', HANDLERS.taskTab)
            notification.success('Калькулятор добавлен во вкладку задачи')
          } else {
            await placementManager.unbind('TASK_VIEW_TAB', HANDLERS.taskTab)
            notification.info('Калькулятор удален из вкладки задачи')
          }

          settings.value.taskTabEnabled = newValue
          updateMainToggle('task')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('TASK_VIEW_TAB', HANDLERS.taskTab)
          settings.value.taskTabEnabled = status
          notification.error('Ошибка при обновлении вкладки задачи')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.task.isProcessingTab.value = false
        }
      },

      userFieldType: async (newValue) => {
        if (loadingStates.userField.isProcessing.value) return
        loadingStates.userField.isProcessing.value = true

        try {
          if (newValue) {
            await userFieldManager.add()
            notification.success('Пользовательский тип поля "Калькулятор в CRM" успешно зарегистрирован')
          } else {
            await userFieldManager.delete()
            notification.success('Пользовательский тип поля "Калькулятор в CRM" успешно удален')
          }

          settings.value.userFieldTypeEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.userField()
          notification.error(error.message || 'Ошибка при обновлении типа поля')
          console.error('Ошибка:', error)
        } finally {
          loadingStates.userField.isProcessing.value = false
        }
      }
    }

    // Вспомогательные функции
    const updateMainToggle = (type) => {
      if (type === 'chat') {
        settings.value.chatCalculatorEnabled =
            settings.value.chatPanelEnabled || settings.value.chatSidebarEnabled
      } else if (type === 'task') {
        settings.value.taskCalculatorEnabled =
            settings.value.taskSidebarEnabled || settings.value.taskTabEnabled
      }
    }

    const saveSettings = () => {
      localStorage.setItem('app_settings', JSON.stringify(settings.value))
    }

    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('app_settings')
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          settings.value = {...settings.value, ...parsed}
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
        notification.error('Ошибка загрузки настроек')
      }
    }

    // Навигация по слайдам
    const nextSlide = () => {
      currentSlide.value = currentSlide.value < totalSlides.value - 1
          ? currentSlide.value + 1
          : 0
    }

    const prevSlide = () => {
      currentSlide.value = currentSlide.value > 0
          ? currentSlide.value - 1
          : totalSlides.value - 1
    }

    const goToSlide = (index) => {
      if (index >= 0 && index < totalSlides.value) {
        currentSlide.value = index
      }
    }

    // Автопрокрутка
    const startAutoplay = () => {
      stopAutoplay()
      autoplayInterval.value = setInterval(nextSlide, 5000)
    }

    const stopAutoplay = () => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value)
        autoplayInterval.value = null
      }
    }

    // Инициализация
    onMounted(async () => {
      await loadSettings()

      if (typeof BX24 === 'undefined') {
        console.warn('Библиотека Bitrix24 не загружена.')
        notification.warning('Библиотека Bitrix24 не загружена. Проверьте подключение.')
        return
      }

      try {
        await Promise.all([
          syncStatus.chat(),
          syncStatus.task(),
          syncStatus.userField()
        ])
        notification.info('Статус настроек успешно синхронизирован')
      } catch (error) {
        notification.error('Ошибка синхронизации статуса')
      }

      startAutoplay()
    })

    onUnmounted(() => {
      stopAutoplay()
    })

    return {
      // Состояние
      settings,
      isSaving,
      isLoadingChatPlacements: loadingStates.chat.isLoadingPlacements,
      isLoadingTaskPlacements: loadingStates.task.isLoadingPlacements,
      isLoadingUserFieldType: loadingStates.userField.isLoading,
      isProcessingChat: loadingStates.chat.isProcessing,
      isProcessingChatPanel: loadingStates.chat.isProcessingPanel,
      isProcessingChatSidebar: loadingStates.chat.isProcessingSidebar,
      isProcessingTask: loadingStates.task.isProcessing,
      isProcessingTaskSidebar: loadingStates.task.isProcessingSidebar,
      isProcessingTaskTab: loadingStates.task.isProcessingTab,
      isProcessingUserFieldType: loadingStates.userField.isProcessing,

      // Слайдер
      solutions,
      currentSlide,
      totalSlides,
      currentSolution,

      // Методы
      nextSlide,
      prevSlide,
      goToSlide,
      startAutoplay,
      stopAutoplay,

      // Функции переключения
      toggleChatCalculator: toggleFunctions.chatCalculator,
      toggleChatPanel: toggleFunctions.chatPanel,
      toggleChatSidebar: toggleFunctions.chatSidebar,
      toggleTaskCalculator: toggleFunctions.taskCalculator,
      toggleTaskSidebar: toggleFunctions.taskSidebar,
      toggleTaskTab: toggleFunctions.taskTab,
      toggleUserFieldType: toggleFunctions.userFieldType,

      // Константы
      userFieldTypeHandler: HANDLERS.userField
    }
  }
}
</script>

<style scoped>
/* Фиксированный сайдбар с плавной прокруткой */
.lg\:sticky {
  position: sticky;
  align-self: flex-start;
  transition: top 0.3s ease;
}

/* Анимация для перехода слайдов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Плавная анимация для переключения слайдов */
.transition-transform {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Стили для кнопок навигации слайдера */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Улучшенные анимации загрузки */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>