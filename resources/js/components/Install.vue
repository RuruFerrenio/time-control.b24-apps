<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Шапка с логотипом -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
          <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-3">
          {{ $t('install.title') }}
        </h1>
        <p class="text-lg text-gray-600 mx-auto">
          {{ $t('install.subtitle') }}
        </p>
      </div>

      <!-- Прогресс-бар -->
      <div class="mx-auto mb-8">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-blue-600">{{ $t('install.progress') }}: {{ progress }}%</span>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ $t('install.welcome.title') }}
              </h2>
              <p class="text-gray-600 mb-6">
                {{ $t('install.welcome.description') }}
              </p>
              <div class="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 class="text-lg font-semibold text-blue-800 mb-3">
                  {{ $t('install.features.title') }}
                </h3>
                <ul class="space-y-3">
                  <li v-for="feature in features" :key="feature.id" class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
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
                  {{ $t('install.buttons.start') }}
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 2: Выбор встроек -->
        <div v-else-if="currentStep === 2" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ $t('install.placements.title') }}
              </h2>
              <p class="text-gray-600 mb-6">
                {{ $t('install.placements.description') }}
              </p>

              <!-- Карточки встроек -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Калькулятор в чате -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <!-- Плашка "Уже установлено" -->
                    <div v-if="placementStatus.chat.installed" class="mb-4">
                      <div
                          class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ $t('install.placements.alreadyInstalled') }}
                      </div>
                    </div>

                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ $t('install.placements.chat.title') }}
                          </h3>
                          <p class="text-sm text-gray-500">{{ $t('install.placements.chat.description') }}</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedPlacements.chat"
                          :disabled="placementStatus.chat.installed && selectedPlacements.chat"
                          class="large-bordered-switch"
                      />
                    </div>

                    <!-- Слайдер для изображений -->
                    <div
                        class="bg-gray-100 rounded-lg overflow-hidden mb-4 relative"
                        @mouseenter="stopAutoplay"
                        @mouseleave="startAutoplay"
                    >
                      <!-- Текущее изображение -->
                      <div class="relative h-48 overflow-hidden">
                        <transition name="fade" mode="out-in">
                          <div
                              :key="chatImages[currentChatSlide]"
                              class="absolute inset-0 flex items-center justify-center p-4"
                          >
                            <div class="text-center">
                              <img
                                  :src="chatImages[currentChatSlide]"
                                  :alt="$t('install.placements.chat.imageAlt')"
                                  class="max-w-full max-h-full object-contain mx-auto"
                              />
                              <p class="text-xs text-gray-500 mt-2">
                                {{ getChatImageDescription(currentChatSlide) }}
                              </p>
                            </div>
                          </div>
                        </transition>
                      </div>

                      <!-- Кнопки навигации слайдера (только если изображений больше одного) -->
                      <div v-if="chatImages.length > 1"
                           class="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                        <button
                            @click="prevChatSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentChatSlide === 0"
                            :class="{ 'opacity-50 cursor-not-allowed': currentChatSlide === 0 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        <button
                            @click="nextChatSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentChatSlide >= chatImages.length - 1"
                            :class="{ 'opacity-50 cursor-not-allowed': currentChatSlide >= chatImages.length - 1 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Индикаторы прогресса (только если изображений больше одного) -->
                      <div v-if="chatImages.length > 1"
                           class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        <button
                            v-for="index in chatImages.length"
                            :key="index"
                            @click="goToChatSlide(index - 1)"
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            :class="currentChatSlide === index - 1 ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'"
                            :aria-label="`Перейти к изображению ${index}`"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.chat.feature1') }}</span>
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.chat.feature2') }}</span>
                      </div>
                    </div>
                  </div>
                </B24Card>

                <!-- Калькулятор в задачах -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <!-- Плашка "Уже установлено" -->
                    <div v-if="placementStatus.tasks.installed" class="mb-4">
                      <div
                          class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ $t('install.placements.alreadyInstalled') }}
                      </div>
                    </div>

                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ $t('install.placements.tasks.title') }}
                          </h3>
                          <p class="text-sm text-gray-500">{{ $t('install.placements.tasks.description') }}</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedPlacements.tasks"
                          :disabled="placementStatus.tasks.installed && selectedPlacements.tasks"
                          class="large-bordered-switch"
                      />
                    </div>

                    <!-- Слайдер для изображений -->
                    <div
                        class="bg-gray-100 rounded-lg overflow-hidden mb-4 relative"
                        @mouseenter="stopAutoplay"
                        @mouseleave="startAutoplay"
                    >
                      <!-- Текущее изображение -->
                      <div class="relative h-48 overflow-hidden">
                        <transition name="fade" mode="out-in">
                          <div
                              :key="taskImages[currentTaskSlide]"
                              class="absolute inset-0 flex items-center justify-center p-4"
                          >
                            <div class="text-center">
                              <img
                                  :src="taskImages[currentTaskSlide]"
                                  :alt="$t('install.placements.tasks.imageAlt')"
                                  class="max-w-full max-h-full object-contain mx-auto"
                              />
                              <p class="text-xs text-gray-500 mt-2">
                                {{ getTaskImageDescription(currentTaskSlide) }}
                              </p>
                            </div>
                          </div>
                        </transition>
                      </div>

                      <!-- Кнопки навигации слайдера (только если изображений больше одного) -->
                      <div v-if="taskImages.length > 1"
                           class="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                        <button
                            @click="prevTaskSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentTaskSlide === 0"
                            :class="{ 'opacity-50 cursor-not-allowed': currentTaskSlide === 0 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        <button
                            @click="nextTaskSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentTaskSlide >= taskImages.length - 1"
                            :class="{ 'opacity-50 cursor-not-allowed': currentTaskSlide >= taskImages.length - 1 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Индикаторы прогресса (только если изображений больше одного) -->
                      <div v-if="taskImages.length > 1"
                           class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        <button
                            v-for="index in taskImages.length"
                            :key="index"
                            @click="goToTaskSlide(index - 1)"
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            :class="currentTaskSlide === index - 1 ? 'bg-green-600 w-4' : 'bg-gray-300 hover:bg-gray-400'"
                            :aria-label="`Перейти к изображению ${index}`"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.tasks.feature2') }}</span>
                      </div>
                    </div>
                  </div>
                </B24Card>

                <!-- Калькулятор в карточке звонка -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <!-- Плашка "Уже установлено" -->
                    <div v-if="placementStatus.callCard.installed" class="mb-4">
                      <div
                          class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ $t('install.placements.alreadyInstalled') }}
                      </div>
                    </div>

                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ $t('install.placements.callCard.title') }}
                          </h3>
                          <p class="text-sm text-gray-500">{{ $t('install.placements.callCard.description') }}</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedPlacements.callCard"
                          :disabled="placementStatus.callCard.installed && selectedPlacements.callCard"
                          class="large-bordered-switch"
                      />
                    </div>

                    <!-- Слайдер для изображений -->
                    <div
                        class="bg-gray-100 rounded-lg overflow-hidden mb-4 relative"
                        @mouseenter="stopAutoplay"
                        @mouseleave="startAutoplay"
                    >
                      <!-- Текущее изображение -->
                      <div class="relative h-48 overflow-hidden">
                        <transition name="fade" mode="out-in">
                          <div
                              :key="callCardImages[currentCallCardSlide]"
                              class="absolute inset-0 flex items-center justify-center p-4"
                          >
                            <div class="text-center">
                              <img
                                  :src="callCardImages[currentCallCardSlide]"
                                  :alt="$t('install.placements.callCard.imageAlt')"
                                  class="max-w-full max-h-full object-contain mx-auto"
                              />
                              <p class="text-xs text-gray-500 mt-2">
                                {{ getCallCardImageDescription(currentCallCardSlide) }}
                              </p>
                            </div>
                          </div>
                        </transition>
                      </div>

                      <!-- Кнопки навигации слайдера (только если изображений больше одного) -->
                      <div v-if="callCardImages.length > 1"
                           class="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                        <button
                            @click="prevCallCardSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentCallCardSlide === 0"
                            :class="{ 'opacity-50 cursor-not-allowed': currentCallCardSlide === 0 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        <button
                            @click="nextCallCardSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentCallCardSlide >= callCardImages.length - 1"
                            :class="{ 'opacity-50 cursor-not-allowed': currentCallCardSlide >= callCardImages.length - 1 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Индикаторы прогресса (только если изображений больше одного) -->
                      <div v-if="callCardImages.length > 1"
                           class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        <button
                            v-for="index in callCardImages.length"
                            :key="index"
                            @click="goToCallCardSlide(index - 1)"
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            :class="currentCallCardSlide === index - 1 ? 'bg-purple-600 w-4' : 'bg-gray-300 hover:bg-gray-400'"
                            :aria-label="`Перейти к изображению ${index}`"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.callCard.feature1') }}</span>
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.callCard.feature2') }}</span>
                      </div>
                    </div>
                  </div>
                </B24Card>

                <!-- Пользовательский тип поля -->
                <B24Card class="hover:shadow-lg transition-shadow duration-300">
                  <div class="p-6">
                    <!-- Плашка "Уже установлено" -->
                    <div v-if="placementStatus.userField.installed" class="mb-4">
                      <div
                          class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ $t('install.placements.alreadyInstalled') }}
                      </div>
                    </div>

                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ $t('install.placements.userField.title') }}
                          </h3>
                          <p class="text-sm text-gray-500">{{ $t('install.placements.userField.description') }}</p>
                        </div>
                      </div>
                      <B24Switch
                          v-model="selectedPlacements.userField"
                          :disabled="placementStatus.userField.installed && selectedPlacements.userField"
                          class="large-bordered-switch"
                      />
                    </div>

                    <!-- Слайдер для изображений -->
                    <div
                        class="bg-gray-100 rounded-lg overflow-hidden mb-4 relative"
                        @mouseenter="stopAutoplay"
                        @mouseleave="startAutoplay"
                    >
                      <!-- Текущее изображение -->
                      <div class="relative h-48 overflow-hidden">
                        <transition name="fade" mode="out-in">
                          <div
                              :key="userFieldImages[currentUserFieldSlide]"
                              class="absolute inset-0 flex items-center justify-center p-4"
                          >
                            <div class="text-center">
                              <img
                                  :src="userFieldImages[currentUserFieldSlide]"
                                  :alt="$t('install.placements.userField.imageAlt')"
                                  class="max-w-full max-h-full object-contain mx-auto"
                              />
                              <p class="text-xs text-gray-500 mt-2">
                                {{ getUserFieldImageDescription(currentUserFieldSlide) }}
                              </p>
                            </div>
                          </div>
                        </transition>
                      </div>

                      <!-- Кнопки навигации слайдера (только если изображений больше одного) -->
                      <div v-if="userFieldImages.length > 1"
                           class="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                        <button
                            @click="prevUserFieldSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentUserFieldSlide === 0"
                            :class="{ 'opacity-50 cursor-not-allowed': currentUserFieldSlide === 0 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        <button
                            @click="nextUserFieldSlide"
                            class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm"
                            :disabled="currentUserFieldSlide >= userFieldImages.length - 1"
                            :class="{ 'opacity-50 cursor-not-allowed': currentUserFieldSlide >= userFieldImages.length - 1 }"
                        >
                          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Индикаторы прогресса (только если изображений больше одного) -->
                      <div v-if="userFieldImages.length > 1"
                           class="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        <button
                            v-for="index in userFieldImages.length"
                            :key="index"
                            @click="goToUserFieldSlide(index - 1)"
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            :class="currentUserFieldSlide === index - 1 ? 'bg-orange-600 w-4' : 'bg-gray-300 hover:bg-gray-400'"
                            :aria-label="`Перейти к изображению ${index}`"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.userField.feature1') }}</span>
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ $t('install.placements.userField.feature2') }}</span>
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
                  {{ $t('install.buttons.back') }}
                </B24Button>
                <B24Button
                    @click="nextStep"
                    variant="primary"
                    size="large"
                    :disabled="!hasSelectedPlacements"
                    class="px-4 py-2"
                >
                  {{ $t('install.buttons.continue') }}
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </B24Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 3: Установка -->
        <div v-else-if="currentStep === 3" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ $t('install.installation.title') }}
              </h2>
              <p class="text-gray-600 mb-6">
                {{ $t('install.installation.description') }}
              </p>

              <!-- Информация о переустановке -->
              <div v-if="showReinstallWarning && hasSelectedPlacements"
                   class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <div>
                    <p class="text-sm text-yellow-700">
                      {{ $t('install.installation.reinstallWarning') }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Список устанавливаемых встроек -->
              <div class="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  {{ $t('install.installation.selectedPlacements') }}
                </h3>
                <div class="space-y-4">
                  <div v-for="placement in selectedPlacementsList" :key="placement.id" class="flex items-center">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                         :class="getPlacementIconClass(placement.id)">
                      <component :is="getPlacementIcon(placement.id)" class="w-5 h-5 text-white"/>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ placement.title }}</p>
                      <p class="text-sm text-gray-500">{{ placement.description }}</p>
                      <div class="flex items-center mt-1 space-x-2">
                        <p v-if="placementStatus[placement.id]?.installed && selectedPlacements[placement.id] && showReinstallWarning"
                           class="text-xs text-yellow-600">
                          {{ $t('install.installation.willBeReinstalled') }}
                        </p>
                        <p v-else-if="placementStatus[placement.id]?.installed && selectedPlacements[placement.id]"
                           class="text-xs text-green-600">
                          {{ $t('install.installation.alreadyInstalled') }}
                        </p>
                      </div>
                    </div>
                    <div
                        v-if="placementStatus[placement.id]?.installed && selectedPlacements[placement.id] && !showReinstallWarning"
                        class="ml-4">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div v-else-if="installationStatus[placement.id] === 'loading'" class="ml-4">
                      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="installationStatus[placement.id] === 'success'" class="ml-4">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div v-else-if="installationStatus[placement.id] === 'error'" class="ml-4">
                      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Прогресс установки -->
              <div v-if="isInstalling" class="mb-8">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-blue-600">
                    {{ $t('install.installation.progress') }}: {{ installationProgress }}%
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

              <!-- Кнопки навигации -->
              <div class="flex justify-between pt-6 border-t">
                <B24Button
                    @click="prevStep"
                    variant="outline"
                    size="large"
                    :disabled="isInstalling"
                    class="px-4 py-2"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  {{ $t('install.buttons.back') }}
                </B24Button>
                <div class="flex space-x-4">
                  <B24Button
                      v-if="!isInstalling && !installationComplete"
                      @click="startInstallation"
                      variant="primary"
                      size="large"
                      :disabled="!hasSelectedPlacements"
                      class="px-4 py-2"
                  >
                    <template v-if="showReinstallWarning">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      {{ $t('install.buttons.reinstall') }}
                    </template>
                    <template v-else>
                      {{ $t('install.buttons.install') }}
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </template>
                  </B24Button>
                  <B24Button
                      v-else-if="installationComplete"
                      @click="nextStep"
                      variant="primary"
                      size="large"
                      class="px-4 py-2"
                  >
                    {{ $t('install.buttons.finish') }}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </B24Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Шаг 4: Завершение -->
        <div v-else-if="currentStep === 4" class="bg-white rounded-2xl shadow-lg p-8">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ $t('install.completion.title') }}
              </h2>

              <div class="space-y-6">
                <p class="text-lg text-gray-700">
                  {{ $t('install.completion.description') }}
                </p>

                <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">
                    {{ $t('install.completion.reviewTitle') }}
                  </h3>
                  <p class="text-gray-600 mb-4">
                    {{ $t('install.completion.reviewDescription') }}
                  </p>
                  <div class="flex items-center space-x-4">
                    <a
                        :href="reviewLink"
                        target="_blank"
                        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                      {{ $t('install.buttons.review') }}
                    </a>
                    <a
                        href="mailto:it.galera@yandex.ru?subject=Вопрос по приложению Калькулятор в CRM"
                        target="_blank"
                        class="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      {{ $t('install.buttons.support') }}
                    </a>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    {{ $t('install.completion.nextSteps') }}
                  </h3>
                  <ul class="space-y-3">
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      {{ $t('install.completion.step1') }}
                    </li>
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      {{ $t('install.completion.step2') }}
                    </li>
                    <li class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      {{ $t('install.completion.step3') }}
                    </li>
                  </ul>
                </div>

                <div class="flex justify-between pt-6 border-t">
                  <B24Button
                      @click="openSettings"
                      variant="outline"
                      size="large"
                      class="px-4 py-2"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ $t('install.buttons.settings') }}
                  </B24Button>
                  <div class="flex space-x-4">
                    <B24Button
                        @click="finishInstallation"
                        variant="primary"
                        size="large"
                        class="px-4 py-2"
                    >
                      {{ $t('install.buttons.complete') }}
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
import {ref, computed, onMounted, onUnmounted, h, markRaw} from 'vue'
import {useI18n} from 'vue-i18n'
import {useToast} from '@bitrix24/b24ui-nuxt/composables/useToast'

const ChatIcon = {
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      })
    ])
  }
}

const TaskIcon = {
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      })
    ])
  }
}

const PhoneIcon = {
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
      })
    ])
  }
}

const FieldIcon = {
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ])
  }
}

// Конфигурации встроек
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
  name: 'Install',
  setup() {
    const {t, locale} = useI18n()
    const toast = useToast()

    // Состояние
    const currentStep = ref(1)
    const totalSteps = 4
    const progress = computed(() => Math.round((currentStep.value / totalSteps) * 100))

    // Выбранные встройки
    const selectedPlacements = ref({
      chat: true,
      tasks: true,
      callCard: true,
      userField: true
    })

    // Статус установки
    const isInstalling = ref(false)
    const installationComplete = ref(false)
    const installationStatus = ref({})
    const installedCount = ref(0)

    // Статус встроек (уже установлены или нет)
    const placementStatus = ref({
      chat: {installed: false, checking: false},
      tasks: {installed: false, checking: false},
      callCard: {installed: false, checking: false},
      userField: {installed: false, checking: false}
    })

    // Предупреждение о переустановке
    const showReinstallWarning = ref(false)

    // Ссылка на отзыв
    const reviewLink = 'https://marketplace.bitrix24.ru/your-app-url/reviews/'

    // URL обработчиков
    const HANDLERS = {
      chatPanel: `${window.location.origin}/placements/chat-panel`,
      chatSidebar: `${window.location.origin}/placements/chat-sidebar`,
      taskSidebar: `${window.location.origin}/placements/task-sidebar`,
      taskTab: `${window.location.origin}/placements/task-tab`,
      callCard: `${window.location.origin}/placements/call-card`,
      userField: `${window.location.origin}/placements/task-sidebar`
    }

    // Изображения для слайдеров
    const chatImages = ref([
      `${window.location.origin}/images/install/calc_in_chat_panel.png`,
      `${window.location.origin}/images/install/calc_in_chat_sidebar.png`
    ])

    const taskImages = ref([
      `${window.location.origin}/images/install/calc_in_task.png`,
    ])

    const callCardImages = ref([
      `${window.location.origin}/images/install/calc_in_call_card.png`,
    ])

    const userFieldImages = ref([
      `${window.location.origin}/images/install/calc_in_crm.png`,
    ])

    // Текущие слайды
    const currentChatSlide = ref(0)
    const currentTaskSlide = ref(0)
    const currentCallCardSlide = ref(0)
    const currentUserFieldSlide = ref(0)

    // Автопрокрутка слайдеров
    const autoplayIntervals = ref({
      chat: null,
      task: null,
      callCard: null,
      userField: null
    })

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

      getUserFieldTypes: async () => {
        try {
          const result = await bitrixAPI.call('userfieldtype.list', {})
          console.log('Список пользовательских типов полей:', result)
          return result || []
        } catch (error) {
          console.error('Ошибка при получении списка типов полей:', error)
          return []
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

    // Проверка статуса всех встроек
    const checkPlacementsStatus = async () => {
      try {
        // Проверяем встройки чата
        placementStatus.value.chat.checking = true
        const [chatPanelStatus, chatSidebarStatus] = await Promise.all([
          placementManager.checkStatus('IM_TEXTAREA', HANDLERS.chatPanel),
          placementManager.checkStatus('IM_SIDEBAR', HANDLERS.chatSidebar)
        ])
        placementStatus.value.chat.installed = chatPanelStatus || chatSidebarStatus
        placementStatus.value.chat.checking = false

        // Проверяем встройки задач
        placementStatus.value.tasks.checking = true
        const [taskSidebarStatus, taskTabStatus] = await Promise.all([
          placementManager.checkStatus('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
          placementManager.checkStatus('TASK_VIEW_TAB', HANDLERS.taskTab)
        ])
        placementStatus.value.tasks.installed = taskSidebarStatus || taskTabStatus
        placementStatus.value.tasks.checking = false

        // Проверяем встройку карточки звонка
        placementStatus.value.callCard.checking = true
        const callCardStatus = await placementManager.checkStatus('CALL_CARD', HANDLERS.callCard)
        placementStatus.value.callCard.installed = callCardStatus
        placementStatus.value.callCard.checking = false

        // Проверяем пользовательский тип поля
        placementStatus.value.userField.checking = true
        const userFieldStatus = await userFieldManager.checkStatus()
        placementStatus.value.userField.installed = userFieldStatus
        placementStatus.value.userField.checking = false

        // Автоматически выбираем встройки, которые уже установлены
        if (placementStatus.value.chat.installed) selectedPlacements.value.chat = true
        if (placementStatus.value.tasks.installed) selectedPlacements.value.tasks = true
        if (placementStatus.value.callCard.installed) selectedPlacements.value.callCard = true
        if (placementStatus.value.userField.installed) selectedPlacements.value.userField = true

        // Определяем, нужно ли показывать предупреждение о переустановке
        // Только если есть выбранные встройки, которые уже установлены
        // И мы еще не завершили установку
        if (!installationComplete.value) {
          const hasInstalledSelected = (
              (selectedPlacements.value.chat && placementStatus.value.chat.installed) ||
              (selectedPlacements.value.tasks && placementStatus.value.tasks.installed) ||
              (selectedPlacements.value.callCard && placementStatus.value.callCard.installed) ||
              (selectedPlacements.value.userField && placementStatus.value.userField.installed)
          )

          showReinstallWarning.value = hasInstalledSelected
        } else {
          showReinstallWarning.value = false
        }

      } catch (error) {
        console.error('Ошибка при проверке статуса встроек:', error)
      }
    }

    // Удаление существующих встроек
    const uninstallPlacements = async () => {
      const uninstallPromises = []

      // Чат (если установлен и выбран для переустановки)
      if (placementStatus.value.chat.installed && selectedPlacements.value.chat) {
        uninstallPromises.push(
            placementManager.unbind('IM_TEXTAREA', HANDLERS.chatPanel).catch(e => console.error('Ошибка удаления chatPanel:', e)),
            placementManager.unbind('IM_SIDEBAR', HANDLERS.chatSidebar).catch(e => console.error('Ошибка удаления chatSidebar:', e))
        )
      }

      // Задачи (если установлены и выбраны для переустановки)
      if (placementStatus.value.tasks.installed && selectedPlacements.value.tasks) {
        uninstallPromises.push(
            placementManager.unbind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar).catch(e => console.error('Ошибка удаления taskSidebar:', e)),
            placementManager.unbind('TASK_VIEW_TAB', HANDLERS.taskTab).catch(e => console.error('Ошибка удаления taskTab:', e))
        )
      }

      // Карточка звонка (если установлена и выбрана для переустановки)
      if (placementStatus.value.callCard.installed && selectedPlacements.value.callCard) {
        uninstallPromises.push(
            placementManager.unbind('CALL_CARD', HANDLERS.callCard).catch(e => console.error('Ошибка удаления callCard:', e))
        )
      }

      // Пользовательский тип поля (если установлен и выбран для переустановки)
      if (placementStatus.value.userField.installed && selectedPlacements.value.userField) {
        uninstallPromises.push(
            userFieldManager.delete().catch(e => console.error('Ошибка удаления userField:', e))
        )
      }

      try {
        await Promise.all(uninstallPromises)
        console.log('Старые встройки удалены')
        return true
      } catch (error) {
        console.error('Ошибка при удалении старых встроек:', error)
        return false
      }
    }

    // Установка выбранных встроек
    const installPlacements = async () => {
      isInstalling.value = true
      installedCount.value = 0

      // Сбрасываем статусы перед установкой
      Object.keys(installationStatus.value).forEach(key => {
        installationStatus.value[key] = 'pending'
      })

      try {
        // Если нужно переустановить, сначала удаляем старые встройки
        if (showReinstallWarning.value) {
          toast.add({
            description: t('install.notifications.reinstalling'),
            variant: 'info'
          })

          await uninstallPlacements()

          // Сбрасываем статусы после удаления
          if (selectedPlacements.value.chat) placementStatus.value.chat.installed = false
          if (selectedPlacements.value.tasks) placementStatus.value.tasks.installed = false
          if (selectedPlacements.value.callCard) placementStatus.value.callCard.installed = false
          if (selectedPlacements.value.userField) placementStatus.value.userField.installed = false

          // Скрываем предупреждение после удаления
          showReinstallWarning.value = false
        }

        // Чат
        if (selectedPlacements.value.chat) {
          installationStatus.value.chat = 'loading'
          try {
            await Promise.all([
              placementManager.bind('IM_TEXTAREA', HANDLERS.chatPanel),
              placementManager.bind('IM_SIDEBAR', HANDLERS.chatSidebar)
            ])
            installationStatus.value.chat = 'success'
            installedCount.value++
            placementStatus.value.chat.installed = true
          } catch (error) {
            installationStatus.value.chat = 'error'
            console.error('Ошибка установки чат-встроек:', error)
          }
        }

        // Задачи
        if (selectedPlacements.value.tasks) {
          installationStatus.value.tasks = 'loading'
          try {
            await Promise.all([
              placementManager.bind('TASK_VIEW_SIDEBAR', HANDLERS.taskSidebar),
              placementManager.bind('TASK_VIEW_TAB', HANDLERS.taskTab)
            ])
            installationStatus.value.tasks = 'success'
            installedCount.value++
            placementStatus.value.tasks.installed = true
          } catch (error) {
            installationStatus.value.tasks = 'error'
            console.error('Ошибка установки встроек задач:', error)
          }
        }

        // Карточка звонка
        if (selectedPlacements.value.callCard) {
          installationStatus.value.callCard = 'loading'
          try {
            await placementManager.bind('CALL_CARD', HANDLERS.callCard)
            installationStatus.value.callCard = 'success'
            installedCount.value++
            placementStatus.value.callCard.installed = true
          } catch (error) {
            installationStatus.value.callCard = 'error'
            console.error('Ошибка установки встройки карточки звонка:', error)
          }
        }

        // Пользовательский тип поля
        if (selectedPlacements.value.userField) {
          installationStatus.value.userField = 'loading'
          try {
            await userFieldManager.add()
            installationStatus.value.userField = 'success'
            installedCount.value++
            placementStatus.value.userField.installed = true
          } catch (error) {
            installationStatus.value.userField = 'error'
            console.error('Ошибка установки типа поля:', error)
          }
        }

        isInstalling.value = false
        installationComplete.value = true

        // Сохраняем выбранные настройки
        saveSettings()

        toast.add({
          description: showReinstallWarning.value ? t('install.notifications.reinstallSuccess') : t('install.notifications.installSuccess'),
          variant: 'success'
        })
      } catch (error) {
        isInstalling.value = false
        toast.add({
          description: t('install.notifications.installError'),
          variant: 'error'
        })
        console.error('Ошибка установки:', error)
      }
    }

    // Сохранение настроек
    const saveSettings = () => {
      const settings = {
        chatCalculatorEnabled: selectedPlacements.value.chat,
        chatPanelEnabled: selectedPlacements.value.chat,
        chatSidebarEnabled: selectedPlacements.value.chat,
        taskCalculatorEnabled: selectedPlacements.value.tasks,
        taskSidebarEnabled: selectedPlacements.value.tasks,
        taskTabEnabled: selectedPlacements.value.tasks,
        callCardCalculatorEnabled: selectedPlacements.value.callCard,
        userFieldTypeEnabled: selectedPlacements.value.userField
      }

      localStorage.setItem('app_settings', JSON.stringify(settings))
    }

    // Функции для слайдеров
    const startAutoplay = () => {
      if (currentStep.value === 2) {
        // Запускаем автопрокрутку только для слайдеров с несколькими изображениями
        if (chatImages.value.length > 1) startChatAutoplay()
        if (taskImages.value.length > 1) startTaskAutoplay()
        if (callCardImages.value.length > 1) startCallCardAutoplay()
        if (userFieldImages.value.length > 1) startUserFieldAutoplay()
      }
    }

    const stopAutoplay = () => {
      // Останавливаем все интервалы
      stopChatAutoplay()
      stopTaskAutoplay()
      stopCallCardAutoplay()
      stopUserFieldAutoplay()
    }

    // Функции для слайдера чата
    const startChatAutoplay = () => {
      stopChatAutoplay()
      autoplayIntervals.value.chat = setInterval(() => {
        nextChatSlide()
      }, 4000)
    }

    const stopChatAutoplay = () => {
      if (autoplayIntervals.value.chat) {
        clearInterval(autoplayIntervals.value.chat)
        autoplayIntervals.value.chat = null
      }
    }

    const nextChatSlide = () => {
      currentChatSlide.value = currentChatSlide.value < chatImages.value.length - 1
          ? currentChatSlide.value + 1
          : 0
    }

    const prevChatSlide = () => {
      currentChatSlide.value = currentChatSlide.value > 0
          ? currentChatSlide.value - 1
          : chatImages.value.length - 1
    }

    const goToChatSlide = (index) => {
      if (index >= 0 && index < chatImages.value.length) {
        currentChatSlide.value = index
      }
    }

    // Функции для слайдера задач
    const startTaskAutoplay = () => {
      stopTaskAutoplay()
      autoplayIntervals.value.task = setInterval(() => {
        nextTaskSlide()
      }, 4200)
    }

    const stopTaskAutoplay = () => {
      if (autoplayIntervals.value.task) {
        clearInterval(autoplayIntervals.value.task)
        autoplayIntervals.value.task = null
      }
    }

    const nextTaskSlide = () => {
      currentTaskSlide.value = currentTaskSlide.value < taskImages.value.length - 1
          ? currentTaskSlide.value + 1
          : 0
    }

    const prevTaskSlide = () => {
      currentTaskSlide.value = currentTaskSlide.value > 0
          ? currentTaskSlide.value - 1
          : taskImages.value.length - 1
    }

    const goToTaskSlide = (index) => {
      if (index >= 0 && index < taskImages.value.length) {
        currentTaskSlide.value = index
      }
    }

    // Функции для слайдера карточки звонка
    const startCallCardAutoplay = () => {
      stopCallCardAutoplay()
      autoplayIntervals.value.callCard = setInterval(() => {
        nextCallCardSlide()
      }, 4400)
    }

    const stopCallCardAutoplay = () => {
      if (autoplayIntervals.value.callCard) {
        clearInterval(autoplayIntervals.value.callCard)
        autoplayIntervals.value.callCard = null
      }
    }

    const nextCallCardSlide = () => {
      currentCallCardSlide.value = currentCallCardSlide.value < callCardImages.value.length - 1
          ? currentCallCardSlide.value + 1
          : 0
    }

    const prevCallCardSlide = () => {
      currentCallCardSlide.value = currentCallCardSlide.value > 0
          ? currentCallCardSlide.value - 1
          : callCardImages.value.length - 1
    }

    const goToCallCardSlide = (index) => {
      if (index >= 0 && index < callCardImages.value.length) {
        currentCallCardSlide.value = index
      }
    }

    // Функции для слайдера пользовательского поля
    const startUserFieldAutoplay = () => {
      stopUserFieldAutoplay()
      autoplayIntervals.value.userField = setInterval(() => {
        nextUserFieldSlide()
      }, 4600)
    }

    const stopUserFieldAutoplay = () => {
      if (autoplayIntervals.value.userField) {
        clearInterval(autoplayIntervals.value.userField)
        autoplayIntervals.value.userField = null
      }
    }

    const nextUserFieldSlide = () => {
      currentUserFieldSlide.value = currentUserFieldSlide.value < userFieldImages.value.length - 1
          ? currentUserFieldSlide.value + 1
          : 0
    }

    const prevUserFieldSlide = () => {
      currentUserFieldSlide.value = currentUserFieldSlide.value > 0
          ? currentUserFieldSlide.value - 1
          : userFieldImages.value.length - 1
    }

    const goToUserFieldSlide = (index) => {
      if (index >= 0 && index < userFieldImages.value.length) {
        currentUserFieldSlide.value = index
      }
    }

    // Функции для получения описаний для слайдеров
    const getChatImageDescription = (index) => {
      const descriptions = [
        t('install.placements.chat.image1Description'),
        t('install.placements.chat.image2Description')
      ]
      return descriptions[index] || t('install.placements.imagePlaceholder')
    }

    const getTaskImageDescription = (index) => {
      const descriptions = [
        t('install.placements.tasks.image1Description')
      ]
      return descriptions[index] || t('install.placements.imagePlaceholder')
    }

    const getCallCardImageDescription = (index) => {
      const descriptions = [
        t('install.placements.callCard.image1Description')
      ]
      return descriptions[index] || t('install.placements.imagePlaceholder')
    }

    const getUserFieldImageDescription = (index) => {
      const descriptions = [
        t('install.placements.userField.image1Description')
      ]
      return descriptions[index] || t('install.placements.imagePlaceholder')
    }

    // Функции для получения иконок на 3 шаге
    const getPlacementIcon = (placementId) => {
      switch (placementId) {
        case 'chat':
          return markRaw(ChatIcon)
        case 'tasks':
          return markRaw(TaskIcon)
        case 'callCard':
          return markRaw(PhoneIcon)
        case 'userField':
          return markRaw(FieldIcon)
        default:
          return markRaw(ChatIcon)
      }
    }

    const getPlacementIconClass = (placementId) => {
      switch (placementId) {
        case 'chat':
          return 'bg-blue-500'
        case 'tasks':
          return 'bg-green-500'
        case 'callCard':
          return 'bg-purple-500'
        case 'userField':
          return 'bg-orange-500'
        default:
          return 'bg-blue-500'
      }
    }

    // Вычисляемые свойства
    const hasSelectedPlacements = computed(() => {
      return Object.values(selectedPlacements.value).some(value => value === true)
    })

    const selectedPlacementsCount = computed(() => {
      return Object.values(selectedPlacements.value).filter(value => value === true).length
    })

    const installationsToProcess = computed(() => {
      let count = 0
      if (selectedPlacements.value.chat) count++
      if (selectedPlacements.value.tasks) count++
      if (selectedPlacements.value.callCard) count++
      if (selectedPlacements.value.userField) count++
      return count
    })

    const installationProgress = computed(() => {
      if (installationsToProcess.value === 0) return 0
      return Math.round((installedCount.value / installationsToProcess.value) * 100)
    })

    const features = computed(() => [
      {id: 1, text: t('install.features.feature1')},
      {id: 2, text: t('install.features.feature2')},
      {id: 3, text: t('install.features.feature3')},
      {id: 4, text: t('install.features.feature4')}
    ])

    const selectedPlacementsList = computed(() => {
      const list = []

      if (selectedPlacements.value.chat) {
        list.push({
          id: 'chat',
          title: t('install.placements.chat.title'),
          description: t('install.placements.chat.description'),
          color: 'bg-blue-500',
          icon: markRaw(ChatIcon)
        })
      }

      if (selectedPlacements.value.tasks) {
        list.push({
          id: 'tasks',
          title: t('install.placements.tasks.title'),
          description: t('install.placements.tasks.description'),
          color: 'bg-green-500',
          icon: markRaw(TaskIcon)
        })
      }

      if (selectedPlacements.value.callCard) {
        list.push({
          id: 'callCard',
          title: t('install.placements.callCard.title'),
          description: t('install.placements.callCard.description'),
          color: 'bg-purple-500',
          icon: markRaw(PhoneIcon)
        })
      }

      if (selectedPlacements.value.userField) {
        list.push({
          id: 'userField',
          title: t('install.placements.userField.title'),
          description: t('install.placements.userField.description'),
          color: 'bg-orange-500',
          icon: markRaw(FieldIcon)
        })
      }

      return list
    })

    // Методы
    const nextStep = () => {
      if (currentStep.value < totalSteps) {
        // Если переходим на шаг 3, проверяем статус встроек
        if (currentStep.value === 2 || currentStep.value === 1) {
          checkPlacementsStatus()
        }

        currentStep.value++

        // При переходе на 3 шаг останавливаем автопрокрутку
        if (currentStep.value === 3) {
          stopAutoplay()
        }
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
        // При возврате на 2 шаг запускаем автопрокрутку
        if (currentStep.value === 2) {
          startAutoplay()
        }
      }
    }

    const startInstallation = async () => {
      await installPlacements()
    }

    const finishInstallation = async () => {
      try {
        await bitrixAPI.installFinish()
      } catch (error) {
        console.error('Ошибка завершения установки:', error)
        toast.add({
          description: t('install.notifications.finishError'),
          variant: 'error'
        })
      }
    }

    const openSettings = () => {
      window.location.href = '/app'
    }

    const closeApp = () => {
      if (typeof BX24 !== 'undefined' && typeof BX24.closeApplication === 'function') {
        BX24.closeApplication()
      } else {
        window.location.href = '/'
      }
    }

    // Инициализация
    onMounted(async () => {
      // Инициализируем статусы установки
      selectedPlacementsList.value.forEach(placement => {
        installationStatus.value[placement.id] = 'pending'
      })

      // Запускаем автопрокрутку при загрузке, если на 2 шаге
      if (currentStep.value === 2) {
        startAutoplay()
      }
    })

    onUnmounted(() => {
      stopAutoplay()
    })

    return {
      // Состояние
      currentStep,
      totalSteps,
      progress,
      selectedPlacements,
      isInstalling,
      installationComplete,
      installationStatus,
      installedCount,
      placementStatus,
      showReinstallWarning,
      reviewLink,

      // Слайдеры
      chatImages,
      taskImages,
      callCardImages,
      userFieldImages,
      currentChatSlide,
      currentTaskSlide,
      currentCallCardSlide,
      currentUserFieldSlide,

      // Вычисляемые свойства
      hasSelectedPlacements,
      selectedPlacementsCount,
      installationsToProcess,
      installationProgress,
      features,
      selectedPlacementsList,

      // Методы для слайдеров
      startAutoplay,
      stopAutoplay,
      nextChatSlide,
      prevChatSlide,
      goToChatSlide,
      nextTaskSlide,
      prevTaskSlide,
      goToTaskSlide,
      nextCallCardSlide,
      prevCallCardSlide,
      goToCallCardSlide,
      nextUserFieldSlide,
      prevUserFieldSlide,
      goToUserFieldSlide,

      // Функции для изображений
      getChatImageDescription,
      getTaskImageDescription,
      getCallCardImageDescription,
      getUserFieldImageDescription,

      // Методы
      nextStep,
      prevStep,
      startInstallation,
      finishInstallation,
      openSettings,
      closeApp,

      // Функции для 3 шага
      getPlacementIcon,
      getPlacementIconClass
    }
  }
}
</script>

<style scoped>
/* Улучшение видимости радиобаттонов */
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

/* Стили для отключенного свитчера */
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

/* Анимация перехода слайдов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

/* Стили для кнопок навигации слайдера */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button:not(:disabled):hover {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

/* Улучшенный внешний вид слайдеров */
.bg-gray-100 {
  background-color: #f7fafc;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.overflow-hidden {
  overflow: hidden;
}

/* Стили для плашки "Уже установлено" */
.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-800 {
  color: #065f46;
}

/* Стили для предупреждения о переустановке */
.bg-yellow-50 {
  background-color: #fffbeb;
}

.border-yellow-400 {
  border-color: #fbbf24;
}

.text-yellow-700 {
  color: #92400e;
}
</style>