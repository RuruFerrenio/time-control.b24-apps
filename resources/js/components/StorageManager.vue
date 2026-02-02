<template>
  <B24Card>
    <div class="p-6">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ description }}
            </p>
          </div>
        </div>

        <!-- Информация о хранилище -->
        <div class="space-y-4 pt-4 border-t">
          <h4 class="text-sm font-medium text-gray-900 mb-4">
            Управление хранилищем данных
          </h4>

          <!-- Информация о хранилище -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-xs text-gray-600">Название хранилища</div>
                <div class="text-sm font-medium text-gray-900">{{ storageName }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Количество записей</div>
                <div class="text-sm font-medium text-gray-900">{{ storageStatus.totalItems || 0 }}</div>
              </div>
            </div>

            <!-- Статус хранилища -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="text-sm font-medium text-gray-900">Статус хранилища</div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ entityId === 'pr_tracking' ? 'Хранит данные о посещениях страниц сотрудниками' : 'Хранит данные об отсутствиях сотрудников' }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :class="storageStatus.initialized ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-xs" :class="storageStatus.initialized ? 'text-green-600' : 'text-red-600'">
                  {{ storageStatus.initialized ? 'Активно' : 'Не инициализировано' }}
                </span>
              </div>
            </div>

            <!-- Информация об очистке -->
            <div class="mb-4">
              <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-blue-700">
                  <span class="font-medium">Важно:</span> Очистка хранилища полностью удалит все существующие данные и создаст новое чистое хранилище.
                  Это действие нельзя отменить.
                </div>
              </div>
            </div>

            <!-- Кнопка очистки -->
            <div class="flex space-x-2">
              <button
                  @click="clearStorage"
                  :disabled="isProcessing"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isProcessing ? 'Очистка...' : 'Очистить хранилище' }}
              </button>
            </div>
          </div>

          <!-- Как работает система очистки -->
          <div class="space-y-4 mt-6">
            <h4 class="text-sm font-medium text-gray-900">
              Как работает очистка хранилища
            </h4>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p class="text-sm text-gray-700">
                    Полное удаление существующего хранилища со всеми данными
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p class="text-sm text-gray-700">
                    Создание нового чистого хранилища с исходными настройками
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p class="text-sm text-gray-700">
                    Настройка всех необходимых свойств для корректной работы системы
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </B24Card>
</template>

<script>
import { ref, onMounted } from 'vue'

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
    }
  },
  setup(props) {
    const storageStatus = ref({
      initialized: false,
      totalItems: 0
    })

    const isProcessing = ref(false)

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

    // Получение количества записей
    const getTotalItemsCount = (callback) => {
      if (!BX24) {
        callback(0)
        return
      }

      BX24.callMethod('entity.section.get', {
        ENTITY: props.entityId
      }, (result) => {
        if (result.error()) {
          console.error('Ошибка при получении разделов:', result.error())
          callback(0)
          return
        }

        const sections = result.data()
        let totalItems = 0
        let processedSections = 0

        if (sections.length === 0) {
          callback(0)
          return
        }

        sections.forEach((section, index) => {
          BX24.callMethod('entity.item.get', {
            ENTITY: props.entityId,
            FILTER: { SECTION_ID: section.ID }
          }, (itemsResult) => {
            if (!itemsResult.error()) {
              totalItems += itemsResult.data().length
            }

            processedSections++
            if (processedSections === sections.length) {
              callback(totalItems)
            }
          })
        })
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

    // Очистка хранилища
    const clearStorage = () => {
      if (!confirm(`Вы уверены, что хотите полностью очистить хранилище "${props.storageName}"? Все данные будут безвозвратно удалены.`)) {
        return
      }

      try {
        isProcessing.value = true

        if (!BX24) {
          isProcessing.value = false
          return
        }

        // Проверяем существование хранилища
        checkStorageExists((exists) => {
          if (exists) {
            // Удаляем существующее хранилище
            BX24.callMethod('entity.delete', {
              ENTITY: props.entityId
            }, (deleteResult) => {
              if (deleteResult.error()) {
                console.error('Ошибка при удалении хранилища:', deleteResult.error())
                // Продолжаем создание нового даже при ошибке удаления
              }

              // Создаем новое хранилище
              createNewStorage()
            })
          } else {
            // Создаем новое хранилище
            createNewStorage()
          }
        })

      } catch (error) {
        console.error('Ошибка при очистке хранилища:', error)
        isProcessing.value = false
      }
    }

    // Создание нового хранилища
    const createNewStorage = () => {
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
          alert('Ошибка при создании хранилища. Пожалуйста, попробуйте еще раз.')
        } else {
          console.log('Хранилище успешно создано')

          // Создаем свойства
          createStorageProperties((success) => {
            // Обновляем статус хранилища
            storageStatus.value.initialized = true
            storageStatus.value.totalItems = 0

            // Показываем уведомление об успехе
            alert('Хранилище успешно очищено и создано заново!')

            isProcessing.value = false
          })
        }
      })
    }

    // Инициализация при монтировании
    const init = () => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(() => {
          checkStorageExists((exists) => {
            if (exists) {
              storageStatus.value.initialized = true
              getTotalItemsCount((count) => {
                storageStatus.value.totalItems = count
              })
            }
          })
        })
      }
    }

    onMounted(() => {
      init()
    })

    return {
      storageStatus,
      isProcessing,
      clearStorage
    }
  }
}
</script>