import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import b24UiPlugin from '@bitrix24/b24ui-nuxt/vue-plugin';
import '../css/app.css';

// Импортируем основной компонент Vue
import App from './components/App.vue';

// Если у вас есть маршруты, импортируйте их
import routes from './router.js';

const app = createApp(App);

// Создаем роутер
const router = createRouter({
  routes: routes || [],
  history: createWebHistory(),
});

// Используем плагин Bitrix24 UI
app.use(router);
app.use(b24UiPlugin);

app.mount('#app');