<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-4 md:py-8">
      <!-- Шапка с логотипом -->
      <div class="text-center mb-8 md:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl mb-4 md:mb-6">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
          Установка системы контроля времени сотрудников
        </h1>
        <p class="text-base md:text-lg text-gray-600 mx-auto max-w-2xl px-4">
          Настройка и активация системы мониторинга активности и рабочего времени
        </p>
      </div>

      <!-- Прогресс-бар -->
      <div class="mx-auto mb-6 md:mb-8 max-w-3xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs md:text-sm font-medium text-blue-600">Прогресс: {{ progress }}%</span>
          <span class="text-xs md:text-sm text-gray-500">{{ currentStep }}/{{ totalSteps }}</span>
        </div>
        <div class="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
              class="h-full bg-blue-600 transition-all duration-500 ease-out"
              :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Контент установки -->
      <div class="mx-auto max-w-4xl">
        <!-- Шаг 1: Приветствие -->
        <B24Card v-if="currentStep === 1" class="mb-8">
          <div class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-start md:space-x-6">
              <div class="hidden md:flex md:flex-shrink-0 mb-4 md:mb-0">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Добро пожаловать в систему контроля времени
                </h2>
                <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Настройте систему мониторинга активности сотрудников, которая поможет оптимизировать рабочее время и повысить продуктивность.
                </p>

                <div class="bg-blue-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                  <h3 class="text-base md:text-lg font-semibold text-blue-800 mb-3">
                    Ключевые возможности системы
                  </h3>
                  <ul class="space-y-2 md:space-y-3">
                    <li v-for="feature in features" :key="feature.id" class="flex items-start">
                      <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 md:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-sm md:text-base text-gray-700">{{ feature.text }}</span>
                    </li>
                  </ul>
                </div>

                <div class="flex justify-end">
                  <B24Button
                      @click="nextStep"
                      variant="primary"
                      size="large"
                      class="w-full md:w-auto px-4 py-2 text-sm md:text-base"
                  >
                    Начать настройку
                    <svg class="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </B24Button>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Шаг 2: Настройка основных функций -->
        <B24Card v-else-if="currentStep === 2" class="mb-8">
          <div class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-start md:space-x-6">
              <div class="hidden md:flex md:flex-shrink-0 mb-4 md:mb-0">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Настройка основных функций системы
                </h2>
                <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Выберите, какие функции системы контроля времени вы хотите активировать и настроить.
                </p>

                <!-- Карточки функций -->
                <div class="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <!-- Отслеживание посещений -->
                  <B24Card class="hover:shadow-lg transition-shadow duration-300">
                    <div class="p-4 md:p-6">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">
                              Отслеживание посещений страниц пользователями
                            </h3>
                            <p class="text-xs md:text-sm text-gray-500">Сбор и хранение истории посещений страниц сотрудниками</p>
                          </div>
                        </div>
                        <div class="flex items-center justify-end space-x-3">
                          <div class="w-2 h-2 rounded-full" :class="selectedFeatures.pageTracking ? 'bg-green-500' : 'bg-red-500'"></div>
                          <B24Switch
                              v-model="selectedFeatures.pageTracking"
                              :disabled="isInstalling"
                              class="large-bordered-switch"
                              size="sm"
                          />
                        </div>
                      </div>

                      <div v-if="selectedFeatures.pageTracking" class="space-y-4 pt-4 border-t">
                        <h4 class="text-sm font-medium text-gray-900 mb-3 md:mb-4">
                          Настройки хранения истории
                        </h4>

                        <B24FormField
                            label="Количество дней хранения истории посещений"
                            name="historyDays"
                            :help-text="`Текущее значение: ${configSettings.pageTracking.historyDays} дней`"
                        >
                          <div class="space-y-4">
                            <div>
                              <B24Input
                                  v-model.number="configSettings.pageTracking.historyDays"
                                  :disabled="isInstalling"
                                  :min="1"
                                  :max="30"
                                  type="number"
                                  class="w-full"
                                  size="sm"
                                  @blur="validateHistoryDays"
                              >
                                <template #suffix>
                                  <span class="text-xs md:text-sm text-gray-500">дней</span>
                                </template>
                              </B24Input>
                            </div>
                            <div class="space-y-2">
                              <input
                                  type="range"
                                  v-model.number="configSettings.pageTracking.historyDays"
                                  :disabled="isInstalling"
                                  min="1"
                                  max="30"
                                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  @input="validateHistoryDays"
                              >
                              <div class="flex justify-between text-xs text-gray-500">
                                <span>1 день</span>
                                <span>30 дней</span>
                              </div>
                            </div>
                          </div>

                          <div v-if="historyDaysError" class="mt-2 text-xs md:text-sm text-red-600 flex items-start">
                            <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                            </svg>
                            <span>{{ historyDaysError }}</span>
                          </div>

                          <div class="mt-3">
                            <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                              <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <div class="text-xs md:text-sm text-blue-700">
                                <span class="font-medium">Важно:</span> Система будет автоматически удалять записи о посещениях, которые старше указанного количества дней.
                                Это помогает поддерживать оптимальный размер внутреннего хранилища.
                              </div>
                            </div>
                          </div>
                        </B24FormField>

                        <!-- Информация о системе отслеживания -->
                        <div class="space-y-3 mt-4 md:mt-6">
                          <h4 class="text-sm font-medium text-gray-900">
                            Как работает система отслеживания:
                          </h4>
                          <div class="space-y-2 md:space-y-3">
                            <div v-for="(item, index) in [
      'Система записывает посещение страницы сотрудником, если он задерживается на странице больше 10 секунд (сократить эту задержку в данной версии приложения нельзя).',
      'Для каждого посещения сохраняется URL страницы, время нахождения, пользователь и категория страницы.',
      'Данные сохраняются в хранилище Bitrix24 с группировкой по дням.',
      'Данные из хранилища Bitrix24 об истории посещения страниц пользователям отображаются в удобном для восприятия виде на странице приложения - История посещений. Здесь пользователь может изучить свои затраты времени на каждой странице и, при желании, добавить время в задачи.',
      `История посещений хранится ${configSettings.pageTracking.historyDays} дней, после чего старые записи автоматически удаляются.`
    ]" :key="index" class="flex items-start">
                              <div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                                <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
                              </div>
                              <p class="text-xs md:text-sm text-gray-700">{{ item }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </B24Card>

                  <!-- Контроль присутствия -->
                  <B24Card class="hover:shadow-lg transition-shadow duration-300">
                    <div class="p-4 md:p-6">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">
                              Контроль присутствия сотрудника
                            </h3>
                            <p class="text-xs md:text-sm text-gray-500">Автоматическая проверка реального присутствия сотрудника на рабочем месте с открытым Битрикс24</p>
                          </div>
                        </div>
                        <div class="flex items-center justify-end space-x-3">
                          <div class="w-2 h-2 rounded-full" :class="selectedFeatures.presenceControl ? 'bg-green-500' : 'bg-red-500'"></div>
                          <B24Switch
                              v-model="selectedFeatures.presenceControl"
                              :disabled="isInstalling"
                              class="large-bordered-switch"
                              size="sm"
                          />
                        </div>
                      </div>

                      <div v-if="selectedFeatures.presenceControl" class="space-y-4 pt-4 border-t">
                        <B24FormField
                            label="Время на странице до проверки присутствия"
                            name="pageTimeThreshold"
                            :help-text="`Текущее значение: ${configSettings.presenceControl.pageTimeThreshold} минут`"
                        >
                          <div class="space-y-4">
                            <div>
                              <B24Input
                                  v-model.number="configSettings.presenceControl.pageTimeThreshold"
                                  :disabled="isInstalling"
                                  :min="1"
                                  :max="60"
                                  type="number"
                                  class="w-full"
                                  size="sm"
                                  @blur="validatePageTimeThreshold"
                              >
                                <template #suffix>
                                  <span class="text-xs md:text-sm text-gray-500">минут</span>
                                </template>
                              </B24Input>
                            </div>
                            <div class="space-y-2">
                              <input
                                  type="range"
                                  v-model.number="configSettings.presenceControl.pageTimeThreshold"
                                  :disabled="isInstalling"
                                  min="1"
                                  max="60"
                                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  @input="validatePageTimeThreshold"
                              >
                              <div class="flex justify-between text-xs text-gray-500">
                                <span>1 минута</span>
                                <span>60 минут</span>
                              </div>
                            </div>
                          </div>

                          <div v-if="pageTimeThresholdError" class="mt-2 text-xs md:text-sm text-red-600 flex items-start">
                            <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                            </svg>
                            <span>{{ pageTimeThresholdError }}</span>
                          </div>

                          <div class="space-y-3 pt-3 md:pt-4">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div class="flex-1 mb-3 sm:mb-0">
                                <h4 class="text-sm font-medium text-gray-900 mb-1">
                                  Уведомлять руководителя об отсутствии на рабочем месте
                                </h4>
                                <p class="text-xs text-gray-500">
                                  Отправлять уведомление руководителю при длительном отсутствии сотрудника
                                </p>
                              </div>
                              <div class="flex items-center justify-end space-x-3">
                                <div class="w-2 h-2 rounded-full" :class="configSettings.presenceControl.notifyManager.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                                <B24Switch
                                    v-model="configSettings.presenceControl.notifyManager.enabled"
                                    @update:modelValue="toggleNotifyManager"
                                    :disabled="isInstalling"
                                    size="sm"
                                />
                              </div>
                            </div>

                            <div v-if="configSettings.presenceControl.notifyManager.enabled" class="space-y-4">
                              <B24FormField
                                  label="Время на подтверждение присутствия"
                                  name="absenceTimeThreshold"
                                  :help-text="`Текущее значение: ${configSettings.presenceControl.notifyManager.absenceTimeThreshold} секунд`"
                              >
                                <div class="space-y-4">
                                  <div>
                                    <B24Input
                                        v-model.number="configSettings.presenceControl.notifyManager.absenceTimeThreshold"
                                        :disabled="isInstalling"
                                        :min="10"
                                        :max="300"
                                        type="number"
                                        class="w-full"
                                        size="sm"
                                        @blur="validateAbsenceTimeThreshold"
                                    >
                                      <template #suffix>
                                        <span class="text-xs md:text-sm text-gray-500">секунд</span>
                                      </template>
                                    </B24Input>
                                  </div>
                                  <div class="space-y-2">
                                    <input
                                        type="range"
                                        v-model.number="configSettings.presenceControl.notifyManager.absenceTimeThreshold"
                                        :disabled="isInstalling"
                                        min="10"
                                        max="300"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        @input="validateAbsenceTimeThreshold"
                                    >
                                    <div class="flex justify-between text-xs text-gray-500">
                                      <span>10 сек</span>
                                      <span>5 мин</span>
                                    </div>
                                  </div>
                                </div>

                                <div v-if="absenceTimeThresholdError" class="mt-2 text-xs md:text-sm text-red-600 flex items-start">
                                  <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                  </svg>
                                  <span>{{ absenceTimeThresholdError }}</span>
                                </div>

                                <div class="mt-3">
                                  <div class="flex items-start p-3 bg-yellow-50 rounded-lg">
                                    <svg class="w-4 h-4 md:w-5 md:h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                    </svg>
                                    <div class="text-xs md:text-sm text-yellow-700">
                                      <span class="font-medium">Примечание:</span> Уведомление будет отправлено
                                      руководителю, если сотрудник отсутствует непрерывно более указанного времени.
                                    </div>
                                  </div>
                                </div>
                              </B24FormField>

                              <B24FormField
                                  label="Способ уведомления"
                                  name="notificationMethod"
                              >
                                <B24RadioGroup
                                    v-model="configSettings.presenceControl.notifyManager.method"
                                    :disabled="isInstalling"
                                    :items="[
                                        {
                                            label: 'Чат',
                                            value: 'chat',
                                            description: 'Сообщение в чате'
                                        },
                                        {
                                            label: 'Push',
                                            value: 'push',
                                            description: 'Системное уведомление'
                                        },
                                        {
                                            label: 'Оба',
                                            value: 'all',
                                            description: 'Оба способа'
                                        }
                                    ]"
                                    orientation="vertical"
                                    variant="card"
                                    size="sm"
                                    default-value="push"
                                    indicator="end"
                                    class="space-y-2"
                                />
                              </B24FormField>
                            </div>
                          </div>
                        </B24FormField>

                        <!-- Информация о системе контроля присутствия -->
                        <div class="space-y-3 mt-4 md:mt-6">
                          <h4 class="text-sm font-medium text-gray-900">
                            Как работает система контроля присутствия
                          </h4>
                          <div class="space-y-2 md:space-y-3">
                            <div v-for="(item, index) in [
      `Через ${configSettings.presenceControl.pageTimeThreshold} минут с момента открытия сотрудником страницы будет всплывать модальное окно с кнопкой подтверждения присутствия, которая доступна для нажатия ${configSettings.presenceControl.notifyManager.absenceTimeThreshold} секунд.`,
      `Если пользователь действительно присутствует на рабочем месте, нажатие кнопки "Я здесь" закроет модальное окно и время на странице будет фиксироваться дальше. В противном случае, учет времени на странице останавливается, пока пользователь не подаст признаки активности в Битрикс24.`,
                            configSettings.presenceControl.notifyManager.enabled ? `По истечении ${configSettings.presenceControl.notifyManager.absenceTimeThreshold} секунд с момента появления модального окна у сотрудника, руководителю будет отправлено уведомление о том, что пользователь не подтвердил своего присутствия на рабочем месте.` : null
                            ].filter(Boolean)" :key="index" class="flex items-start">
                            <div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                              <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
                            </div>
                            <p class="text-xs md:text-sm text-gray-700">{{ item }}</p>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                </div>
        </B24Card>

        <!-- Разрешить запрос отчета о деятельности подчиненных -->
        <B24Card class="hover:shadow-lg transition-shadow duration-300">
          <div class="p-4 md:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div class="flex items-center space-x-3 mb-3 sm:mb-0">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">
                    Разрешить запрос отчета о деятельности подчиненных
                  </h3>
                  <p class="text-xs md:text-sm text-gray-500">Удобный механизм для получения информации от сотрудника о том, чем он занимается в данный момент</p>
                </div>
              </div>
              <div class="flex items-center justify-end space-x-3">
                <div class="w-2 h-2 rounded-full" :class="selectedFeatures.subordinateReports ? 'bg-green-500' : 'bg-red-500'"></div>
                <B24Switch
                    v-model="selectedFeatures.subordinateReports"
                    :disabled="isInstalling"
                    class="large-bordered-switch"
                    size="sm"
                />
              </div>
            </div>

            <div v-if="selectedFeatures.subordinateReports" class="space-y-4 pt-4 border-t">
              <B24FormField
                  label="Время на реакцию сотрудника"
                  name="employeeReactionTime"
                  :help-text="`Текущее значение: ${configSettings.subordinateReports.employeeReactionTime} секунд`"
              >
                <div class="space-y-4">
                  <div>
                    <B24Input
                        v-model.number="configSettings.subordinateReports.employeeReactionTime"
                        :disabled="isInstalling"
                        :min="10"
                        :max="300"
                        type="number"
                        class="w-full"
                        size="sm"
                        @blur="validateEmployeeReactionTime"
                    >
                      <template #suffix>
                        <span class="text-xs md:text-sm text-gray-500">секунд</span>
                      </template>
                    </B24Input>
                  </div>
                  <div class="space-y-2">
                    <input
                        type="range"
                        v-model.number="configSettings.subordinateReports.employeeReactionTime"
                        :disabled="isInstalling"
                        min="10"
                        max="300"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        @input="validateEmployeeReactionTime"
                    >
                    <div class="flex justify-between text-xs text-gray-500">
                      <span>10 сек</span>
                      <span>5 мин</span>
                    </div>
                  </div>
                </div>

                <div v-if="employeeReactionTimeError" class="mt-2 text-xs md:text-sm text-red-600 flex items-start">
                  <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <span>{{ employeeReactionTimeError }}</span>
                </div>

                <div class="mt-3">
                  <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                    <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="text-xs md:text-sm text-blue-700">
                      <span class="font-medium">Важно:</span> Сотруднику предоставляется указанное количество
                      секунд для подготовки и отправки отчета руководителю.
                      Если отчет не будет предоставлен в течение этого времени, его заполнение сотруднику станет не доступно. Заполнение отчета не доступно на мобильных устройствах.
                      Данные условия обеспечивают не только оперативное получение обратной связи от сотрудников, но и гарантируют, что сотрудник действительно находится на рабочем месте и, вероятно, занимается тем, что описывает в отчете.
                    </div>
                  </div>
                </div>
              </B24FormField>

              <B24FormField
                  label="Способ получения ответа"
                  name="responseMethod"
                  :help-text="`Текущий способ: ${getResponseMethodText()}`"
              >
                <B24RadioGroup
                    v-model="configSettings.subordinateReports.responseMethod"
                    :disabled="isInstalling"
                    :items="[
                                  {
                                      label: 'Чат',
                                      value: 'chat',
                                      description: 'Ответ в чате'
                                  },
                                  {
                                      label: 'Push',
                                      value: 'push',
                                      description: 'Ответ через push'
                                  },
                                  {
                                      label: 'Оба',
                                      value: 'all',
                                      description: 'Оба способа'
                                  }
                              ]"
                    orientation="vertical"
                    variant="card"
                    size="sm"
                    default-value="push"
                    indicator="end"
                    class="space-y-2"
                />
              </B24FormField>

              <B24FormField
                  label="Способ доставки запроса подчиненному"
                  name="deliveryMethod"
                  :help-text="`Текущий способ: ${getDeliveryMethodText()}`"
              >
                <B24RadioGroup
                    v-model="configSettings.subordinateReports.deliveryMethod"
                    :disabled="isInstalling"
                    :items="[
                                  {
                                      label: 'Чат',
                                      value: 'chat',
                                      description: 'Запрос через чат'
                                  },
                                  {
                                      label: 'Push',
                                      value: 'push',
                                      description: 'Запрос через push'
                                  },
                                  {
                                      label: 'Оба',
                                      value: 'all',
                                      description: 'Оба способа'
                                  }
                              ]"
                    orientation="vertical"
                    variant="card"
                    size="sm"
                    default-value="push"
                    indicator="end"
                    class="space-y-2"
                />
              </B24FormField>

              <!-- Информация о системе запросов отчетов -->
              <div class="space-y-3 mt-4 md:mt-6">
                <h4 class="text-sm font-medium text-gray-900">
                  Как работает система запросов отчетов
                </h4>
                <div class="space-y-2 md:space-y-3">
                  <div v-for="(item, index) in [
      'В списке "Время всех сотрудников" в истории посещений в блоке пользователя появляется кнопка "Запросить отчет", которая инициирует запрос обратной связи от сотрудника.',
                  `Сотруднику отправляется уведомление через ${getDeliveryMethodText()} с прикрепленной ссылкой на заполнение короткой формы и предоставляется ${configSettings.subordinateReports.employeeReactionTime} секунд для подготовки отчета.`,
                  'Сотрудник заполняет форму, описывая, чем занимается в данный момент.',
                  `Информация, внесенная сотрудником в отчет автоматически возвращается инициатору запроса через ${getResponseMethodText()}.`
                  ]" :key="index" class="flex items-start">
                  <div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                    <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
                  </div>
                  <p class="text-xs md:text-sm text-gray-700">{{ item }}</p>
                </div>
              </div>
            </div>
            </div>
          </div>
      </div>
      </B24Card>

      <!-- Помощь в старте рабочего дня -->
      <B24Card class="hover:shadow-lg transition-shadow duration-300">
        <div class="p-4 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div class="flex items-center space-x-3 mb-3 sm:mb-0">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">
                  Помощь в старте рабочего дня
                </h3>
                <p class="text-xs md:text-sm text-gray-500">Автоматическая помощь сотрудникам в своевременном начале рабочего дня</p>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3">
              <div class="w-2 h-2 rounded-full" :class="selectedFeatures.workdayStart ? 'bg-green-500' : 'bg-red-500'"></div>
              <B24Switch
                  v-model="selectedFeatures.workdayStart"
                  :disabled="isInstalling"
                  class="large-bordered-switch"
                  size="sm"
              />
            </div>
          </div>

          <div v-if="selectedFeatures.workdayStart" class="space-y-4 pt-4 border-t">
            <B24FormField
                label="Способ старта рабочего дня"
                name="workdayStartMethod"
                :help-text="`Текущий способ: ${getWorkdayStartMethodText()}`"
            >
              <B24RadioGroup
                  v-model="configSettings.workdayStart.method"
                  :disabled="isInstalling"
                  :items="[
                                  {
                                      label: 'Автоматический старт',
                                      value: 'auto',
                                      description: 'Рабочий день начинается автоматически при открытии'
                                  },
                                  {
                                      label: 'Модальное окно',
                                      value: 'modal',
                                      description: 'Показывать окно с предложением начать рабочий день'
                                  }
                              ]"
                  orientation="vertical"
                  variant="card"
                  size="sm"
                  default-value="modal"
                  indicator="end"
                  class="space-y-2"
              />
            </B24FormField>

            <!-- Информация о системе помощи -->
            <div class="space-y-3 mt-4 md:mt-6">
              <h4 class="text-sm font-medium text-gray-900">
                Как работает помощь в завершении рабочего дня
              </h4>
              <div class="space-y-2 md:space-y-3">
                <div v-for="(item, index) in [
      'При открытии страницы портала, система проверяет, запущен ли рабочий день пользователя и является ли текущее время рабочим.',
      configSettings.workdayEnd.method === 'auto' ? 'Автоматическое завершение: рабочий день закрывается автоматически без участия сотрудника.' : 'Модальное окно: показывается окно с кнопкой "Завершить рабочий день", пока сотрудник не завершит рабочий день.'
                ]" :key="index" class="flex items-start">
                <div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
                </div>
                <p class="text-xs md:text-sm text-gray-700">{{ item }}</p>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
    </div>
    </B24Card>

    <!-- Помощь в завершении рабочего дня -->
    <B24Card class="hover:shadow-lg transition-shadow duration-300">
      <div class="p-4 md:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div class="flex items-center space-x-3 mb-3 sm:mb-0">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">
                Помощь в завершении рабочего дня
              </h3>
              <p class="text-xs md:text-sm text-gray-500">Автоматическая помощь сотрудникам в своевременном завершении рабочего дня</p>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3">
            <div class="w-2 h-2 rounded-full" :class="selectedFeatures.workdayEnd ? 'bg-green-500' : 'bg-red-500'"></div>
            <B24Switch
                v-model="selectedFeatures.workdayEnd"
                :disabled="isInstalling"
                class="large-bordered-switch"
                size="sm"
            />
          </div>
        </div>

        <div v-if="selectedFeatures.workdayEnd" class="space-y-4 pt-4 border-t">
          <B24FormField
              label="Способ завершения рабочего дня"
              name="workdayEndMethod"
              :help-text="`Текущий способ: ${getWorkdayEndMethodText()}`"
          >
            <B24RadioGroup
                v-model="configSettings.workdayEnd.method"
                :disabled="isInstalling"
                :items="[
                                  {
                                      label: 'Автоматическое завершение',
                                      value: 'auto',
                                      description: 'Рабочий день завершается автоматически'
                                  },
                                  {
                                      label: 'Модальное окно',
                                      value: 'modal',
                                      description: 'Показывать окно с предложением завершить рабочий день'
                                  }
                              ]"
                orientation="vertical"
                variant="card"
                size="sm"
                default-value="modal"
                indicator="end"
                class="space-y-2"
            />
          </B24FormField>

          <!-- Информация о системе помощи -->
          <div class="space-y-3 mt-4 md:mt-6">
            <h4 class="text-sm font-medium text-gray-900">
              Как работает помощь в завершении рабочего дня
            </h4>
            <div class="space-y-2 md:space-y-3">
              <div v-for="(item, index) in [
                              'При открытии страницы портала, система проверяет, запущен ли рабочий день пользователя и является ли текущее время рабочим.',
                              configSettings.workdayEnd.method === 'auto' ? 'Автоматическое завершение: рабочий день закрывается автоматически без участия сотрудника.' : 'Модальное окно: показывается окно с кнопкой "Завершить рабочий день", пока сотрудник не завершит рабочий день.'
              ]" :key="index" class="flex items-start">
              <div class="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
              </div>
              <p class="text-xs md:text-sm text-gray-700">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>
  </div>
  </B24Card>
  </div>

  <!-- Кнопки навигации -->
  <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
    <B24Button
        @click="prevStep"
        variant="outline"
        size="large"
        class="w-full sm:w-auto px-4 py-2 text-sm md:text-base order-2 sm:order-1"
    >
      <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Назад
    </B24Button>
    <B24Button
        @click="nextStep"
        variant="primary"
        size="large"
        :disabled="!hasSelectedFeatures"
        class="w-full sm:w-auto px-4 py-2 text-sm md:text-base order-1 sm:order-2"
    >
      Продолжить
      <svg class="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </B24Button>
  </div>
  </div>
  </div>
  </div>
  </B24Card>

  <!-- Шаг 3: Установка и настройка -->
  <B24Card v-else-if="currentStep === 3" class="mb-8">
    <div class="p-4 md:p-6">
      <div class="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div class="hidden md:flex md:flex-shrink-0 mb-4 md:mb-0">
          <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
            Установка системы
          </h2>
          <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            Выполняется установка и настройка выбранных компонентов системы.
          </p>

          <!-- Прогресс установки -->
          <div class="mb-6 md:mb-8">
            <div class="flex items-center justify-between mb-2">
                    <span class="text-xs md:text-sm font-medium text-blue-600">
                      Прогресс: {{ installationProgress }}%
                    </span>
              <span class="text-xs md:text-sm text-gray-500">{{ installedCount }}/{{ installationsToProcess }}</span>
            </div>
            <div class="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                  class="h-full bg-blue-600 transition-all duration-300 ease-out"
                  :style="{ width: installationProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Детали установки -->
          <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <!-- Хранилище активности -->
            <div class="flex items-center">
              <div class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <div v-if="storageStatus === 'loading'">
                  <svg class="animate-spin h-4 w-4 md:h-5 md:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else-if="storageStatus === 'success'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div v-else-if="storageStatus === 'error'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div v-else>
                  <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div class="ml-2 md:ml-3">
                <p class="text-xs md:text-sm font-medium text-gray-900">Регистрация хранилища активности</p>
                <p class="text-xs text-gray-500">pr_tracking - Статистика посещений</p>
              </div>
            </div>

            <!-- Хранилище сохраненного времени -->
            <div class="flex items-center">
              <div class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <div v-if="savedTimeStorageStatus === 'loading'">
                  <svg class="animate-spin h-4 w-4 md:h-5 md:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else-if="savedTimeStorageStatus === 'success'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div v-else-if="savedTimeStorageStatus === 'error'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div v-else>
                  <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div class="ml-2 md:ml-3">
                <p class="text-xs md:text-sm font-medium text-gray-900">Регистрация хранилища сохраненного времени</p>
                <p class="text-xs text-gray-500">pr_saved_time - Персональные счетчики времени</p>
              </div>
            </div>

            <!-- Встройки -->
            <div v-for="placement in placementsToInstall" :key="placement.id" class="flex items-center">
              <div class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <div v-if="placementStatus[placement.id] === 'loading'">
                  <svg class="animate-spin h-4 w-4 md:h-5 md:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else-if="placementStatus[placement.id] === 'success'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div v-else-if="placementStatus[placement.id] === 'error'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div v-else>
                  <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div class="ml-2 md:ml-3">
                <p class="text-xs md:text-sm font-medium text-gray-900">{{ placement.title }}</p>
                <p class="text-xs text-gray-500">{{ placement.description }}</p>
              </div>
            </div>

            <!-- Настройки приложения -->
            <div class="flex items-center">
              <div class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <div v-if="settingsStatus === 'loading'">
                  <svg class="animate-spin h-4 w-4 md:h-5 md:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div v-else-if="settingsStatus === 'success'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div v-else-if="settingsStatus === 'error'">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div v-else>
                  <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div class="ml-2 md:ml-3">
                <p class="text-xs md:text-sm font-medium text-gray-900">Настройка параметров системы</p>
                <p class="text-xs text-gray-500">Сохранение настроек функций</p>
              </div>
            </div>
          </div>

          <!-- Кнопки навигации -->
          <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
            <B24Button
                v-if="!installationComplete"
                @click="prevStep"
                variant="outline"
                size="large"
                :disabled="isInstalling"
                class="w-full sm:w-auto px-4 py-2 text-sm md:text-base order-2 sm:order-1"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Назад
            </B24Button>
            <B24Button
                v-if="installationComplete"
                @click="nextStep"
                variant="primary"
                size="large"
                class="w-full sm:w-auto px-4 py-2 text-sm md:text-base order-1 sm:order-2"
            >
              Завершить
              <svg class="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </B24Button>
          </div>
        </div>
      </div>
    </div>
  </B24Card>

  <!-- Шаг 4: Завершение -->
  <B24Card v-else-if="currentStep === 4" class="mb-8">
    <div class="p-4 md:p-6">
      <div class="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div class="hidden md:flex md:flex-shrink-0 mb-4 md:mb-0">
          <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
            Установка завершена!
          </h2>

          <div class="space-y-4 md:space-y-6">
            <p class="text-base md:text-lg text-gray-700">
              Система контроля времени сотрудников успешно установлена и настроена.
            </p>

            <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                Что дальше?
              </h3>
              <p class="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                Система готова к использованию. Вы можете начать мониторинг активности сотрудников прямо сейчас.
              </p>

              <!-- Информация об установленных компонентах -->
              <div class="space-y-2">
                <div v-if="selectedFeatures.pageTracking" class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Отслеживание посещений страниц</span>
                </div>
                <div v-if="selectedFeatures.presenceControl" class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Контроль присутствия сотрудников</span>
                </div>
                <div v-if="selectedFeatures.subordinateReports" class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Запрос отчетов о деятельности</span>
                </div>
                <div v-if="selectedFeatures.workdayStart" class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Помощь в старте рабочего дня</span>
                </div>
                <div v-if="selectedFeatures.workdayEnd" class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Помощь в завершении рабочего дня</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Фоновый счетчик (встройка)</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Форма для отчета (встройка)</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Хранилище активности (pr_tracking)</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs md:text-sm text-gray-700">Хранилище сохраненного времени (pr_saved_time)</span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 md:mt-6">
                <a
                    href="mailto:it.galera@yandex.ru?subject=Поддержка приложения Автоматический контроль времени"
                    target="_blank"
                    class="w-full sm:w-auto inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base"
                >
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Техническая поддержка
                </a>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 md:p-6">
              <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                Следующие шаги
              </h3>
              <ul class="space-y-2">
                <li class="flex items-start text-gray-700">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-xs md:text-sm">Перейдите в приложение для просмотра данных мониторинга</span>
                </li>
                <li class="flex items-start text-gray-700">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-xs md:text-sm">Настройте дополнительные параметры в разделе "Настройки"</span>
                </li>
                <li class="flex items-start text-gray-700">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-xs md:text-sm">Ознакомьте сотрудников с новыми возможностями системы</span>
                </li>
              </ul>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
              <B24Button
                  @click="openApp"
                  variant="outline"
                  size="large"
                  class="w-full sm:w-auto px-4 py-2 text-sm md:text-base order-2 sm:order-1"
              >
                <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Перейти в приложение
              </B24Button>
              <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                <B24Button
                    @click="finishInstallation"
                    variant="primary"
                    size="large"
                    class="w-full sm:w-auto px-4 py-2 text-sm md:text-base"
                >
                  Завершить установку
                </B24Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </B24Card>
  </div>
  </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

export default {
  name: 'Install',
  setup() {
    const toast = useToast()

    // Конфигурации встроек
    const PLACEMENT_CONFIGS = {
      PAGE_BACKGROUND_WORKER: {
        title: 'Фоновый счетчик',
        description: 'Подсчитывает время, проведенное пользователем на странице',
        options: {
          errorHandlerUrl: `${window.location.origin}/placements/error-handler`
        }
      },
      REST_APP_URI: {
        title: 'Форма для отчета',
        description: 'Позволяет сотруднику заполнять запрошенные отчеты',
        options: {}
      }
    }

    // Определения свойств хранилища
    const STORAGE_PROPERTIES = [
      { PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N' },
      { PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S' },
      { PROPERTY: 'PAGE_URL', NAME: 'URL страницы', TYPE: 'S' },
      { PROPERTY: 'PAGE_TIME', NAME: 'Время на странице (сек)', TYPE: 'N' },
      { PROPERTY: 'PAGE_CATEGORY', NAME: 'Категория страницы', TYPE: 'S' },
      { PROPERTY: 'TASK_ID', NAME: 'ID связанной задачи', TYPE: 'N' },
      { PROPERTY: 'ELAPSED_ITEM_ID', NAME: 'ID записи времени', TYPE: 'N' }
    ]

    // Определения свойств хранилища сохраненного времени
    const SAVED_TIME_STORAGE_PROPERTIES = [
      { PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N' },
      { PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S' },
      { PROPERTY: 'TOTAL_TIME', NAME: 'Общее сохраненное время (сек)', TYPE: 'N' },
      { PROPERTY: 'UPDATED_AT', NAME: 'Дата последнего обновления', TYPE: 'S' }
    ]

    // Состояние
    const currentStep = ref(1)
    const totalSteps = 4
    const progress = computed(() => Math.round((currentStep.value / totalSteps) * 100))

    // Выбранные функции - ВСЕ ВКЛЮЧЕНЫ ПО УМОЛЧАНИЮ
    const selectedFeatures = ref({
      pageTracking: true,
      presenceControl: true,
      subordinateReports: true,
      workdayStart: true,
      workdayEnd: true
    })

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
      },
      workdayStart: {
        enabled: true,
        method: 'modal'
      },
      workdayEnd: {
        enabled: true,
        method: 'modal'
      }
    })

    // Статус установки
    const isInstalling = ref(false)
    const installationComplete = ref(false)
    const installedCount = ref(0)

    // Статусы компонентов
    const placementStatus = ref({
      pageBackgroundWorker: null,
      restAppUri: null
    })

    const storageStatus = ref(null)
    const savedTimeStorageStatus = ref(null)
    const settingsStatus = ref(null)

    // Ошибки валидации
    const historyDaysError = ref(null)
    const pageTimeThresholdError = ref(null)
    const absenceTimeThresholdError = ref(null)
    const employeeReactionTimeError = ref(null)

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

      setAppOption: async (key, value) => {
        try {
          const result = await bitrixAPI.call('app.option.set', {
            options: { [key]: value }
          })
          return result
        } catch (error) {
          toast.add({
            description: `Ошибка сохранения настройки ${key}`,
            variant: 'error'
          })
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
                  }
                },
                OPTIONS: config.options
              }

          await bitrixAPI.call('placement.bind', placementConfig)
          return true
        } catch (error) {
          toast.add({
            description: `Ошибка регистрации встройки ${placementType}`,
            variant: 'error'
          })
          throw error
        }
      },

      unbind: async (placementType, handler) => {
        try {
          await bitrixAPI.call('placement.unbind', {
            PLACEMENT: placementType,
            HANDLER: handler
          })
          return true
        } catch (error) {
          toast.add({
            description: `Ошибка удаления встройки ${placementType}`,
            variant: 'error'
          })
          return null
        }
      }
    }

    // Менеджер хранилища
    const storageManager = {
      checkStorageExists: (entityId) => {
        return new Promise((resolve) => {
          BX24.callMethod('entity.get', {}, (result) => {
            if (result.error()) {
              toast.add({
                description: `Ошибка при проверке хранилища ${entityId}`,
                variant: 'error'
              })
              resolve(false)
            } else {
              const entities = result.data()
              const exists = entities.some(entity => entity.ENTITY === entityId)
              resolve(exists)
            }
          })
        })
      },

      createStorageProperties: (entityId, properties) => {
        return new Promise((resolve) => {
          let createdCount = 0
          const totalProperties = properties.length

          if (totalProperties === 0) {
            resolve(true)
            return
          }

          const createNextProperty = (index) => {
            if (index >= totalProperties) {
              resolve(true)
              return
            }

            const prop = properties[index]
            BX24.callMethod('entity.item.property.add', {
              ENTITY: entityId,
              PROPERTY: prop.PROPERTY,
              NAME: prop.NAME,
              TYPE: prop.TYPE
            }, (result) => {
              if (result.error()) {
                toast.add({
                  description: `Свойство ${prop.PROPERTY} уже существует или ошибка создания`,
                  variant: 'warning'
                })
              }
              createNextProperty(index + 1)
            })
          }

          createNextProperty(0)
        })
      },

      setupStorage: async (entityId, storageName, properties) => {
        try {
          const exists = await storageManager.checkStorageExists(entityId)

          if (!exists) {
            await new Promise((resolve, reject) => {
              BX24.callMethod('entity.add', {
                ENTITY: entityId,
                NAME: storageName,
                ACCESS: {
                  AU: 'W'
                }
              }, (result) => {
                if (result.error()) {
                  reject(new Error(`Ошибка при создании хранилища: ${result.error()}`))
                } else {
                  resolve()
                }
              })
            })

            await storageManager.createStorageProperties(entityId, properties)
          }

          return true
        } catch (error) {
          toast.add({
            description: `Ошибка настройки хранилища ${entityId}`,
            variant: 'error'
          })
          throw error
        }
      }
    }

    // Валидация полей
    const validateHistoryDays = () => {
      historyDaysError.value = null
      const days = configSettings.value.pageTracking.historyDays

      if (isNaN(days)) {
        historyDaysError.value = 'Значение должно быть числом'
        return false
      }

      if (days < 1) {
        configSettings.value.pageTracking.historyDays = 1
        historyDaysError.value = 'Минимальное значение: 1 день'
        return false
      }

      if (days > 30) {
        configSettings.value.pageTracking.historyDays = 30
        historyDaysError.value = 'Максимальное значение: 30 дней'
        return false
      }

      return true
    }

    const validatePageTimeThreshold = () => {
      pageTimeThresholdError.value = null
      const minutes = configSettings.value.presenceControl.pageTimeThreshold

      if (isNaN(minutes)) {
        pageTimeThresholdError.value = 'Значение должно быть числом'
        return false
      }

      if (minutes < 1) {
        configSettings.value.presenceControl.pageTimeThreshold = 1
        pageTimeThresholdError.value = 'Минимальное значение: 1 минута'
        return false
      }

      if (minutes > 60) {
        configSettings.value.presenceControl.pageTimeThreshold = 60
        pageTimeThresholdError.value = 'Максимальное значение: 60 минут'
        return false
      }

      return true
    }

    const validateAbsenceTimeThreshold = () => {
      absenceTimeThresholdError.value = null
      const seconds = configSettings.value.presenceControl.notifyManager.absenceTimeThreshold

      if (isNaN(seconds)) {
        absenceTimeThresholdError.value = 'Значение должно быть числом'
        return false
      }

      if (seconds < 10) {
        configSettings.value.presenceControl.notifyManager.absenceTimeThreshold = 10
        absenceTimeThresholdError.value = 'Минимальное значение: 10 секунд'
        return false
      }

      if (seconds > 300) {
        configSettings.value.presenceControl.notifyManager.absenceTimeThreshold = 300
        absenceTimeThresholdError.value = 'Максимальное значение: 300 секунд (5 минут)'
        return false
      }

      return true
    }

    const validateEmployeeReactionTime = () => {
      employeeReactionTimeError.value = null
      const seconds = configSettings.value.subordinateReports.employeeReactionTime

      if (isNaN(seconds)) {
        employeeReactionTimeError.value = 'Значение должно быть числом'
        return false
      }

      if (seconds < 10) {
        configSettings.value.subordinateReports.employeeReactionTime = 10
        employeeReactionTimeError.value = 'Минимальное значение: 10 секунд'
        return false
      }

      if (seconds > 300) {
        configSettings.value.subordinateReports.employeeReactionTime = 300
        employeeReactionTimeError.value = 'Максимальное значение: 300 секунд (5 минут)'
        return false
      }

      return true
    }

    // Сохранение настроек приложения
    const saveSettings = async () => {
      settingsStatus.value = 'loading'
      try {
        const settingsToSave = {
          page_tracking_enabled: selectedFeatures.value.pageTracking ? 'Y' : 'N',
          presence_control_enabled: selectedFeatures.value.presenceControl ? 'Y' : 'N',
          subordinate_reports_enabled: selectedFeatures.value.subordinateReports ? 'Y' : 'N',
          page_tracking_history_days: configSettings.value.pageTracking.historyDays.toString(),
          presence_page_time_threshold: configSettings.value.presenceControl.pageTimeThreshold.toString(),
          notify_manager_enabled: configSettings.value.presenceControl.notifyManager.enabled ? 'Y' : 'N',
          absence_time_threshold: configSettings.value.presenceControl.notifyManager.absenceTimeThreshold.toString(),
          notification_method: configSettings.value.presenceControl.notifyManager.method,
          employee_reaction_time: configSettings.value.subordinateReports.employeeReactionTime.toString(),
          response_method: configSettings.value.subordinateReports.responseMethod,
          delivery_method: configSettings.value.subordinateReports.deliveryMethod,
          workday_start_enabled: selectedFeatures.value.workdayStart ? 'Y' : 'N',
          workday_start_method: configSettings.value.workdayStart.method,
          workday_end_enabled: selectedFeatures.value.workdayEnd ? 'Y' : 'N',
          workday_end_method: configSettings.value.workdayEnd.method,
          installation_completed: 'Y'
        }

        for (const [key, value] of Object.entries(settingsToSave)) {
          await bitrixAPI.setAppOption(key, value)
        }

        settingsStatus.value = 'success'
        installedCount.value++
        return true
      } catch (error) {
        settingsStatus.value = 'error'
        toast.add({
          description: 'Ошибка сохранения настроек',
          variant: 'error'
        })
        return false
      }
    }

    // Регистрация всех встроек
    const registerAllPlacements = async () => {
      const placements = [
        {
          id: 'pageBackgroundWorker',
          type: 'PAGE_BACKGROUND_WORKER',
          handler: HANDLERS.pageBackgroundWorker,
          title: 'Фоновый счетчик',
          description: 'Подсчитывает время, проведенное пользователем на странице'
        },
        {
          id: 'restAppUri',
          type: 'REST_APP_URI',
          handler: HANDLERS.restAppUri,
          title: 'Форма для отчета',
          description: 'Позволяет сотруднику заполнять запрошенные отчеты'
        }
      ]

      for (const placement of placements) {
        placementStatus.value[placement.id] = 'loading'
        try {
          await placementManager.bind(placement.type, placement.handler)
          placementStatus.value[placement.id] = 'success'
          installedCount.value++
        } catch (error) {
          placementStatus.value[placement.id] = 'error'
        }
      }

      return placements
    }

    // Основная функция установки
    const startInstallation = async () => {
      if (currentStep.value === 2) {
        currentStep.value = 3
      }

      isInstalling.value = true
      installedCount.value = 0

      // Сбрасываем статусы
      placementStatus.value = {
        pageBackgroundWorker: null,
        restAppUri: null
      }
      storageStatus.value = null
      savedTimeStorageStatus.value = null
      settingsStatus.value = null

      try {
        // 1. Регистрация хранилища активности
        storageStatus.value = 'loading'
        await storageManager.setupStorage('pr_tracking', 'Статистика посещений', STORAGE_PROPERTIES)
        storageStatus.value = 'success'
        installedCount.value++

        // 2. Регистрация хранилища сохраненного времени
        savedTimeStorageStatus.value = 'loading'
        await storageManager.setupStorage('pr_saved_time', 'Сохраненное время', SAVED_TIME_STORAGE_PROPERTIES)
        savedTimeStorageStatus.value = 'success'
        installedCount.value++

        // 3. Регистрация встроек
        await registerAllPlacements()

        // 4. Сохранение настроек
        await saveSettings()

        installationComplete.value = true

        toast.add({
          description: 'Система успешно установлена и настроена',
          variant: 'success'
        })
      } catch (error) {
        toast.add({
          description: 'Произошла ошибка при установке системы',
          variant: 'error'
        })
      } finally {
        isInstalling.value = false
      }
    }

    // Вспомогательные функции
    const getNotificationMethodText = () => {
      const methods = {
        'chat': 'Чат',
        'push': 'Push-уведомление',
        'all': 'Чат и Push-уведомление'
      }
      return methods[configSettings.value.presenceControl.notifyManager.method] || 'чат'
    }

    const getResponseMethodText = () => {
      const methods = {
        'chat': 'Чат',
        'push': 'Push-уведомление',
        'all': 'Чат и Push-уведомление'
      }
      return methods[configSettings.value.subordinateReports.responseMethod] || 'чат'
    }

    const getDeliveryMethodText = () => {
      const methods = {
        'chat': 'Чат',
        'push': 'Push-уведомление',
        'all': 'Чат и Push-уведомление'
      }
      return methods[configSettings.value.subordinateReports.deliveryMethod] || 'чат'
    }

    const getWorkdayStartMethodText = () => {
      const methods = {
        'auto': 'Автоматический старт',
        'modal': 'Модальное окно с предупреждением'
      }
      return methods[configSettings.value.workdayStart.method] || 'модальное окно'
    }

    const getWorkdayEndMethodText = () => {
      const methods = {
        'auto': 'Автоматическое завершение',
        'modal': 'Модальное окно с предупреждением'
      }
      return methods[configSettings.value.workdayEnd.method] || 'модальное окно'
    }

    const toggleNotifyManager = (newValue) => {
      configSettings.value.presenceControl.notifyManager.enabled = newValue
    }

    // Вычисляемые свойства
    const hasSelectedFeatures = computed(() => {
      return Object.values(selectedFeatures.value).some(value => value === true)
    })

    const placementsToInstall = computed(() => {
      return [
        {
          id: 'pageBackgroundWorker',
          title: 'Фоновый счетчик',
          description: 'Подсчитывает время, проведенное пользователем на странице'
        },
        {
          id: 'restAppUri',
          title: 'Форма для отчета',
          description: 'Позволяет сотруднику заполнять запрошенные отчеты'
        }
      ]
    })

    const installationsToProcess = computed(() => {
      let count = 2 // Два хранилища
      count += 2 // Две встройки
      count += 1 // Настройки
      return count
    })

    const installationProgress = computed(() => {
      if (installationsToProcess.value === 0) return 0
      return Math.round((installedCount.value / installationsToProcess.value) * 100)
    })

    const features = computed(() => [
      { id: 1, text: 'Автоматическое отслеживание посещений страниц сотрудниками' },
      { id: 2, text: 'Мониторинг активности и присутствия на рабочем месте' },
      { id: 3, text: 'Запрос и получение отчетов о деятельности подчиненных' },
      { id: 4, text: 'Помощь в старте и завершении рабочего дня' },
      { id: 5, text: 'Безопасное хранение данных в защищенном хранилище Bitrix24' },
      { id: 6, text: 'Гибкая настройка параметров мониторинга' }
    ])

    // Методы навигации
    const nextStep = () => {
      if (currentStep.value === 2) {
        // Запускаем установку при переходе на шаг 3
        startInstallation()
      } else if (currentStep.value < totalSteps) {
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
        toast.add({
          description: 'Ошибка завершения установки',
          variant: 'error'
        })
      }
    }

    const openApp = () => {
      window.location.href = '/'
    }

    return {
      // Состояние
      currentStep,
      totalSteps,
      progress,
      selectedFeatures,
      configSettings,
      isInstalling,
      installationComplete,
      installedCount,
      placementStatus,
      storageStatus,
      savedTimeStorageStatus,
      settingsStatus,

      // Ошибки
      historyDaysError,
      pageTimeThresholdError,
      absenceTimeThresholdError,
      employeeReactionTimeError,

      // Вычисляемые свойства
      hasSelectedFeatures,
      placementsToInstall,
      installationsToProcess,
      installationProgress,
      features,

      // Методы
      nextStep,
      prevStep,
      finishInstallation,
      openApp,

      // Валидация
      validateHistoryDays,
      validatePageTimeThreshold,
      validateAbsenceTimeThreshold,
      validateEmployeeReactionTime,

      // Вспомогательные
      getNotificationMethodText,
      getResponseMethodText,
      getDeliveryMethodText,
      getWorkdayStartMethodText,
      getWorkdayEndMethodText,
      toggleNotifyManager
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

/* Мобильные улучшения */
@media (max-width: 640px) {
  ::v-deep .b24-radio-group__item {
    padding: 0.75rem !important;
  }

  ::v-deep .b24-radio-group__item-description {
    font-size: 0.75rem !important;
  }

  ::v-deep .b24-card {
    border-radius: 0.75rem !important;
  }
}
</style>