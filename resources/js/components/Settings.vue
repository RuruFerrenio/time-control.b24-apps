<template>
  <div class="p-6">
    <B24PageHeader
        :title="$t('app.settings.title')"
        :description="$t('app.settings.description')"
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
                    {{ $t('chatCalculator.title') }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t('chatCalculator.description') }}
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
                {{ $t('buttons.processing') }}
              </div>

              <!-- Дополнительные настройки (только если включено) -->
              <div v-if="settings.chatCalculatorEnabled" class="space-y-4 pt-4 border-t">
                <h4 class="text-sm font-medium text-gray-900 mb-4">
                  {{ $t('chatCalculator.additionalSettings') }}
                </h4>

                <!-- Калькулятор в панели чата -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ $t('chatCalculator.chatPanel.title') }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ $t('chatCalculator.chatPanel.description') }}
                    </p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.chatPanelEnabled"
                        @update:modelValue="toggleChatPanel"
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
                    <p class="text-sm font-medium text-gray-900">
                      {{ $t('chatCalculator.chatSidebar.title') }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ $t('chatCalculator.chatSidebar.description') }}
                    </p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.chatSidebarEnabled"
                        @update:modelValue="toggleChatSidebar"
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
                    {{ $t('taskCalculator.title') }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t('taskCalculator.description') }}
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
                {{ $t('buttons.processing') }}
              </div>

              <!-- Дополнительные настройки (только если включено) -->
              <div v-if="settings.taskCalculatorEnabled" class="space-y-4 pt-4 border-t">
                <h4 class="text-sm font-medium text-gray-900 mb-4">
                  {{ $t('taskCalculator.additionalSettings') }}
                </h4>

                <!-- Калькулятор в сайдбаре задачи -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ $t('taskCalculator.taskSidebar.title') }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ $t('taskCalculator.taskSidebar.description') }}
                    </p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.taskSidebarEnabled"
                        @update:modelValue="toggleTaskSidebar"
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
                    <p class="text-sm font-medium text-gray-900">
                      {{ $t('taskCalculator.taskTab.title') }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ $t('taskCalculator.taskTab.description') }}
                    </p>
                  </div>
                  <div class="flex items-center">
                    <B24Switch
                        v-model="settings.taskTabEnabled"
                        @update:modelValue="toggleTaskTab"
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

        <!-- Карточка калькулятора в карточке звонка (CALL_CARD) -->
        <B24Card class="mb-6">
          <div class="p-6">
            <div class="space-y-6">
              <!-- Основной переключатель -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    {{ $t('callCardCalculator.title') }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t('callCardCalculator.description') }}
                  </p>
                </div>
                <div class="ml-4">
                  <!-- Индикатор загрузки при проверке статуса -->
                  <div v-if="isLoadingCallCardPlacements" class="flex items-center justify-center w-10">
                    <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <B24Switch
                      v-else
                      v-model="settings.callCardCalculatorEnabled"
                      @update:modelValue="toggleCallCardCalculator"
                      :disabled="isSaving || isProcessingCallCard"
                  />
                </div>
              </div>

              <!-- Индикатор загрузки при обработке -->
              <div v-if="isProcessingCallCard" class="flex items-center text-sm text-blue-600">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('buttons.processing') }}
              </div>

              <!-- Дополнительная информация (только если включено) -->
              <div v-if="settings.callCardCalculatorEnabled" class="space-y-4 pt-4 border-t">
                <div class="bg-blue-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-blue-800 mb-2">
                    {{ $t('callCardCalculator.info') }}
                  </h4>
                  <p class="text-sm text-blue-700 mb-3">
                    {{ $t('callCardCalculator.infoDescription') }}
                  </p>
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
                    {{ $t('userFieldType.title') }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t('userFieldType.description') }}
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
                {{ $t('buttons.processing') }}
              </div>

              <!-- Информация о типе поля -->
              <div v-if="settings.userFieldTypeEnabled" class="space-y-4 pt-4 border-t">
                <div class="bg-blue-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-blue-800 mb-2">
                    {{ $t('userFieldType.info') }}
                  </h4>
                  <div class="space-y-2 text-sm text-blue-700">
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">
                        {{ $t('userFieldType.typeCode') }}
                      </span>
                      <span class="font-mono bg-white px-2 py-0.5 rounded">calculator_crm</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">
                        {{ $t('userFieldType.typeName') }}
                      </span>
                      <span>{{ $t('userFieldType.title') }}</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium w-32 flex-shrink-0">
                        {{ $t('userFieldType.typeDescription') }}
                      </span>
                      <span>{{ $t('userFieldType.description') }}</span>
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
              {{ $t('userFieldType.fieldInfo') }}
            </h4>
            <p class="text-sm text-blue-700">
              {{ $t('userFieldType.fieldInfoDescription') }}
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
            <div class="p-6">
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
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ $t('app.title') }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ $t('app.version') }}
                    </p>
                  </div>
                </div>

                <!-- Быстрые ссылки -->
                <div class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ $t('app.guide') }}
                  </h4>
                  <div class="space-y-2">
                    <!-- Изменено: теперь скачивание файла вместо перехода на страницу -->
                    <a
                        href="#"
                        @click="downloadUserGuide"
                        class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ $t('buttons.guide') }}
                    </a>
                    <a
                        href="https://www.bitrix24.ru/apps/"
                        target="_blank"
                        class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                      {{ $t('buttons.feedback') }}
                    </a>
                    <a
                        href="mailto:it.galera@yandex.ru?subject=Поддержка приложения Калькулятор в CRM"
                        class="flex items-center text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      {{ $t('buttons.support') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </B24Card>

          <!-- Слайдер с другими решениями -->
          <div v-if="settings.showSolutionsSlider">
            <B24Card>
              <div class="p-6">
                <div class="space-y-4">
                  <!-- Заголовок слайдера -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                      {{ $t('app.otherSolutions') }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ $t('app.expandCapabilities') }}
                    </p>
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
                              {{ $t(`solutions.${currentSolution.translationKey}.title`) }}
                            </h4>
                            <p class="text-sm text-gray-600 mb-4">
                              {{ $t(`solutions.${currentSolution.translationKey}.description`) }}
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
                              >
                                {{ currentSolution.installed ? $t('buttons.open') : $t('buttons.details') }}
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
                        {{ $t('app.slideCounter', {current: currentSlide + 1, total: totalSlides}) }}
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
    </div>

    <!-- Уведомление об успешном сохранении -->
    <B24NotificationContainer position="top-right"/>
  </div>
</template>

<script>
import {ref, computed, onMounted, onUnmounted, markRaw} from 'vue'
import {useToast} from '@bitrix24/b24ui-nuxt/composables/useToast'
import {useI18n} from 'vue-i18n'

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

// Конфигурации встроек (добавлена конфигурация для PAGE_BACKGROUND_WORKER)
const PLACEMENT_CONFIGS = {
  IM_TEXTAREA: {
    title: 'Калькулятор в CRM',
    description: 'Расчеты прямо в панели ввода сообщения',
    options: {
      iconName: 'fa-calculator',
      context: 'ALL',
      role: 'USER',
      color: 'AQUA',
      extranet: 'N',
      width: 300,
      height: 675
    }
  },
  IM_SIDEBAR: {
    title: 'Калькулятор в CRM',
    description: 'Расчеты в боковой панели чата',
    options: {
      iconName: 'fa-calculator',
      context: 'ALL',
      color: 'AQUA',
      extranet: 'N',
      role: 'USER',
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
      role: 'USER',
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
      role: 'USER',
      width: 300,
      height: 500,
    }
  },
  CALL_CARD: {
    title: 'Калькулятор',
    description: 'Расчеты в карточке звонка',
    options: {
      iconName: 'fa-calculator',
      color: 'AQUA',
      extranet: 'N',
      role: 'USER',
    }
  },
  PAGE_BACKGROUND_WORKER: {
    title: 'Фоновый калькулятор',
    description: 'Вычисления в фоновом режиме для обработки данных',
    options: {
      errorHandlerUrl: `${window.location.origin}/placements/error-handler`
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
    const {t, locale} = useI18n()
    const toast = useToast()
    const isSaving = ref(false)

    // Получаем origin текущего окна
    const windowOrigin = window.location.origin

    // URL обработчиков (добавлен обработчик для PAGE_BACKGROUND_WORKER)
    const HANDLERS = {
      chatPanel: `${windowOrigin}/placements/chat-panel`,
      chatSidebar: `${windowOrigin}/placements/chat-sidebar`,
      taskSidebar: `${windowOrigin}/placements/task-sidebar`,
      taskTab: `${windowOrigin}/placements/task-tab`,
      callCard: `${windowOrigin}/placements/call-card`,
      pageBackgroundWorker: `${windowOrigin}/placements/page-background-worker`,
      userField: `${windowOrigin}/placements/task-sidebar`
    }

    // Настройки (убрано поле pageBackgroundWorkerEnabled)
    const settings = ref({
      chatCalculatorEnabled: false,
      chatPanelEnabled: false,
      chatSidebarEnabled: false,
      taskCalculatorEnabled: false,
      taskSidebarEnabled: false,
      taskTabEnabled: false,
      callCardCalculatorEnabled: false,
      userFieldTypeEnabled: false,
      showSolutionsSlider: false
    })

    // Данные для слайдера
    const solutions = ref([
      {
        id: 1,
        translationKey: 'calendarInCrm',
        icon: 'chart-bar',
        iconComponent: markRaw(ChartBarIcon),
        color: 'bg-purple-500',
        features: ['Автоматические отчёты', 'Аналитика в реальном времени', 'Интеграция с CRM'],
        link: 'https://marketplace.bitrix24.ru/smart-reports',
        installed: false,
        badge: t('badges.new'),
        badgeClass: 'bg-purple-100 text-purple-800'
      },
      {
        id: 2,
        translationKey: 'timerInCrm',
        icon: 'calendar',
        iconComponent: markRaw(CalendarIcon),
        color: 'bg-green-500',
        features: ['Автораспределение задач', 'Гант-диаграммы', 'Контроль сроков'],
        link: 'https://marketplace.bitrix24.ru/task-planner',
        installed: false,
        badge: t('badges.new'),
        badgeClass: 'bg-green-100 text-green-800'
      },
      {
        id: 3,
        translationKey: 'noticeInCrm',
        icon: 'chat-alt-2',
        iconComponent: markRaw(ChatAlt2Icon),
        color: 'bg-blue-500',
        features: ['24/7 поддержка', 'Обучение на базе данных', 'Мультиязычность'],
        link: 'https://marketplace.bitrix24.ru/ai-chatbot',
        installed: false,
        badge: t('badges.new'),
        badgeClass: 'bg-blue-100 text-blue-800'
      }
    ])

    // Управление слайдером
    const currentSlide = ref(0)
    const autoplayInterval = ref(null)

    // Вычисляемые свойства
    const currentSolution = computed(() => solutions.value[currentSlide.value] || solutions.value[0])
    const totalSlides = computed(() => solutions.value.length)

    // Функция для скачивания руководства пользователя
    const downloadUserGuide = () => {
      // Получаем сохраненный язык из localStorage
      const savedLang = localStorage.getItem('bitrix24_language') || 'ru'

      // Определяем URL файла в зависимости от языка
      let fileUrl
      let fileName

      if (savedLang === 'ru') {
        // Русская версия
        fileUrl = '/files/user-guide-ru.docx'
        fileName = 'Руководство_пользователя_Калькулятор_в_CRM.docx'
      } else {
        // Английская версия (для всех других языков)
        fileUrl = '/files/user-guide-en.docx'
        fileName = 'User_Guide_Calculator_in_CRM.docx'
      }

      // Создаем временную ссылку для скачивания
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Показываем уведомление
      toast.add({
        description: savedLang === 'ru'
            ? 'Руководство пользователя скачивается...'
            : 'User guide is downloading...',
        variant: 'info'
      })
    }

    // Утилиты для уведомлений
    const notification = {
      success: (messageKey) => {
        toast.add({
          description: t(`notifications.success.${messageKey}`),
          variant: 'success'
        })
      },
      error: (messageKey) => {
        toast.add({
          description: t(`notifications.error.${messageKey}`),
          variant: 'error'
        })
      },
      warning: (messageKey) => {
        toast.add({
          description: t(`notifications.warning.${messageKey}`),
          variant: 'warning'
        })
      },
      info: (messageKey) => {
        toast.add({
          description: t(`notifications.info.${messageKey}`),
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

          // Для PAGE_BACKGROUND_WORKER используем специальный формат конфигурации
          const placementConfig = placementType === 'PAGE_BACKGROUND_WORKER'
              ? {
                PLACEMENT: placementType,
                HANDLER: handler,
                OPTIONS: config.options
              }
              : {
                PLACEMENT: placementType,
                HANDLER: handler,
                LANG_ALL: {
                  ru: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Инструменты'
                  },
                  en: {
                    TITLE: 'Calculator in CRM',
                    DESCRIPTION: 'Calculations directly in the message input panel',
                    GROUP_NAME: 'Tools'
                  },
                  be: {
                    TITLE: 'Калькулятар у CRM',
                    DESCRIPTION: 'Разлікі прама ў панэлі ўводу паведамлення',
                    GROUP_NAME: 'Інструменты'
                  },
                  kk: {
                    TITLE: 'CRM-дегі калькулятор',
                    DESCRIPTION: 'Хабарлама енгізу панелінде тікелей есептеулер',
                    GROUP_NAME: 'Құралдар'
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
          const panelStatus = await placementManager.checkStatus('IM_TEXTAREA', HANDLERS.chatPanel)
          const sidebarStatus = await placementManager.checkStatus('IM_SIDEBAR', HANDLERS.chatSidebar)

          settings.value.chatCalculatorEnabled = panelStatus || sidebarStatus
          settings.value.chatPanelEnabled = panelStatus
          settings.value.chatSidebarEnabled = sidebarStatus
        } catch (error) {
          console.error('Ошибка синхронизации статуса встроек чата:', error)
        }
      },

      task: async () => {
        try {
          const sidebarStatus = await placementManager.checkStatus('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
          const tabStatus = await placementManager.checkStatus('TASK_VIEW_TAB', HANDLERS.taskTab)

          settings.value.taskCalculatorEnabled = sidebarStatus || tabStatus
          settings.value.taskSidebarEnabled = sidebarStatus
          settings.value.taskTabEnabled = tabStatus
        } catch (error) {
          console.error('Ошибка синхронизации статуса встроек задач:', error)
        }
      },

      callCard: async () => {
        try {
          const callCardStatus = await placementManager.checkStatus('CALL_CARD', HANDLERS.callCard)
          settings.value.callCardCalculatorEnabled = callCardStatus
        } catch (error) {
          console.error('Ошибка синхронизации статуса встройки карточки звонка:', error)
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

    // Функция для автоматической регистрации PAGE_BACKGROUND_WORKER
    const registerPageBackgroundWorker = async () => {
      try {
        const isRegistered = await placementManager.checkStatus('PAGE_BACKGROUND_WORKER', HANDLERS.pageBackgroundWorker)

        if (!isRegistered) {
          console.log('Регистрируем PAGE_BACKGROUND_WORKER...')
          await placementManager.bind('PAGE_BACKGROUND_WORKER', HANDLERS.pageBackgroundWorker)
          console.log('PAGE_BACKGROUND_WORKER успешно зарегистрирован')
        } else {
          console.log('PAGE_BACKGROUND_WORKER уже зарегистрирован')
        }
      } catch (error) {
        console.error('Ошибка при регистрации PAGE_BACKGROUND_WORKER:', error)
      }
    }

    // Основные функции переключения
    const toggleFunctions = {
      chatCalculator: async (newValue) => {
        try {
          if (newValue) {
            await Promise.all([
              placementManager.bind('IM_TEXTAREA', HANDLERS.chatPanel),
              placementManager.bind('IM_SIDEBAR', HANDLERS.chatSidebar)
            ])
            settings.value.chatPanelEnabled = true
            settings.value.chatSidebarEnabled = true
            notification.success('chatAdded')
          } else {
            await Promise.all([
              placementManager.unbind('IM_TEXTAREA', HANDLERS.chatPanel),
              placementManager.unbind('IM_SIDEBAR', HANDLERS.chatSidebar)
            ])
            settings.value.chatPanelEnabled = false
            settings.value.chatSidebarEnabled = false
            notification.success('chatRemoved')
          }

          settings.value.chatCalculatorEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.chat()
          notification.error('chatUpdate')
          console.error('Ошибка:', error)
        }
      },

      chatPanel: async (newValue) => {
        try {
          if (newValue) {
            await placementManager.bind('IM_TEXTAREA', HANDLERS.chatPanel)
            notification.success('chatPanelAdded')
          } else {
            await placementManager.unbind('IM_TEXTAREA', HANDLERS.chatPanel)
            notification.success('chatPanelRemoved')
          }

          settings.value.chatPanelEnabled = newValue
          updateMainToggle('chat')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('IM_TEXTAREA', HANDLERS.chatPanel)
          settings.value.chatPanelEnabled = status
          notification.error('chatPanelUpdate')
          console.error('Ошибка:', error)
        }
      },

      chatSidebar: async (newValue) => {
        try {
          if (newValue) {
            await placementManager.bind('IM_SIDEBAR', HANDLERS.chatSidebar)
            notification.success('chatSidebarAdded')
          } else {
            await placementManager.unbind('IM_SIDEBAR', HANDLERS.chatSidebar)
            notification.success('chatSidebarRemoved')
          }

          settings.value.chatSidebarEnabled = newValue
          updateMainToggle('chat')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('IM_SIDEBAR', HANDLERS.chatSidebar)
          settings.value.chatSidebarEnabled = status
          notification.error('chatSidebarUpdate')
          console.error('Ошибка:', error)
        }
      },

      taskCalculator: async (newValue) => {
        try {
          if (newValue) {
            await Promise.all([
              placementManager.bind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
              placementManager.bind('TASK_VIEW_TAB', HANDLERS.taskTab)
            ])
            settings.value.taskSidebarEnabled = true
            settings.value.taskTabEnabled = true
            notification.success('taskAdded')
          } else {
            await Promise.all([
              placementManager.unbind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
              placementManager.unbind('TASK_VIEW_TAB', HANDLERS.taskTab)
            ])
            settings.value.taskSidebarEnabled = false
            settings.value.taskTabEnabled = false
            notification.success('taskRemoved')
          }

          settings.value.taskCalculatorEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.task()
          notification.error('taskUpdate')
          console.error('Ошибка:', error)
        }
      },

      taskSidebar: async (newValue) => {
        try {
          if (newValue) {
            await placementManager.bind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
            notification.success('taskSidebarAdded')
          } else {
            await placementManager.unbind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
            notification.success('taskSidebarRemoved')
          }

          settings.value.taskSidebarEnabled = newValue
          updateMainToggle('task')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar)
          settings.value.taskSidebarEnabled = status
          notification.error('taskSidebarUpdate')
          console.error('Ошибка:', error)
        }
      },

      taskTab: async (newValue) => {
        try {
          if (newValue) {
            await placementManager.bind('TASK_VIEW_TAB', HANDLERS.taskTab)
            notification.success('taskTabAdded')
          } else {
            await placementManager.unbind('TASK_VIEW_TAB', HANDLERS.taskTab)
            notification.success('taskTabRemoved')
          }

          settings.value.taskTabEnabled = newValue
          updateMainToggle('task')
          saveSettings()
        } catch (error) {
          const status = await placementManager.checkStatus('TASK_VIEW_TAB', HANDLERS.taskTab)
          settings.value.taskTabEnabled = status
          notification.error('taskTabUpdate')
          console.error('Ошибка:', error)
        }
      },

      callCardCalculator: async (newValue) => {
        try {
          if (newValue) {
            await placementManager.bind('CALL_CARD', HANDLERS.callCard)
            notification.success('callCardAdded')
          } else {
            await placementManager.unbind('CALL_CARD', HANDLERS.callCard)
            notification.success('callCardRemoved')
          }

          settings.value.callCardCalculatorEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.callCard()
          notification.error('callCardUpdate')
          console.error('Ошибка:', error)
        }
      },

      userFieldType: async (newValue) => {
        try {
          if (newValue) {
            await userFieldManager.add()
            notification.success('fieldTypeAdded')
          } else {
            await userFieldManager.delete()
            notification.success('fieldTypeRemoved')
          }

          settings.value.userFieldTypeEnabled = newValue
          saveSettings()
        } catch (error) {
          await syncStatus.userField()
          notification.error('fieldTypeUpdate')
          console.error('Ошибка:', error)
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
        notification.error('settingsLoad')
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
        notification.warning('bitrixLoad')
        return
      }

      try {
        // Автоматически регистрируем PAGE_BACKGROUND_WORKER
        await registerPageBackgroundWorker()

        // Синхронизируем статус остальных встроек
        await Promise.all([
          syncStatus.chat(),
          syncStatus.task(),
          syncStatus.callCard(),
          syncStatus.userField()
        ])
        notification.info('syncInfo')
      } catch (error) {
        notification.error('syncError')
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
      windowOrigin,
      isLoadingChatPlacements: ref(false),
      isLoadingTaskPlacements: ref(false),
      isLoadingCallCardPlacements: ref(false),
      isLoadingUserFieldType: ref(false),
      isProcessingChat: ref(false),
      isProcessingChatPanel: ref(false),
      isProcessingChatSidebar: ref(false),
      isProcessingTask: ref(false),
      isProcessingTaskSidebar: ref(false),
      isProcessingTaskTab: ref(false),
      isProcessingCallCard: ref(false),
      isProcessingUserFieldType: ref(false),

      // Константы
      HANDLERS,

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
      downloadUserGuide,

      // Функции переключения
      toggleChatCalculator: toggleFunctions.chatCalculator,
      toggleChatPanel: toggleFunctions.chatPanel,
      toggleChatSidebar: toggleFunctions.chatSidebar,
      toggleTaskCalculator: toggleFunctions.taskCalculator,
      toggleTaskSidebar: toggleFunctions.taskSidebar,
      toggleTaskTab: toggleFunctions.taskTab,
      toggleCallCardCalculator: toggleFunctions.callCardCalculator,
      toggleUserFieldType: toggleFunctions.userFieldType,
    }
  }
}
</script>

<style scoped>
/* Улучшение видимости радиобаттонов */
::v-deep .b24-switch__toggle {
  border: 2px solid #cbd5e0 !important; /* Добавляем обводку */
  background-color: white !important;
}

::v-deep .b24-switch__toggle--checked {
  border-color: #3b82f6 !important; /* Синяя обводка когда включено */
  background-color: #3b82f6 !important;
}

::v-deep .b24-switch__toggle--small {
  width: 36px !important;
  height: 20px !important;
}

::v-deep .b24-switch__toggle--small .b24-switch__thumb {
  width: 16px !important;
  height: 16px !important;
  transform: translateX(2px) !important;
}

::v-deep .b24-switch__toggle--small.b24-switch__toggle--checked .b24-switch__thumb {
  transform: translateX(16px) !important;
}

::v-deep .b24-switch__toggle--default {
  width: 44px !important;
  height: 24px !important;
}

::v-deep .b24-switch__toggle--default .b24-switch__thumb {
  width: 20px !important;
  height: 20px !important;
  transform: translateX(2px) !important;
}

::v-deep .b24-switch__toggle--default.b24-switch__toggle--checked .b24-switch__thumb {
  transform: translateX(20px) !important;
}

/* Улучшение видимости кнопок навигации слайдера */
button:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

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