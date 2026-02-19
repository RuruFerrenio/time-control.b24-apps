<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <script src="//api.bitrix24.com/api/v1/"></script>
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <script>
      // ==================== КЛАСС ДЛЯ РАБОТЫ С URL ====================
      class URLProcessor {
        constructor() {
          this.domain = BX24.getDomain();
        }

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

          } catch (e) {
            console.warn('Ошибка нормализации URL:', url);
            return this._fallbackNormalization(url);
          }
        }

        _removeQueryParams(url) {
          try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
          } catch (e) {
            return url.split('?')[0];
          }
        }

        _fallbackNormalization(url) {
          const queryIndex = url.indexOf('?');
          let cleanUrl = queryIndex !== -1 ? url.substring(0, queryIndex) : url;

          if (!cleanUrl.startsWith('/')) {
            cleanUrl = '/' + cleanUrl;
          }

          return `https://${this.domain}${cleanUrl}`;
        }

        parseUrl(url) {
          const normalized = this.normalizeUrl(url);
          if (!normalized) return { path: '', search: '', host: '', fullUrl: '' };

          try {
            const urlObj = new URL(normalized);
            return {
              path: urlObj.pathname,
              search: urlObj.search,
              host: urlObj.host,
              fullUrl: normalized
            };
          } catch (e) {
            return {
              path: normalized.replace(`https://${this.domain}`, ''),
              search: '',
              host: this.domain,
              fullUrl: normalized
            };
          }
        }
      }

      // ==================== КЛАСС ДЛЯ ОПРЕДЕЛЕНИЯ КАТЕГОРИЙ ====================
      class CategoryDetector {
        constructor() {
          this.categories = {
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

        getCategory(url) {
          if (!url) return null;

          const urlProcessor = new URLProcessor();
          const { path } = urlProcessor.parseUrl(url);

          for (const [categoryKey, category] of Object.entries(this.categories)) {
            for (const categoryPath of category.paths) {
              const pattern = categoryPath.replace('[0-9]+', '\\d+');
              const regex = new RegExp(`^${pattern}`);

              if (regex.test(path)) {
                for (const [subcategoryName, subcategoryPaths] of Object.entries(category.subcategories)) {
                  for (const subcategoryPath of subcategoryPaths) {
                    const subPattern = subcategoryPath.replace('[0-9]+', '\\d+');
                    const subRegex = new RegExp(`^${subPattern}`);

                    if (subRegex.test(path)) {
                      return `${category.name} › ${subcategoryName}`;
                    }
                  }
                }
                return category.name;
              }
            }
          }

          if (path.includes('/bi/dashboard/detail/')) {
            const categoryMatch = url.match(/scope=([^&]+)/);
            if (categoryMatch) {
              const scope = categoryMatch[1];
              switch(scope) {
                case 'crm': return 'CRM › Аналитика';
                case 'tasks': return 'Задачи и Проекты › Аналитика';
                case 'shop': return 'Сайты и Магазины › Аналитика';
                case 'bizproc': return 'Автоматизация › Аналитика';
              }
            }
            return 'BI Конструктор';
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
      }

      // ==================== КЛАСС ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЕМ ====================
      class UserManager {
        constructor() {
          this.profile = null;
        }

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

        getFullName(profile = null) {
          const user = profile || this.profile;
          if (!user) return 'Неизвестный';

          const firstName = user.NAME || '';
          const lastName = user.LAST_NAME || '';
          const fullName = `${firstName} ${lastName}`.trim();

          return fullName || user.EMAIL || 'Пользователь';
        }

        getUserId() {
          return this.profile ? this.profile.ID : null;
        }
      }

      // ==================== КЛАСС ДЛЯ РАБОТЫ С НАСТРОЙКАМИ ====================
      class SettingsManager {
        constructor() {
          this.keys = {
            PAGE_TRACKING_ENABLED: 'page_tracking_enabled',
            PAGE_TRACKING_HISTORY_DAYS: 'page_tracking_history_days',
            PRESENCE_CONTROL_ENABLED: 'presence_control_enabled',
            PRESENCE_PAGE_TIME_THRESHOLD: 'presence_page_time_threshold',
            WORKDAY_START_ENABLED: 'workday_start_enabled',
            WORKDAY_START_METHOD: 'workday_start_method'
          };
          this.settings = {
            pageTracking: {
              enabled: false,
              historyDays: 30
            },
            presenceControl: {
              enabled: false,
              pageTimeThreshold: 5 // в минутах
            },
            workdayStart: {
              enabled: false,
              method: 'modal' // 'modal' или 'auto'
            }
          };
        }

        async load() {
          try {
            const [pageTrackingEnabled, historyDays, presenceEnabled, pageTimeThreshold, workdayStartEnabled, workdayStartMethod] = await Promise.all([
              BX24.appOption.get(this.keys.PAGE_TRACKING_ENABLED),
              BX24.appOption.get(this.keys.PAGE_TRACKING_HISTORY_DAYS),
              BX24.appOption.get(this.keys.PRESENCE_CONTROL_ENABLED),
              BX24.appOption.get(this.keys.PRESENCE_PAGE_TIME_THRESHOLD),
              BX24.appOption.get(this.keys.WORKDAY_START_ENABLED),
              BX24.appOption.get(this.keys.WORKDAY_START_METHOD)
            ]);

            this.settings.pageTracking.enabled = pageTrackingEnabled === 'Y' || pageTrackingEnabled === true || pageTrackingEnabled === 1;
            this.settings.presenceControl.enabled = presenceEnabled === 'Y' || presenceEnabled === true || presenceEnabled === 1;
            this.settings.workdayStart.enabled = workdayStartEnabled === 'Y' || workdayStartEnabled === true || workdayStartEnabled === 1;

            if (workdayStartMethod && ['modal', 'auto'].includes(workdayStartMethod)) {
              this.settings.workdayStart.method = workdayStartMethod;
            }

            if (historyDays) {
              try {
                const days = parseInt(historyDays);
                if (!isNaN(days) && days >= 1 && days <= 7) {
                  this.settings.pageTracking.historyDays = days;
                }
              } catch (e) {}
            }

            if (pageTimeThreshold) {
              try {
                const minutes = parseInt(pageTimeThreshold);
                if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
                  this.settings.presenceControl.pageTimeThreshold = minutes;
                }
              } catch (e) {}
            }

            return true;
          } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            return false;
          }
        }

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

        getPageTimeThresholdSeconds() {
          return this.settings.presenceControl.pageTimeThreshold * 60;
        }

        getHistoryDays() {
          return this.settings.pageTracking.historyDays;
        }
      }

      // ==================== КЛАСС ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ ====================
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

        async cleanupOldSections(historyDays) {
          const today = new Date();
          const cutoffDate = new Date(today);
          cutoffDate.setDate(today.getDate() - historyDays);
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

        async getAllSections() {
          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.section.get', {
              ENTITY: this.entityId
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при получении секций:', result.error());
                reject(result.error());
              } else {
                resolve(result.data());
              }
            });
          });
        }

        async deleteSection(sectionId) {
          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.section.delete', {
              ENTITY: this.entityId,
              ID: sectionId
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при удалении секции:', result.error());
                reject(result.error());
              } else {
                resolve(result.data());
              }
            });
          });
        }

        async getOrCreateTodaySection() {
          const today = new Date().toISOString().split('T')[0];

          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.section.get', {
              ENTITY: this.entityId,
              FILTER: { NAME: today }
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при поиске секции:', result.error());
                reject(result.error());
              } else {
                const sections = result.data();
                if (sections.length > 0) {
                  this.currentSectionId = sections[0].ID;
                  resolve(this.currentSectionId);
                } else {
                  BX24.callMethod('entity.section.add', {
                    ENTITY: this.entityId,
                    NAME: today
                  }, (newSectionResult) => {
                    if (newSectionResult.error()) {
                      console.error('Ошибка при создании секции:', newSectionResult.error());
                      reject(newSectionResult.error());
                    } else {
                      this.currentSectionId = newSectionResult.data();
                      resolve(this.currentSectionId);
                    }
                  });
                }
              }
            });
          });
        }

        async findItemByUserAndUrl(userId, pageUrl) {
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);

          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.item.get', {
              ENTITY: this.entityId,
              FILTER: {
                SECTION_ID: this.currentSectionId,
                PROPERTY_USER_ID: userId,
                PROPERTY_PAGE_URL: normalizedUrl,
              }
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при поиске элемента:', result.error());
                reject(result.error());
              } else {
                const items = result.data();
                if (items.length > 0) {
                  this.currentItemId = items[0].ID;
                  resolve(this.currentItemId);
                } else {
                  resolve(null);
                }
              }
            });
          });
        }

        async createNewItem(userProfile, pageUrl, pageTitle = '') {
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);
          const category = this.categoryDetector.getCategory(pageUrl);
          const userName = `${userProfile.NAME || ''} ${userProfile.LAST_NAME || ''}`.trim() || userProfile.EMAIL || 'Пользователь';

          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.item.add', {
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
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при создании элемента:', result.error());
                reject(result.error());
              } else {
                this.currentItemId = result.data();
                resolve(this.currentItemId);
              }
            });
          });
        }

        async loadItemTime(itemId) {
          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.item.get', {
              ENTITY: this.entityId,
              SELECT: ['PROPERTY_VALUES'],
              FILTER: { ID: itemId }
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при загрузке элемента:', result.error());
                reject(result.error());
              } else {
                const items = result.data();
                const savedTime = parseInt(items[0].PROPERTY_VALUES?.PAGE_TIME || 0);
                resolve(savedTime);
              }
            });
          });
        }

        async updateItemTime(userProfile, pageUrl, pageTitle, storedTime, sessionTime) {
          if (!this.currentItemId) {
            console.error('Нет активного элемента для обновления');
            return;
          }

          const newTotalTime = storedTime + sessionTime;
          const normalizedUrl = this.urlProcessor.normalizeUrl(pageUrl);
          const category = this.categoryDetector.getCategory(pageUrl);
          const userName = `${userProfile.NAME || ''} ${userProfile.LAST_NAME || ''}`.trim() || userProfile.EMAIL || 'Пользователь';

          return new Promise((resolve, reject) => {
            BX24.callMethod('entity.item.update', {
              ENTITY: this.entityId,
              ID: this.currentItemId,
              PROPERTY_VALUES: {
                USER_NAME: userName,
                PAGE_URL: normalizedUrl,
                PAGE_TITLE: pageTitle || document.title || '',
                PAGE_TIME: newTotalTime,
                PAGE_CATEGORY: category
              }
            }, (result) => {
              if (result.error()) {
                console.error('Ошибка при обновлении элемента:', result.error());
                reject(result.error());
              } else {
                resolve(newTotalTime);
              }
            });
          });
        }
      }

      // ==================== КЛАСС ТАЙМЕРА И СЕССИИ ====================
      class SessionTimer {
        constructor() {
          this.sessionTime = 0;
          this.sessionStartTime = 0;
          this.isPageHidden = false;
          this.timer = null;
          this.updateInterval = 1000; // 1 секунда
        }

        startSession() {
          this.sessionStartTime = Date.now();
          this.sessionTime = 0;
        }

        updateSessionTime() {
          if (!this.isPageHidden) {
            this.sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
          }
          return this.sessionTime;
        }

        resetSession() {
          this.sessionTime = 0;
          this.sessionStartTime = Date.now();
        }

        getSessionTime() {
          return this.sessionTime;
        }

        markPageHidden() {
          this.isPageHidden = true;
        }

        markPageVisible() {
          this.isPageHidden = false;
          this.resetSession();
        }

        startTimer(callback) {
          this.stopTimer();
          this.timer = setInterval(() => {
            this.updateSessionTime();
            callback(this.sessionTime);
          }, this.updateInterval);
        }

        stopTimer() {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }
      }

      // ==================== КЛАСС ДЛЯ РАБОТЫ С РАБОЧИМ ДНЕМ ====================
      class WorkdayManager {
        constructor(userManager) {
          this.userManager = userManager;
          this.workdayStarted = false;
          this.workdayInfo = null;
        }

        async checkWorkdayStatus() {
          return new Promise((resolve, reject) => {
            BX24.callMethod('timeman.status', {}, (result) => {
              if (result.error()) {
                console.error('Ошибка при проверке статуса рабочего дня:', result.error());
                reject(result.error());
              } else {
                const status = result.data();
                this.workdayStarted = status && status.STATUS === 'OPENED';
                this.workdayInfo = status;
                resolve(status);
              }
            });
          });
        }

        // Форматирование даты в формат ATOM (ISO-8601)
        formatDateToATOM(date) {
          // Получаем компоненты даты
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          // Получаем смещение часового пояса в минутах
          const timezoneOffset = date.getTimezoneOffset();
          const absOffset = Math.abs(timezoneOffset);
          const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
          const offsetMinutes = String(absOffset % 60).padStart(2, '0');
          const offsetSign = timezoneOffset <= 0 ? '+' : '-'; // Обратите внимание: getTimezoneOffset возвращает минуты, на которые местное время отличается от UTC. Если местное время впереди UTC, offset отрицательный.

          // Формат ATOM: YYYY-MM-DDTHH:MM:SS±HH:MM
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
        }

        async startWorkday() {
          return new Promise((resolve, reject) => {
            try {
              const now = new Date();

              // Форматируем дату в формат ATOM
              const atomTime = this.formatDateToATOM(now);

              // Базовые параметры
              const params = {
                //TIME: atomTime
              };

              // Добавляем ID пользователя если он известен и не равен 0
              const userId = this.userManager.getUserId();
              if (userId && parseInt(userId) > 0) {
                params.USER_ID = parseInt(userId);
              }

              console.log('Отправка запроса timeman.open с параметрами:', params);

              BX24.callMethod('timeman.open', params, (result) => {
                if (result.error()) {
                  console.error('Ошибка при начале рабочего дня:', result.error());

                  // Детальный вывод ошибки для отладки
                  console.error('Детали ошибки:', {
                    error: result.error(),
                    errorCode: result.error().ex?.error,
                    errorDescription: result.error().ex?.error_description,
                    status: result.status ? result.status() : 'unknown'
                  });

                  reject(result.error());
                } else {
                  this.workdayStarted = true;
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

        async ensureWorkdayStarted() {
          try {
            // Сначала проверяем статус
            const status = await this.checkWorkdayStatus();
            console.log('Текущий статус рабочего дня:', status);

            // Если рабочий день уже начат, ничего не делаем
            if (this.workdayStarted) {
              console.log('ℹ️ Рабочий день уже начат');
              return false;
            }

            // Пробуем начать рабочий день
            console.log('🚀 Попытка автоматического старта рабочего дня...');

            await this.startWorkday();
            console.log('✅ Рабочий день автоматически стартован');
            return true;

          } catch (error) {
            console.error('❌ Ошибка при автоматическом старте рабочего дня:', error);

            // Детальный вывод ошибки
            if (error.ex) {
              console.error('Детали ошибки:', {
                error: error.ex.error,
                description: error.ex.error_description,
                status: error.ex.status
              });
            }

            return false;
          }
        }
      }

      // ==================== КЛАСС ПРИЛОЖЕНИЯ ====================
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
          this.STORAGE_UPDATE_INTERVAL = 10; // секунд
          this.workdayCheckDone = false;
        }

        async initialize() {
          if (this.initialized) return;

          try {
            this.currentUrl = <?php echo json_encode($clientUrl ?? null, 15, 512) ?> || window.location.href;

            await this.settingsManager.load();

            if (!this.settingsManager.isPageTrackingEnabled()) {
              console.log('Отслеживание страниц отключено в настройках');
              return;
            }

            await this.userManager.fetchProfile();

            // Проверяем и запускаем рабочий день если нужно
            if (this.settingsManager.isWorkdayStartEnabled() && !this.workdayCheckDone) {
              await this.handleWorkdayStart();
              this.workdayCheckDone = true;
            }

            const storageExists = await this.storageManager.checkExists();
            if (!storageExists) {
              throw new Error('Хранилище не существует. Обратитесь к администратору.');
            }

            const historyDays = this.settingsManager.getHistoryDays();
            await this.storageManager.cleanupOldSections(historyDays);

            await this.initializeStorage();

            this.setupEventListeners();
            this.startMainTimer();

            this.initialized = true;

          } catch (error) {
            console.error('Ошибка инициализации:', error);
          }
        }

        async handleWorkdayStart() {
          try {
            const status = await this.workdayManager.checkWorkdayStatus();

            // Если рабочий день уже начат, ничего не делаем
            if (this.workdayManager.workdayStarted) {
              console.log('Рабочий день уже начат');
              return;
            }

            if (this.settingsManager.isWorkdayStartAuto()) {
              // Автоматический старт
              await this.workdayManager.ensureWorkdayStarted();
            } else if (this.settingsManager.isWorkdayStartModal()) {
              // Модальное окно с предложением начать рабочий день
              this.openWorkdayModal();
            }
          } catch (error) {
            console.error('Ошибка при обработке старта рабочего дня:', error);
          }
        }

        openWorkdayModal() {
          if (this.applicationOpened) return;

          this.applicationOpened = true;

          const alertaParameters = {
            mode: 'workdaystart',
            source: 'workday_start',
            tracking_data: {
              user_id: this.userManager.getUserId(),
              user_name: this.userManager.getFullName(),
              page_url: this.currentUrl,
              page_title: document.title,
              opened_at: new Date().toISOString()
            }
          };

          const openAppParams = {
            'opened': true,
            'bx24_title': 'Начало рабочего дня',
            'bx24_label': {
              'bgColor': 'green',
              'text': 'Старт дня',
              'color': '#ffffff',
            },
            'bx24_width': 500,
            'parameters': JSON.stringify(alertaParameters)
          };

          BX24.openApplication(openAppParams, () => {
            this.onWorkdayModalClosed();
          });

          // Останавливаем таймер на время открытия модалки
          this.sessionTimer.stopTimer();
        }

        async onWorkdayModalClosed() {
          this.applicationOpened = false;

          // После закрытия модалки проверяем статус рабочего дня
          try {
            await this.workdayManager.checkWorkdayStatus();
          } catch (error) {
            console.error('Ошибка при проверке статуса после закрытия модалки:', error);
          }

          // Возобновляем таймер
          this.sessionTimer.resetSession();
          this.lastUpdateTime = 0;
          this.startMainTimer();

          console.log('Модальное окно старта рабочего дня закрыто');
        }

        async initializeStorage() {
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

        startMainTimer() {
          this.sessionTimer.startTimer((currentTime) => {
            this.displayTimerInfo(currentTime);
            this.checkAndOpenApplication(currentTime);

            // Обновляем хранилище каждые 10 секунд
            if (currentTime - this.lastUpdateTime >= this.STORAGE_UPDATE_INTERVAL) {
              this.lastUpdateTime = currentTime;
              if (this.storageManager.currentItemId && currentTime > 0) {
                this.updateStorage(currentTime);
              }
            }
          });
        }

        displayTimerInfo(currentTime) {
          const totalTime = this.storedTime + currentTime;
          const minutes = Math.floor(currentTime / 60);
          const seconds = currentTime % 60;

          console.log(`⏱️ Таймер: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (${currentTime} сек)`);
        }

        checkAndOpenApplication(currentTime) {
          if (this.applicationOpened ||
            !this.settingsManager.isPresenceControlEnabled() ||
            this.sessionTimer.isPageHidden) {
            return;
          }

          const thresholdSeconds = this.settingsManager.getPageTimeThresholdSeconds();

          if (currentTime >= thresholdSeconds) {
            this.openPresenceApplication();
          }
        }

        openPresenceApplication() {
          this.applicationOpened = true;
          const currentTime = this.sessionTimer.getSessionTime();
          const totalTime = this.storedTime + currentTime;
          const userName = this.userManager.getFullName();
          const category = this.categoryDetector.getCategory(this.currentUrl);

          const alertaParameters = {
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

          const openAppParams = {
            'opened': true,
            'bx24_title': 'Активность пользователя',
            'bx24_label': {
              'bgColor': 'blue',
              'text': 'Таймер активности',
              'color': '#ffffff',
            },
            'bx24_width': 500,
            'parameters': JSON.stringify(alertaParameters)
          };

          BX24.openApplication(openAppParams, () => {
            this.onPresenceApplicationClosed();
          });

          this.sessionTimer.stopTimer();
        }

        onPresenceApplicationClosed() {
          this.applicationOpened = false;

          const sessionTime = this.sessionTimer.getSessionTime();
          if (sessionTime > 0 && this.storageManager.currentItemId) {
            this.updateStorage(sessionTime);
          }

          this.sessionTimer.resetSession();
          this.lastUpdateTime = 0;
          this.startMainTimer();

          console.log('Приложение активности закрыто, таймер сброшен');
        }

        async updateStorage(sessionTime) {
          try {
            const userProfile = this.userManager.profile;
            const newTotalTime = await this.storageManager.updateItemTime(
              userProfile,
              this.currentUrl,
              document.title,
              this.storedTime,
              this.STORAGE_UPDATE_INTERVAL
            );

            this.storedTime = newTotalTime;
            console.log(`✅ Хранилище обновлено: ${sessionTime} сек (Всего: ${newTotalTime} сек)`);
          } catch (error) {
            console.error('Ошибка обновления хранилища:', error);
          }
        }

        setupEventListeners() {
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
              this.handlePageHidden();
            } else {
              this.handlePageVisible();
            }
          });

          window.addEventListener('beforeunload', () => {
            this.handlePageUnload();
          });
        }

        handlePageHidden() {
          this.sessionTimer.markPageHidden();
          this.sessionTimer.stopTimer();

          const sessionTime = this.sessionTimer.getSessionTime();
          if (this.storageManager.currentItemId && sessionTime > 0) {
            this.updateStorage(sessionTime);
          }
        }

        handlePageVisible() {
          this.sessionTimer.markPageVisible();
          this.startMainTimer();
        }

        handlePageUnload() {
          this.sessionTimer.stopTimer();

          const sessionTime = this.sessionTimer.getSessionTime();
          if (this.storageManager.currentItemId && sessionTime > 0) {
            this.updateStorage(sessionTime);
          }
        }
      }

      // ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================
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