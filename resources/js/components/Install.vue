<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Шапка с логотипом -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
          <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-3">
          Установка системы контроля времени сотрудников
        </h1>
        <p class="text-lg text-gray-600 mx-auto">
          Настройка и активация системы мониторинга активности и рабочего времени
        </p>
      </div>

      <!-- Прогресс-бар -->
      <div class="mx-auto mb-8">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-blue-600">Прогресс: {{ progress }}%</span>
          <span class="text-sm text-gray-500">{{ currentStep }}/{{ totalSteps }}</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
              class="h-full bg-blue-600 transition-all duration-500 ease-out"
              :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Контент установки -->
      <div class="mx-auto">
        <!-- Шаг 1: Приветствие -->
        <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Добро пожаловать в систему контроля времени
              </h2>
              <p class="text-gray-600 mb-6">
                Настройте систему мониторинга активности сотрудников, которая поможет оптимизировать рабочее время и повысить продуктивность.
              </p>
              <div class="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 class="text-lg font-semibold text-blue-800 mb-3">
                  Ключевые возможности системы
                </h3>
                <ul class="space-y-3">
                  <li v-for="feature in features" :key="feature.id" class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-700">{{ feature.text }}</span>
                  </li>
                </ul>
              </div>
              <div class="flex justify-end">
                <B24Button
                    @click="nextStep"
                    variant="primary"
                    size="large"
                    class="px-4 py-2"
                >
                  Начать настройку
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 2: Настройка основных функций -->
        <div v-else-if="currentStep === 2" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Настройка основных функций системы
              </h2>
              <p class="text-gray-600 mb-6">
                Выберите, какие функции системы контроля времени вы хотите активировать и настроить.
              </p>

              <!-- Карточки функций -->
              <div class="space-y-6 mb-8">
                <!-- Отслеживание посещений -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            Отслеживание посещений страниц
                          </h3>
                          <p class="text-sm text-gray-500">Сбор и хранение истории посещений страниц сотрудниками</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedFeatures.pageTracking"
                          :disabled="featureStatus.pageTracking.installed && selectedFeatures.pageTracking"
                          class="large-bordered-switch"
                      />
                    </div>

                    <div v-if="selectedFeatures.pageTracking" class="mt-4 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Дней хранения истории
                          </label>
                          <B24Input
                              v-model.number="configSettings.pageTracking.historyDays"
                              type="number"
                              :min="1"
                              :max="7"
                              class="w-full"
                          >
                            <template #suffix>
                              <span class="text-gray-500">дней</span>
                            </template>
                          </B24Input>
                        </div>
                      </div>
                      <div class="text-sm text-gray-600">
                        <div class="flex items-center">
                          <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>Автоматическое удаление старых записей</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </B24Card>

                <!-- Контроль присутствия -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            Контроль присутствия сотрудника
                          </h3>
                          <p class="text-sm text-gray-500">Автоматический мониторинг активности сотрудников</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedFeatures.presenceControl"
                          :disabled="featureStatus.presenceControl.installed && selectedFeatures.presenceControl"
                          class="large-bordered-switch"
                      />
                    </div>

                    <div v-if="selectedFeatures.presenceControl" class="mt-4 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Минут до проверки
                          </label>
                          <B24Input
                              v-model.number="configSettings.presenceControl.pageTimeThreshold"
                              type="number"
                              :min="1"
                              :max="60"
                              class="w-full"
                          >
                            <template #suffix>
                              <span class="text-gray-500">минут</span>
                            </template>
                          </B24Input>
                        </div>
                      </div>

                      <div class="flex items-center justify-between pt-3 border-t">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">Уведомлять руководителя</h4>
                          <p class="text-xs text-gray-500">При длительном отсутствии сотрудника</p>
                        </div>
                        <B24Switch
                            v-model="configSettings.presenceControl.notifyManager.enabled"
                            size="sm"
                        />
                      </div>

                      <div v-if="configSettings.presenceControl.notifyManager.enabled" class="space-y-3">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Секунд до уведомления
                          </label>
                          <B24Input
                              v-model.number="configSettings.presenceControl.notifyManager.absenceTimeThreshold"
                              type="number"
                              :min="10"
                              :max="300"
                              class="w-full"
                          >
                            <template #suffix>
                              <span class="text-gray-500">секунд</span>
                            </template>
                          </B24Input>
                        </div>
                      </div>
                    </div>
                  </div>
                </B24Card>

                <!-- Запрос отчетов -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            Запрос отчетов о деятельности
                          </h3>
                          <p class="text-sm text-gray-500">Руководители могут запрашивать отчеты у подчиненных</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedFeatures.subordinateReports"
                          :disabled="featureStatus.subordinateReports.installed && selectedFeatures.subordinateReports"
                          class="large-bordered-switch"
                      />
                    </div>

                    <div v-if="selectedFeatures.subordinateReports" class="mt-4 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Секунд на реакцию
                          </label>
                          <B24Input
                              v-model.number="configSettings.subordinateReports.employeeReactionTime"
                              type="number"
                              :min="10"
                              :max="300"
                              class="w-full"
                          >
                            <template #suffix>
                              <span class="text-gray-500">секунд</span>
                            </template>
                          </B24Input>
                        </div>
                      </div>
                    </div>
                  </div>
                </B24Card>
              </div>

              <!-- Кнопки навигации -->
              <div class="flex justify-between pt-6 border-t">
                <B24Button
                    @click="prevStep"
                    variant="outline"
                    size="large"
                    class="px-4 py-2"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Назад
                </B24Button>
                <B24Button
                    @click="nextStep"
                    variant="primary"
                    size="large"
                    :disabled="!hasSelectedFeatures"
                    class="px-4 py-2"
                >
                  Продолжить
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 3: Настройка встроек и хранилища -->
        <div v-else-if="currentStep === 3" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Настройка встроек и хранилища
              </h2>
              <p class="text-gray-600 mb-6">
                Зарегистрируйте необходимые встройки и настройте хранилище для данных системы.
              </p>

              <!-- Встройки -->
              <div class="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Регистрация встроек
                </h3>
                <div class="space-y-6">
                  <!-- PAGE_BACKGROUND_WORKER -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Фоновый калькулятор</p>
                        <p class="text-sm text-gray-500">Вычисления в фоновом режиме для обработки данных</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div v-if="placementStatus.pageBackgroundWorker === 'loading'" class="ml-4">
                        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div v-else-if="placementStatus.pageBackgroundWorker === 'success'" class="ml-4">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div v-else-if="placementStatus.pageBackgroundWorker === 'error'" class="ml-4">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </div>
                      <B24Switch
                          v-else
                          v-model="selectedPlacements.pageBackgroundWorker"
                          class="large-bordered-switch"
                      />
                    </div>
                  </div>

                  <!-- REST_APP_URI -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">REST приложение</p>
                        <p class="text-sm text-gray-500">Внешний REST API для интеграции с системой</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div v-if="placementStatus.restAppUri === 'loading'" class="ml-4">
                        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div v-else-if="placementStatus.restAppUri === 'success'" class="ml-4">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div v-else-if="placementStatus.restAppUri === 'error'" class="ml-4">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </div>
                      <B24Switch
                          v-else
                          v-model="selectedPlacements.restAppUri"
                          class="large-bordered-switch"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Хранилище -->
              <div class="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Настройка хранилища
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Хранилище активности</p>
                        <p class="text-sm text-gray-500">pr_tracking - Статистика посещений</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div v-if="storageStatus === 'loading'" class="ml-4">
                        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div v-else-if="storageStatus === 'success'" class="ml-4">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div v-else-if="storageStatus === 'error'" class="ml-4">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </div>
                      <B24Switch
                          v-else
                          v-model="selectedStorage"
                          class="large-bordered-switch"
                      />
                    </div>
                  </div>

                  <div v-if="selectedStorage" class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Свойства хранилища:</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">USER_ID:</span> ID пользователя
                      </div>
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">USER_NAME:</span> Имя пользователя
                      </div>
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">PAGE_URL:</span> URL страницы
                      </div>
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">PAGE_TIME:</span> Время на странице
                      </div>
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">PAGE_CATEGORY:</span> Категория страницы
                      </div>
                      <div class="text-xs bg-blue-50 p-2 rounded">
                        <span class="font-medium">TASK_ID:</span> ID связанной задачи
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Кнопки навигации -->
              <div class="flex justify-between pt-6 border-t">
                <B24Button
                    @click="prevStep"
                    variant="outline"
                    size="large"
                    class="px-4 py-2"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Назад
                </B24Button>
                <B24Button
                    @click="startInstallation"
                    variant="primary"
                    size="large"
                    :disabled="isInstalling"
                    class="px-4 py-2"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Установить
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 4: Установка и настройка -->
        <div v-else-if="currentStep === 4" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Установка системы
              </h2>
              <p class="text-gray-600 mb-6">
                Выполняется установка и настройка выбранных компонентов системы.
              </p>

              <!-- Прогресс установки -->
              <div class="mb-8">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-blue-600">
                    Прогресс: {{ installationProgress }}%
                  </span>
                  <span class="text-sm text-gray-500">{{ installedCount }}/{{ installationsToProcess }}</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                      class="h-full bg-blue-600 transition-all duration-300 ease-out"
                      :style="{ width: installationProgress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Детали установки -->
              <div class="space-y-4 mb-8">
                <!-- Хранилище -->
                <div class="flex items-center">
                  <div class="w-8 h-8 flex-shrink-0">
                    <div v-if="storageStatus === 'loading'">
                      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="storageStatus === 'success'">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div v-else-if="storageStatus === 'error'">
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                    <div v-else>
                      <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Регистрация хранилища</p>
                    <p class="text-xs text-gray-500">pr_tracking - Статистика посещений</p>
                  </div>
                </div>

                <!-- Встройки -->
                <div v-for="placement in placementsToInstall" :key="placement.id" class="flex items-center">
                  <div class="w-8 h-8 flex-shrink-0">
                    <div v-if="placementStatus[placement.id] === 'loading'">
                      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="placementStatus[placement.id] === 'success'">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div v-else-if="placementStatus[placement.id] === 'error'">
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                    <div v-else>
                      <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ placement.title }}</p>
                    <p class="text-xs text-gray-500">{{ placement.description }}</p>
                  </div>
                </div>

                <!-- Настройки приложения -->
                <div class="flex items-center">
                  <div class="w-8 h-8 flex-shrink-0">
                    <div v-if="settingsStatus === 'loading'">
                      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="settingsStatus === 'success'">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div v-else-if="settingsStatus === 'error'">
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                    <div v-else>
                      <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Настройка параметров системы</p>
                    <p class="text-xs text-gray-500">Сохранение настроек функций</p>
                  </div>
                </div>
              </div>

              <!-- Кнопки навигации -->
              <div class="flex justify-between pt-6 border-t">
                <B24Button
                    v-if="!installationComplete"
                    @click="prevStep"
                    variant="outline"
                    size="large"
                    :disabled="isInstalling"
                    class="px-4 py-2"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Назад
                </B24Button>
                <B24Button
                    v-if="installationComplete"
                    @click="nextStep"
                    variant="primary"
                    size="large"
                    class="px-4 py-2"
                >
                  Завершить
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 5: Завершение -->
        <div v-else-if="currentStep === 5" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Установка завершена!
              </h2>

              <div class="space-y-6">
                <p class="text-lg text-gray-700">
                  Система контроля времени сотрудников успешно установлена и настроена.
                </p>

                <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">
                    Что дальше?
                  </h3>
                  <p class="text-gray-600 mb-4">
                    Система готова к использованию. Вы можете начать мониторинг активности сотрудников прямо сейчас.
                  </p>

                  <!-- Информация об установленных компонентах -->
                  <div class="space-y-3">
                    <div v-if="selectedFeatures.pageTracking" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">Отслеживание посещений страниц</span>
                    </div>
                    <div v-if="selectedFeatures.presenceControl" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">Контроль присутствия сотрудников</span>
                    </div>
                    <div v-if="selectedFeatures.subordinateReports" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">Запрос отчетов о деятельности</span>
                    </div>
                    <div v-if="selectedPlacements.pageBackgroundWorker" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">Фоновый калькулятор</span>
                    </div>
                    <div v-if="selectedPlacements.restAppUri" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">REST приложение</span>
                    </div>
                    <div v-if="selectedStorage" class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm text-gray-700">Хранилище активности</span>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4 mt-6">
                    <a
                        href="mailto:it.galera@yandex.ru?subject=Поддержка приложения Автоматический контроль времени"
                        target="_blank"
                        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      Техническая поддержка
                    </a>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    Следующие шаги
                  </h3>
                  <ul class="space-y-3">
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      Перейдите в приложение для просмотра данных мониторинга
                    </li>
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      Настройте дополнительные параметры в разделе "Настройки"
                    </li>
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      Ознакомьте сотрудников с новыми возможностями системы
                    </li>
                  </ul>
                </div>

                <div class="flex justify-between pt-6 border-t">
                  <B24Button
                      @click="openApp"
                      variant="outline"
                      size="large"
                      class="px-4 py-2"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Перейти в приложение
                  </B24Button>
                  <div class="flex space-x-4">
                    <B24Button
                        @click="finishInstallation"
                        variant="primary"
                        size="large"
                        class="px-4 py-2"
                    >
                      Завершить установку
                    </B24Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue'
import {useToast} from '@bitrix24/b24ui-nuxt/composables/useToast'

const toast = useToast()

// Конфигурации встроек
const PLACEMENT_CONFIGS = {
  PAGE_BACKGROUND_WORKER: {
    title: 'Фоновый калькулятор',
    description: 'Вычисления в фоновом режиме для обработки данных',
    options: {
      errorHandlerUrl: `${window.location.origin}/placements/error-handler`
    }
  },
  REST_APP_URI: {
    title: 'REST приложение',
    description: 'Внешний REST API для интеграции с системой',
    options: {}
  }
}

export default {
  name: 'Install',
  setup() {
    // Состояние
    const currentStep = ref(1)
    const totalSteps = 5
    const progress = computed(() => Math.round((currentStep.value / totalSteps) * 100))

    // Выбранные функции
    const selectedFeatures = ref({
      pageTracking: true,
      presenceControl: true,
      subordinateReports: true
    })

    // Выбранные встройки
    const selectedPlacements = ref({
      pageBackgroundWorker: true,
      restAppUri: true
    })

    // Хранилище
    const selectedStorage = ref(true)

    // Настройки по умолчанию
    const configSettings = ref({
      pageTracking: {
        historyDays: 30
      },
      presenceControl: {
        pageTimeThreshold: 5,
        notifyManager: {
          enabled: true,
          absenceTimeThreshold: 300,
          method: 'chat'
        }
      },
      subordinateReports: {
        employeeReactionTime: 300,
        responseMethod: 'chat',
        deliveryMethod: 'chat'
      }
    })

    // Статус установки
    const isInstalling = ref(false)
    const installationComplete = ref(false)
    const installedCount = ref(0)

    // Статусы компонентов
    const featureStatus = ref({
      pageTracking: {installed: false, checking: false},
      presenceControl: {installed: false, checking: false},
      subordinateReports: {installed: false, checking: false}
    })

    const placementStatus = ref({
      pageBackgroundWorker: null,
      restAppUri: null
    })

    const storageStatus = ref(null)
    const settingsStatus = ref(null)

    // URL обработчиков
    const HANDLERS = {
      pageBackgroundWorker: `${window.location.origin}/placements/page-background-worker`,
      restAppUri: `${window.location.origin}/app`
    }

    // Функции для работы с Bitrix24 API
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

      installFinish: () => {
        return new Promise((resolve, reject) => {
          if (typeof BX24 === 'undefined') {
            reject(new Error('Библиотека Bitrix24 не доступна'))
            return
          }

          BX24.installFinish()
          resolve()
        })
      },

      getPlacements: async () => {
        try {
          const result = await bitrixAPI.call('placement.get', {})
          console.log('Список встроек:', result)
          return result || []
        } catch (error) {
          console.error('Ошибка при получении списка встроек:', error)
          return []
        }
      },

      // Методы для работы с хранилищем
      registerStorage: async (entityId, storageName) => {
        try {
          const result = await bitrixAPI.call('bizproc.storage.register', {
            entityId: entityId,
            storageName: storageName
          })
          console.log('Хранилище зарегистрировано:', result)
          return result
        } catch (error) {
          console.error('Ошибка регистрации хранилища:', error)
          throw error
        }
      },

      // Методы для работы с настройками
      setAppOption: async (key, value) => {
        try {
          const result = await bitrixAPI.call('app.option.set', {
            options: {[key]: value}
          })
          return result
        } catch (error) {
          console.error('Ошибка сохранения настройки:', error)
          throw error
        }
      }
    }

    // Менеджер встроек
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
                    GROUP_NAME: 'Инструменты контроля времени'
                  },
                  en: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Time control tools'
                  },
                  be: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Інструменты кантролю часу'
                  },
                  kk: {
                    TITLE: config.title,
                    DESCRIPTION: config.description,
                    GROUP_NAME: 'Уақытты бақылау құралдары'
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

    // Сохранение настроек приложения
    const saveSettings = async () => {
      settingsStatus.value = 'loading'
      try {
        const settingsToSave = {
          // Основные функции
          page_tracking_enabled: selectedFeatures.value.pageTracking ? 'Y' : 'N',
          presence_control_enabled: selectedFeatures.value.presenceControl ? 'Y' : 'N',
          subordinate_reports_enabled: selectedFeatures.value.subordinateReports ? 'Y' : 'N',

          // Настройки отслеживания посещений
          page_tracking_history_days: configSettings.value.pageTracking.historyDays.toString(),

          // Настройки контроля присутствия
          presence_page_time_threshold: configSettings.value.presenceControl.pageTimeThreshold.toString(),
          notify_manager_enabled: configSettings.value.presenceControl.notifyManager.enabled ? 'Y' : 'N',
          absence_time_threshold: configSettings.value.presenceControl.notifyManager.absenceTimeThreshold.toString(),
          notification_method: configSettings.value.presenceControl.notifyManager.method,

          // Настройки отчетов
          employee_reaction_time: configSettings.value.subordinateReports.employeeReactionTime.toString(),
          response_method: configSettings.value.subordinateReports.responseMethod,
          delivery_method: configSettings.value.subordinateReports.deliveryMethod,

          // Флаг завершенной установки
          installation_completed: 'Y'
        }

        // Сохраняем все настройки
        for (const [key, value] of Object.entries(settingsToSave)) {
          await bitrixAPI.setAppOption(key, value)
        }

        settingsStatus.value = 'success'
        installedCount.value++
        return true
      } catch (error) {
        console.error('Ошибка сохранения настроек:', error)
        settingsStatus.value = 'error'
        return false
      }
    }

    // Регистрация хранилища
    const registerStorage = async () => {
      storageStatus.value = 'loading'
      try {
        await bitrixAPI.registerStorage('pr_tracking', 'Статистика посещений')
        storageStatus.value = 'success'
        installedCount.value++
        return true
      } catch (error) {
        console.error('Ошибка регистрации хранилища:', error)
        storageStatus.value = 'error'
        return false
      }
    }

    // Регистрация встроек
    const registerPlacements = async () => {
      const placementsToInstall = []

      if (selectedPlacements.value.pageBackgroundWorker) {
        placementsToInstall.push({
          id: 'pageBackgroundWorker',
          type: 'PAGE_BACKGROUND_WORKER',
          handler: HANDLERS.pageBackgroundWorker,
          title: 'Фоновый калькулятор',
          description: 'Вычисления в фоновом режиме'
        })
      }

      if (selectedPlacements.value.restAppUri) {
        placementsToInstall.push({
          id: 'restAppUri',
          type: 'REST_APP_URI',
          handler: HANDLERS.restAppUri,
          title: 'REST приложение',
          description: 'Внешний REST API'
        })
      }

      for (const placement of placementsToInstall) {
        placementStatus.value[placement.id] = 'loading'
        try {
          await placementManager.bind(placement.type, placement.handler)
          placementStatus.value[placement.id] = 'success'
          installedCount.value++
        } catch (error) {
          console.error(`Ошибка регистрации встройки ${placement.type}:`, error)
          placementStatus.value[placement.id] = 'error'
        }
      }

      return placementsToInstall
    }

    // Основная функция установки
    const startInstallation = async () => {
      isInstalling.value = true
      currentStep.value = 4
      installedCount.value = 0

      // Сбрасываем статусы
      placementStatus.value = {
        pageBackgroundWorker: null,
        restAppUri: null
      }
      storageStatus.value = null
      settingsStatus.value = null

      try {
        // 1. Регистрация хранилища
        if (selectedStorage.value) {
          await registerStorage()
        }

        // 2. Регистрация встроек
        const placements = await registerPlacements()

        // 3. Сохранение настроек
        await saveSettings()

        installationComplete.value = true
        toast.add({
          description: 'Система успешно установлена и настроена',
          variant: 'success'
        })
      } catch (error) {
        console.error('Ошибка установки:', error)
        toast.add({
          description: 'Произошла ошибка при установке системы',
          variant: 'error'
        })
      } finally {
        isInstalling.value = false
      }
    }

    // Вычисляемые свойства
    const hasSelectedFeatures = computed(() => {
      return Object.values(selectedFeatures.value).some(value => value === true)
    })

    const placementsToInstall = computed(() => {
      const placements = []

      if (selectedPlacements.value.pageBackgroundWorker) {
        placements.push({
          id: 'pageBackgroundWorker',
          title: 'Фоновый калькулятор',
          description: 'Вычисления в фоновом режиме'
        })
      }

      if (selectedPlacements.value.restAppUri) {
        placements.push({
          id: 'restAppUri',
          title: 'REST приложение',
          description: 'Внешний REST API'
        })
      }

      return placements
    })

    const installationsToProcess = computed(() => {
      let count = 0

      // Хранилище
      if (selectedStorage.value) count++

      // Встройки
      if (selectedPlacements.value.pageBackgroundWorker) count++
      if (selectedPlacements.value.restAppUri) count++

      // Настройки (всегда 1)
      count++

      return count
    })

    const installationProgress = computed(() => {
      if (installationsToProcess.value === 0) return 0
      return Math.round((installedCount.value / installationsToProcess.value) * 100)
    })

    const features = computed(() => [
      {id: 1, text: 'Автоматическое отслеживание посещений страниц сотрудниками'},
      {id: 2, text: 'Мониторинг активности и присутствия на рабочем месте'},
      {id: 3, text: 'Запрос и получение отчетов о деятельности подчиненных'},
      {id: 4, text: 'Безопасное хранение данных в защищенном хранилище Bitrix24'},
      {id: 5, text: 'Гибкая настройка параметров мониторинга'}
    ])

    // Методы навигации
    const nextStep = () => {
      if (currentStep.value < totalSteps) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const finishInstallation = async () => {
      try {
        await bitrixAPI.installFinish()
      } catch (error) {
        console.error('Ошибка завершения установки:', error)
        toast.add({
          description: 'Ошибка завершения установки',
          variant: 'error'
        })
      }
    }

    const openApp = () => {
      window.location.href = '/app'
    }

    return {
      // Состояние
      currentStep,
      totalSteps,
      progress,
      selectedFeatures,
      selectedPlacements,
      selectedStorage,
      configSettings,
      isInstalling,
      installationComplete,
      installedCount,
      featureStatus,
      placementStatus,
      storageStatus,
      settingsStatus,

      // Вычисляемые свойства
      hasSelectedFeatures,
      placementsToInstall,
      installationsToProcess,
      installationProgress,
      features,

      // Методы
      nextStep,
      prevStep,
      startInstallation,
      finishInstallation,
      openApp
    }
  }
}
</script>

<style scoped>
/* Стили для свитчей */
::v-deep .b24-switch__toggle {
  border: 2px solid #cbd5e0 !important;
  background-color: white !important;
}

::v-deep .b24-switch__toggle--checked {
  border-color: #3b82f6 !important;
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

/* Стили для отключенного свитча */
::v-deep .b24-switch__toggle--disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

::v-deep .b24-switch__toggle--disabled.b24-switch__toggle--checked {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

/* Анимации */
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

/* Плавные переходы */
.transition-all {
  transition-property: all;
}

.transition-colors {
  transition-property: background-color, border-color, color;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

/* Тени при наведении */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>