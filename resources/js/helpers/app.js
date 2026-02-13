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
    this.storageName = 'pr_saved_time_stats' // Единственное хранилище для сохраненного времени
    this.currentUserId = null
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

  // ============== МЕТОДЫ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ==============

  /**
   * Получение всего хранилища статистики времени
   * @returns {Promise<Array>} Массив объектов { userId, totalTime, updatedAt }
   */
  async getSavedTimeStorage() {
    try {
      if (!BX24) return []

      const storage = await BX24.appOption.get(this.storageName)

      // Если хранилище пустое, возвращаем пустой массив
      if (!storage) return []

      // Парсим JSON, если есть ошибка - возвращаем пустой массив
      try {
        return JSON.parse(storage)
      } catch (e) {
        console.error('Ошибка парсинга хранилища:', e)
        return []
      }
    } catch (error) {
      console.error('Ошибка получения хранилища:', error)
      return []
    }
  }

  /**
   * Сохранение всего хранилища
   * @param {Array} storage - Массив объектов статистики
   * @returns {Promise<boolean>}
   */
  async saveSavedTimeStorage(storage) {
    try {
      if (!BX24) return false

      await BX24.appOption.set(this.storageName, JSON.stringify(storage))
      return true
    } catch (error) {
      console.error('Ошибка сохранения хранилища:', error)
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
      const userStat = storage.find(item => parseInt(item.userId) === parseInt(userId))

      return userStat?.totalTime || 0
    } catch (error) {
      console.error('Ошибка получения времени пользователя:', error)
      return 0
    }
  }

  /**
   * Обновление сохраненного времени пользователя
   * @param {number|string} userId - ID пользователя
   * @param {number} secondsToAdd - Количество секунд для добавления (может быть отрицательным)
   * @returns {Promise<boolean>}
   */
  async updateUserSavedTime(userId, secondsToAdd) {
    try {
      if (!userId || !BX24) {
        console.error('Не указан userId или BX24 не доступен')
        return false
      }

      // Приводим userId к числу
      const numericUserId = parseInt(userId)
      if (isNaN(numericUserId)) return false

      const storage = await this.getSavedTimeStorage()
      let userStat = storage.find(item => parseInt(item.userId) === numericUserId)

      if (userStat) {
        // Обновляем существующую запись
        const newTime = (userStat.totalTime || 0) + secondsToAdd
        userStat.totalTime = newTime < 0 ? 0 : newTime
        userStat.updatedAt = new Date().toISOString()
      } else {
        // Создаем новую запись
        storage.push({
          userId: numericUserId,
          totalTime: secondsToAdd > 0 ? secondsToAdd : 0,
          updatedAt: new Date().toISOString()
        })
      }

      // Сохраняем обновленное хранилище
      await this.saveSavedTimeStorage(storage)

      // Уведомляем об обновлении через глобальное событие
      this.notifyTimeUpdate(numericUserId, secondsToAdd)

      return true
    } catch (error) {
      console.error('Ошибка обновления времени пользователя:', error)
      return false
    }
  }

  /**
   * Установка точного значения времени для пользователя
   * @param {number|string} userId - ID пользователя
   * @param {number} totalTime - Точное значение времени в секундах
   * @returns {Promise<boolean>}
   */
  async setUserSavedTime(userId, totalTime) {
    try {
      if (!userId || !BX24) return false

      const numericUserId = parseInt(userId)
      if (isNaN(numericUserId)) return false

      const storage = await this.getSavedTimeStorage()
      let userStat = storage.find(item => parseInt(item.userId) === numericUserId)

      if (userStat) {
        userStat.totalTime = totalTime < 0 ? 0 : totalTime
        userStat.updatedAt = new Date().toISOString()
      } else {
        storage.push({
          userId: numericUserId,
          totalTime: totalTime < 0 ? 0 : totalTime,
          updatedAt: new Date().toISOString()
        })
      }

      await this.saveSavedTimeStorage(storage)
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

      const storage = await this.getSavedTimeStorage()
      const userIndex = storage.findIndex(item => parseInt(item.userId) === numericUserId)

      if (userIndex !== -1) {
        storage[userIndex].totalTime = 0
        storage[userIndex].updatedAt = new Date().toISOString()
        await this.saveSavedTimeStorage(storage)
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

      await this.saveSavedTimeStorage([])
      this.notifyTimeUpdate('all', 0)

      return true
    } catch (error) {
      console.error('Ошибка сброса времени всех пользователей:', error)
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

    // Также можно использовать CustomEvent для более гибкого уведомления
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