import './bootstrap';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router';
import b24UiPlugin from '@bitrix24/b24ui-nuxt/vue-plugin';
import axios from 'axios'; // Убедитесь, что axios импортирован
import '../css/app.css';

// Импортируем основной компонент Vue
import App from './components/App.vue';
import { messages } from './locales'

// Импортируем Bitrix24 хелпер
import { bitrixHelper } from './helpers/app'

// Импортируем маршруты
import routes from './router.js'; // Теперь это просто массив routes

// Функция для определения языка из URL параметров
function detectLanguageFromUrl() {
  try {
    // Способ: Из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('LANG') || urlParams.get('lang');

    if (urlLang) {
      return urlLang.toLowerCase();
    }

    return 'en';
  } catch (error) {
    console.error('Ошибка определения языка:', error);
    return 'en';
  }
}

// Функция для нормализации кода языка
function normalizeLanguageCode(langCode) {
  const normalized = langCode.toLowerCase();

  // Приведение к стандартным кодам
  const languageMap = {
    'ru': 'ru',
    'en': 'en',
    'be': 'be',
    'kk': 'kk',
    'pl': 'pl',
    'br': 'br',
    'it': 'it',
  };

  return languageMap[normalized] || 'en'; // По умолчанию английский
}

// Определяем язык
const detectedLang = detectLanguageFromUrl();
const normalizedLang = normalizeLanguageCode(detectedLang);

// Сохраняем язык в localStorage для будущего использования
localStorage.setItem('bitrix24_language', normalizedLang);

// Проверяем, есть ли сообщения для выбранного языка
const availableLocales = Object.keys(messages);
const finalLocale = availableLocales.includes(normalizedLang) ? normalizedLang : 'en';

// ============================================
// УСТАНАВЛИВАЕМ ЗАГОЛОВКИ AXIOS ИЗ window.bitrixData
// ============================================
const setAxiosHeaders = (authData) => {
  if (!authData) return;

  if (authData.access_token) {
    axios.defaults.headers.common['X-b24api-access-token'] = authData.access_token;
  }
  if (authData.refresh_token) {
    axios.defaults.headers.common['X-b24api-refresh-token'] = authData.refresh_token;
  }
  if (authData.domain) {
    axios.defaults.headers.common['X-b24api-domain'] = authData.domain;
  }
  if (authData.member_id) {
    axios.defaults.headers.common['X-b24api-member-id'] = authData.member_id;
  }
  if (authData.expires_in) {
    axios.defaults.headers.common['X-b24api-expires-in'] = authData.expires_in;
  }
};

// Устанавливаем заголовки из данных, полученных от PHP
if (window.bitrixData?.auth) {
  setAxiosHeaders(window.bitrixData.auth);
} else {
  console.warn('No auth data found in window.bitrixData');
}

// Создаем экземпляр i18n с определенным языком
const i18n = createI18n({
  locale: finalLocale,
  fallbackLocale: 'en', // Английский как fallback
  messages,
  legacy: false
})

const router = createRouter({
  history: createWebHistory(),
  routes, // Используем импортированный массив маршрутов
});

// Инициализируем Bitrix24 перед созданием приложения
// Теперь это будет выполняться ПОСЛЕ установки заголовков
bitrixHelper.init().then(() => {
  // После инициализации BX24 можно обновить заголовки, если токены изменились
  if (window.BX24) {
    const bxAuth = BX24.getAuth();
    if (bxAuth) {
      setAxiosHeaders({
        access_token: bxAuth.access_token,
        refresh_token: bxAuth.refresh_token,
        domain: bxAuth.domain,
        member_id: bxAuth.member_id,
        expires_in: bxAuth.expires_in
      });
    }
  }
}).catch(error => {
  console.error('Ошибка инициализации Bitrix24:', error);
});

const app = createApp(App);

// Директива для клика вне элемента
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
})

// Используем плагины
app.use(i18n)
app.use(router); // Используем созданный роутер
app.use(b24UiPlugin);

// Предоставляем bitrixHelper глобально через provide
app.provide('bitrixHelper', bitrixHelper);

app.mount('#app');

// Экспортируем функцию для получения языка (если нужно в других местах)
export function getCurrentLanguage() {
  return normalizedLang;
}