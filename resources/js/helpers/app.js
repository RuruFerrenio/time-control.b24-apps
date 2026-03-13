// helpers/app.js

import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

const toast = useToast()

/**
 * Класс для работы с Bitrix24 API и проверкой прав
 */
class Bitrix24Helper {
  constructor() {
    this.appInfo = null
    this.isAdmin = false
    this.userProfile = null
    this.isInitialized = false
    this.storageName = 'pr_saved_time' // Единственное хранилище для сохраненного времени
    this.currentUserId = null

    // Кэш для хранения данных хранилища
    this.storageCache = null
    this.cacheTimestamp = null
    this.cacheTTL = 60000 // 1 минута
  }

  /**
   * Инициализация Bitrix24
   * @returns {Promise<void>}
   */
  async init() {
    return new Promise((resolve, reject) => {
      if (typeof BX24 !== 'undefined' && BX24.init) {
        BX24.init(async () => {
          try {
            await this.checkAdminStatus()

            // Выполняем запросы в одном batch
            const results = await this.executeBatch([
              ['app.info', {}],
              ['profile', {}]
            ])

            if (results[0]) {
              this.appInfo = results[0]
            }

            if (results[1]) {
              this.userProfile = results[1]
              this.currentUserId = parseInt(this.userProfile.ID)
            }

            this.isInitialized = true
            resolve()
          } catch (error) {
            console.error('Ошибка инициализации Bitrix24:', error)
            reject(error)
          }
        })
      } else {
        reject(new Error('Bitrix24 не доступен'))
      }
    })
  }

  /**
   * Проверка прав администратора
   * @returns {Promise<boolean>}
   */
  async checkAdminStatus() {
    return new Promise((resolve, reject) => {
      if (typeof BX24 !== 'undefined' && BX24.isAdmin) {
        try {
          this.isAdmin = BX24.isAdmin()
          resolve(this.isAdmin)
        } catch (error) {
          console.error('Ошибка проверки прав администратора:', error)
          reject(error)
        }
      } else {
        resolve(false)
      }
    })
  }

  /**
   * Получение информации о приложении
   * @returns {Promise<Object>}
   */
  async getAppInfo() {
    if (this.appInfo) return this.appInfo

    try {
      const results = await this.executeBatch([
        ['app.info', {}]
      ])

      if (results[0]) {
        this.appInfo = results[0]
        return this.appInfo
      }

      throw new Error('Не удалось получить информацию о приложении')
    } catch (error) {
      console.error("Ошибка при получении информации о приложении:", error)
      toast.error("Не удалось получить информацию о тарифе")
      throw error
    }
  }

  /**
   * Получение профиля пользователя
   * @returns {Promise<Object>}
   */
  async getUserProfile() {
    if (this.userProfile) return this.userProfile

    try {
      const results = await this.executeBatch([
        ['profile', {}]
      ])

      if (results[0]) {
        this.userProfile = results[0]
        this.currentUserId = parseInt(this.userProfile.ID)
        return this.userProfile
      }

      throw new Error('Не удалось получить профиль пользователя')
    } catch (error) {
      console.error("Ошибка при получении профиля пользователя:", error)
      throw error
    }
  }

  // ============== МЕТОДЫ ДЛЯ РАБОТЫ С ENTITY ХРАНИЛИЩЕМ ==============

  /**
   * Инвалидация кэша
   */
  invalidateCache() {
    this.storageCache = null
    this.cacheTimestamp = null
  }

  /**
   * Проверка валидности кэша
   */
  isCacheValid() {
    return this.storageCache !== null &&
      this.cacheTimestamp !== null &&
      (Date.now() - this.cacheTimestamp) < this.cacheTTL
  }

  /**
   * Выполнение batch-запроса
   * @param {Array} calls - Массив вызовов в формате [method, params]
   * @returns {Promise<Array>}
   */
  async executeBatch(calls) {
    if (!BX24) {
      throw new Error('Bitrix24 не доступен')
    }

    const batchSize = 50
    const allResults = []

    for (let i = 0; i < calls.length; i += batchSize) {
      const batchCalls = calls.slice(i, i + batchSize)
      const batchResults = await this.executeSingleBatch(batchCalls)
      allResults.push(...batchResults)
    }

    return allResults
  }

  /**
   * Выполнение одного batch-запроса
   * @param {Array} calls - Массив вызовов в формате [method, params]
   * @returns {Promise<Array>}
   */
  executeSingleBatch(calls) {
    return new Promise((resolve, reject) => {
      const batchCommands = {}

      calls.forEach((call, index) => {
        const [method, params] = call
        batchCommands[`cmd_${index}`] = [method, params]
      })

      BX24.callBatch(batchCommands, (result) => {

        const results = []

        // Проходим по всем командам в порядке их вызова
        for (let i = 0; i < calls.length; i++) {
          const cmdName = `cmd_${i}`
          const cmdResult = result[cmdName]

          if (cmdResult) {
            results.push(cmdResult.data())
          } else {
            results.push(null)
          }
        }

        resolve(results)
      })
    })
  }

  /**
   * Получение корневого раздела хранилища
   * @returns {Promise<number|null>} ID раздела
   */
  async getRootSectionId() {
    try {
      // Сначала пытаемся получить существующие разделы
      const results = await this.executeBatch([
        ['entity.section.get', {
          ENTITY: this.storageName
        }]
      ])

      const sections = results[0] || []

      if (sections && sections.length > 0) {
        // Берем первый раздел как корневой
        return parseInt(sections[0].ID)
      }

      // Если разделов нет, создаем корневой раздел
      const createResults = await this.executeBatch([
        ['entity.section.add', {
          ENTITY: this.storageName,
          NAME: 'Статистика пользователей'
        }]
      ])

      if (createResults[0]) {
        return parseInt(createResults[0])
      }

      throw new Error('Не удалось создать корневой раздел')
    } catch (error) {
      console.error('Ошибка при получении/создании раздела:', error)
      throw error
    }
  }

  /**
   * Получение всего хранилища статистики времени
   * @param {boolean} forceRefresh - Принудительное обновление (игнорировать кэш)
   * @returns {Promise<Array>} Массив объектов { userId, totalTime, updatedAt }
   */
  async getSavedTimeStorage(forceRefresh = false) {
    try {
      if (!BX24) return []

      // Проверяем кэш
      if (!forceRefresh && this.isCacheValid()) {
        return this.storageCache
      }

      const items = await this.getAllItems()

      // Преобразуем в удобный формат
      const storage = items.map(item => {
        const properties = item.PROPERTY_VALUES || {}
        return {
          userId: parseInt(properties.USER_ID || 0),
          userName: properties.USER_NAME || '',
          totalTime: parseInt(properties.TOTAL_TIME || 0),
          updatedAt: properties.UPDATED_AT || new Date().toISOString(),
          itemId: parseInt(item.ID)
        }
      }).filter(item => item.userId > 0) // Только валидные записи

      // Сохраняем в кэш
      this.storageCache = storage
      this.cacheTimestamp = Date.now()

      return storage
    } catch (error) {
      console.error('Ошибка получения хранилища:', error)
      return []
    }
  }

  /**
   * Получение всех элементов хранилища с пагинацией через batch
   * @returns {Promise<Array>}
   */
  async getAllItems() {
    try {
      // Получаем корневой раздел
      const sectionId = await this.getRootSectionId()

      let allItems = []
      let page = 1
      const pageSize = 50

      while (true) {
        const results = await this.executeBatch([
          ['entity.item.get', {
            ENTITY: this.storageName,
            FILTER: { SECTION_ID: sectionId },
            NAV_PARAMS: {
              nPageSize: pageSize,
              iNumPage: page
            }
          }]
        ])

        const items = results[0] || []
        if (items.length === 0) break

        allItems = allItems.concat(items)
        if (items.length < pageSize) break

        page++
      }

      return allItems
    } catch (error) {
      console.error('Ошибка при получении элементов:', error)
      return []
    }
  }

  /**
   * Сохранение всего хранилища (замена всех элементов) с использованием batch
   * @param {Array} storage - Массив объектов статистики
   * @returns {Promise<boolean>}
   */
  async saveSavedTimeStorage(storage) {
    try {
      if (!BX24) return false

      // Получаем корневой раздел
      const sectionId = await this.getRootSectionId()

      // Получаем все текущие элементы
      const currentItems = await this.getAllItems()

      // Формируем batch для удаления всех элементов
      const deleteCalls = currentItems.map(item =>
        ['entity.item.delete', {
          ENTITY: this.storageName,
          ID: item.ID
        }]
      )

      if (deleteCalls.length > 0) {
        await this.executeBatch(deleteCalls)
      }

      // Формируем batch для создания новых элементов
      const createCalls = storage.map(stat => {
        const userName = stat.userName || `Пользователь ${stat.userId}`

        return ['entity.item.add', {
          ENTITY: this.storageName,
          NAME: `${userName} - Статистика времени`,
          SECTION: sectionId,
          PROPERTY_VALUES: {
            USER_ID: stat.userId,
            USER_NAME: userName,
            TOTAL_TIME: stat.totalTime || 0,
            UPDATED_AT: stat.updatedAt || new Date().toISOString()
          }
        }]
      })

      // Выполняем создание элементов пачками по 50
      if (createCalls.length > 0) {
        await this.executeBatch(createCalls)
      }

      // Инвалидируем кэш
      this.invalidateCache()

      return true
    } catch (error) {
      console.error('Ошибка сохранения хранилища:', error)
      return false
    }
  }

  /**
   * Удаление элемента
   * @param {number} itemId - ID элемента
   * @returns {Promise<boolean>}
   */
  async deleteItem(itemId) {
    try {
      const results = await this.executeBatch([
        ['entity.item.delete', {
          ENTITY: this.storageName,
          ID: itemId
        }]
      ])

      return results[0] !== null
    } catch (error) {
      console.error('Ошибка при удалении элемента:', error)
      return false
    }
  }

  /**
   * Создание элемента
   * @param {number} sectionId - ID раздела
   * @param {Object} data - Данные элемента
   * @returns {Promise<number|null>} ID созданного элемента
   */
  async createItem(sectionId, data) {
    try {
      const userName = data.userName || `Пользователь ${data.userId}`

      const results = await this.executeBatch([
        ['entity.item.add', {
          ENTITY: this.storageName,
          NAME: `${userName} - Статистика времени`,
          SECTION: sectionId,
          PROPERTY_VALUES: {
            USER_ID: data.userId,
            USER_NAME: userName,
            TOTAL_TIME: data.totalTime || 0,
            UPDATED_AT: data.updatedAt || new Date().toISOString()
          }
        }]
      ])

      if (results[0]) {
        return parseInt(results[0])
      }

      return null
    } catch (error) {
      console.error('Ошибка при создании элемента:', error)
      return null
    }
  }

  /**
   * Получение имени пользователя по ID
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} Имя пользователя
   */
  async getUserNameById(userId) {
    try {
      // Сначала проверяем текущего пользователя
      if (this.userProfile && parseInt(this.userProfile.ID) === parseInt(userId)) {
        return this.userProfile.NAME && this.userProfile.LAST_NAME
          ? `${this.userProfile.NAME} ${this.userProfile.LAST_NAME}`.trim()
          : `Пользователь ${userId}`
      }

      // Получаем из API
      const users = await this.getAllUsers()
      const user = users.find(u => parseInt(u.ID) === parseInt(userId))

      if (user) {
        return user.NAME && user.LAST_NAME
          ? `${user.NAME} ${user.LAST_NAME}`.trim()
          : `Пользователь ${userId}`
      }

      return `Пользователь ${userId}`
    } catch {
      return `Пользователь ${userId}`
    }
  }

  /**
   * Обновление или создание элемента для пользователя
   * @param {number} userId - ID пользователя
   * @param {number} secondsToAdd - Количество секунд для добавления (может быть отрицательным)
   * @returns {Promise<boolean>}
   */
  async ensureAndUpdateUserTime(userId, secondsToAdd) {
    try {
      if (!userId || !BX24) {
        console.error('Не указан userId или BX24 не доступен')
        return false
      }

      const numericUserId = parseInt(userId)
      if (isNaN(numericUserId)) return false

      // Получаем корневой раздел
      const sectionId = await this.getRootSectionId()

      // Получаем все элементы
      const items = await this.getAllItems()

      // Ищем существующую запись
      const existingItem = items.find(item => {
        const props = item.PROPERTY_VALUES || {}
        return parseInt(props.USER_ID) === numericUserId
      })

      const now = new Date().toISOString()

      if (existingItem) {
        // Обновляем существующую запись
        const currentTime = parseInt(existingItem.PROPERTY_VALUES?.TOTAL_TIME || 0)
        const newTime = Math.max(0, currentTime + secondsToAdd)

        const results = await this.executeBatch([
          ['entity.item.update', {
            ENTITY: this.storageName,
            ID: existingItem.ID,
            PROPERTY_VALUES: {
              TOTAL_TIME: newTime,
              UPDATED_AT: now
            }
          }]
        ])
      } else {
        // Получаем имя пользователя
        const userName = await this.getUserNameById(numericUserId)

        // Создаем новую запись
        const newTime = Math.max(0, secondsToAdd)

        const results = await this.executeBatch([
          ['entity.item.add', {
            ENTITY: this.storageName,
            NAME: `${userName} - Статистика времени`,
            SECTION: sectionId,
            PROPERTY_VALUES: {
              USER_ID: numericUserId,
              USER_NAME: userName,
              TOTAL_TIME: newTime,
              UPDATED_AT: now
            }
          }]
        ])
      }

      // Инвалидируем кэш
      this.invalidateCache()

      // Уведомляем об обновлении
      this.notifyTimeUpdate(numericUserId, secondsToAdd)

      return true
    } catch (error) {
      console.error('Ошибка обновления/создания времени пользователя:', error)
      return false
    }
  }

  /**
   * Обновление элемента
   * @param {number} itemId - ID элемента
   * @param {Object} data - Данные для обновления
   * @returns {Promise<boolean>}
   */
  async updateItem(itemId, data) {
    try {
      const results = await this.executeBatch([
        ['entity.item.update', {
          ENTITY: this.storageName,
          ID: itemId,
          PROPERTY_VALUES: data
        }]
      ])

      return results[0] !== null
    } catch (error) {
      console.error('Ошибка при обновлении элемента:', error)
      return false
    }
  }

  /**
   * Получение общего сохраненного времени всех пользователей
   * @returns {Promise<number>}
   */
  async getTotalSavedTime() {
    try {
      const storage = await this.getSavedTimeStorage()
      return storage.reduce((sum, item) => sum + (item.totalTime || 0), 0)
    } catch (error) {
      console.error('Ошибка получения общего времени:', error)
      return 0
    }
  }

  /**
   * Получение сохраненного времени конкретного пользователя
   * @param {number|string} userId - ID пользователя
   * @returns {Promise<number>}
   */
  async getUserSavedTime(userId) {
    try {
      if (!userId) return 0

      const storage = await this.getSavedTimeStorage()
      const userStat = storage.find(item => item.userId === parseInt(userId))

      return userStat?.totalTime || 0
    } catch (error) {
      console.error('Ошибка получения времени пользователя:', error)
      return 0
    }
  }

  /**
   * Обновление сохраненного времени пользователя (с автоматическим созданием если не существует)
   * @param {number|string} userId - ID пользователя
   * @param {number} secondsToAdd - Количество секунд для добавления (может быть отрицательным)
   * @returns {Promise<boolean>}
   */
  async updateUserSavedTime(userId, secondsToAdd) {
    return this.ensureAndUpdateUserTime(userId, secondsToAdd)
  }

  /**
   * Установка точного значения времени для пользователя (с автоматическим созданием если не существует)
   * @param {number|string} userId - ID пользователя
   * @param {number} totalTime - Точное значение времени в секундах
   * @returns {Promise<boolean>}
   */
  async setUserSavedTime(userId, totalTime) {
    try {
      if (!userId || !BX24) return false

      const numericUserId = parseInt(userId)
      if (isNaN(numericUserId)) return false

      // Получаем корневой раздел
      const sectionId = await this.getRootSectionId()

      // Получаем все элементы
      const items = await this.getAllItems()

      // Ищем существующую запись
      const existingItem = items.find(item => {
        const props = item.PROPERTY_VALUES || {}
        return parseInt(props.USER_ID) === numericUserId
      })

      const now = new Date().toISOString()

      if (existingItem) {
        // Обновляем существующую запись
        await this.updateItem(existingItem.ID, {
          TOTAL_TIME: Math.max(0, totalTime),
          UPDATED_AT: now
        })
      } else {
        // Получаем имя пользователя
        const userName = await this.getUserNameById(numericUserId)

        // Создаем новую запись
        await this.createItem(sectionId, {
          userId: numericUserId,
          userName: userName,
          totalTime: Math.max(0, totalTime),
          updatedAt: now
        })
      }

      // Инвалидируем кэш
      this.invalidateCache()
      this.notifyTimeUpdate(numericUserId, 0)

      return true
    } catch (error) {
      console.error('Ошибка установки времени пользователя:', error)
      return false
    }
  }

  /**
   * Получение процента времени пользователя от общего
   * @param {number|string} userId - ID пользователя
   * @returns {Promise<number>} Процент (0-100)
   */
  async getUserPercentage(userId) {
    try {
      const [userTime, totalTime] = await Promise.all([
        this.getUserSavedTime(userId),
        this.getTotalSavedTime()
      ])

      return totalTime > 0 ? Math.round((userTime / totalTime) * 100) : 0
    } catch (error) {
      console.error('Ошибка расчета процента:', error)
      return 0
    }
  }

  /**
   * Получение статистики всех пользователей
   * @returns {Promise<Array>}
   */
  async getAllUsersStats() {
    try {
      const storage = await this.getSavedTimeStorage()
      return storage.sort((a, b) => (b.totalTime || 0) - (a.totalTime || 0))
    } catch (error) {
      console.error('Ошибка получения статистики всех пользователей:', error)
      return []
    }
  }

  /**
   * Получение статистики текущего пользователя
   * @returns {Promise<Object>}
   */
  async getCurrentUserStats() {
    try {
      if (!this.currentUserId) return { userId: null, totalTime: 0, percentage: 0 }

      const [totalTime, percentage] = await Promise.all([
        this.getUserSavedTime(this.currentUserId),
        this.getUserPercentage(this.currentUserId)
      ])

      return {
        userId: this.currentUserId,
        totalTime,
        percentage
      }
    } catch (error) {
      console.error('Ошибка получения статистики текущего пользователя:', error)
      return { userId: this.currentUserId, totalTime: 0, percentage: 0 }
    }
  }

  /**
   * Сброс времени конкретного пользователя (только для администратора)
   * @param {number|string} userId - ID пользователя
   * @returns {Promise<boolean>}
   */
  async resetUserSavedTime(userId) {
    try {
      if (!this.isAdmin) {
        console.error('Недостаточно прав для сброса времени')
        return false
      }

      if (!userId || !BX24) return false

      const numericUserId = parseInt(userId)
      if (isNaN(numericUserId)) return false

      // Получаем все элементы
      const items = await this.getAllItems()

      // Ищем существующую запись
      const existingItem = items.find(item => {
        const props = item.PROPERTY_VALUES || {}
        return parseInt(props.USER_ID) === numericUserId
      })

      if (existingItem) {
        // Обновляем время на 0
        await this.updateItem(existingItem.ID, {
          TOTAL_TIME: 0,
          UPDATED_AT: new Date().toISOString()
        })

        // Инвалидируем кэш
        this.invalidateCache()
        this.notifyTimeUpdate(numericUserId, 0)
      }

      return true
    } catch (error) {
      console.error('Ошибка сброса времени пользователя:', error)
      return false
    }
  }

  /**
   * Сброс времени всех пользователей (только для администратора)
   * @returns {Promise<boolean>}
   */
  async resetAllUsersTime() {
    try {
      if (!this.isAdmin) {
        console.error('Недостаточно прав для сброса времени')
        return false
      }

      if (!BX24) return false

      // Получаем все элементы
      const items = await this.getAllItems()

      // Формируем batch для обновления времени у всех элементов на 0
      const updateCalls = items.map(item =>
        ['entity.item.update', {
          ENTITY: this.storageName,
          ID: item.ID,
          PROPERTY_VALUES: {
            TOTAL_TIME: 0,
            UPDATED_AT: new Date().toISOString()
          }
        }]
      )

      if (updateCalls.length > 0) {
        await this.executeBatch(updateCalls)
      }

      // Инвалидируем кэш
      this.invalidateCache()
      this.notifyTimeUpdate('all', 0)

      return true
    } catch (error) {
      console.error('Ошибка сброса времени всех пользователей:', error)
      return false
    }
  }

  /**
   * Полное удаление хранилища и создание заново
   * @returns {Promise<boolean>}
   */
  async resetStorage() {
    try {
      if (!this.isAdmin) {
        console.error('Недостаточно прав для сброса хранилища')
        return false
      }

      if (!BX24) return false

      // Удаляем хранилище
      await this.executeBatch([
        ['entity.delete', {
          ENTITY: this.storageName
        }]
      ])

      // Создаем новое хранилище
      await this.executeBatch([
        ['entity.add', {
          ENTITY: this.storageName,
          NAME: 'Сохраненное время',
          ACCESS: {
            AU: 'W'
          }
        }]
      ])

      // Создаем свойства
      const properties = [
        {PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N'},
        {PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S'},
        {PROPERTY: 'TOTAL_TIME', NAME: 'Общее сохраненное время (сек)', TYPE: 'N'},
        {PROPERTY: 'UPDATED_AT', NAME: 'Дата последнего обновления', TYPE: 'S'}
      ]

      const propertyCalls = properties.map(prop =>
        ['entity.item.property.add', {
          ENTITY: this.storageName,
          PROPERTY: prop.PROPERTY,
          NAME: prop.NAME,
          TYPE: prop.TYPE
        }]
      )

      await this.executeBatch(propertyCalls)

      // Инвалидируем кэш
      this.invalidateCache()

      return true
    } catch (error) {
      console.error('Ошибка сброса хранилища:', error)
      return false
    }
  }

  /**
   * Получение ID текущего пользователя
   * @returns {Promise<number|null>}
   */
  async getCurrentUserId() {
    if (this.currentUserId) return this.currentUserId

    try {
      if (this.userProfile && this.userProfile.ID) {
        this.currentUserId = parseInt(this.userProfile.ID)
        return this.currentUserId
      }

      await this.getUserProfile()
      return this.currentUserId
    } catch (error) {
      console.error('Ошибка получения ID текущего пользователя:', error)
      return null
    }
  }

  /**
   * Уведомление об обновлении времени
   * @param {number|string} userId - ID пользователя или 'all'
   * @param {number} change - Изменение времени
   */
  notifyTimeUpdate(userId, change) {
    // Вызываем глобальную функцию обновления, если она существует
    if (typeof window.updateSidebarSavedTime === 'function') {
      try {
        window.updateSidebarSavedTime()
      } catch (error) {
        console.warn('Ошибка обновления сайдбара:', error)
      }
    }

    // Используем CustomEvent для уведомления
    try {
      const event = new CustomEvent('saved-time-update', {
        detail: { userId, change, timestamp: Date.now() }
      })
      window.dispatchEvent(event)
    } catch (error) {
      // Игнорируем ошибки DOM события
    }
  }

  // ============== МЕТОДЫ ДЛЯ ПРОВЕРКИ ТАРИФОВ ==============

  /**
   * Проверка доступности статистики по тарифу
   * @returns {boolean}
   */
  isStatisticsAvailable() {
    if (!this.appInfo || !this.appInfo.LICENSE) {
      return false
    }

    const license = this.appInfo.LICENSE.toLowerCase()

    // Список поддерживаемых тарифов для статистики
    const supportedTariffs = [
      'demo',
      'std',        // Стандартный
      'pro100',     // Профессиональный
      'ent250',     // Энтерпрайз 250
      'ent500',     // Энтерпрайз 500
      'ent1000',    // Энтерпрайз 1000
      'ent2000',    // Энтерпрайз 2000
      'ent10000'    // Энтерпрайз 10000
    ]

    return supportedTariffs.some(tariff => license.includes(tariff))
  }

  /**
   * Получение названия тарифа
   * @returns {string}
   */
  getTariffName() {
    if (!this.appInfo || !this.appInfo.LICENSE) return 'Неизвестный тариф'

    const license = this.appInfo.LICENSE.toLowerCase()

    if (license.includes('demo')) return 'Демо'
    if (license.includes('project')) return 'Проект'
    if (license.includes('basic')) return 'Базовый'
    if (license.includes('std')) return 'Стандартный'
    if (license.includes('pro100')) return 'Профессиональный'
    if (license.includes('ent250')) return 'Энтерпрайз 250'
    if (license.includes('ent500')) return 'Энтерпрайз 500'
    if (license.includes('ent1000')) return 'Энтерпрайз 1000'
    if (license.includes('ent2000')) return 'Энтерпрайз 2000'
    if (license.includes('ent10000')) return 'Энтерпрайз 10000'

    return 'Другой тариф'
  }

  /**
   * Получение текста подсказки для статистики
   * @returns {string}
   */
  getStatisticsTooltip() {
    if (!this.appInfo || !this.appInfo.LICENSE) {
      return 'Информация о тарифе недоступна'
    }

    if (this.isStatisticsAvailable()) {
      return `Доступно на тарифе: ${this.getTariffName()}`
    } else {
      return `Статистика доступна только на тарифах: Стандартный, Профессиональный, Энтерпрайз. Текущий тариф: ${this.getTariffName()}`
    }
  }

  /**
   * Проверка, является ли пользователь администратором
   * @returns {boolean}
   */
  isUserAdmin() {
    return this.isAdmin
  }

  /**
   * Получение информации о приложении
   * @returns {Object|null}
   */
  getAppInfoData() {
    return this.appInfo
  }

  /**
   * Получение профиля пользователя
   * @returns {Object|null}
   */
  getUserProfileData() {
    return this.userProfile
  }

  /**
   * Проверка инициализации
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized
  }

  /**
   * Получение всех пользователей портала
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    try {
      let allUsers = []
      let page = 1
      const pageSize = 50

      while (true) {
        const results = await this.executeBatch([
          ['user.get', {
            NAV_PARAMS: {
              nPageSize: pageSize,
              iNumPage: page
            },
            SELECT: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'EMAIL']
          }]
        ])

        const users = results[0] || []
        if (users.length === 0) break

        allUsers = allUsers.concat(users)
        if (users.length < pageSize) break

        page++
      }

      return allUsers
    } catch (error) {
      console.error("Ошибка при получении списка пользователей:", error)
      return []
    }
  }

  // ============== МЕТОДЫ ДЛЯ ТЕСТИРОВАНИЯ ==============

  /**
   * Генерация тестовых записей (доступно только администратору)
   * @param {Object} options - Опции генерации
   * @param {number} options.count - Количество записей (по умолчанию 500)
   * @param {number} options.userId - ID пользователя (по умолчанию текущий)
   * @param {boolean} options.randomDays - Распределять по разным дням (по умолчанию true)
   * @param {number} options.daysRange - Диапазон дней для распределения (по умолчанию 30)
   * @param {boolean} options.verbose - Выводить подробную информацию в консоль (по умолчанию false)
   * @returns {Promise<Object>} Результат операции
   */
  async generateTestData(options = {}) {
    const {
      count = 500,
      userId = null,
      randomDays = true,
      daysRange = 30,
      verbose = false
    } = options;

    // Проверка прав администратора
    if (!this.isAdmin) {
      console.error('❌ Недостаточно прав для генерации тестовых данных. Требуются права администратора.');
      return { success: false, error: 'access_denied', message: 'Требуются права администратора' };
    }

    // Проверка инициализации
    if (!this.isInitialized) {
      try {
        await this.init();
      } catch (error) {
        console.error('❌ Ошибка инициализации Bitrix24:', error);
        return { success: false, error: 'init_failed', message: 'Ошибка инициализации' };
      }
    }

    console.log(`🚀 Начинаю генерацию ${count} тестовых записей...`);

    const startTime = Date.now();
    const targetUserId = userId || this.currentUserId;

    if (!targetUserId) {
      console.error('❌ Не удалось определить ID пользователя');
      return { success: false, error: 'no_user_id', message: 'Не удалось определить ID пользователя' };
    }

    // Получаем имя пользователя
    const userName = await this.getUserNameById(targetUserId);

    // Категории для тестовых данных
    const categories = [
      { name: 'CRM › Сделки', path: '/crm/deal/', weight: 20 },
      { name: 'CRM › Лиды', path: '/crm/lead/', weight: 15 },
      { name: 'CRM › Контакты', path: '/crm/contact/', weight: 10 },
      { name: 'Задачи и Проекты › Задачи', path: '/company/personal/user/1/tasks/', weight: 25 },
      { name: 'Совместная работа › Лента', path: '/stream/', weight: 10 },
      { name: 'Совместная работа › Календарь', path: '/calendar/', weight: 5 },
      { name: 'Совместная работа › Диск', path: '/docs/', weight: 5 },
      { name: 'Сайты и Магазины › Товары', path: '/shop/catalog/', weight: 5 },
      { name: 'Автоматизация › Роботы', path: '/automation/', weight: 3 },
      { name: 'Маркетинг › Рассылки', path: '/marketing/letter/', weight: 2 }
    ];

    // Расширяем категории согласно весу
    const expandedCategories = [];
    categories.forEach(cat => {
      for (let i = 0; i < cat.weight; i++) {
        expandedCategories.push(cat);
      }
    });

    // Получаем домен
    const domain = window.location.hostname;

    // Кэш для секций
    const sections = {};
    const today = new Date();

    // Функция для логирования с условием
    const log = (message, data = null) => {
      if (verbose) {
        if (data) {
          console.log(message, data);
        } else {
          console.log(message);
        }
      }
    };

    log('📊 Категории подготовлены');

    let created = 0;
    let errors = 0;
    const errorsList = [];

    // Генерируем записи
    for (let i = 0; i < count; i++) {
      try {
        // Определяем дату
        let dateStr;
        let sectionId;

        if (randomDays) {
          // Случайный день в пределах диапазона
          const randomDay = Math.floor(Math.random() * daysRange);
          const date = new Date(today);
          date.setDate(date.getDate() - randomDay);
          dateStr = date.toISOString().split('T')[0];

          // Получаем или создаем секцию для этой даты
          if (!sections[dateStr]) {
            try {
              // Проверяем существование секции
              const sectionsList = await this.executeBatch([
                ['entity.section.get', {
                  ENTITY: 'pr_tracking',
                  FILTER: { NAME: dateStr }
                }]
              ]);

              if (sectionsList[0] && sectionsList[0].length > 0) {
                sections[dateStr] = parseInt(sectionsList[0][0].ID);
                log(`📁 Найдена секция для ${dateStr}: ${sections[dateStr]}`);
              } else {
                // Создаем новую секцию
                const newSection = await this.executeBatch([
                  ['entity.section.add', {
                    ENTITY: 'pr_tracking',
                    NAME: dateStr
                  }]
                ]);
                sections[dateStr] = parseInt(newSection[0]);
                log(`📁 Создана секция для ${dateStr}: ${sections[dateStr]}`);
              }
            } catch (error) {
              log(`❌ Ошибка с секцией ${dateStr}:`, error);
              errors++;
              errorsList.push({ type: 'section', date: dateStr, error: error.message });
              continue;
            }
          }
          sectionId = sections[dateStr];
        } else {
          // Используем сегодняшнюю дату
          dateStr = today.toISOString().split('T')[0];

          if (!sections[dateStr]) {
            // Получаем или создаем секцию для сегодня
            const sectionsList = await this.executeBatch([
              ['entity.section.get', {
                ENTITY: 'pr_tracking',
                FILTER: { NAME: dateStr }
              }]
            ]);

            if (sectionsList[0] && sectionsList[0].length > 0) {
              sections[dateStr] = parseInt(sectionsList[0][0].ID);
            } else {
              const newSection = await this.executeBatch([
                ['entity.section.add', {
                  ENTITY: 'pr_tracking',
                  NAME: dateStr
                }]
              ]);
              sections[dateStr] = parseInt(newSection[0]);
            }
          }
          sectionId = sections[dateStr];
        }

        if (!sectionId) {
          errors++;
          errorsList.push({ type: 'no_section', date: dateStr });
          continue;
        }

        // Выбираем случайную категорию
        const randomCat = expandedCategories[Math.floor(Math.random() * expandedCategories.length)];

        // Генерируем случайное время (от 5 минут до 4 часов)
        const pageTime = Math.floor(Math.random() * 14400) + 300; // 300-14400 сек (5 мин - 4 часа)

        // Создаем URL и заголовок
        const pageUrl = `https://${domain}${randomCat.path}${Math.floor(Math.random() * 1000)}/`;
        const pageTitle = `${randomCat.name.split(' › ').pop()} - ${Math.floor(Math.random() * 1000)}`;

        // Создаем запись
        await this.executeBatch([
          ['entity.item.add', {
            ENTITY: 'pr_tracking',
            NAME: `${userName} - ${randomCat.name}`,
            SECTION: sectionId,
            PROPERTY_VALUES: {
              USER_ID: targetUserId,
              USER_NAME: userName,
              PAGE_URL: pageUrl,
              PAGE_TITLE: pageTitle,
              PAGE_TIME: pageTime,
              PAGE_CATEGORY: randomCat.name
            }
          }]
        ]);

        created++;

        // Прогресс каждые 50 записей
        if (i % 50 === 0 && i > 0) {
          console.log(`📊 Прогресс: ${created}/${count} (ошибок: ${errors})`);
          // Небольшая задержка чтобы не перегружать API
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        errors++;
        errorsList.push({ type: 'item', index: i, error: error.message });
        console.error(`❌ Ошибка при создании записи ${i + 1}:`, error);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Инвалидируем кэш
    this.invalidateCache();

    // Уведомляем об обновлении
    this.notifyTimeUpdate('all', 0);

    // Выводим итоги
    console.log('=================================');
    console.log(`✅ Генерация завершена!`);
    console.log(`📊 Создано записей: ${created}`);
    console.log(`❌ Ошибок: ${errors}`);
    console.log(`⏱️ Время выполнения: ${duration} сек`);

    if (errorsList.length > 0 && verbose) {
      console.log('📋 Детали ошибок:', errorsList);
    }
    console.log('=================================');

    // Возвращаем результат
    const result = {
      success: errors === 0,
      created,
      errors,
      duration: parseFloat(duration),
      categories: categories.map(c => c.name)
    };

    if (errorsList.length > 0) {
      result.errorsList = errorsList.slice(0, 10); // Только первые 10 ошибок
    }

    return result;
  }
}

// Создаем и экспортируем экземпляр класса
export const bitrixHelper = new Bitrix24Helper()