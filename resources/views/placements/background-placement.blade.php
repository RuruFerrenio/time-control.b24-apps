<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <script>
      // ==========================================================================
      // КОНСТАНТЫ И КОНФИГУРАЦИЯ
      // ==========================================================================

      const APP_CONFIG = {
        STORAGE_UPDATE_INTERVAL: 10, // секунд
        TIMER_UPDATE_INTERVAL: 1000, // миллисекунд
        DEFAULT_HISTORY_DAYS: 30,
        MIN_HISTORY_DAYS: 1,
        MAX_HISTORY_DAYS: 7,
        MIN_PAGE_TIME_THRESHOLD: 1, // минут
        MAX_PAGE_TIME_THRESHOLD: 60, // минут
        MODAL_WIDTH: 500
      };

      // ==========================================================================
      // КЛАСС: URLProcessor - Обработка URL адресов
      // ==========================================================================

      /**
       * Класс для нормализации и парсинга URL адресов Битрикс24
       */
      class URLProcessor {
        constructor() {
          this.domain = BX24.getDomain();
        }

        /**
         * Нормализует URL: удаляет query параметры и приводит к единому формату
         * @param {string} url - Исходный URL
         * @returns {string|null} Нормализованный URL или null
         */
        normalizeUrl(url) {
          if (!url) return null;

          try {
            if (url.includes('://')) {
              return this._removeQueryParams(url);
            }

            if (url.startsWith('/')) {
              const fullUrl = `https://${this.domain}${url}`;
              return this._removeQueryParams(fullUrl);
            }

            const fullUrl = `https://${this.domain}/${url}`;
            return this._removeQueryParams(fullUrl);

          } catch (error) {
            console.warn('Ошибка нормализации URL:', url, error);
            return this._fallbackNormalization(url);
          }
        }

        /**
         * Удаляет query параметры из URL
         * @private
         */
        _removeQueryParams(url) {
          try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
          } catch (error) {
            return url.split('?')[0];
          }
        }

        /**
         * Запасной метод нормализации при ошибках
         * @private
         */
        _fallbackNormalization(url) {
          const queryIndex = url.indexOf('?');
          let cleanUrl = queryIndex !== -1 ? url.substring(0, queryIndex) : url;

          if (!cleanUrl.startsWith('/')) {
            cleanUrl = '/' + cleanUrl;
          }

          return `https://${this.domain}${cleanUrl}`;
        }

        /**
         * Парсит URL на составные части
         * @param {string} url - URL для парсинга
         * @returns {Object} Объект с частями URL
         */
        parseUrl(url) {
          const normalized = this.normalizeUrl(url);

          if (!normalized) {
            return { path: '', search: '', host: '', fullUrl: '' };
          }

          try {
            const urlObj = new URL(normalized);
            return {
              path: urlObj.pathname,
              search: urlObj.search,
              host: urlObj.host,
              fullUrl: normalized
            };
          } catch (error) {
            return {
              path: normalized.replace(`https://${this.domain}`, ''),
              search: '',
              host: this.domain,
              fullUrl: normalized
            };
          }
        }
      }

      // ==========================================================================
      // КЛАСС: CategoryDetector - Определение категорий страниц
      // ==========================================================================

      /**
       * Класс для определения категории страницы на основе URL
       */
      class CategoryDetector {
        constructor() {
          this.categories = this._initializeCategories();
        }

        /**
         * Инициализирует структуру категорий
         * @private
         */
        _initializeCategories() {
          return {
            'collaboration': {
              name: 'Совместная работа',
              paths: [
                '/stream/',
                '/online/',
                '/company/personal/user/',
                '/calendar/',
                '/docs/',
                '/company/personal/user/[0-9]+/disk/',
                '/workgroups/',
                '/mail/'
              ],
              subcategories: {
                'Лента': ['/stream/'],
                'Мессенджер': ['/online/'],
                'Календарь': ['/company/personal/user/[0-9]+/calendar/', '/calendar/'],
                'Документы онлайн': ['/company/personal/user/[0-9]+/disk/documents/'],
                'Доски': ['/company/personal/user/[0-9]+/disk/boards/'],
                'Диск': ['/docs/', '/company/personal/user/[0-9]+/disk/path/'],
                'Почта': ['/mail/'],
                'Группы': ['/workgroups/']
              }
            },
            'tasks': {
              name: 'Задачи и Проекты',
              paths: [
                '/company/personal/user/[0-9]+/tasks/',
                '/tasks/'
              ],
              subcategories: {
                'Задачи': ['/company/personal/user/[0-9]+/tasks/'],
                'Проекты': ['/company/personal/user/[0-9]+/tasks/projects/'],
                'Потоки': ['/company/personal/user/[0-9]+/tasks/flow/'],
                'Скрам': ['/company/personal/user/[0-9]+/tasks/scrum/'],
                'Занятость': ['/company/personal/user/[0-9]+/tasks/employee/plan/'],
                'Эффективность': ['/company/personal/user/[0-9]+/tasks/effective/'],
                'Шаблоны': ['/company/personal/user/[0-9]+/tasks/templates/'],
                'Корзина': ['/company/personal/user/[0-9]+/tasks/recyclebin/'],
                'Права доступа': ['/tasks/config/permissions/'],
                'Аналитика': ['/bi/dashboard/detail/']
              }
            },
            'warehouse': {
              name: 'Складской учёт',
              paths: ['/shop/documents/inventory/'],
              subcategories: {
                'Складской учёт': ['/shop/documents/inventory/']
              }
            },
            'crm': {
              name: 'CRM',
              paths: [
                '/crm/',
                '/shop/documents/',
                '/sign/',
                '/telephony/',
                '/contact_center/',
                '/saleshub/',
                '/onec/',
                '/market/collection/migration_crm/',
                '/marketplace/configuration/section/vertical_crm/'
              ],
              subcategories: {
                'Лиды': ['/crm/lead/'],
                'Сделки': ['/crm/deal/'],
                'Товары и Склады': ['/crm/catalog/', '/shop/documents/'],
                'Клиенты': ['/crm/contact/', '/crm/company/', '/sign/contact/'],
                'Поставщики': ['/shop/documents/contractors/'],
                'Продажи': [
                  '/telephony/',
                  '/mail/',
                  '/contact_center/',
                  '/crm/button/',
                  '/crm/webform/',
                  '/saleshub/'
                ],
                'Счета': ['/crm/invoice/'],
                'Предложения': ['/crm/quote/'],
                'Коннектор к 1С': ['/onec/'],
                'Мои дела': ['/crm/activity/'],
                'История': ['/crm/history/'],
                'Корзина': ['/crm/recyclebin/'],
                'Настройки CRM': ['/crm/configs/'],
                'Права доступа': ['/crm/perms/'],
                'Аналитика': ['/crm/reports/', '/report/analytics/', '/bi/dashboard/detail/', '/crm/tracking/'],
                'Смарт-процессы': ['/crm/type/']
              }
            },
            'booking': {
              name: 'Онлайн-запись',
              paths: ['/booking/'],
              subcategories: {
                'Онлайн-запись': ['/booking/']
              }
            },
            'sites': {
              name: 'Сайты и Магазины',
              paths: [
                '/sites/',
                '/shop/',
                '/crm/contact/',
                '/crm/company/',
                '/contact_center/',
                '/crm/webform/',
                '/shop/settings/',
                '/shop/buyer_group/',
                '/shop/terminal/'
              ],
              subcategories: {
                'Сайты': ['/sites/'],
                'Магазины': ['/shop/stores/'],
                'Товары и Склады': ['/shop/catalog/', '/shop/documents/'],
                'Клиенты': ['/crm/contact/', '/crm/company/', '/contact_center/'],
                'Формы': ['/crm/webform/'],
                'Платежи и Доставка': [
                  '/shop/settings/sale_pay_system/',
                  '/shop/settings/sale_cashbox/',
                  '/shop/settings/sale_delivery_service/',
                  '/shop/terminal/'
                ],
                'Маркетинг Магазина': ['/marketing/'],
                'Покупатели': ['/shop/settings/sale_buyers/', '/shop/buyer_group/'],
                'Товарный каталог': ['/shop/settings/menu_catalog_'],
                'Экспертные настройки': ['/shop/settings/menu_sale_']
              }
            },
            'bi': {
              name: 'BI Конструктор',
              paths: ['/bi/dashboard'],
              subcategories: {
                'BI Конструктор': ['/bi/dashboard']
              }
            },
            'marketing': {
              name: 'Маркетинг',
              paths: [
                '/marketing/',
                '/marketing/letter/',
                '/marketing/ads/',
                '/marketing/segment/',
                '/marketing/rc/',
                '/marketing/toloka/',
                '/marketing/template/',
                '/marketing/blacklist/',
                '/marketing/contact/',
                '/marketing/config/'
              ],
              subcategories: {
                'Старт': ['/marketing/'],
                'Рассылки': ['/marketing/letter/'],
                'Реклама': ['/marketing/ads/'],
                'Сегменты': ['/marketing/segment/'],
                'Генератор продаж': ['/marketing/rc/'],
                'Яндекс.Толока': ['/marketing/toloka/'],
                'Мои шаблоны': ['/marketing/template/'],
                'Черный список': ['/marketing/blacklist/'],
                'Список адресов': ['/marketing/contact/'],
                'Настройки': ['/marketing/config.php'],
                'Права доступа': ['/marketing/config/role/']
              }
            },
            'collabs': {
              name: 'Коллабы',
              paths: ['/online/?IM_COLLAB'],
              subcategories: {
                'Коллабы': ['/online/?IM_COLLAB']
              }
            },
            'kedo': {
              name: 'КЭДО + Госключ',
              paths: ['/sign/b2e/'],
              subcategories: {
                'КЭДО + Госключ': ['/sign/b2e/']
              }
            },
            'signature': {
              name: 'Подпись',
              paths: ['/sign/'],
              subcategories: {
                'Подпись': ['/sign/']
              }
            },
            'automation': {
              name: 'Автоматизация',
              paths: [
                '/rpa/',
                '/automation/',
                '/ai/',
                '/market/category/automated_solutions_seats/'
              ],
              subcategories: {
                'Роботы и триггеры': ['/crm/', '/company/personal/user/[0-9]+/tasks/', '/sign/'],
                'Цифровые рабочие места': ['/market/category/automated_solutions_seats/', '/automation/type/automated_solution/'],
                'RPA': ['/rpa/'],
                'Коннектор к 1С': ['/onec/'],
                'Умные сценарии': ['/crm/deal/', '/crm/contact/', '/crm/company/'],
                'Списки': ['/lists/'],
                'Лаборатория AI': ['/ai/'],
                'Аналитика': ['/bi/dashboard/detail/']
              }
            },
            'marketplace': {
              name: 'Маркетплейс',
              paths: [
                '/market/',
                '/marketplace/',
                '/devops/'
              ],
              subcategories: {
                'Все приложения': ['/market/'],
                'Установленные': ['/market/installed/'],
                'Разработчикам': ['/devops/'],
                'Приложения': ['/marketplace/app/']
              }
            },
            'developers': {
              name: 'Разработчикам',
              paths: ['/devops/'],
              subcategories: {
                'Готовые сценарии': ['/devops/'],
                'Интеграции': ['/devops/list/'],
                'Статистика': ['/devops/statistic/'],
                'Документация': ['https://apidocs.bitrix24.ru/']
              }
            },
            'mcp': {
              name: 'MCP-подключения',
              paths: ['/mcp/'],
              subcategories: {
                'MCP-подключения': ['/mcp/']
              }
            },
            'employees': {
              name: 'Сотрудники',
              paths: [
                '/company/',
                '/hr/',
                '/timeman/',
                '/kb/',
                '/conference/'
              ],
              subcategories: {
                'Сотрудники': ['/company/'],
                'Структура компании': ['/hr/structure/'],
                'Время и Отчеты': ['/timeman/'],
                'База знаний': ['/kb/'],
                'Видеоконференции': ['/conference/']
              }
            },
            'tariff': {
              name: 'Мой тариф',
              paths: [
                '/settings/license',
                '/settings/partner_order',
                '/settings/support',
                '/settings/order'
              ],
              subcategories: {
                'Мой тариф': ['/settings/license.php'],
                'Расширенные тарифы': ['/settings/license_all.php'],
                'Заказать внедрение': ['/settings/partner_order.php'],
                'Демо': ['/settings/license_demo.php'],
                'Поддержка24': ['/settings/support.php'],
                'История заказов': ['/settings/order/']
              }
            }
          };
        }

        /**
         * Определяет категорию страницы по URL
         * @param {string} url - URL страницы
         * @returns {string|null} Название категории или null
         */
        getCategory(url) {
          if (!url) return null;

          const urlProcessor = new URLProcessor();
          const { path } = urlProcessor.parseUrl(url);

          const matchedCategory = this._findMatchingCategory(path);

          if (matchedCategory) {
            return matchedCategory;
          }

          return this._handleSpecialCases(url, path);
        }

        /**
         * Ищет категорию по пути
         * @private
         */
        _findMatchingCategory(path) {
          for (const [categoryKey, category] of Object.entries(this.categories)) {
            for (const categoryPath of category.paths) {
              const pattern = categoryPath.replace('[0-9]+', '\\d+');
              const regex = new RegExp(`^${pattern}`);

              if (regex.test(path)) {
                return this._findSubcategory(path, category) || category.name;
              }
            }
          }
          return null;
        }

        /**
         * Ищет подкатегорию
         * @private
         */
        _findSubcategory(path, category) {
          for (const [subcategoryName, subcategoryPaths] of Object.entries(category.subcategories)) {
            for (const subcategoryPath of subcategoryPaths) {
              const subPattern = subcategoryPath.replace('[0-9]+', '\\d+');
              const subRegex = new RegExp(`^${subPattern}`);

              if (subRegex.test(path)) {
                return `${category.name} › ${subcategoryName}`;
              }
            }
          }
          return null;
        }

        /**
         * Обрабатывает специальные случаи URL
         * @private
         */
        _handleSpecialCases(url, path) {
          if (path.includes('/bi/dashboard/detail/')) {
            return this._handleBiDashboardCategory(url);
          }

          if (path.includes('/market/collection/')) {
            return 'Маркетплейс';
          }

          if (path.includes('/crm/configs/')) {
            return 'CRM › Настройки CRM';
          }

          if (path.includes('/crm/reports/report/')) {
            return 'CRM › Аналитика › Конструктор отчётов';
          }

          return null;
        }

        /**
         * Определяет категорию для BI дашборда
         * @private
         */
        _handleBiDashboardCategory(url) {
          const categoryMatch = url.match(/scope=([^&]+)/);

          if (categoryMatch) {
            const scope = categoryMatch[1];

            const scopeToCategory = {
              'crm': 'CRM › Аналитика',
              'tasks': 'Задачи и Проекты › Аналитика',
              'shop': 'Сайты и Магазины › Аналитика',
              'bizproc': 'Автоматизация › Аналитика'
            };

            return scopeToCategory[scope] || 'BI Конструктор';
          }

          return 'BI Конструктор';
        }
      }

      // ==========================================================================
      // КЛАСС: UserManager - Управление пользователем
      // ==========================================================================

      /**
       * Класс для работы с профилем пользователя
       */
      class UserManager {
        constructor() {
          this.profile = null;
        }

        /**
         * Получает профиль текущего пользователя
         * @returns {Promise<Object>} Профиль пользователя
         */
        async fetchProfile() {
          return new Promise((resolve, reject) => {
            BX24.callMethod("profile", {}, (result) => {
              if (result.error()) {
                console.error('Ошибка при получении профиля пользователя:', result.error());
                reject(result.error());
              } else {
                const userData = result.data();
                userData.FULL_NAME = this.getFullName(userData);
                this.profile = userData;
                resolve(userData);
              }
            });
          });
        }

        /**
         * Возвращает полное имя пользователя
         * @param {Object} profile - Профиль пользователя
         * @returns {string} Полное имя
         */
        getFullName(profile = null) {
          const user = profile || this.profile;

          if (!user) return 'Неизвестный';

          const firstName = user.NAME || '';
          const lastName = user.LAST_NAME || '';
          const fullName = `${firstName} ${lastName}`.trim();

          return fullName || user.EMAIL || 'Пользователь';
        }

        /**
         * Возвращает ID текущего пользователя
         * @returns {string|null} ID пользователя
         */
        getUserId() {
          return this.profile ? this.profile.ID : null;
        }
      }

      // ==========================================================================
      // КЛАСС: SettingsManager - Управление настройками
      // ==========================================================================

      /**
       * Класс для работы с настройками приложения
       */
      class SettingsManager {
        constructor() {
          this.keys = this._initializeSettingsKeys();
          this.settings = this._initializeDefaultSettings();
        }

        /**
         * Инициализирует ключи настроек
         * @private
         */
        _initializeSettingsKeys() {
          return {
            PAGE_TRACKING_ENABLED: 'page_tracking_enabled',
            PAGE_TRACKING_HISTORY_DAYS: 'page_tracking_history_days',
            PRESENCE_CONTROL_ENABLED: 'presence_control_enabled',
            PRESENCE_PAGE_TIME_THRESHOLD: 'presence_page_time_threshold',
            WORKDAY_START_ENABLED: 'workday_start_enabled',
            WORKDAY_START_METHOD: 'workday_start_method',
            WORKDAY_END_ENABLED: 'workday_end_enabled',
            WORKDAY_END_METHOD: 'workday_end_method'
          };
        }

        /**
         * Инициализирует настройки по умолчанию
         * @private
         */
        _initializeDefaultSettings() {
          return {
            pageTracking: {
              enabled: false,
              historyDays: APP_CONFIG.DEFAULT_HISTORY_DAYS
            },
            presenceControl: {
              enabled: false,
              pageTimeThreshold: 5 // в минутах
            },
            workdayStart: {
              enabled: false,
              method: 'modal' // 'modal' или 'auto'
            },
            workdayEnd: {
              enabled: false,
              method: 'modal' // 'modal' или 'auto'
            }
          };
        }

        /**
         * Загружает настройки из хранилища приложения
         * @returns {Promise<boolean>} Успешность загрузки
         */
        async load() {
          try {
            const settingsPromises = [
              BX24.appOption.get(this.keys.PAGE_TRACKING_ENABLED),
              BX24.appOption.get(this.keys.PAGE_TRACKING_HISTORY_DAYS),
              BX24.appOption.get(this.keys.PRESENCE_CONTROL_ENABLED),
              BX24.appOption.get(this.keys.PRESENCE_PAGE_TIME_THRESHOLD),
              BX24.appOption.get(this.keys.WORKDAY_START_ENABLED),
              BX24.appOption.get(this.keys.WORKDAY_START_METHOD),
              BX24.appOption.get(this.keys.WORKDAY_END_ENABLED),
              BX24.appOption.get(this.keys.WORKDAY_END_METHOD)
            ];

            const [
              pageTrackingEnabled,
              historyDays,
              presenceEnabled,
              pageTimeThreshold,
              workdayStartEnabled,
              workdayStartMethod,
              workdayEndEnabled,
              workdayEndMethod
            ] = await Promise.all(settingsPromises);

            this._parseBooleanSettings({
              pageTrackingEnabled,
              presenceEnabled,
              workdayStartEnabled,
              workdayEndEnabled
            });

            this._parseWorkdayMethods(workdayStartMethod, workdayEndMethod);
            this._parseHistoryDays(historyDays);
            this._parsePageTimeThreshold(pageTimeThreshold);

            return true;
          } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            return false;
          }
        }

        /**
         * Парсит булевы настройки
         * @private
         */
        _parseBooleanSettings({ pageTrackingEnabled, presenceEnabled, workdayStartEnabled, workdayEndEnabled }) {
          this.settings.pageTracking.enabled = this._parseBooleanValue(pageTrackingEnabled);
          this.settings.presenceControl.enabled = this._parseBooleanValue(presenceEnabled);
          this.settings.workdayStart.enabled = this._parseBooleanValue(workdayStartEnabled);
          this.settings.workdayEnd.enabled = this._parseBooleanValue(workdayEndEnabled);
        }

        /**
         * Преобразует значение в булево
         * @private
         */
        _parseBooleanValue(value) {
          return value === 'Y' || value === true || value === 1;
        }

        /**
         * Парсит методы начала/окончания рабочего дня
         * @private
         */
        _parseWorkdayMethods(startMethod, endMethod) {
          const validMethods = ['modal', 'auto'];

          if (startMethod && validMethods.includes(startMethod)) {
            this.settings.workdayStart.method = startMethod;
          }

          if (endMethod && validMethods.includes(endMethod)) {
            this.settings.workdayEnd.method = endMethod;
          }
        }

        /**
         * Парсит количество дней истории
         * @private
         */
        _parseHistoryDays(historyDays) {
          if (!historyDays) return;

          try {
            const days = parseInt(historyDays);
            if (!isNaN(days) && days >= APP_CONFIG.MIN_HISTORY_DAYS && days <= APP_CONFIG.MAX_HISTORY_DAYS) {
              this.settings.pageTracking.historyDays = days;
            }
          } catch (error) {
            console.warn('Ошибка парсинга historyDays:', error);
          }
        }

        /**
         * Парсит порог времени на странице
         * @private
         */
        _parsePageTimeThreshold(pageTimeThreshold) {
          if (!pageTimeThreshold) return;

          try {
            const minutes = parseInt(pageTimeThreshold);
            if (!isNaN(minutes) && minutes >= APP_CONFIG.MIN_PAGE_TIME_THRESHOLD && minutes <= APP_CONFIG.MAX_PAGE_TIME_THRESHOLD) {
              this.settings.presenceControl.pageTimeThreshold = minutes;
            }
          } catch (error) {
            console.warn('Ошибка парсинга pageTimeThreshold:', error);
          }
        }

        // ===== Геттеры настроек =====

        isPageTrackingEnabled() {
          return this.settings.pageTracking.enabled;
        }

        isPresenceControlEnabled() {
          return this.settings.presenceControl.enabled;
        }

        isWorkdayStartEnabled() {
          return this.settings.workdayStart.enabled;
        }

        isWorkdayStartAuto() {
          return this.settings.workdayStart.enabled && this.settings.workdayStart.method === 'auto';
        }

        isWorkdayStartModal() {
          return this.settings.workdayStart.enabled && this.settings.workdayStart.method === 'modal';
        }

        isWorkdayEndEnabled() {
          return this.settings.workdayEnd.enabled;
        }

        isWorkdayEndAuto() {
          return this.settings.workdayEnd.enabled && this.settings.workdayEnd.method === 'auto';
        }

        isWorkdayEndModal() {
          return this.settings.workdayEnd.enabled && this.settings.workdayEnd.method === 'modal';
        }

        getPageTimeThresholdSeconds() {
          return this.settings.presenceControl.pageTimeThreshold * 60;
        }

        getHistoryDays() {
          return this.settings.pageTracking.historyDays;
        }
      }

      // ==========================================================================
      // КЛАСС: StorageManager - Управление хранилищем
      // ==========================================================================

      /**
       * Класс для работы с сущностями Bitrix24
       */
      class StorageManager {
        constructor() {
          this.entityId = 'pr_tracking';
          this.properties = {
            USER_ID: 'USER_ID',
            USER_NAME: 'USER_NAME',
            PAGE_URL: 'PAGE_URL',
            PAGE_TITLE: 'PAGE_TITLE',
            PAGE_TIME: 'PAGE_TIME',
            PAGE_CATEGORY: 'PAGE_CATEGORY'
          };
          this.currentSectionId = null;
          this.currentItemId = null;
          this.urlProcessor = new URLProcessor();
          this.categoryDetector = new CategoryDetector();
        }

        /**
         * Проверяет существование хранилища
         * @returns {Promise<boolean>}
         */
        async checkExists() {
          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.get', {}, (result) => {
              if (result.error()) {
                console.error('Ошибка при проверке хранилищ:', result.error());
                reject(result.error());
              } else {
                const entities = result.data();
                const exists = entities.some(entity => entity.ENTITY === this.entityId);
                resolve(exists);
              }
            });
          });
        }

        /**
         * Очищает старые секции
         * @param {number} historyDays - Количество дней для хранения
         * @returns {Promise<number>} Количество удаленных секций
         */
        async cleanupOldSections(historyDays) {
          const cutoffDate = this._calculateCutoffDate(historyDays);
          const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

          try {
            const sections = await this.getAllSections();
            const oldSections = sections.filter(section => {
              const sectionDate = new Date(section.NAME + 'T00:00:00');
              return sectionDate < cutoffDate;
            });

            for (const section of oldSections) {
              await this.deleteSection(section.ID);
              console.log(`Удалена старая секция: ${section.NAME} (ID: ${section.ID})`);
            }

            return oldSections.length;
          } catch (error) {
            console.error('Ошибка при очистке старых секций:', error);
            return 0;
          }
        }

        /**
         * Вычисляет дату отсечки
         * @private
         */
        _calculateCutoffDate(historyDays) {
          const today = new Date();
          const cutoffDate = new Date(today);
          cutoffDate.setDate(today.getDate() - historyDays);
          return cutoffDate;
        }

        /**
         * Получает все секции
         * @returns {Promise<Array>}
         */
        getAllSections() {
          return this._callMethod('entity.section.get', { ENTITY: this.entityId });
        }

        /**
         * Удаляет секцию
         * @param {string} sectionId - ID секции
         * @returns {Promise}
         */
        deleteSection(sectionId) {
          return this._callMethod('entity.section.delete', {
            ENTITY: this.entityId,
            ID: sectionId
          });
        }

        /**
         * Получает или создает секцию для сегодняшнего дня
         * @returns {Promise<string>} ID секции
         */
        async getOrCreateTodaySection() {
          const today = new Date().toISOString().split('T')[0];

          try {
            const sections = await this._callMethod('entity.section.get', {
              ENTITY: this.entityId,
              FILTER: { NAME: today }
            });

            if (sections.length > 0) {
              this.currentSectionId = sections[0].ID;
              return this.currentSectionId;
            }

            const newSectionId = await this._callMethod('entity.section.add', {
              ENTITY: this.entityId,
              NAME: today
            });

            this.currentSectionId = newSectionId;
            return this.currentSectionId;
          } catch (error) {
            console.error('Ошибка при работе с секцией:', error);
            throw error;
          }
        }

        /**
         * Ищет элемент по пользователю и URL
         * @param {string} userId - ID пользователя
         * @param {string} pageUrl - URL страницы
         * @returns {Promise<string|null>} ID элемента или null
         */
        async findItemByUserAndUrl(userId, pageUrl) {
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);

          try {
            const items = await this._callMethod('entity.item.get', {
              ENTITY: this.entityId,
              FILTER: {
                SECTION_ID: this.currentSectionId,
                PROPERTY_USER_ID: userId,
                PROPERTY_PAGE_URL: normalizedUrl,
              }
            });

            if (items.length > 0) {
              this.currentItemId = items[0].ID;
              return this.currentItemId;
            }

            return null;
          } catch (error) {
            console.error('Ошибка при поиске элемента:', error);
            throw error;
          }
        }

        /**
         * Создает новый элемент
         * @param {Object} userProfile - Профиль пользователя
         * @param {string} pageUrl - URL страницы
         * @param {string} pageTitle - Заголовок страницы
         * @returns {Promise<string>} ID созданного элемента
         */
        async createNewItem(userProfile, pageUrl, pageTitle = '') {
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);
          const category = this.categoryDetector.getCategory(pageUrl);
          const userName = this._formatUserName(userProfile);

          try {
            const itemId = await this._callMethod('entity.item.add', {
              ENTITY: this.entityId,
              NAME: `${userName} - ${category || 'Неизвестная категория'}`,
              SECTION: this.currentSectionId,
              PROPERTY_VALUES: {
                USER_ID: userProfile.ID,
                USER_NAME: userName,
                PAGE_URL: normalizedUrl,
                PAGE_TITLE: pageTitle || document.title || '',
                PAGE_TIME: 0,
                PAGE_CATEGORY: category
              }
            });

            this.currentItemId = itemId;
            return this.currentItemId;
          } catch (error) {
            console.error('Ошибка при создании элемента:', error);
            throw error;
          }
        }

        /**
         * Форматирует имя пользователя
         * @private
         */
        _formatUserName(userProfile) {
          return `${userProfile.NAME || ''} ${userProfile.LAST_NAME || ''}`.trim() ||
            userProfile.EMAIL ||
            'Пользователь';
        }

        /**
         * Загружает время элемента
         * @param {string} itemId - ID элемента
         * @returns {Promise<number>} Сохраненное время в секундах
         */
        async loadItemTime(itemId) {
          try {
            const items = await this._callMethod('entity.item.get', {
              ENTITY: this.entityId,
              SELECT: ['PROPERTY_VALUES'],
              FILTER: { ID: itemId }
            });

            const savedTime = parseInt(items[0].PROPERTY_VALUES?.PAGE_TIME || 0);
            return savedTime;
          } catch (error) {
            console.error('Ошибка при загрузке элемента:', error);
            throw error;
          }
        }

        /**
         * Обновляет время элемента
         * @param {Object} userProfile - Профиль пользователя
         * @param {string} pageUrl - URL страницы
         * @param {string} pageTitle - Заголовок страницы
         * @param {number} storedTime - Ранее сохраненное время
         * @param {number} sessionTime - Время текущей сессии
         * @returns {Promise<number>} Новое общее время
         */
        async updateItemTime(userProfile, pageUrl, pageTitle, storedTime, sessionTime) {
          if (!this.currentItemId) {
            console.error('Нет активного элемента для обновления');
            return storedTime;
          }

          const newTotalTime = storedTime + sessionTime;
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);
          const category = this.categoryDetector.getCategory(pageUrl);
          const userName = this._formatUserName(userProfile);

          try {
            await this._callMethod('entity.item.update', {
              ENTITY: this.entityId,
              ID: this.currentItemId,
              PROPERTY_VALUES: {
                USER_NAME: userName,
                PAGE_URL: normalizedUrl,
                PAGE_TITLE: pageTitle || document.title || '',
                PAGE_TIME: newTotalTime,
                PAGE_CATEGORY: category
              }
            });

            return newTotalTime;
          } catch (error) {
            console.error('Ошибка при обновлении элемента:', error);
            throw error;
          }
        }

        /**
         * Универсальный метод для вызовов BX24
         * @private
         */
        _callMethod(method, params) {
          return new Promise((resolve, reject) => {
            BX24.callMethod(method, params, (result) => {
              if (result.error()) {
                reject(result.error());
              } else {
                resolve(result.data());
              }
            });
          });
        }
      }

      // ==========================================================================
      // КЛАСС: SessionTimer - Таймер сессии
      // ==========================================================================

      /**
       * Класс для управления таймером сессии на странице
       */
      class SessionTimer {
        constructor() {
          this.sessionTime = 0;
          this.sessionStartTime = 0;
          this.isPageHidden = false;
          this.timer = null;
          this.updateInterval = APP_CONFIG.TIMER_UPDATE_INTERVAL;
        }

        /**
         * Запускает сессию
         */
        startSession() {
          this.sessionStartTime = Date.now();
          this.sessionTime = 0;
        }

        /**
         * Обновляет время сессии
         * @returns {number} Текущее время сессии
         */
        updateSessionTime() {
          if (!this.isPageHidden) {
            this.sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
          }
          return this.sessionTime;
        }

        /**
         * Сбрасывает сессию
         */
        resetSession() {
          this.sessionTime = 0;
          this.sessionStartTime = Date.now();
        }

        /**
         * Возвращает текущее время сессии
         * @returns {number}
         */
        getSessionTime() {
          return this.sessionTime;
        }

        /**
         * Отмечает страницу как скрытую
         */
        markPageHidden() {
          this.isPageHidden = true;
        }

        /**
         * Отмечает страницу как видимую
         */
        markPageVisible() {
          this.isPageHidden = false;
          this.resetSession();
        }

        /**
         * Запускает таймер
         * @param {Function} callback - Функция обратного вызова
         */
        startTimer(callback) {
          this.stopTimer();
          this.timer = setInterval(() => {
            this.updateSessionTime();
            callback(this.sessionTime);
          }, this.updateInterval);
        }

        /**
         * Останавливает таймер
         */
        stopTimer() {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }
      }

      // ==========================================================================
      // КЛАСС: WorkdayManager - Управление рабочим днем (исправленная версия)
      // ==========================================================================

      /**
       * Класс для работы с функциями рабочего дня
       */
      class WorkdayManager {
        constructor(userManager) {
          this.userManager = userManager;
          this.workdayStatus = null;
          this.workdayInfo = null;
          this.workdaySettings = null;
        }

        /**
         * Проверяет статус рабочего дня
         * Возможные статусы:
         * - OPENED - рабочий день открыт
         * - CLOSED - рабочий день закрыт
         * - PAUSED - рабочий день на паузе
         * - EXPIRED - рабочий день просрочен (не закрыт вовремя)
         * @returns {Promise<Object>} Статус рабочего дня
         */
        async checkWorkdayStatus() {
          return new Promise((resolve, reject) => {
            BX24.callMethod('timeman.status', {}, (result) => {
              if (result.error()) {
                console.error('Ошибка при проверке статуса рабочего дня:', result.error());
                reject(result.error());
              } else {
                const status = result.data();
                this.workdayStatus = status ? status.STATUS : null;
                this.workdayInfo = status;
                resolve(status);
              }
            });
          });
        }

        /**
         * Проверяет, открыт ли рабочий день (статус OPENED)
         * @returns {boolean}
         */
        isWorkdayOpened() {
          return this.workdayStatus === 'OPENED';
        }

        /**
         * Проверяет, закрыт ли рабочий день (статус CLOSED)
         * @returns {boolean}
         */
        isWorkdayClosed() {
          return this.workdayStatus === 'CLOSED';
        }

        /**
         * Проверяет, находится ли рабочий день на паузе
         * @returns {boolean}
         */
        isWorkdayPaused() {
          return this.workdayStatus === 'PAUSED';
        }

        /**
         * Проверяет, просрочен ли рабочий день
         * @returns {boolean}
         */
        isWorkdayExpired() {
          return this.workdayStatus === 'EXPIRED';
        }

        /**
         * Проверяет, можно ли начать рабочий день (статус CLOSED)
         * @returns {boolean}
         */
        canStartWorkday() {
          return this.isWorkdayClosed();
        }

        /**
         * Проверяет, можно ли завершить рабочий день (статус OPENED или EXPIRED)
         * @returns {boolean}
         */
        canEndWorkday() {
          return this.isWorkdayOpened() || this.isWorkdayExpired();
        }

        /**
         * Получает настройки рабочего времени пользователя
         * @returns {Promise<Object>} Настройки рабочего времени
         */
        async getWorkdaySettings() {
          const userId = this.userManager.getUserId();

          return new Promise((resolve, reject) => {
            BX24.callMethod('timeman.settings', {
              USER_ID: userId
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при получении настроек рабочего времени:', result.error());
                reject(result.error());
              } else {
                this.workdaySettings = result.data();
                resolve(result.data());
              }
            });
          });
        }

        /**
         * Проверяет, находится ли текущее время в рамках рабочего дня
         * @returns {Promise<boolean>} true если рабочее время
         */
        async isCurrentTimeWithinWorkHours() {
          try {
            const settings = await this.getWorkdaySettings();

            if (!this._isWorkTimeTrackingEnabled(settings)) {
              console.log('Учет рабочего времени не включен для пользователя');
              return true;
            }

            if (settings.UF_TM_FREE) {
              console.log('У пользователя свободный график');
              return true;
            }

            return this._isWithinWorkHours(settings);
          } catch (error) {
            console.error('Ошибка при проверке рабочего времени:', error);
            return true; // В случае ошибки считаем что рабочее время
          }
        }

        /**
         * Проверяет, включен ли учет рабочего времени
         * @private
         */
        _isWorkTimeTrackingEnabled(settings) {
          return settings && settings.UF_TIMEMAN;
        }

        /**
         * Проверяет нахождение в рабочем интервале
         * @private
         */
        _isWithinWorkHours(settings) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();

          const maxStartMinutes = this._parseTimeToMinutes(settings.UF_TM_MAX_START);
          const minFinishMinutes = this._parseTimeToMinutes(settings.UF_TM_MIN_FINISH);

          if (!maxStartMinutes || !minFinishMinutes) {
            console.log('Не удалось распарсить время начала/окончания');
            return true;
          }

          const isWorkTime = currentTime >= maxStartMinutes && currentTime <= minFinishMinutes;

          console.log('Проверка рабочего времени:', {
            currentTime: `${Math.floor(currentTime / 60)}:${currentTime % 60}`,
            maxStart: settings.UF_TM_MAX_START,
            minFinish: settings.UF_TM_MIN_FINISH,
            isWorkTime
          });

          return isWorkTime;
        }

        /**
         * Парсит время из строки в минуты
         * @private
         */
        _parseTimeToMinutes(timeStr) {
          if (!timeStr) return null;
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        }

        /**
         * Форматирует дату в формат ATOM
         * @param {Date} date - Дата
         * @returns {string} Дата в формате ATOM
         */
        formatDateToATOM(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          const timezoneOffset = date.getTimezoneOffset();
          const absOffset = Math.abs(timezoneOffset);
          const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
          const offsetMinutes = String(absOffset % 60).padStart(2, '0');
          const offsetSign = timezoneOffset <= 0 ? '+' : '-';

          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
        }

        /**
         * Начинает рабочий день
         * @returns {Promise<Object>} Результат начала рабочего дня
         */
        async startWorkday() {
          return new Promise((resolve, reject) => {
            try {
              const params = this._buildWorkdayParams();

              console.log('Отправка запроса timeman.open с параметрами:', params);

              BX24.callMethod('timeman.open', params, (result) => {
                if (result.error()) {
                  console.error('Ошибка при начале рабочего дня:', result.error());
                  reject(result.error());
                } else {
                  this.workdayStatus = 'OPENED';
                  this.workdayInfo = result.data();
                  console.log('✅ Рабочий день успешно начат:', result.data());
                  resolve(result.data());
                }
              });
            } catch (error) {
              console.error('❌ Исключение при начале рабочего дня:', error);
              reject(error);
            }
          });
        }

        /**
         * Завершает рабочий день
         * @returns {Promise<Object>} Результат завершения рабочего дня
         */
        async endWorkday() {
          return new Promise((resolve, reject) => {
            try {
              const params = this._buildWorkdayParams();

              console.log('Отправка запроса timeman.close с параметрами:', params);

              BX24.callMethod('timeman.close', params, (result) => {
                if (result.error()) {
                  console.error('Ошибка при завершении рабочего дня:', result.error());
                  reject(result.error());
                } else {
                  this.workdayStatus = 'CLOSED';
                  this.workdayInfo = result.data();
                  console.log('✅ Рабочий день успешно завершен:', result.data());
                  resolve(result.data());
                }
              });
            } catch (error) {
              console.error('❌ Исключение при завершении рабочего дня:', error);
              reject(error);
            }
          });
        }

        /**
         * Формирует параметры для методов рабочего дня
         * @private
         */
        _buildWorkdayParams() {
          const params = {};
          const userId = this.userManager.getUserId();

          if (userId && parseInt(userId) > 0) {
            params.USER_ID = parseInt(userId);
          }

          return params;
        }

        /**
         * Проверяет и запускает рабочий день если нужно (только если статус CLOSED)
         * @returns {Promise<boolean>} true если день был запущен
         */
        async ensureWorkdayStarted() {
          try {
            await this.checkWorkdayStatus();
            console.log('Текущий статус рабочего дня:', this.workdayStatus);

            if (!this.canStartWorkday()) {
              console.log(`ℹ️ Рабочий день нельзя начать: текущий статус ${this.workdayStatus}`);
              return false;
            }

            console.log('🚀 Попытка автоматического старта рабочего дня...');
            await this.startWorkday();
            console.log('✅ Рабочий день автоматически стартован');
            return true;

          } catch (error) {
            console.error('❌ Ошибка при автоматическом старте рабочего дня:', error);
            return false;
          }
        }

        /**
         * Проверяет и завершает рабочий день если нужно (только если статус OPENED)
         * @returns {Promise<boolean>} true если день был завершен
         */
        async ensureWorkdayEnded() {
          try {
            await this.checkWorkdayStatus();
            console.log('Текущий статус рабочего дня:', this.workdayStatus);

            if (!this.isWorkdayOpened()) {
              console.log(`ℹ️ Рабочий день нельзя завершить: текущий статус ${this.workdayStatus} (нужен OPENED)`);
              return false;
            }

            console.log('🚀 Попытка автоматического завершения рабочего дня...');
            await this.endWorkday();
            console.log('✅ Рабочий день автоматически завершен');
            return true;

          } catch (error) {
            console.error('❌ Ошибка при автоматическом завершении рабочего дня:', error);
            return false;
          }
        }
      }

      // ==========================================================================
      // КЛАСС: PageTrackerApp - Главный класс приложения (исправленная версия)
      // ==========================================================================

      /**
       * Главный класс приложения для отслеживания страниц
       */
      class PageTrackerApp {
        constructor() {
          this.urlProcessor = new URLProcessor();
          this.categoryDetector = new CategoryDetector();
          this.userManager = new UserManager();
          this.settingsManager = new SettingsManager();
          this.storageManager = new StorageManager();
          this.sessionTimer = new SessionTimer();
          this.workdayManager = new WorkdayManager(this.userManager);

          this.currentUrl = null;
          this.applicationOpened = false;
          this.storedTime = 0;
          this.initialized = false;
          this.lastUpdateTime = 0;
          this.workdayCheckDone = false;
          this.isWithinWorkHours = true;
        }

        /**
         * Инициализирует приложение
         */
        async initialize() {
          if (this.initialized) return;

          try {
            this._setCurrentUrl();
            await this.settingsManager.load();

            if (!this.settingsManager.isPageTrackingEnabled()) {
              console.log('Отслеживание страниц отключено в настройках');
              return;
            }

            await this.userManager.fetchProfile();
            await this._checkWorkHoursAndWorkday();
            await this._initializeStorageWithCleanup();

            this.setupEventListeners();
            this.startMainTimer();

            this.initialized = true;

          } catch (error) {
            console.error('Ошибка инициализации:', error);
          }
        }

        /**
         * Устанавливает текущий URL
         * @private
         */
        _setCurrentUrl() {
          this.currentUrl = <?php echo json_encode($clientUrl ?? null, 15, 512) ?> || window.location.href;
        }

        /**
         * Проверяет рабочее время и управляет рабочим днем
         * @private
         */
        async _checkWorkHoursAndWorkday() {
          this.isWithinWorkHours = await this.workdayManager.isCurrentTimeWithinWorkHours();
          console.log('Текущее время:', this.isWithinWorkHours ? 'РАБОЧЕЕ' : 'НЕРАБОЧЕЕ');

          if (this.workdayCheckDone) return;

          // Получаем актуальный статус рабочего дня
          await this.workdayManager.checkWorkdayStatus();

          await this._handleWorkdayBasedOnStatus();
          this.workdayCheckDone = true;
        }

        /**
         * Обрабатывает начало/завершение рабочего дня на основе статуса
         * @private
         */
        async _handleWorkdayBasedOnStatus() {
          const status = this.workdayManager.workdayStatus;
          console.log('Обработка рабочего дня на основе статуса:', status);

          // Начало рабочего дня - только если статус CLOSED
          if (this.settingsManager.isWorkdayStartEnabled() &&
            this.workdayManager.canStartWorkday()) {

            if (this.isWithinWorkHours) {
              // В рабочее время - предлагаем начать день
              await this._handleWorkdayStart();
            }
          }

          // Завершение рабочего дня - только если статус OPENED
          if (this.settingsManager.isWorkdayEndEnabled() &&
            this.workdayManager.isWorkdayOpened()) {

            if (!this.isWithinWorkHours) {
              // В нерабочее время - предлагаем завершить день
              await this._handleWorkdayEnd();
            }
          }
        }

        /**
         * Обрабатывает начало рабочего дня
         * @private
         */
        async _handleWorkdayStart() {
          if (this.settingsManager.isWorkdayStartAuto()) {
            await this.workdayManager.ensureWorkdayStarted();
          } else if (this.settingsManager.isWorkdayStartModal()) {
            this.openWorkdayStartModal();
          }
        }

        /**
         * Обрабатывает завершение рабочего дня
         * @private
         */
        async _handleWorkdayEnd() {
          if (this.settingsManager.isWorkdayEndAuto()) {
            await this.workdayManager.ensureWorkdayEnded();
          } else if (this.settingsManager.isWorkdayEndModal()) {
            this.openWorkdayEndModal();
          }
        }

        /**
         * Инициализирует хранилище с очисткой
         * @private
         */
        async _initializeStorageWithCleanup() {
          const storageExists = await this.storageManager.checkExists();
          if (!storageExists) {
            throw new Error('Хранилище не существует. Обратитесь к администратору.');
          }

          const historyDays = this.settingsManager.getHistoryDays();
          await this.storageManager.cleanupOldSections(historyDays);

          await this._initializeStorage();
        }

        /**
         * Инициализирует хранилище для текущей страницы
         * @private
         */
        async _initializeStorage() {
          try {
            await this.storageManager.getOrCreateTodaySection();

            const userId = this.userManager.getUserId();
            const itemId = await this.storageManager.findItemByUserAndUrl(userId, this.currentUrl);

            if (itemId) {
              const savedTime = await this.storageManager.loadItemTime(itemId);
              this.storedTime = savedTime;
            } else {
              const userProfile = this.userManager.profile;
              await this.storageManager.createNewItem(userProfile, this.currentUrl, document.title);
            }

            this.sessionTimer.startSession();

          } catch (error) {
            console.error('Ошибка инициализации хранилища:', error);
          }
        }

        // ===== Методы для работы с модальными окнами =====

        /**
         * Открывает модальное окно начала рабочего дня
         */
        openWorkdayStartModal() {
          if (this.applicationOpened) return;

          // Дополнительная проверка перед открытием
          if (!this.workdayManager.canStartWorkday()) {
            console.log('Нельзя открыть модалку начала дня: статус не CLOSED');
            return;
          }

          this.applicationOpened = true;

          const alertaParameters = this._buildWorkdayModalParams('workdaystart', 'workday_start');

          this._openApplication('Начало рабочего дня', 'green', 'Старт дня', alertaParameters);
        }

        /**
         * Открывает модальное окно завершения рабочего дня
         */
        openWorkdayEndModal() {
          if (this.applicationOpened) return;

          // Дополнительная проверка перед открытием - только OPENED
          if (!this.workdayManager.isWorkdayOpened()) {
            console.log('Нельзя открыть модалку завершения дня: статус не OPENED');
            return;
          }

          this.applicationOpened = true;

          const alertaParameters = this._buildWorkdayModalParams('workdayend', 'workday_end');

          this._openApplication('Завершение рабочего дня', 'red', 'Завершение дня', alertaParameters);
        }

        /**
         * Открывает приложение активности
         */
        openPresenceApplication() {
          if (this.applicationOpened || this.sessionTimer.isPageHidden) return;

          const thresholdSeconds = this.settingsManager.getPageTimeThresholdSeconds();

          if (this.sessionTimer.getSessionTime() < thresholdSeconds) return;

          this.applicationOpened = true;

          const alertaParameters = this._buildPresenceModalParams();

          this._openApplication('Активность пользователя', 'blue', 'Таймер активности', alertaParameters);

          this.sessionTimer.stopTimer();
        }

        /**
         * Формирует параметры для модального окна рабочего дня
         * @private
         */
        _buildWorkdayModalParams(mode, source) {
          return {
            mode,
            source,
            tracking_data: {
              user_id: this.userManager.getUserId(),
              user_name: this.userManager.getFullName(),
              page_url: this.currentUrl,
              page_title: document.title,
              workday_status: this.workdayManager.workdayStatus,
              opened_at: new Date().toISOString()
            }
          };
        }

        /**
         * Формирует параметры для модального окна активности
         * @private
         */
        _buildPresenceModalParams() {
          const currentTime = this.sessionTimer.getSessionTime();
          const totalTime = this.storedTime + currentTime;
          const userName = this.userManager.getFullName();
          const category = this.categoryDetector.getCategory(this.currentUrl);

          return {
            mode: 'alerta',
            source: 'page_tracking',
            tracking_data: {
              user_id: this.userManager.getUserId(),
              user_name: userName,
              total_time_on_page: totalTime,
              current_session_time: currentTime,
              stored_time: this.storedTime,
              page_url: this.currentUrl,
              page_title: document.title,
              page_category: category,
              opened_at: new Date().toISOString()
            }
          };
        }

        /**
         * Открывает приложение Bitrix24
         * @private
         */
        _openApplication(title, bgColor, labelText, parameters) {
          const openAppParams = {
            'opened': true,
            'bx24_title': title,
            'bx24_label': {
              'bgColor': bgColor,
              'text': labelText,
              'color': '#ffffff',
            },
            'bx24_width': APP_CONFIG.MODAL_WIDTH,
            'parameters': JSON.stringify(parameters)
          };

          BX24.openApplication(openAppParams, () => {
            this.onModalClosed();
          });
        }

        /**
         * Обработчик закрытия модального окна
         */
        async onModalClosed() {
          this.applicationOpened = false;

          try {
            await this.workdayManager.checkWorkdayStatus();
          } catch (error) {
            console.error('Ошибка при проверке статуса после закрытия модалки:', error);
          }

          const sessionTime = this.sessionTimer.getSessionTime();
          if (sessionTime > 0 && this.storageManager.currentItemId) {
            await this._updateStorage(sessionTime);
          }

          this.sessionTimer.resetSession();
          this.lastUpdateTime = 0;
          this.startMainTimer();

          console.log('Модальное окно закрыто');
        }

        // ===== Методы для работы с таймером и хранилищем =====

        /**
         * Запускает основной таймер
         */
        startMainTimer() {
          this.sessionTimer.startTimer((currentTime) => {
            this._displayTimerInfo(currentTime);
            this.openPresenceApplication();

            if (currentTime - this.lastUpdateTime >= APP_CONFIG.STORAGE_UPDATE_INTERVAL) {
              this.lastUpdateTime = currentTime;
              if (this.storageManager.currentItemId && currentTime > 0) {
                this._updateStorage(APP_CONFIG.STORAGE_UPDATE_INTERVAL);
              }
            }
          });
        }

        /**
         * Отображает информацию о таймере в консоли
         * @private
         */
        _displayTimerInfo(currentTime) {
          const totalTime = this.storedTime + currentTime;
          const minutes = Math.floor(currentTime / 60);
          const seconds = currentTime % 60;

          console.log(`⏱️ Таймер: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (${currentTime} сек)`);
        }

        /**
         * Обновляет данные в хранилище
         * @private
         */
        async _updateStorage(sessionTime) {
          try {
            const userProfile = this.userManager.profile;
            const newTotalTime = await this.storageManager.updateItemTime(
              userProfile,
              this.currentUrl,
              document.title,
              this.storedTime,
              sessionTime
            );

            this.storedTime = newTotalTime;
            console.log(`✅ Хранилище обновлено: ${sessionTime} сек (Всего: ${newTotalTime} сек)`);
          } catch (error) {
            console.error('Ошибка обновления хранилища:', error);
          }
        }

        // ===== Обработчики событий =====

        /**
         * Настраивает обработчики событий
         */
        setupEventListeners() {
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
              this._handlePageHidden();
            } else {
              this._handlePageVisible();
            }
          });

          window.addEventListener('beforeunload', () => {
            this._handlePageUnload();
          });
        }

        /**
         * Обрабатывает скрытие страницы
         * @private
         */
        _handlePageHidden() {
          this.sessionTimer.markPageHidden();
          this.sessionTimer.stopTimer();

          const sessionTime = this.sessionTimer.getSessionTime();
          if (this.storageManager.currentItemId && sessionTime > 0) {
            this._updateStorage(sessionTime);
          }
        }

        /**
         * Обрабатывает появление страницы
         * @private
         */
        _handlePageVisible() {
          this.sessionTimer.markPageVisible();
          this.startMainTimer();
        }

        /**
         * Обрабатывает выгрузку страницы
         * @private
         */
        _handlePageUnload() {
          this.sessionTimer.stopTimer();

          const sessionTime = this.sessionTimer.getSessionTime();
          if (this.storageManager.currentItemId && sessionTime > 0) {
            this._updateStorage(sessionTime);
          }
        }
      }

      // ==========================================================================
      // ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
      // ==========================================================================

      let app;

      BX24.init(function () {
        app = new PageTrackerApp();
        app.initialize();

        try {
          BX24.fitWindow();
        } catch (error) {
          console.error('Ошибка при вызове BX24.fitWindow:', error);
        }
      });
    </script>
</head>
</html>