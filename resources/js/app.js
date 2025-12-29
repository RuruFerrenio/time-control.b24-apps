import './bootstrap';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router';
import b24UiPlugin from '@bitrix24/b24ui-nuxt/vue-plugin';
import '../css/app.css';

// Импортируем основной компонент Vue
import App from './components/App.vue';
import { messages } from './locales'

// Если у вас есть маршруты, импортируйте их
import routes from './router.js';

// Функция для определения языка из URL параметров
function detectLanguageFromUrl() {
  try {
    // Способ: Из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('LANG') || urlParams.get('lang');

    if (urlLang) {
      console.log('Язык из URL параметра:', urlLang);
      return urlLang.toLowerCase();
    }

    console.log('Язык не определен в URL, используется английский по умолчанию');
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
console.log('Установлен язык:', normalizedLang);

// Проверяем, есть ли сообщения для выбранного языка
const availableLocales = Object.keys(messages);
const finalLocale = availableLocales.includes(normalizedLang) ? normalizedLang : 'en';

// Создаем экземпляр i18n с определенным языком
const i18n = createI18n({
  locale: finalLocale,
  fallbackLocale: 'en', // Английский как fallback
  messages,
  legacy: false
})

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

// Создаем роутер
const router = createRouter({
  routes: routes || [],
  history: createWebHistory(),
});

// Используем плагин Bitrix24 UI
app.use(i18n)
app.use(router);
app.use(b24UiPlugin);

app.mount('#app');

// Экспортируем функцию для получения языка (если нужно в других местах)
export function getCurrentLanguage() {
  return normalizedLang;
}