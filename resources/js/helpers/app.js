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

    // Проверяем, содержит ли лицензия один из поддерживаемых постфиксов
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
}

// Создаем и экспортируем экземпляр класса
export const bitrixHelper = new Bitrix24Helper()