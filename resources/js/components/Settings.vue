<template>
  <div class="p-0 md:p-6">
    <B24PageHeader
        title="Контроль времени сотрудников"
        description="Система мониторинга активности и рабочего времени"
    />

    <div class="mt-0 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Основная часть с настройками -->
      <div class="lg:col-span-2">
        <!-- Блок 1: Отслеживание посещений страниц пользователями -->
        <B24Card class="mb-8">
          <div class="p-0 md:p-6">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Отслеживание посещений страниц пользователями
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Сбор и хранение истории посещений страниц сотрудниками
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <div class="w-2 h-2 rounded-full"
                       :class="formData.pageTracking.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                  <B24Switch
                      v-model="formData.pageTracking.enabled"
                      @update:modelValue="togglePageTracking"
                      :disabled="isProcessing"
                  />
                </div>
              </div>

              <!-- Настройки отслеживания посещений -->
              <div v-if="formData.pageTracking.enabled" class="space-y-4 pt-4 border-t">
                <h4 class="text-sm font-medium text-gray-900 mb-4">
                  Настройки хранения истории
                </h4>

                <B24Form
                    :state="formData"
                    class="space-y-4"
                    @submit="savePageTrackingSettings"
                >
                  <!-- Количество дней хранения истории посещений -->
                  <div class="space-y-4">
                    <B24FormField
                        label="Количество дней хранения истории посещений"
                        name="historyDays"
                        :help-text="`Текущее значение: ${formData.pageTracking.historyDays} дней`"
                    >
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Поле ввода -->
                        <div>
                          <B24Input
                              v-model.number="formData.pageTracking.historyDays"
                              :disabled="isProcessing"
                              :min="1"
                              :max="30"
                              type="number"
                              class="w-full"
                              @blur="validateHistoryDays"
                          >
                            <template #suffix>
                              <span class="text-gray-500">дней</span>
                            </template>
                          </B24Input>
                        </div>

                        <!-- Слайдер для настройки -->
                        <div class="space-y-2">
                          <input
                              type="range"
                              v-model.number="formData.pageTracking.historyDays"
                              :disabled="isProcessing"
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

                      <!-- Ошибка валидации -->
                      <div v-if="pageTrackingHistoryDaysError" class="mt-2 text-sm text-red-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        {{ pageTrackingHistoryDaysError }}
                      </div>

                      <!-- Информация о хранении -->
                      <div class="mt-3">
                        <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                          <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                               viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div class="text-sm text-blue-700">
                            <span class="font-medium">Важно:</span> Система будет автоматически удалять записи о
                            посещениях, которые старше указанного количества дней.
                            Это помогает поддерживать оптимальный размер внутреннего хранилища.
                          </div>
                        </div>
                      </div>
                    </B24FormField>
                  </div>
                </B24Form>

                <!-- Информация о системе отслеживания -->
                <div class="space-y-4 mt-6">
                  <h4 class="text-sm font-medium text-gray-900">
                    Как работает система отслеживания:
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Система записывает посещение страницы сотрудником, если он задерживается на странице больше 10 секунд (сократить эту задержку в данной версии приложения нельзя).
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Для каждого посещения сохраняется URL страницы, время нахождения, пользователь и категория страницы.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Данные сохраняются в хранилище Bitrix24 с группировкой по дням.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">4</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Данные из хранилища Bitrix24 об истории посещения страниц пользователям отображаются в удобном для восприятия виде на странице приложения - История посещений. Здесь пользователь может изучить свои затраты времени на каждой странице и, при желании, добавить время в задачи.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">5</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          История посещений хранится {{ formData.pageTracking.historyDays }} дней, после чего старые
                          записи автоматически удаляются.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Блок 2: Контроль присутствия сотрудника -->
        <B24Card class="mb-8">
          <div class="p-0 md:p-6">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Контроль присутствия сотрудника
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Автоматическая проверка реального присутствия сотрудника на рабочем месте с открытым Битрикс24
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <div class="w-2 h-2 rounded-full"
                       :class="formData.presenceControl.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                  <B24Switch
                      v-model="formData.presenceControl.enabled"
                      @update:modelValue="togglePresenceControl"
                      :disabled="isProcessing"
                  />
                </div>
              </div>

              <!-- Настройки контроля присутствия -->
              <div v-if="formData.presenceControl.enabled" class="space-y-4 pt-4 border-t">
                <B24Form
                    :state="formData"
                    class="space-y-4"
                    @submit="savePresenceControlSettings"
                >
                  <!-- Время на странице до проверки присутствия -->
                  <div class="space-y-4">
                    <B24FormField
                        label="Время на странице до проверки присутствия"
                        name="pageTimeThreshold"
                        :help-text="`Текущее значение: ${formData.presenceControl.pageTimeThreshold} минут`"
                    >
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Поле ввода -->
                        <div>
                          <B24Input
                              v-model.number="formData.presenceControl.pageTimeThreshold"
                              :disabled="isProcessing"
                              :min="1"
                              :max="60"
                              type="number"
                              class="w-full"
                              @blur="validatePageTimeThreshold"
                          >
                            <template #suffix>
                              <span class="text-gray-500">минут</span>
                            </template>
                          </B24Input>
                        </div>

                        <!-- Слайдер для настройки -->
                        <div class="space-y-2">
                          <input
                              type="range"
                              v-model.number="formData.presenceControl.pageTimeThreshold"
                              :disabled="isProcessing"
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

                      <!-- Ошибка валидации -->
                      <div v-if="pageTimeThresholdError" class="mt-2 text-sm text-red-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        {{ pageTimeThresholdError }}
                      </div>

                      <!-- Настройка уведомлений руководителя -->
                      <div class="space-y-4 pt-4">
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <h4 class="text-sm font-medium text-gray-900 mb-1">
                              Уведомлять руководителя об отсутствии на рабочем месте
                            </h4>
                            <p class="text-sm text-gray-500">
                              Отправлять уведомление руководителю при длительном отсутствии сотрудника
                            </p>
                          </div>
                          <div class="ml-4 flex items-center space-x-4">
                            <div class="w-2 h-2 rounded-full"
                                 :class="formData.presenceControl.notifyManager.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                            <B24Switch
                                v-model="formData.presenceControl.notifyManager.enabled"
                                @update:modelValue="toggleNotifyManager"
                                :disabled="isProcessing"
                                size="sm"
                            />
                          </div>
                        </div>

                        <!-- Дополнительные настройки уведомлений -->
                        <div v-if="formData.presenceControl.notifyManager.enabled" class="space-y-4">
                          <!-- Время отсутствия до уведомления -->
                          <B24FormField
                              label="Время на подтверждение присутствия"
                              name="absenceTimeThreshold"
                              :help-text="`Текущее значение: ${formData.presenceControl.notifyManager.absenceTimeThreshold} секунд`"
                          >
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <!-- Поле ввода -->
                              <div>
                                <B24Input
                                    v-model.number="formData.presenceControl.notifyManager.absenceTimeThreshold"
                                    :disabled="isProcessing"
                                    :min="10"
                                    :max="300"
                                    type="number"
                                    class="w-full"
                                    @blur="validateAbsenceTimeThreshold"
                                >
                                  <template #suffix>
                                    <span class="text-gray-500">секунд</span>
                                  </template>
                                </B24Input>
                              </div>

                              <!-- Слайдер для настройки -->
                              <div class="space-y-2">
                                <input
                                    type="range"
                                    v-model.number="formData.presenceControl.notifyManager.absenceTimeThreshold"
                                    :disabled="isProcessing"
                                    min="10"
                                    max="300"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    @input="validateAbsenceTimeThreshold"
                                >
                                <div class="flex justify-between text-xs text-gray-500">
                                  <span>10 секунд</span>
                                  <span>5 минут</span>
                                </div>
                              </div>
                            </div>

                            <!-- Ошибка валидации -->
                            <div v-if="absenceTimeThresholdError" class="mt-2 text-sm text-red-600 flex items-center">
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                              </svg>
                              {{ absenceTimeThresholdError }}
                            </div>

                            <!-- Информация о настройке -->
                            <div class="mt-3">
                              <div class="flex items-start p-3 bg-yellow-50 rounded-lg">
                                <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                                <div class="text-sm text-yellow-700">
                                  <span class="font-medium">Примечание:</span> Уведомление будет отправлено
                                  руководителю, если сотрудник отсутствует непрерывно более указанного времени.
                                </div>
                              </div>
                            </div>
                          </B24FormField>

                          <!-- Способ уведомления -->
                          <B24FormField
                              label="Способ уведомления"
                              name="notificationMethod"
                          >
                            <B24RadioGroup
                                v-model="formData.presenceControl.notifyManager.method"
                                :disabled="isProcessing"
                                :items="[
                                    {
                                        label: 'Чат',
                                        value: 'chat',
                                        description: 'Сообщение в чате'
                                    },
                                    {
                                        label: 'Push-уведомление',
                                        value: 'push',
                                        description: 'Системное всплывающее уведомление'
                                    },
                                    {
                                        label: 'Оба способа',
                                        value: 'all',
                                        description: 'Push-уведомление и сообщение в чат'
                                    }
                                ]"
                                orientation="horizontal"
                                variant="card"
                                size="sm"
                                default-value="push"
                                indicator="end"
                                class="overflow-scroll"
                            />
                          </B24FormField>
                        </div>
                      </div>
                    </B24FormField>
                  </div>
                </B24Form>

                <!-- Информация о системе контроля присутствия -->
                <div class="space-y-4 mt-6">
                  <h4 class="text-sm font-medium text-gray-900">
                    Как работает система контроля присутствия
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Через {{ formData.presenceControl.pageTimeThreshold }} минут с момента открытия сотрудником страницы
                          будет всплывать модальное окно с кнопкой подтверждения присутствия, которая доступна для нажатия {{ formData.presenceControl.notifyManager.absenceTimeThreshold }} секунд.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Если пользователь действительно присутствует на рабочем месте, нажатие кнопки "Я здесь" закроет модальное окно
                          и время на странице будет фиксироваться дальше. В противном случае, учет времени на странице останавливается, пока пользователь не подаст признаки активности в Битрикс24.
                        </p>
                      </div>
                    </div>
                    <div v-if="formData.presenceControl.notifyManager.enabled" class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          По истечении {{ formData.presenceControl.notifyManager.absenceTimeThreshold }} секунд с момента появляения модального окна у сотрудника, руководителю будет отправлено уведомление
                          о том, что пользователь не подтвердил своего присутствия на рабочем месте.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Блок 3: Разрешить запрос отчета о деятельности подчиненных -->
        <B24Card class="mb-8">
          <div class="p-0 md:p-6">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Разрешить запрос отчета о деятельности подчиненных
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Удобный механизм для получения информации от сотрудника о том, чем он занимается в данный момент
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <div class="w-2 h-2 rounded-full"
                       :class="formData.subordinateReports.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                  <B24Switch
                      v-model="formData.subordinateReports.enabled"
                      @update:modelValue="toggleSubordinateReports"
                      :disabled="isProcessing"
                  />
                </div>
              </div>

              <!-- Настройки запросов отчетов -->
              <div v-if="formData.subordinateReports.enabled" class="space-y-4 pt-4 border-t">
                <B24Form
                    :state="formData"
                    class="space-y-4"
                    @submit="saveSubordinateReportsSettings"
                >
                  <!-- Время на реакцию сотрудника (в секундах) -->
                  <div class="space-y-4">
                    <B24FormField
                        label="Время на реакцию сотрудника"
                        name="employeeReactionTime"
                        :help-text="`Текущее значение: ${formData.subordinateReports.employeeReactionTime} секунд`"
                    >
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Поле ввода -->
                        <div>
                          <B24Input
                              v-model.number="formData.subordinateReports.employeeReactionTime"
                              :disabled="isProcessing"
                              :min="10"
                              :max="300"
                              type="number"
                              class="w-full"
                              @blur="validateEmployeeReactionTime"
                          >
                            <template #suffix>
                              <span class="text-gray-500">секунд</span>
                            </template>
                          </B24Input>
                        </div>

                        <!-- Слайдер для настройки -->
                        <div class="space-y-2">
                          <input
                              type="range"
                              v-model.number="formData.subordinateReports.employeeReactionTime"
                              :disabled="isProcessing"
                              min="10"
                              max="300"
                              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              @input="validateEmployeeReactionTime"
                          >
                          <div class="flex justify-between text-xs text-gray-500">
                            <span>10 секунд</span>
                            <span>5 минут</span>
                          </div>
                        </div>
                      </div>

                      <!-- Ошибка валидации -->
                      <div v-if="employeeReactionTimeError" class="mt-2 text-sm text-red-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        {{ employeeReactionTimeError }}
                      </div>

                      <!-- Информация о настройке -->
                      <div class="mt-3">
                        <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                          <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                               viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div class="text-sm text-blue-700">
                            <span class="font-medium">Важно:</span> Сотруднику предоставляется указанное количество
                            секунд для подготовки и отправки отчета руководителю.
                            Если отчет не будет предоставлен в течение этого времени, его заполнение сотруднику станет не доступно. Заполнение отчета не доступно на мобильных устройствах.
                            Данные условия обеспечивают не только оперативное получение обратной связи от сотрудников, но и гарантируют, что сотрудник действительно находится на рабочем месте и, вероятно, занимается тем, что описывает в отчете.
                          </div>
                        </div>
                      </div>
                    </B24FormField>
                  </div>

                  <!-- Способ получения ответа -->
                  <B24FormField
                      label="Способ получения ответа"
                      name="responseMethod"
                      :help-text="`Текущий способ: ${getResponseMethodText()}`"
                  >
                    <B24RadioGroup
                        v-model="formData.subordinateReports.responseMethod"
                        :disabled="isProcessing"
                        :items="[
                            {
                                label: 'Чат',
                                value: 'chat',
                                description: 'Ответ в чате'
                            },
                            {
                                label: 'Push-уведомление',
                                value: 'push',
                                description: 'Ответ через системное уведомление'
                            },
                            {
                                label: 'Оба способа',
                                value: 'all',
                                description: 'Ответ в чат и через push-уведомление'
                            }
                        ]"
                        orientation="horizontal"
                        variant="card"
                        size="sm"
                        default-value="push"
                        indicator="end"
                        class="overflow-scroll"
                    />
                  </B24FormField>

                  <!-- Способ доставки запроса подчиненному -->
                  <B24FormField
                      label="Способ доставки запроса подчиненному"
                      name="deliveryMethod"
                      :help-text="`Текущий способ: ${getDeliveryMethodText()}`"
                  >
                    <B24RadioGroup
                        v-model="formData.subordinateReports.deliveryMethod"
                        :disabled="isProcessing"
                        :items="[
                            {
                                label: 'Чат',
                                value: 'chat',
                                description: 'Запрос через чат'
                            },
                            {
                                label: 'Push-уведомление',
                                value: 'push',
                                description: 'Запрос через системное уведомление'
                            },
                            {
                                label: 'Оба способа',
                                value: 'all',
                                description: 'Запрос через чат и push-уведомление'
                            }
                        ]"
                        orientation="horizontal"
                        variant="card"
                        size="sm"
                        default-value="push"
                        indicator="end"
                        class="overflow-scroll"
                    />
                  </B24FormField>
                </B24Form>

                <!-- Информация о системе запросов отчетов -->
                <div class="space-y-4 mt-6">
                  <h4 class="text-sm font-medium text-gray-900">
                    Как работает система запросов отчетов
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          В списке "Время всех сотрудников" в истории посещений в блоке пользователя появляется кнопка "Запросить отчет", которая инициирует запрос обратной связи от сотрудника.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Сотруднику отправляется уведомление через {{ getDeliveryMethodText() }} с прикрепленной ссылкой на заполнение короткой формы и предоставляется {{ formData.subordinateReports.employeeReactionTime }} секунд для
                          подготовки отчета.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Сотрудник заполняет форму, описывая, чем занимается в данный момент.
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">4</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Информация, внесенная сотрудником в отчет автоматически возвращается инициатору запроса через {{ getResponseMethodText() }}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Блок 4: Помощь в старте рабочего дня -->
        <B24Card class="mb-8">
          <div class="p-0 md:p-6">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Помощь в старте рабочего дня
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Автоматическая помощь сотрудникам в своевременном начале рабочего дня
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <div class="w-2 h-2 rounded-full"
                       :class="formData.workdayStart.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                  <B24Switch
                      v-model="formData.workdayStart.enabled"
                      @update:modelValue="toggleWorkdayStart"
                      :disabled="isProcessing"
                  />
                </div>
              </div>

              <!-- Настройки помощи -->
              <div v-if="formData.workdayStart.enabled" class="space-y-4 pt-4 border-t">
                <B24Form
                    :state="formData"
                    class="space-y-4"
                    @submit="saveWorkdayStartSettings"
                >
                  <!-- Способ старта рабочего дня -->
                  <B24FormField
                      label="Способ старта рабочего дня"
                      name="workdayStartMethod"
                      :help-text="`Текущий способ: ${getWorkdayStartMethodText()}`"
                  >
                    <B24RadioGroup
                        v-model="formData.workdayStart.method"
                        :disabled="isProcessing"
                        :items="[
                    {
                        label: 'Автоматический старт',
                        value: 'auto',
                        description: 'Рабочий день начинается автоматически при открытии'
                    },
                    {
                        label: 'Модальное окно с предупреждением',
                        value: 'modal',
                        description: 'Показывать окно с предложением начать рабочий день'
                    }
                ]"
                        orientation="horizontal"
                        variant="card"
                        size="sm"
                        default-value="modal"
                        indicator="end"
                        class="overflow-scroll"
                    />
                  </B24FormField>
                </B24Form>

                <!-- Информация о системе помощи -->
                <div class="space-y-4 mt-6">
                  <h4 class="text-sm font-medium text-gray-900">
                    Как работает помощь в старте рабочего дня
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          При первом открытии Битрикс24 в течение дня сотруднику предлагается отметить начало рабочего дня
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          <span class="font-medium">Автоматический старт:</span> рабочий день фиксируется автоматически без участия сотрудника
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          <span class="font-medium">Модальное окно:</span> показывается окно с кнопкой "Начать рабочий день", сотрудник должен подтвердить начало
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">4</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Данные о начале рабочего дня сохраняются и используются в статистике рабочего дня
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start mt-2 p-3 bg-yellow-50 rounded-lg">
                      <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <div class="text-sm text-yellow-700">
                        <span class="font-medium">Доступно только на тарифах:</span> Функция доступна на тарифах "Профессиональный", "Энтерпрайз" и выше
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Блок 5: Помощь в завершении рабочего дня -->
        <B24Card class="mb-8">
          <div class="p-0 md:p-6">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Помощь в завершении рабочего дня
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Автоматическая помощь сотрудникам в своевременном завершении рабочего дня
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <div class="w-2 h-2 rounded-full"
                       :class="formData.workdayEnd.enabled ? 'bg-green-500' : 'bg-red-500'"></div>
                  <B24Switch
                      v-model="formData.workdayEnd.enabled"
                      @update:modelValue="toggleWorkdayEnd"
                      :disabled="isProcessing"
                  />
                </div>
              </div>

              <!-- Настройки помощи в завершении -->
              <div v-if="formData.workdayEnd.enabled" class="space-y-4 pt-4 border-t">
                <B24Form
                    :state="formData"
                    class="space-y-4"
                    @submit="saveWorkdayEndSettings"
                >
                  <!-- Способ завершения рабочего дня -->
                  <B24FormField
                      label="Способ завершения рабочего дня"
                      name="workdayEndMethod"
                      :help-text="`Текущий способ: ${getWorkdayEndMethodText()}`"
                  >
                    <B24RadioGroup
                        v-model="formData.workdayEnd.method"
                        :disabled="isProcessing"
                        :items="[
                    {
                        label: 'Автоматическое завершение',
                        value: 'auto',
                        description: 'Рабочий день завершается автоматически'
                    },
                    {
                        label: 'Модальное окно с предупреждением',
                        value: 'modal',
                        description: 'Показывать окно с предложением завершить рабочий день'
                    }
                ]"
                        orientation="horizontal"
                        variant="card"
                        size="sm"
                        default-value="modal"
                        indicator="end"
                        class="overflow-scroll"
                    />
                  </B24FormField>
                </B24Form>

                <!-- Информация о системе помощи в завершении -->
                <div class="space-y-4 mt-6">
                  <h4 class="text-sm font-medium text-gray-900">
                    Как работает помощь в завершении рабочего дня
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          При завершении рабочего времени сотруднику предлагается отметить окончание рабочего дня
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          <span class="font-medium">Автоматическое завершение:</span> рабочий день фиксируется автоматически без участия сотрудника
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          <span class="font-medium">Модальное окно:</span> показывается окно с кнопкой "Завершить рабочий день", сотрудник должен подтвердить завершение
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-xs font-medium text-blue-600">4</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-700">
                          Данные о завершении рабочего дня сохраняются и используются в статистике рабочего дня
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start mt-2 p-3 bg-yellow-50 rounded-lg">
                      <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <div class="text-sm text-yellow-700">
                        <span class="font-medium">Доступно только на тарифах:</span> Функция доступна на тарифах "Профессиональный", "Энтерпрайз" и выше
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </B24Card>

        <!-- Хранилище активности сотрудников -->
        <StorageManager
            ref="activityStorage"
            title="Хранилище истории посещений сотрудников"
            description="Выполняет роль локальной базы данных, место под хранилище выделяется на самом портале Битрикс24. Это позволяет избежать хранения данных на стороне стороннего сервера."
            entity-id="pr_tracking"
            storage-name="Статистика посещений"
            :properties="activityProperties"
            :categories="categories"
            :show-categories="false"
            class="mt-8"
        />

        <!-- Хранилище сохраненного времени -->
        <StorageManager
            ref="savedTimeStorage"
            title="Хранилище сохраненного времени сотрудников"
            description="Хранит персональные счетчики сохраненного времени каждого пользователя. Сбрасывайте счетчики при необходимости."
            entity-id="pr_saved_time"
            storage-name="Сохраненное время"
            :properties="savedTimeProperties"
            class="mt-8"
        />

        <!-- Управление встройками -->
        <PlacementsManager
            class="mt-8"
        />
      </div>

      <!-- Сайдбар с информацией -->
      <div class="lg:col-span-1">
        <Sidebar/>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, watch} from 'vue'
import {useToast} from '@bitrix24/b24ui-nuxt/composables/useToast'
import StorageManager from './StorageManager.vue'
import PlacementsManager from './PlacementsManager.vue'
import Sidebar from './Sidebar.vue'
import categoriesData from './categories.json'

const toast = useToast()

// Класс для работы с системой контроля присутствия
class SettingsSystem {
  constructor() {
    this.isProcessing = ref(false)
    this.pageTrackingHistoryDaysError = ref(null)
    this.pageTimeThresholdError = ref(null)
    this.absenceTimeThresholdError = ref(null)
    this.employeeReactionTimeError = ref(null)
    this.isBitrixLoaded = ref(false)

    this.formData = ref({
      pageTracking: {
        enabled: false,
        historyDays: 30
      },
      presenceControl: {
        enabled: false,
        pageTimeThreshold: 5, // Время на странице до проверки присутствия (в минутах)
        notifyManager: {
          enabled: false,
          absenceTimeThreshold: 300, // 300 секунд = 5 минут
          method: 'chat' // chat, push, all
        }
      },
      subordinateReports: {
        enabled: false,
        employeeReactionTime: 300, // Время на реакцию сотрудника (в секундах) - 5 минут по умолчанию
        responseMethod: 'chat', // Способ получения ответа: chat, push, all
        deliveryMethod: 'chat' // Способ доставки запроса: chat, push, all
      },
      workdayStart: {
        enabled: false,
        method: 'modal' // 'auto' или 'modal'
      },
      workdayEnd: {
        enabled: false,
        method: 'modal' // 'auto' или 'modal'
      }
    })
  }

  // Метод для получения текста способа завершения рабочего дня
  getWorkdayEndMethodText() {
    const methods = {
      'auto': 'Автоматическое завершение',
      'modal': 'Модальное окно с предупреждением'
    }
    return methods[this.formData.value.workdayEnd.method] || 'модальное окно'
  }

  // Метод для переключения функции завершения рабочего дня
  async toggleWorkdayEnd(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_end_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.workdayEnd.enabled = newValue
      this.showNotification('success', newValue ? 'Помощь в завершении рабочего дня включена' : 'Помощь в завершении рабочего дня выключена')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  // Метод для обновления способа завершения рабочего дня
  async updateWorkdayEndMethod() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_end_method', this.formData.value.workdayEnd.method)
      }
      const methodText = this.getWorkdayEndMethodText()
      this.showNotification('success', `Способ завершения рабочего дня: ${methodText}`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения способа завершения')
    } finally {
      this.isProcessing.value = false
    }
  }

  // Метод для сохранения всех настроек завершения рабочего дня
  async saveWorkdayEndSettings() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_end_enabled', this.formData.value.workdayEnd.enabled ? 'Y' : 'N')
        await BX24.appOption.set('workday_end_method', this.formData.value.workdayEnd.method)
      }
      this.showNotification('success', 'Настройки помощи в завершении рабочего дня сохранены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настроек')
    } finally {
      this.isProcessing.value = false
    }
  }

  getWorkdayStartMethodText() {
    const methods = {
      'auto': 'Автоматический старт',
      'modal': 'Модальное окно с предупреждением'
    }
    return methods[this.formData.value.workdayStart.method] || 'модальное окно'
  }

  // Добавить в SettingsSystem класс
  async toggleWorkdayStart(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_start_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.workdayStart.enabled = newValue
      this.showNotification('success', newValue ? 'Помощь в старте рабочего дня включена' : 'Помощь в старте рабочего дня выключена')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateWorkdayStartMethod() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_start_method', this.formData.value.workdayStart.method)
      }
      const methodText = this.getWorkdayStartMethodText()
      this.showNotification('success', `Способ старта рабочего дня: ${methodText}`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения способа старта')
    } finally {
      this.isProcessing.value = false
    }
  }

  async saveWorkdayStartSettings() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('workday_start_enabled', this.formData.value.workdayStart.enabled ? 'Y' : 'N')
        await BX24.appOption.set('workday_start_method', this.formData.value.workdayStart.method)
      }
      this.showNotification('success', 'Настройки помощи в старте рабочего дня сохранены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настроек')
    } finally {
      this.isProcessing.value = false
    }
  }

  // Единая функция для уведомлений
  showNotification(type, message) {
    if (typeof toast !== 'undefined') {
      toast.add({
        description: message,
        variant: type
      })
    }
  }

  // Получение текста способа уведомления
  getNotificationMethodText() {
    const methods = {
      'chat': 'Чат',
      'push': 'Push-уведомление',
      'all': 'Чат и Push-уведомление'
    }
    return methods[this.formData.value.presenceControl.notifyManager.method] || 'чат'
  }

  // Получение текста способа получения ответа
  getResponseMethodText() {
    const methods = {
      'chat': 'Чат',
      'push': 'Push-уведомление',
      'all': 'Чат и Push-уведомление'
    }
    return methods[this.formData.value.subordinateReports.responseMethod] || 'чат'
  }

  // Получение текста способа доставки запроса
  getDeliveryMethodText() {
    const methods = {
      'chat': 'Чат',
      'push': 'Push-уведомление',
      'all': 'Чат и Push-уведомление'
    }
    return methods[this.formData.value.subordinateReports.deliveryMethod] || 'чат'
  }

  validateHistoryDays() {
    this.pageTrackingHistoryDaysError.value = null
    const days = this.formData.value.pageTracking.historyDays

    if (isNaN(days)) {
      this.pageTrackingHistoryDaysError.value = 'Значение должно быть числом'
      return false
    }

    if (days < 1) {
      this.formData.value.pageTracking.historyDays = 1
      this.pageTrackingHistoryDaysError.value = 'Минимальное значение: 1 день'
      return false
    }

    if (days > 7) {
      this.formData.value.pageTracking.historyDays = 30
      this.pageTrackingHistoryDaysError.value = 'Максимальное значение: 30 дней'
      return false
    }

    return true
  }

  validatePageTimeThreshold() {
    this.pageTimeThresholdError.value = null
    const minutes = this.formData.value.presenceControl.pageTimeThreshold

    if (isNaN(minutes)) {
      this.pageTimeThresholdError.value = 'Значение должно быть числом'
      return false
    }

    if (minutes < 1) {
      this.formData.value.presenceControl.pageTimeThreshold = 1
      this.pageTimeThresholdError.value = 'Минимальное значение: 1 минута'
      return false
    }

    if (minutes > 60) {
      this.formData.value.presenceControl.pageTimeThreshold = 60
      this.pageTimeThresholdError.value = 'Максимальное значение: 60 минут'
      return false
    }

    return true
  }

  validateAbsenceTimeThreshold() {
    this.absenceTimeThresholdError.value = null
    const seconds = this.formData.value.presenceControl.notifyManager.absenceTimeThreshold

    if (isNaN(seconds)) {
      this.absenceTimeThresholdError.value = 'Значение должно быть числом'
      return false
    }

    if (seconds < 10) {
      this.formData.value.presenceControl.notifyManager.absenceTimeThreshold = 10
      this.absenceTimeThresholdError.value = 'Минимальное значение: 10 секунд'
      return false
    }

    if (seconds > 300) {
      this.formData.value.presenceControl.notifyManager.absenceTimeThreshold = 300
      this.absenceTimeThresholdError.value = 'Максимальное значение: 300 секунд (5 минут)'
      return false
    }

    return true
  }

  validateEmployeeReactionTime() {
    this.employeeReactionTimeError.value = null
    const seconds = this.formData.value.subordinateReports.employeeReactionTime

    if (isNaN(seconds)) {
      this.employeeReactionTimeError.value = 'Значение должно быть числом'
      return false
    }

    if (seconds < 10) {
      this.formData.value.subordinateReports.employeeReactionTime = 10
      this.employeeReactionTimeError.value = 'Минимальное значение: 10 секунд'
      return false
    }

    if (seconds > 300) {
      this.formData.value.subordinateReports.employeeReactionTime = 300
      this.employeeReactionTimeError.value = 'Максимальное значение: 300 секунд (5 минут)'
      return false
    }

    return true
  }

  async togglePageTracking(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('page_tracking_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.pageTracking.enabled = newValue
      this.showNotification('success', newValue ? 'Отслеживание посещений включено' : 'Отслеживание посещений выключено')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async togglePresenceControl(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('presence_control_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.presenceControl.enabled = newValue
      this.showNotification('success', newValue ? 'Контроль присутствия включен' : 'Контроль присутствия выключен')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async toggleSubordinateReports(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('subordinate_reports_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.subordinateReports.enabled = newValue
      this.showNotification('success', newValue ? 'Запрос отчетов включен' : 'Запрос отчетов выключен')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async toggleNotifyManager(newValue) {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('notify_manager_enabled', newValue ? 'Y' : 'N')
      }
      this.formData.value.presenceControl.notifyManager.enabled = newValue
      this.showNotification('success', newValue ? 'Уведомления руководителю включены' : 'Уведомления руководителю выключены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateHistoryDays() {
    if (!this.validateHistoryDays()) return

    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('page_tracking_history_days', this.formData.value.pageTracking.historyDays.toString())
      }
      this.showNotification('success', `История посещений будет храниться ${this.formData.value.pageTracking.historyDays} дней`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updatePageTimeThreshold() {
    if (!this.validatePageTimeThreshold()) return

    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('presence_page_time_threshold', this.formData.value.presenceControl.pageTimeThreshold.toString())
      }
      this.showNotification('success', `Проверка присутствия начнется после ${this.formData.value.presenceControl.pageTimeThreshold} минут на странице`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateAbsenceTimeThreshold() {
    if (!this.validateAbsenceTimeThreshold()) return

    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('absence_time_threshold', this.formData.value.presenceControl.notifyManager.absenceTimeThreshold.toString())
      }
      this.showNotification('success', `Уведомления будут отправляться при отсутствии более ${this.formData.value.presenceControl.notifyManager.absenceTimeThreshold} секунд`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateEmployeeReactionTime() {
    if (!this.validateEmployeeReactionTime()) return

    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('employee_reaction_time', this.formData.value.subordinateReports.employeeReactionTime.toString())
      }
      this.showNotification('success', `Время на реакцию сотрудника установлено: ${this.formData.value.subordinateReports.employeeReactionTime} секунд`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения настройки')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateNotificationMethod() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('notification_method', this.formData.value.presenceControl.notifyManager.method)
      }
      const methodText = this.getNotificationMethodText()
      this.showNotification('success', `Уведомления будут отправляться через: ${methodText}`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения способа уведомления')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateResponseMethod() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('response_method', this.formData.value.subordinateReports.responseMethod)
      }
      const methodText = this.getResponseMethodText()
      this.showNotification('success', `Ответы от сотрудников будут поступать через: ${methodText}`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения способа получения ответа')
    } finally {
      this.isProcessing.value = false
    }
  }

  async updateDeliveryMethod() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('delivery_method', this.formData.value.subordinateReports.deliveryMethod)
      }
      const methodText = this.getDeliveryMethodText()
      this.showNotification('success', `Запросы сотрудникам будут доставляться через: ${methodText}`)
    } catch {
      this.showNotification('error', 'Ошибка сохранения способа доставки запроса')
    } finally {
      this.isProcessing.value = false
    }
  }

  async savePageTrackingSettings() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('page_tracking_enabled', this.formData.value.pageTracking.enabled ? 'Y' : 'N')
        await BX24.appOption.set('page_tracking_history_days', this.formData.value.pageTracking.historyDays.toString())
      }
      this.showNotification('success', 'Настройки отслеживания посещений сохранены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настроек отслеживания')
    } finally {
      this.isProcessing.value = false
    }
  }

  async savePresenceControlSettings() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('presence_control_enabled', this.formData.value.presenceControl.enabled ? 'Y' : 'N')
        await BX24.appOption.set('presence_page_time_threshold', this.formData.value.presenceControl.pageTimeThreshold.toString())
        await BX24.appOption.set('notify_manager_enabled', this.formData.value.presenceControl.notifyManager.enabled ? 'Y' : 'N')
        await BX24.appOption.set('absence_time_threshold', this.formData.value.presenceControl.notifyManager.absenceTimeThreshold.toString())
        await BX24.appOption.set('notification_method', this.formData.value.presenceControl.notifyManager.method)
      }
      this.showNotification('success', 'Настройки контроля присутствия сохранены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настроек контроля присутствия')
    } finally {
      this.isProcessing.value = false
    }
  }

  async saveSubordinateReportsSettings() {
    try {
      this.isProcessing.value = true
      if (this.isBitrixLoaded.value) {
        await BX24.appOption.set('subordinate_reports_enabled', this.formData.value.subordinateReports.enabled ? 'Y' : 'N')
        await BX24.appOption.set('employee_reaction_time', this.formData.value.subordinateReports.employeeReactionTime.toString())
        await BX24.appOption.set('response_method', this.formData.value.subordinateReports.responseMethod)
        await BX24.appOption.set('delivery_method', this.formData.value.subordinateReports.deliveryMethod)
      }
      this.showNotification('success', 'Настройки запросов отчетов сохранены')
    } catch {
      this.showNotification('error', 'Ошибка сохранения настроек запросов отчетов')
    } finally {
      this.isProcessing.value = false
    }
  }

  async loadSettings() {
    if (this.isBitrixLoaded.value) {
      try {
        const [
          pageTrackingEnabled,
          pageTrackingHistoryDays,
          presenceEnabled,
          pageTimeThreshold,
          notifyManagerEnabled,
          absenceTimeThreshold,
          notificationMethod,
          subordinateReportsEnabled,
          employeeReactionTime,
          responseMethod,
          deliveryMethod,
          workdayStartEnabled,
          workdayStartMethod,
          workdayEndEnabled,
          workdayEndMethod
        ] = await Promise.all([
          BX24.appOption.get('page_tracking_enabled'),
          BX24.appOption.get('page_tracking_history_days'),
          BX24.appOption.get('presence_control_enabled'),
          BX24.appOption.get('presence_page_time_threshold'),
          BX24.appOption.get('notify_manager_enabled'),
          BX24.appOption.get('absence_time_threshold'),
          BX24.appOption.get('notification_method'),
          BX24.appOption.get('subordinate_reports_enabled'),
          BX24.appOption.get('employee_reaction_time'),
          BX24.appOption.get('response_method'),
          BX24.appOption.get('delivery_method'),
          BX24.appOption.get('workday_start_enabled'),
          BX24.appOption.get('workday_start_method'),
          BX24.appOption.get('workday_end_enabled'),
          BX24.appOption.get('workday_end_method')
        ])

        // Загрузка основных настроек
        this.formData.value.pageTracking.enabled = pageTrackingEnabled === 'Y' || pageTrackingEnabled === true || pageTrackingEnabled === 1
        this.formData.value.presenceControl.enabled = presenceEnabled === 'Y' || presenceEnabled === true || presenceEnabled === 1
        this.formData.value.presenceControl.notifyManager.enabled = notifyManagerEnabled === 'Y' || notifyManagerEnabled === true || notifyManagerEnabled === 1
        this.formData.value.subordinateReports.enabled = subordinateReportsEnabled === 'Y' || subordinateReportsEnabled === true || subordinateReportsEnabled === 1
        this.formData.value.workdayStart.enabled = workdayStartEnabled === 'Y' || workdayStartEnabled === true || workdayStartEnabled === 1

        // Загрузка дней хранения истории посещений
        if (pageTrackingHistoryDays) {
          try {
            const days = parseInt(pageTrackingHistoryDays)
            if (!isNaN(days) && days >= 1 && days <= 30) {
              this.formData.value.pageTracking.historyDays = days
            }
          } catch {
            // Игнорируем ошибку парсинга
          }
        }

        // Загрузка времени на странице до проверки присутствия
        if (pageTimeThreshold) {
          try {
            const minutes = parseInt(pageTimeThreshold)
            if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
              this.formData.value.presenceControl.pageTimeThreshold = minutes
            }
          } catch {
            // Игнорируем ошибку парсинга
          }
        }

        // Загрузка времени отсутствия до уведомления
        if (absenceTimeThreshold) {
          try {
            const seconds = parseInt(absenceTimeThreshold)
            if (!isNaN(seconds) && seconds >= 10 && seconds <= 300) {
              this.formData.value.presenceControl.notifyManager.absenceTimeThreshold = seconds
            }
          } catch {
            // Игнорируем ошибку парсинга
          }
        }

        // Загрузка времени на реакцию сотрудника
        if (employeeReactionTime) {
          try {
            const seconds = parseInt(employeeReactionTime)
            if (!isNaN(seconds) && seconds >= 10 && seconds <= 300) {
              this.formData.value.subordinateReports.employeeReactionTime = seconds
            }
          } catch {
            // Игнорируем ошибку парсинга
          }
        }

        // Загрузка способа уведомления для контроля присутствия
        if (notificationMethod && ['chat', 'push', 'all'].includes(notificationMethod)) {
          this.formData.value.presenceControl.notifyManager.method = notificationMethod
        }

        // Загрузка способа получения ответа для отчетов
        if (responseMethod && ['chat', 'push', 'all'].includes(responseMethod)) {
          this.formData.value.subordinateReports.responseMethod = responseMethod
        }

        // Загрузка способа доставки запроса для отчетов
        if (deliveryMethod && ['chat', 'push', 'all'].includes(deliveryMethod)) {
          this.formData.value.subordinateReports.deliveryMethod = deliveryMethod
        }

        // Загрузка способа старта рабочего дня
        if (workdayStartMethod && ['auto', 'modal'].includes(workdayStartMethod)) {
          this.formData.value.workdayStart.method = workdayStartMethod
        }

        this.formData.value.workdayEnd.enabled = workdayEndEnabled === 'Y' || workdayEndEnabled === true || workdayEndEnabled === 1

        if (workdayEndMethod && ['auto', 'modal'].includes(workdayEndMethod)) {
          this.formData.value.workdayEnd.method = workdayEndMethod
        }

      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
      }
    }
  }
}

export default {
  name: 'Settings',
  components: {
    StorageManager,
    PlacementsManager,
    Sidebar
  },
  setup() {
    const settingsSystem = new SettingsSystem()
    const categories = ref(categoriesData.categories)
    const activityProperties = [
      {PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N'},
      {PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S'},
      {PROPERTY: 'PAGE_URL', NAME: 'URL страницы', TYPE: 'S'},
      {PROPERTY: 'PAGE_TIME', NAME: 'Время на странице (сек)', TYPE: 'N'},
      {PROPERTY: 'PAGE_CATEGORY', NAME: 'Категория страницы', TYPE: 'S'},
      {PROPERTY: 'TASK_ID', NAME: 'ID связанной задачи', TYPE: 'N'},
      {PROPERTY: 'ELAPSED_ITEM_ID', NAME: 'ID записи времени', TYPE: 'N'}
    ]

    const savedTimeProperties = [
      {PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N'},
      {PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S'},
      {PROPERTY: 'TOTAL_TIME', NAME: 'Общее сохраненное время (сек)', TYPE: 'N'},
      {PROPERTY: 'UPDATED_AT', NAME: 'Дата последнего обновления', TYPE: 'S'}
    ]

    onMounted(async () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          settingsSystem.isBitrixLoaded.value = true
          await settingsSystem.loadSettings()
        })
      }
    })

    // Наблюдатель для дней хранения истории посещений
    watch(() => settingsSystem.formData.value.pageTracking.historyDays, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.validateHistoryDays()
      settingsSystem.updateHistoryDays()
    })

    // Наблюдатель для времени на странице до проверки присутствия
    watch(() => settingsSystem.formData.value.presenceControl.pageTimeThreshold, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.validatePageTimeThreshold()
      settingsSystem.updatePageTimeThreshold()
    })

    // Наблюдатель для времени отсутствия до уведомления
    watch(() => settingsSystem.formData.value.presenceControl.notifyManager.absenceTimeThreshold, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.validateAbsenceTimeThreshold()
      settingsSystem.updateAbsenceTimeThreshold()
    })

    // Наблюдатель для времени на реакцию сотрудника
    watch(() => settingsSystem.formData.value.subordinateReports.employeeReactionTime, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.validateEmployeeReactionTime()
      settingsSystem.updateEmployeeReactionTime()
    })

    // Наблюдатель для способа уведомления
    watch(() => settingsSystem.formData.value.presenceControl.notifyManager.method, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.updateNotificationMethod()
    })

    // Наблюдатель для способа получения ответа
    watch(() => settingsSystem.formData.value.subordinateReports.responseMethod, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.updateResponseMethod()
    })

    // Наблюдатель для способа доставки запроса
    watch(() => settingsSystem.formData.value.subordinateReports.deliveryMethod, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.updateDeliveryMethod()
    })

    watch(() => settingsSystem.formData.value.workdayStart.method, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.updateWorkdayStartMethod()
    })

    watch(() => settingsSystem.formData.value.workdayEnd.method, () => {
      if (settingsSystem.isProcessing.value) return
      settingsSystem.updateWorkdayEndMethod()
    })

    return {
      formData: settingsSystem.formData,
      isProcessing: settingsSystem.isProcessing,
      pageTrackingHistoryDaysError: settingsSystem.pageTrackingHistoryDaysError,
      pageTimeThresholdError: settingsSystem.pageTimeThresholdError,
      absenceTimeThresholdError: settingsSystem.absenceTimeThresholdError,
      employeeReactionTimeError: settingsSystem.employeeReactionTimeError,
      categories,
      activityProperties,
      savedTimeProperties,
      getNotificationMethodText: settingsSystem.getNotificationMethodText.bind(settingsSystem),
      getResponseMethodText: settingsSystem.getResponseMethodText.bind(settingsSystem),
      getDeliveryMethodText: settingsSystem.getDeliveryMethodText.bind(settingsSystem),
      validateHistoryDays: settingsSystem.validateHistoryDays.bind(settingsSystem),
      validatePageTimeThreshold: settingsSystem.validatePageTimeThreshold.bind(settingsSystem),
      validateAbsenceTimeThreshold: settingsSystem.validateAbsenceTimeThreshold.bind(settingsSystem),
      validateEmployeeReactionTime: settingsSystem.validateEmployeeReactionTime.bind(settingsSystem),
      togglePageTracking: settingsSystem.togglePageTracking.bind(settingsSystem),
      togglePresenceControl: settingsSystem.togglePresenceControl.bind(settingsSystem),
      toggleSubordinateReports: settingsSystem.toggleSubordinateReports.bind(settingsSystem),
      toggleNotifyManager: settingsSystem.toggleNotifyManager.bind(settingsSystem),
      updateHistoryDays: settingsSystem.updateHistoryDays.bind(settingsSystem),
      updatePageTimeThreshold: settingsSystem.updatePageTimeThreshold.bind(settingsSystem),
      updateAbsenceTimeThreshold: settingsSystem.updateAbsenceTimeThreshold.bind(settingsSystem),
      updateEmployeeReactionTime: settingsSystem.updateEmployeeReactionTime.bind(settingsSystem),
      updateNotificationMethod: settingsSystem.updateNotificationMethod.bind(settingsSystem),
      updateResponseMethod: settingsSystem.updateResponseMethod.bind(settingsSystem),
      updateDeliveryMethod: settingsSystem.updateDeliveryMethod.bind(settingsSystem),
      savePageTrackingSettings: settingsSystem.savePageTrackingSettings.bind(settingsSystem),
      savePresenceControlSettings: settingsSystem.savePresenceControlSettings.bind(settingsSystem),
      saveSubordinateReportsSettings: settingsSystem.saveSubordinateReportsSettings.bind(settingsSystem),
      getWorkdayStartMethodText: settingsSystem.getWorkdayStartMethodText.bind(settingsSystem),
      toggleWorkdayStart: settingsSystem.toggleWorkdayStart.bind(settingsSystem),
      updateWorkdayStartMethod: settingsSystem.updateWorkdayStartMethod.bind(settingsSystem),
      saveWorkdayStartSettings: settingsSystem.saveWorkdayStartSettings.bind(settingsSystem),
      getWorkdayEndMethodText: settingsSystem.getWorkdayEndMethodText.bind(settingsSystem),
      toggleWorkdayEnd: settingsSystem.toggleWorkdayEnd.bind(settingsSystem),
      updateWorkdayEndMethod: settingsSystem.updateWorkdayEndMethod.bind(settingsSystem),
      saveWorkdayEndSettings: settingsSystem.saveWorkdayEndSettings.bind(settingsSystem)
    }
  }
}
</script>