<template>
  <B24Card>
    <div class="p-6">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ description }}
            </p>
          </div>
        </div>

        <!-- Информация о хранилище -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="mb-4">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Текущее хранилище</h5>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <div class="text-xs text-gray-600">Идентификатор</div>
                <div class="text-sm font-medium text-gray-900">{{ storageStatus.entityId }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Название</div>
                <div class="text-sm font-medium text-gray-900">{{ storageStatus.name }}</div>
              </div>
            </div>
          </div>

          <!-- Статус хранилища -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h5 class="text-sm font-medium text-gray-900">Статус хранилища</h5>
              <p class="text-xs text-gray-500 mt-1">
                {{ storageStatus.entityId === 'pr_tracking' ? 'Хранит данные о посещениях страниц сотрудниками' : 'Хранит данные об отсутствиях сотрудников' }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full" :class="storageStatus.initialized ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="text-xs" :class="storageStatus.initialized ? 'text-green-600' : 'text-red-600'">
                {{ storageStatus.initialized ? 'Активно' : 'Не инициализировано' }}
              </span>
            </div>
          </div>

          <!-- Информация о хранилище -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div class="text-xs text-gray-600">Дата создания</div>
              <div class="text-sm font-medium text-gray-900">{{ storageStatus.createdDate || 'Не создано' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-600">Количество записей</div>
              <div class="text-sm font-medium text-gray-900">{{ storageStatus.totalItems || 0 }}</div>
            </div>
          </div>

          <!-- Свойства хранилища -->
          <div class="mb-4">
            <h6 class="text-xs font-medium text-gray-900 mb-2">Свойства хранилища:</h6>
            <div class="space-y-1">
              <div v-for="prop in properties" :key="prop.PROPERTY" class="flex items-center justify-between text-xs">
                <span class="text-gray-600">{{ prop.NAME }}</span>
                <span class="text-gray-500 font-mono">{{ prop.PROPERTY }} ({{ prop.TYPE }})</span>
              </div>
            </div>
          </div>

          <!-- Кнопки управления -->
          <div class="flex space-x-2">
            <button
                @click="initializeStorage"
                :disabled="isProcessing || storageStatus.initialized"
                class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ storageStatus.initialized ? 'Хранилище создано' : 'Инициализировать хранилище' }}
            </button>
            <button
                @click="showStorageInfo"
                :disabled="isProcessing || !storageStatus.initialized"
                class="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Показать данные
            </button>
            <button
                @click="confirmDeleteStorage"
                :disabled="isProcessing"
                class="px-3 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Удалить
            </button>
          </div>

          <!-- Сводка по дням -->
          <div v-if="storageSummary.length > 0" class="mt-4">
            <h6 class="text-xs font-medium text-gray-900 mb-2">Статистика по дням:</h6>
            <div class="space-y-2">
              <div v-for="day in storageSummary" :key="day.date" class="flex items-center justify-between text-xs">
                <span class="text-gray-600">{{ day.date }}</span>
                <div class="flex items-center space-x-4">
                  <span class="text-gray-500">{{ day.count }} записей</span>
                  <button
                      @click="deleteDaySection(day.date)"
                      class="text-red-500 hover:text-red-700"
                      title="Удалить записи за этот день"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </B24Card>

  <!-- Модальное окно с данными хранилища -->
  <div v-if="showStorageModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Данные хранилища: {{ title }}</h3>
          <button
              @click="showStorageModal = false"
              class="text-gray-400 hover:text-gray-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Фильтры и поиск -->
        <div class="mb-6">
          <div class="flex space-x-4">
            <div class="flex-1">
              <input
                  type="text"
                  v-model="storageFilter.search"
                  :placeholder="`Поиск по пользователю ${storageStatus.entityId === 'pr_tracking' ? 'или URL' : ''}...`"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                  type="date"
                  v-model="storageFilter.date"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Таблица данных -->
        <div class="overflow-y-auto max-h-[60vh]">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
              <th v-if="storageStatus.entityId === 'pr_tracking'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время на странице</th>
              <th v-else class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время отсутствия</th>
              <th v-if="storageStatus.entityId === 'pr_tracking'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
              <th v-if="storageStatus.entityId === 'pr_tracking'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Страница</th>
              <th v-if="storageStatus.entityId === 'pr_tracking' && showTitleField" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Комментарий</th>
              <th v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Причина</th>
              <th v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Создано</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обновлено</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredStorageItems" :key="item.ID">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.DATE }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span class="text-xs font-medium text-blue-600">{{ getUserInitials(item.USER_NAME) }}</span>
                  </div>
                  <div>
                    <a
                        :href="`/company/personal/user/${item.USER_ID}/`"
                        target="_blank"
                        class="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {{ item.USER_NAME }}
                    </a>
                    <div class="text-xs text-gray-500">ID: {{ item.USER_ID }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDuration(storageStatus.entityId === 'pr_tracking' ? item.PAGE_TIME : item.ABSENCE_TIME) }}
              </td>
              <td v-if="storageStatus.entityId === 'pr_tracking'" class="px-6 py-4 whitespace-nowrap">
                <span
                    v-if="item.PAGE_CATEGORY"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getCategoryBadgeClass(item.PAGE_CATEGORY)"
                >
                  {{ item.PAGE_CATEGORY }}
                </span>
                <span v-else class="text-xs text-gray-500">—</span>
              </td>
              <td v-if="storageStatus.entityId === 'pr_tracking'" class="px-6 py-4">
                <a v-if="item.PAGE_URL" :href="item.PAGE_URL" target="_blank" class="text-blue-600 hover:text-blue-900 truncate block">
                  {{ item.PAGE_TITLE || item.PAGE_URL }}
                </a>
                <span v-else class="text-xs text-gray-500">—</span>
              </td>
              <td v-if="storageStatus.entityId === 'pr_tracking' && showTitleField" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.PAGE_TITLE || '—' }}
              </td>
              <td v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-4">
                <span class="text-sm text-gray-900">{{ item.USER_COMMENT || '—' }}</span>
              </td>
              <td v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.REASON || '—' }}
              </td>
              <td v-if="storageStatus.entityId === 'pr_absence'" class="px-6 py-4 whitespace-nowrap">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getAbsenceStatusClass(item.STATUS)"
                >
                  {{ item.STATUS || 'Не указан' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateTime(item.CREATED_AT) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateTime(item.UPDATED_AT) }}</td>
            </tr>
            </tbody>
          </table>

          <div v-if="filteredStorageItems.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p>Записей не найдено</p>
          </div>
        </div>

        <!-- Пагинация -->
        <div v-if="storageItems.length > 0" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Показано <span class="font-medium">{{ filteredStorageItems.length }}</span> из <span class="font-medium">{{ storageItems.length }}</span> записей
          </div>
          <div class="flex space-x-2">
            <button
                @click="exportStorageData"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Экспорт в CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import categoriesData from './categories.json'

export default {
  name: 'StorageManager',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
    storageName: {
      type: String,
      required: true
    },
    properties: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      default: () => []
    },
    showTitleField: {
      type: Boolean,
      default: false
    },
    showCategories: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const storageStatus = ref({
      initialized: false,
      createdDate: null,
      totalItems: 0,
      entityId: props.entityId,
      name: props.storageName
    })

    const storageSummary = ref([])
    const storageItems = ref([])
    const showStorageModal = ref(false)
    const storageFilter = ref({
      search: '',
      date: ''
    })
    const isProcessing = ref(false)

    // Отфильтрованные элементы хранилища
    const filteredStorageItems = computed(() => {
      return storageItems.value.filter(item => {
        const matchesSearch = !storageFilter.value.search ||
            (item.USER_NAME && item.USER_NAME.toLowerCase().includes(storageFilter.value.search.toLowerCase())) ||
            (props.entityId === 'pr_tracking' && item.PAGE_URL && item.PAGE_URL.toLowerCase().includes(storageFilter.value.search.toLowerCase())) ||
            (props.entityId === 'pr_tracking' && item.PAGE_TITLE && item.PAGE_TITLE.toLowerCase().includes(storageFilter.value.search.toLowerCase())) ||
            (props.entityId === 'pr_absence' && item.USER_COMMENT && item.USER_COMMENT.toLowerCase().includes(storageFilter.value.search.toLowerCase()))

        const matchesDate = !storageFilter.value.date ||
            item.DATE === storageFilter.value.date

        return matchesSearch && matchesDate
      })
    })

    // Получение инициалов пользователя
    const getUserInitials = (name) => {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    // Форматирование длительности
    const formatDuration = (seconds) => {
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

    // Форматирование даты и времени
    const formatDateTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleString('ru-RU')
    }

    // Получение класса для бейджа категории
    const getCategoryBadgeClass = (category) => {
      if (!category) return 'bg-gray-100 text-gray-800'

      // Извлекаем основную категорию (до символа ›)
      const mainCategory = category.split(' › ')[0]

      // Находим категорию в данных
      const categoryData = categoriesData.categories.find(cat => cat.name === mainCategory)
      if (categoryData) {
        return categoryData.color
      }

      return 'bg-gray-100 text-gray-800'
    }

    // Получение класса для статуса отсутствия
    const getAbsenceStatusClass = (status) => {
      const statusMap = {
        'approved': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'rejected': 'bg-red-100 text-red-800',
        'Утверждено': 'bg-green-100 text-green-800',
        'На рассмотрении': 'bg-yellow-100 text-yellow-800',
        'Отклонено': 'bg-red-100 text-red-800'
      }
      return statusMap[status] || 'bg-gray-100 text-gray-800'
    }

    // Проверка существования хранилища
    const checkStorageExists = (callback) => {
      if (!BX24) {
        callback(false)
        return
      }

      BX24.callMethod('entity.get', {}, (result) => {
        if (result.error()) {
          console.error('Ошибка при проверке хранилищ:', result.error())
          callback(false)
        } else {
          const entities = result.data()
          const exists = entities.some(entity => entity.ENTITY === props.entityId)
          callback(exists)
        }
      })
    }

    // Создание свойств хранилища
    const createStorageProperties = (callback) => {
      let createdCount = 0
      const totalProperties = props.properties.length

      const createNextProperty = (index) => {
        if (index >= totalProperties) {
          callback(true)
          return
        }

        const prop = props.properties[index]
        BX24.callMethod('entity.item.property.add', {
          ENTITY: props.entityId,
          PROPERTY: prop.PROPERTY,
          NAME: prop.NAME,
          TYPE: prop.TYPE
        }, (result) => {
          if (result.error()) {
            console.log(`Свойство ${prop.PROPERTY} уже существует или ошибка:`, result.error())
          } else {
            console.log(`Свойство ${prop.PROPERTY} создано`)
            createdCount++
          }
          createNextProperty(index + 1)
        })
      }

      createNextProperty(0)
    }

    // Инициализация хранилища
    const initializeStorage = () => {
      try {
        isProcessing.value = true

        if (!BX24) {
          isProcessing.value = false
          return
        }

        // Проверяем существование хранилища
        checkStorageExists((exists) => {
          if (!exists) {
            // Создаем новое хранилище
            BX24.callMethod('entity.add', {
              ENTITY: props.entityId,
              NAME: props.storageName,
              ACCESS: {
                AU: 'W'
              }
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при создании хранилища:', result.error())
                isProcessing.value = false
              } else {
                console.log('Хранилище успешно создано')

                // Создаем свойства
                createStorageProperties((success) => {
                  // Обновляем статус хранилища
                  storageStatus.value.initialized = true
                  storageStatus.value.createdDate = new Date().toLocaleDateString('ru-RU')

                  // Загружаем сводку
                  loadStorageSummary(() => {
                    isProcessing.value = false
                  })
                })
              }
            })
          } else {
            // Обновляем статус хранилища
            storageStatus.value.initialized = true

            // Загружаем сводку
            loadStorageSummary(() => {
              isProcessing.value = false
            })
          }
        })

      } catch (error) {
        console.error('Ошибка при инициализации хранилища:', error)
        isProcessing.value = false
      }
    }

    // Загрузка сводки хранилища
    const loadStorageSummary = (callback) => {
      if (!BX24 || !storageStatus.value.initialized) {
        if (callback) callback()
        return
      }

      // Проверяем существование хранилища
      checkStorageExists((exists) => {
        if (!exists) {
          storageStatus.value.initialized = false
          if (callback) callback()
          return
        }

        // Получаем все разделы
        BX24.callMethod('entity.section.get', {
          ENTITY: props.entityId
        }, (result) => {
          if (result.error()) {
            console.error('Ошибка при получении разделов:', result.error())
            if (callback) callback()
            return
          }

          const sections = result.data()
          storageSummary.value = sections.map(section => ({
            id: section.ID,
            date: section.NAME,
            count: 0
          })).sort((a, b) => b.date.localeCompare(a.date))

          // Подсчитываем общее количество элементов
          let totalItems = 0
          let processedSections = 0

          if (sections.length === 0) {
            storageStatus.value.totalItems = 0
            if (callback) callback()
            return
          }

          sections.forEach((section, index) => {
            BX24.callMethod('entity.item.get', {
              ENTITY: props.entityId,
              FILTER: { SECTION_ID: section.ID }
            }, (itemsResult) => {
              if (!itemsResult.error()) {
                const count = itemsResult.data().length
                storageSummary.value[index].count = count
                totalItems += count
              }

              processedSections++
              if (processedSections === sections.length) {
                storageStatus.value.totalItems = totalItems
                if (callback) callback()
              }
            })
          })
        })
      })
    }

    // Показать информацию о хранилище
    const showStorageInfo = () => {
      try {
        isProcessing.value = true
        showStorageModal.value = true

        // Проверяем существование хранилища
        checkStorageExists((exists) => {
          if (!exists) {
            isProcessing.value = false
            return
          }

          // Загружаем все элементы хранилища
          const allItems = []
          let sectionsProcessed = 0

          if (storageSummary.value.length === 0) {
            storageItems.value = []
            isProcessing.value = false
            return
          }

          storageSummary.value.forEach((section, index) => {
            BX24.callMethod('entity.item.get', {
              ENTITY: props.entityId,
              FILTER: { SECTION_ID: section.id },
              SELECT: ['ID', 'DATE_CREATE', 'TIMESTAMP_X', 'PROPERTY_VALUES', 'NAME']
            }, (result) => {
              if (!result.error()) {
                result.data().forEach(item => {
                  const props = item.PROPERTY_VALUES || {}
                  const itemData = {
                    ID: item.ID,
                    DATE: section.date,
                    USER_ID: props.USER_ID || '',
                    USER_NAME: props.USER_NAME || '',
                    CREATED_AT: item.DATE_CREATE || '',
                    UPDATED_AT: item.TIMESTAMP_X || ''
                  }

                  if (props.entityId === 'pr_tracking') {
                    itemData.PAGE_TIME = parseInt(props.PAGE_TIME) || 0
                    itemData.PAGE_URL = props.PAGE_URL || ''
                    itemData.PAGE_CATEGORY = props.PAGE_CATEGORY || null
                    itemData.PAGE_TITLE = props.PAGE_TITLE || item.NAME || ''
                  } else if (props.entityId === 'pr_absence') {
                    itemData.ABSENCE_TIME = parseInt(props.ABSENCE_TIME) || 0
                    itemData.USER_COMMENT = props.USER_COMMENT || ''
                    itemData.REASON = props.REASON || ''
                    itemData.STATUS = props.STATUS || ''
                  }

                  allItems.push(itemData)
                })
              }

              sectionsProcessed++
              if (sectionsProcessed === storageSummary.value.length) {
                storageItems.value = allItems.sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT))
                isProcessing.value = false
              }
            })
          })
        })

      } catch (error) {
        console.error('Ошибка при загрузке данных хранилища:', error)
        isProcessing.value = false
      }
    }

    // Подтверждение удаления хранилища
    const confirmDeleteStorage = () => {
      if (confirm(`Вы уверены, что хотите полностью удалить хранилище "${props.storageName}"? Это действие нельзя отменить.`)) {
        deleteStorage()
      }
    }

    // Удаление хранилища
    const deleteStorage = () => {
      try {
        isProcessing.value = true

        if (!BX24) {
          isProcessing.value = false
          return
        }

        // Проверяем существование хранилища
        checkStorageExists((exists) => {
          if (!exists) {
            isProcessing.value = false
            return
          }

          // Удаляем хранилище
          BX24.callMethod('entity.delete', {
            ENTITY: props.entityId
          }, (result) => {
            if (result.error()) {
              console.error('Ошибка при удалении хранилища:', result.error())
            } else {
              storageStatus.value.initialized = false
              storageStatus.value.totalItems = 0
              storageSummary.value = []
              storageItems.value = []
            }
            isProcessing.value = false
          })
        })

      } catch (error) {
        console.error('Ошибка при удалении хранилища:', error)
        isProcessing.value = false
      }
    }

    // Удаление раздела за определенный день
    const deleteDaySection = (date) => {
      if (!confirm(`Удалить все записи за ${date}?`)) {
        return
      }

      try {
        isProcessing.value = true

        const section = storageSummary.value.find(s => s.date === date)
        if (!section) {
          isProcessing.value = false
          return
        }

        // Получаем все элементы раздела
        BX24.callMethod('entity.item.get', {
          ENTITY: props.entityId,
          FILTER: { SECTION_ID: section.id }
        }, (itemsResult) => {
          if (itemsResult.error()) {
            isProcessing.value = false
            return
          }

          const items = itemsResult.data()
          let itemsProcessed = 0

          if (items.length === 0) {
            deleteSection()
            return
          }

          items.forEach((item) => {
            BX24.callMethod('entity.item.delete', {
              ENTITY: props.entityId,
              ID: item.ID
            }, (deleteResult) => {
              if (deleteResult.error()) {
                console.error('Ошибка при удалении элемента:', deleteResult.error())
              }

              itemsProcessed++
              if (itemsProcessed === items.length) {
                deleteSection()
              }
            })
          })
        })

        const deleteSection = () => {
          BX24.callMethod('entity.section.delete', {
            ENTITY: props.entityId,
            ID: section.id
          }, (deleteResult) => {
            if (deleteResult.error()) {
              console.error('Ошибка при удалении раздела:', deleteResult.error())
            } else {
              loadStorageSummary()
            }
            isProcessing.value = false
          })
        }

      } catch (error) {
        console.error('Ошибка при удалении раздела:', error)
        isProcessing.value = false
      }
    }

    // Экспорт данных в CSV
    const exportStorageData = () => {
      if (filteredStorageItems.value.length === 0) {
        return
      }

      const headers = props.entityId === 'pr_tracking'
          ? ['Дата', 'ID пользователя', 'Имя пользователя', 'Время на странице (сек)', 'Категория', 'URL страницы', 'Название страницы', 'Создано', 'Обновлено']
          : ['Дата', 'ID пользователя', 'Имя пользователя', 'Время отсутствия (сек)', 'Комментарий', 'Причина', 'Статус', 'Создано', 'Обновлено']

      const csvData = [
        headers.join(','),
        ...filteredStorageItems.value.map(item => {
          if (props.entityId === 'pr_tracking') {
            return [
              `"${item.DATE}"`,
              item.USER_ID,
              `"${item.USER_NAME}"`,
              item.PAGE_TIME,
              `"${item.PAGE_CATEGORY || ''}"`,
              `"${item.PAGE_URL}"`,
              `"${item.PAGE_TITLE || ''}"`,
              `"${item.CREATED_AT}"`,
              `"${item.UPDATED_AT}"`
            ].join(',')
          } else {
            return [
              `"${item.DATE}"`,
              item.USER_ID,
              `"${item.USER_NAME}"`,
              item.ABSENCE_TIME,
              `"${item.USER_COMMENT || ''}"`,
              `"${item.REASON || ''}"`,
              `"${item.STATUS || ''}"`,
              `"${item.CREATED_AT}"`,
              `"${item.UPDATED_AT}"`
            ].join(',')
          }
        })
      ].join('\n')

      const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `${props.entityId}_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // Инициализация при монтировании
    const init = () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(() => {
          checkStorageExists((exists) => {
            if (exists) {
              storageStatus.value.initialized = true
              loadStorageSummary()
            }
          })
        })
      }
    }

    // Следим за изменениями фильтров
    watch(storageFilter, () => {
      // Фильтры обновляются автоматически через computed свойство filteredStorageItems
    }, { deep: true })

    init()

    return {
      storageStatus,
      storageSummary,
      storageItems,
      showStorageModal,
      storageFilter,
      filteredStorageItems,
      isProcessing,
      getUserInitials,
      formatDuration,
      formatDateTime,
      getCategoryBadgeClass,
      getAbsenceStatusClass,
      initializeStorage,
      showStorageInfo,
      confirmDeleteStorage,
      deleteDaySection,
      exportStorageData
    }
  }
}
</script>