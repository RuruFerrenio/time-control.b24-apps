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
            await this.getAppInfo()
            await this.getUserProfile()

            // Сохраняем ID текущего пользователя
            if (this.userProfile && this.userProfile.ID) {
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
    return new Promise((resolve, reject) => {
      if (typeof BX24 !== 'undefined' && BX24.callMethod) {
        BX24.callMethod(
          "app.info",
          {},
          (result) => {
            if (result.error()) {
              console.error("Ошибка при получении информации о приложении:", result.error())
              toast.error("Не удалось получить информацию о тарифе")
              reject(result.error())
            } else {
              this.appInfo = result.data()
              console.log("Информация о приложении:", this.appInfo)
              resolve(this.appInfo)
            }
          }
        )
      } else {
        reject(new Error('Bitrix24 API не доступен'))
      }
    })
  }

  /**
   * Получение профиля пользователя
   * @returns {Promise<Object>}
   */
  async getUserProfile() {
    return new Promise((resolve, reject) => {
      if (typeof BX24 !== 'undefined' && BX24.callMethod) {
        BX24.callMethod(
          "profile",
          {},
          (result) => {
            if (result.error()) {
              console.error("Ошибка при получении профиля пользователя:", result.error())
              reject(result.error())
            } else {
              this.userProfile = result.data()
              this.currentUserId = parseInt(this.userProfile.ID)
              console.log("Профиль пользователя:", this.userProfile)
              resolve(this.userProfile)
            }
          }
        )
      } else {
        reject(new Error('Bitrix24 API не доступен'))
      }
    })
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
   * Получение корневого раздела хранилища
   * @returns {Promise<number|null>} ID раздела
   */
  async getRootSectionId() {
    return new Promise((resolve, reject) => {
      if (!BX24) {
        reject(new Error('Bitrix24 не доступен'))
        return
      }

      BX24.callMethod('entity.section.get', {
        ENTITY: this.storageName
      }, (result) => {
        if (result.error()) {
          console.error('Ошибка при получении разделов:', result.error())
          reject(result.error())
          return
        }

        const sections = result.data()

        if (sections.length > 0) {
          // Берем первый раздел как корневой
          resolve(parseInt(sections[0].ID))
        } else {
          // Если разделов нет, создаем корневой раздел
          BX24.callMethod('entity.section.add', {
            ENTITY: this.storageName,
            NAME: 'Статистика пользователей'
          }, (addResult) => {
            if (addResult.error()) {
              console.error('Ошибка при создании раздела:', addResult.error())
              reject(addResult.error())
            } else {
              resolve(parseInt(addResult.data()))
            }
          })
        }
      })
    })
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
   * Получение всех элементов хранилища
   * @returns {Promise<Array>}
   */
  async getAllItems() {
    return new Promise(async (resolve, reject) => {
      try {
        // Получаем корневой раздел
        const sectionId = await this.getRootSectionId()

        // Получаем все элементы раздела
        BX24.callMethod('entity.item.get', {
          ENTITY: this.storageName,
          FILTER: { SECTION_ID: sectionId }
        }, (result) => {
          if (result.error()) {
            console.error('Ошибка при получении элементов:', result.error())
            reject(result.error())
          } else {
            resolve(result.data() || [])
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Сохранение всего хранилища (замена всех элементов)
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

      // Удаляем все существующие элементы
      for (const item of currentItems) {
        await this.deleteItem(item.ID)
      }

      // Создаем новые элементы
      for (const stat of storage) {
        await this.createItem(sectionId, stat)
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
    return new Promise((resolve, reject) => {
      BX24.callMethod('entity.item.delete', {
        ENTITY: this.storageName,
        ID: itemId
      }, (result) => {
        if (result.error()) {
          console.error('Ошибка при удалении элемента:', result.error())
          reject(result.error())
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * Создание элемента
   * @param {number} sectionId - ID раздела
   * @param {Object} data - Данные элемента
   * @returns {Promise<number>} ID созданного элемента
   */
  async createItem(sectionId, data) {
    return new Promise((resolve, reject) => {
      BX24.callMethod('entity.item.add', {
        ENTITY: this.storageName,
        NAME: `Пользователь ${data.userId}`,
        PROPERTY_VALUES: {
          USER_ID: data.userId,
          USER_NAME: data.userName || '',
          TOTAL_TIME: data.totalTime || 0,
          UPDATED_AT: data.updatedAt || new Date().toISOString()
        },
        SECTION_ID: sectionId
      }, (result) => {
        if (result.error()) {
          console.error('Ошибка при создании элемента:', result.error())
          reject(result.error())
        } else {
          resolve(parseInt(result.data()))
        }
      })
    })
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
          : `Пользователь ${userId}`;
      }

      // Получаем из API
      const users = await this.getAllUsers();
      const user = users.find(u => parseInt(u.ID) === parseInt(userId));
      if (user) {
        return user.NAME && user.LAST_NAME
          ? `${user.NAME} ${user.LAST_NAME}`.trim()
          : `Пользователь ${userId}`;
      }
      return `Пользователь ${userId}`;
    } catch {
      return `Пользователь ${userId}`;
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
        console.error('Не указан userId или BX24 не доступен');
        return false;
      }

      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) return false;

      // Получаем корневой раздел
      const sectionId = await this.getRootSectionId();

      // Получаем все элементы
      const items = await this.getAllItems();

      // Ищем существующую запись
      const existingItem = items.find(item => {
        const props = item.PROPERTY_VALUES || {};
        return parseInt(props.USER_ID) === numericUserId;
      });

      const now = new Date().toISOString();

      if (existingItem) {
        // Обновляем существующую запись
        const currentTime = parseInt(existingItem.PROPERTY_VALUES?.TOTAL_TIME || 0);
        const newTime = Math.max(0, currentTime + secondsToAdd);

        await this.updateItem(existingItem.ID, {
          TOTAL_TIME: newTime,
          UPDATED_AT: now
        });

        console.log(`Обновлено время для пользователя ${userId}: ${currentTime} -> ${newTime} (изменение: ${secondsToAdd})`);
      } else {
        // Получаем имя пользователя
        const userName = await this.getUserNameById(numericUserId);

        // Создаем новую запись
        const newTime = Math.max(0, secondsToAdd);
        await this.createItem(sectionId, {
          userId: numericUserId,
          userName: userName,
          totalTime: newTime,
          updatedAt: now
        });

        console.log(`Создан новый элемент для пользователя ${userId} с временем ${newTime}`);
      }

      // Инвалидируем кэш
      this.invalidateCache();

      // Уведомляем об обновлении
      this.notifyTimeUpdate(numericUserId, secondsToAdd);

      return true;
    } catch (error) {
      console.error('Ошибка обновления/создания времени пользователя:', error);
      return false;
    }
  }

  /**
   * Обновление элемента
   * @param {number} itemId - ID элемента
   * @param {Object} data - Данные для обновления
   * @returns {Promise<boolean>}
   */
  async updateItem(itemId, data) {
    return new Promise((resolve, reject) => {
      BX24.callMethod('entity.item.update', {
        ENTITY: this.storageName,
        ID: itemId,
        PROPERTY_VALUES: data
      }, (result) => {
        if (result.error()) {
          console.error('Ошибка при обновлении элемента:', result.error())
          reject(result.error())
        } else {
          resolve(true)
        }
      })
    })
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
    // Используем новый метод с автоматическим созданием
    return this.ensureAndUpdateUserTime(userId, secondsToAdd);
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
        const userName = await this.getUserNameById(numericUserId);

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

      // Обновляем время у всех элементов на 0
      for (const item of items) {
        await this.updateItem(item.ID, {
          TOTAL_TIME: 0,
          UPDATED_AT: new Date().toISOString()
        })
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
      await new Promise((resolve, reject) => {
        BX24.callMethod('entity.delete', {
          ENTITY: this.storageName
        }, (result) => {
          if (result.error()) {
            console.error('Ошибка при удалении хранилища:', result.error())
            reject(result.error())
          } else {
            resolve(true)
          }
        })
      })

      // Создаем новое хранилище
      await new Promise((resolve, reject) => {
        BX24.callMethod('entity.add', {
          ENTITY: this.storageName,
          NAME: 'Сохраненное время',
          ACCESS: {
            AU: 'W'
          }
        }, (result) => {
          if (result.error()) {
            console.error('Ошибка при создании хранилища:', result.error())
            reject(result.error())
          } else {
            resolve(true)
          }
        })
      })

      // Создаем свойства
      const properties = [
        {PROPERTY: 'USER_ID', NAME: 'ID пользователя', TYPE: 'N'},
        {PROPERTY: 'USER_NAME', NAME: 'Имя пользователя', TYPE: 'S'},
        {PROPERTY: 'TOTAL_TIME', NAME: 'Общее сохраненное время (сек)', TYPE: 'N'},
        {PROPERTY: 'UPDATED_AT', NAME: 'Дата последнего обновления', TYPE: 'S'}
      ]

      for (const prop of properties) {
        await new Promise((resolve) => {
          BX24.callMethod('entity.item.property.add', {
            ENTITY: this.storageName,
            PROPERTY: prop.PROPERTY,
            NAME: prop.NAME,
            TYPE: prop.TYPE
          }, () => resolve(true))
        })
      }

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
    return new Promise((resolve, reject) => {
      if (typeof BX24 !== 'undefined' && BX24.callMethod) {
        BX24.callMethod(
          "user.get",
          {},
          (result) => {
            if (result.error()) {
              console.error("Ошибка при получении списка пользователей:", result.error())
              reject(result.error())
            } else {
              resolve(result.data())
            }
          }
        )
      } else {
        reject(new Error('Bitrix24 API не доступен'))
      }
    })
  }
}

// Создаем и экспортируем экземпляр класса
export const bitrixHelper = new Bitrix24Helper()