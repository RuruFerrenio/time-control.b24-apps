<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Контент страницы -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Заголовок руководства -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('guide.title') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('guide.subtitle') }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Навигация -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Содержимое табов -->
        <div class="p-6">
          <!-- Введение -->
          <div v-if="activeTab === 'introduction'" class="space-y-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ $t('guide.introduction.title') }}
              </h2>
              <div class="prose max-w-none">
                <p class="text-gray-600 mb-4">
                  {{ $t('guide.introduction.description1') }}
                </p>
                <p class="text-gray-600 mb-4">
                  {{ $t('guide.introduction.description2') }}
                </p>

                <!-- Заглушка для картинки -->
                <div class="my-8">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 flex items-center justify-center">
                    <div class="text-center max-w-md">
                      <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p class="text-gray-500 text-sm italic">
                        {{ $t('guide.introduction.imageCaption') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Возможности -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ $t('guide.introduction.featuresTitle') }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="feature in features"
                    :key="feature.id"
                    class="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors"
                >
                  <div class="flex items-start mb-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <component :is="feature.icon" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ feature.title }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Установка -->
          <div v-if="activeTab === 'installation'" class="space-y-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ $t('guide.installation.title') }}
              </h2>
              <div class="space-y-8">
                <!-- Шаг 1 -->
                <div class="flex">
                  <div class="flex-shrink-0">
                    <span class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      {{ $t('guide.installation.step1.title') }}
                    </h3>
                    <p class="text-gray-600 mb-4">
                      {{ $t('guide.installation.step1.description') }}
                    </p>
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 my-4">
                      <div class="text-center">
                        <div class="inline-block bg-white rounded-lg shadow-lg p-4 mb-4">
                          <div class="flex items-center justify-between mb-4">
                            <div class="text-left">
                              <div class="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                              <div class="h-2 bg-gray-100 rounded w-24"></div>
                            </div>
                            <div class="w-12 h-6 bg-blue-100 rounded-full flex items-center">
                              <div class="w-5 h-5 bg-blue-600 rounded-full ml-1"></div>
                            </div>
                          </div>
                          <div class="space-y-3">
                            <div class="h-2 bg-gray-200 rounded w-full"></div>
                            <div class="h-2 bg-gray-200 rounded w-5/6"></div>
                            <div class="h-2 bg-gray-200 rounded w-4/6"></div>
                          </div>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Шаг 2 -->
                <div class="flex">
                  <div class="flex-shrink-0">
                    <span class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">2</span>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      {{ $t('guide.installation.step2.title') }}
                    </h3>
                    <p class="text-gray-600 mb-4">
                      {{ $t('guide.installation.step2.description') }}
                    </p>
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 my-4">
                      <div class="text-center">
                        <div class="inline-block bg-white rounded-lg shadow-lg p-4 mb-4 max-w-sm">
                          <div class="space-y-4">
                            <div class="flex items-center justify-between">
                              <div>
                                <div class="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                                <div class="h-2 bg-gray-100 rounded w-20"></div>
                              </div>
                              <div class="w-12 h-6 bg-blue-100 rounded-full flex items-center">
                                <div class="w-5 h-5 bg-blue-600 rounded-full ml-1"></div>
                              </div>
                            </div>
                            <div class="pl-4 border-l-2 border-blue-200 space-y-3">
                              <div class="flex items-center justify-between">
                                <div class="h-2 bg-gray-200 rounded w-16"></div>
                                <div class="w-8 h-4 bg-gray-100 rounded-full"></div>
                              </div>
                              <div class="flex items-center justify-between">
                                <div class="h-2 bg-gray-200 rounded w-20"></div>
                                <div class="w-8 h-4 bg-gray-100 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Шаг 3 -->
                <div class="flex">
                  <div class="flex-shrink-0">
                    <span class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      {{ $t('guide.installation.step3.title') }}
                    </h3>
                    <p class="text-gray-600 mb-4">
                      {{ $t('guide.installation.step3.description') }}
                    </p>
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 my-4">
                      <div class="text-center">
                        <div class="inline-block bg-white rounded-lg shadow-lg p-6 mb-4">
                          <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div class="h-3 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                          <div class="h-2 bg-gray-100 rounded w-24 mx-auto"></div>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Использование -->
          <div v-if="activeTab === 'usage'" class="space-y-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ $t('guide.usage.title') }}
              </h2>
              <div class="space-y-8">
                <!-- Калькулятор в чате -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {{ $t('guide.usage.chat.title') }}
                  </h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-4">
                      <p class="text-gray-600">
                        {{ $t('guide.usage.chat.description') }}
                      </p>
                      <div class="space-y-3">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span class="text-gray-700">{{ $t('guide.usage.chat.feature1') }}</span>
                        </div>
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span class="text-gray-700">{{ $t('guide.usage.chat.feature2') }}</span>
                        </div>
                      </div>

                      <!-- Подробное описание настроек чата -->
                      <div class="mt-6 bg-blue-50 rounded-lg p-4">
                        <h4 class="text-sm font-semibold text-blue-900 mb-2">
                          {{ $t('chatCalculator.title') }}
                        </h4>
                        <p class="text-sm text-blue-700 mb-3">
                          {{ $t('chatCalculator.description') }}
                        </p>
                        <div class="space-y-3 text-sm">
                          <div class="flex items-start">
                            <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <div>
                              <span class="font-medium text-blue-800">{{ $t('chatCalculator.chatPanel.title') }}:</span>
                              <span class="text-blue-700 ml-1">{{ $t('chatCalculator.chatPanel.description') }}</span>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <div>
                              <span class="font-medium text-blue-800">{{ $t('chatCalculator.chatSidebar.title') }}:</span>
                              <span class="text-blue-700 ml-1">{{ $t('chatCalculator.chatSidebar.description') }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Калькулятор в задачах -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {{ $t('guide.usage.tasks.title') }}
                  </h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 flex items-center justify-center order-2 lg:order-1">
                      <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                    <div class="space-y-4 order-1 lg:order-2">
                      <p class="text-gray-600">
                        {{ $t('guide.usage.tasks.description') }}
                      </p>
                      <div class="space-y-3">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span class="text-gray-700">{{ $t('guide.usage.tasks.feature1') }}</span>
                        </div>
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span class="text-gray-700">{{ $t('guide.usage.tasks.feature2') }}</span>
                        </div>
                      </div>

                      <!-- Подробное описание настроек задач -->
                      <div class="mt-6 bg-green-50 rounded-lg p-4">
                        <h4 class="text-sm font-semibold text-green-900 mb-2">
                          {{ $t('taskCalculator.title') }}
                        </h4>
                        <p class="text-sm text-green-700 mb-3">
                          {{ $t('taskCalculator.description') }}
                        </p>
                        <div class="space-y-3 text-sm">
                          <div class="flex items-start">
                            <div class="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <div>
                              <span class="font-medium text-green-800">{{ $t('taskCalculator.taskSidebar.title') }}:</span>
                              <span class="text-green-700 ml-1">{{ $t('taskCalculator.taskSidebar.description') }}</span>
                            </div>
                          </div>
                          <div class="flex items-start">
                            <div class="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <div>
                              <span class="font-medium text-green-800">{{ $t('taskCalculator.taskTab.title') }}:</span>
                              <span class="text-green-700 ml-1">{{ $t('taskCalculator.taskTab.description') }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Пользовательские поля CRM -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ $t('userFieldType.title') }}
                  </h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-4">
                      <p class="text-gray-600">
                        {{ $t('userFieldType.description') }}
                      </p>

                      <!-- Подробное описание пользовательского типа поля -->
                      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5">
                        <h4 class="text-sm font-semibold text-purple-900 mb-3">
                          {{ $t('userFieldType.info') }}
                        </h4>
                        <div class="space-y-3 text-sm">
                          <div class="flex items-center">
                            <span class="font-medium text-purple-800 w-32 flex-shrink-0">{{ $t('userFieldType.typeCode') }}</span>
                            <code class="bg-white px-2 py-1 rounded text-purple-700 border border-purple-200">calculator_crm</code>
                          </div>
                          <div class="flex items-center">
                            <span class="font-medium text-purple-800 w-32 flex-shrink-0">{{ $t('userFieldType.typeName') }}</span>
                            <span class="text-purple-700">{{ $t('userFieldType.title') }}</span>
                          </div>
                          <div class="flex items-start">
                            <span class="font-medium text-purple-800 w-32 flex-shrink-0">{{ $t('userFieldType.typeDescription') }}</span>
                            <span class="text-purple-700">{{ $t('userFieldType.description') }}</span>
                          </div>
                        </div>

                        <div class="mt-4 pt-4 border-t border-purple-200">
                          <h5 class="text-xs font-semibold text-purple-900 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ $t('userFieldType.fieldInfo') }}
                          </h5>
                          <p class="text-xs text-purple-700">
                            {{ $t('userFieldType.fieldInfoDescription') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <p class="text-gray-500 text-sm italic">
                          {{ $t('guide.imagePlaceholder') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ -->
          <div v-if="activeTab === 'faq'" class="space-y-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                {{ $t('guide.faq.title') }}
              </h2>
              <div class="space-y-4">
                <div
                    v-for="(item, index) in faqItems"
                    :key="index"
                    class="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <button
                      @click="toggleFaq(index)"
                      class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                  >
                    <span class="font-medium text-gray-900 text-left pr-4">{{ item.question }}</span>
                    <svg
                        class="w-5 h-5 text-gray-500 transition-transform flex-shrink-0"
                        :class="{ 'transform rotate-180': openFaqIndex === index }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                      v-if="openFaqIndex === index"
                      class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200"
                  >
                    <p class="text-gray-700">{{ item.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Поддержка -->
          <div v-if="activeTab === 'support'" class="space-y-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ $t('guide.support.title') }}
              </h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Контактная информация -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                      {{ $t('guide.support.contact.title') }}
                    </h3>
                    <div class="space-y-4">
                      <div class="flex items-start p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                        <svg class="w-6 h-6 mr-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <a
                              href="mailto:it.galera@yandex.ru?subject=Поддержка приложения Калькулятор в CRM"
                              class="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            it.galera@yandex.ru
                          </a>
                          <p class="text-sm text-gray-600 mt-1">{{ $t('guide.support.contact.responseTime') }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Информация о возможностях калькулятора -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                    <h4 class="text-sm font-semibold text-blue-900 mb-3">
                      {{ $t('calculator.helpTitle') }}
                    </h4>
                    <div class="space-y-3 text-sm">
                      <div class="flex items-start">
                        <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span class="text-blue-800">{{ $t('guide.introduction.featuresTitle') }}</span>
                      </div>
                      <div class="flex items-start">
                        <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span class="text-blue-800">{{ $t('guide.features.chat.description') }}</span>
                      </div>
                      <div class="flex items-start">
                        <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span class="text-blue-800">{{ $t('guide.features.tasks.description') }}</span>
                      </div>
                      <div class="flex items-start">
                        <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span class="text-blue-800">{{ $t('guide.features.crm.description') }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Форма обратной связи -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    {{ $t('guide.support.feedbackForm.title') }}
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ $t('guide.support.feedbackForm.email') }}
                      </label>
                      <input
                          v-model="feedback.email"
                          type="email"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          :placeholder="$t('guide.support.feedbackForm.emailPlaceholder')"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ $t('guide.support.feedbackForm.message') }}
                      </label>
                      <textarea
                          v-model="feedback.message"
                          rows="5"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          :placeholder="$t('guide.support.feedbackForm.messagePlaceholder')"
                      ></textarea>
                    </div>
                    <button
                        @click="submitFeedback"
                        :disabled="!feedback.email || !feedback.message"
                        class="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {{ $t('guide.support.feedbackForm.submit') }}
                    </button>
                    <p class="text-xs text-gray-500 text-center">
                      {{ $t('guide.support.feedbackForm.privacyNote') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка возврата в левом нижнем углу -->
    <div class="fixed bottom-4 left-4 z-50">
      <router-link
          to="/app"
          class="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-xl"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('guide.backToSettings') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Иконки
const ChatIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
}

const TaskIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  `
}

const CrmIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

const SupportIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `
}

export default {
  name: 'Guide',
  setup() {
    const { t, locale } = useI18n()
    const activeTab = ref('introduction')
    const openFaqIndex = ref(null)
    const feedback = ref({
      email: '',
      message: ''
    })

    // Функция для определения языка из Bitrix24
    const detectLanguageFromBitrix24 = () => {
      try {
        // Способ 1: Из параметров Bitrix24
        if (typeof BX24 !== 'undefined') {
          const bxLang = BX24.getLanguage ? BX24.getLanguage() : null
          if (bxLang) {
            console.log('Язык из BX24.getLanguage():', bxLang)
            return bxLang.toLowerCase()
          }
        }

        // Способ 2: Из параметров URL
        const urlParams = new URLSearchParams(window.location.search)
        const urlLang = urlParams.get('LANG') || urlParams.get('lang')
        if (urlLang) {
          console.log('Язык из URL параметра:', urlLang)
          return urlLang.toLowerCase()
        }

        // Способ 3: Из iframe параметров
        if (window.parent !== window) {
          try {
            const frameUrl = document.referrer
            if (frameUrl && frameUrl.includes('bitrix24')) {
              const frameLangMatch = frameUrl.match(/[?&]LANG=([^&]+)/i)
              if (frameLangMatch) {
                console.log('Язык из iframe referrer:', frameLangMatch[1])
                return frameLangMatch[1].toLowerCase()
              }
            }
          } catch (e) {
            console.log('Не удалось получить язык из iframe:', e)
          }
        }

        // Способ 4: Из сохраненных настроек
        const savedLang = localStorage.getItem('bitrix24_language')
        if (savedLang) {
          console.log('Язык из сохраненных настроек:', savedLang)
          return savedLang.toLowerCase()
        }

        console.log('Язык не определен, используется русский по умолчанию')
        return 'ru'
      } catch (error) {
        console.error('Ошибка определения языка:', error)
        return 'ru'
      }
    }

    // Функция установки языка
    const setLanguage = (langCode) => {
      try {
        const normalizedLang = langCode.toLowerCase()

        // Сопоставляем с доступными языками
        let finalLang = 'ru'
        if (normalizedLang === 'en' || normalizedLang === 'en_us' || normalizedLang === 'en_gb') {
          finalLang = 'en'
        } else if (normalizedLang === 'be' || normalizedLang === 'by') {
          finalLang = 'be'
        } else if (normalizedLang === 'kk' || normalizedLang === 'kz') {
          finalLang = 'kk'
        } else if (normalizedLang.startsWith('ru')) {
          finalLang = 'ru'
        }

        // Устанавливаем язык в i18n
        locale.value = finalLang
        console.log('Установлен язык в руководстве:', finalLang)

        // Сохраняем язык в localStorage
        localStorage.setItem('bitrix24_language', finalLang)
      } catch (error) {
        console.error('Ошибка установки языка:', error)
        locale.value = 'ru'
      }
    }

    const tabs = computed(() => [
      { id: 'introduction', name: t('guide.tabs.introduction') },
      { id: 'installation', name: t('guide.tabs.installation') },
      { id: 'usage', name: t('guide.tabs.usage') },
      { id: 'faq', name: t('guide.tabs.faq') },
      { id: 'support', name: t('guide.tabs.support') }
    ])

    const features = computed(() => [
      {
        id: 1,
        title: t('guide.features.chat.title'),
        description: t('guide.features.chat.description'),
        icon: ChatIcon
      },
      {
        id: 2,
        title: t('guide.features.tasks.title'),
        description: t('guide.features.tasks.description'),
        icon: TaskIcon
      },
      {
        id: 3,
        title: t('guide.features.crm.title'),
        description: t('guide.features.crm.description'),
        icon: CrmIcon
      },
      {
        id: 4,
        title: t('guide.features.settings.title'),
        description: t('guide.features.settings.description'),
        icon: SettingsIcon
      },
      {
        id: 5,
        title: t('guide.features.support.title'),
        description: t('guide.features.support.description'),
        icon: SupportIcon
      }
    ])

    const faqItems = computed(() => [
      {
        question: t('guide.faq.items.q1'),
        answer: t('guide.faq.items.a1')
      },
      {
        question: t('guide.faq.items.q2'),
        answer: t('guide.faq.items.a2')
      },
      {
        question: t('guide.faq.items.q3'),
        answer: t('guide.faq.items.a3')
      },
      {
        question: t('guide.faq.items.q4'),
        answer: t('guide.faq.items.a4')
      }
    ])

    const toggleFaq = (index) => {
      openFaqIndex.value = openFaqIndex.value === index ? null : index
    }

    const submitFeedback = () => {
      if (!feedback.value.email || !feedback.value.message) return

      const subject = encodeURIComponent('Обратная связь: Калькулятор в CRM')
      const body = encodeURIComponent(
          `Email: ${feedback.value.email}\n\nСообщение:\n${feedback.value.message}\n\n---\nОтправлено из руководства пользователя приложения Калькулятор в CRM`
      )

      const mailtoLink = `mailto:it.galera@yandex.ru?subject=${subject}&body=${body}`
      window.location.href = mailtoLink

      // Сброс формы
      feedback.value = {
        email: '',
        message: ''
      }

      // Показать сообщение об успешной отправке
      alert('Открывается почтовый клиент. Пожалуйста, отправьте письмо для завершения отправки обратной связи.')
    }

    // Инициализация языка при загрузке компонента
    onMounted(() => {
      const detectedLang = detectLanguageFromBitrix24()
      setLanguage(detectedLang)
    })

    return {
      activeTab,
      tabs,
      features,
      faqItems,
      openFaqIndex,
      feedback,
      toggleFaq,
      submitFeedback
    }
  }
}
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Плавные переходы для вкладок */
button {
  transition: all 0.2s ease;
}

/* Стили для скроллбара в навигации */
nav {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

nav::-webkit-scrollbar {
  height: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f7fafc;
}

nav::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 2px;
}

/* Анимация для карточек */
.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

/* Стили для формы */
input, textarea {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Анимация для кнопки возврата */
.back-button {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .flex {
    flex-direction: column;
  }

  .ml-4 {
    margin-left: 0;
    margin-top: 1rem;
  }
}
</style>