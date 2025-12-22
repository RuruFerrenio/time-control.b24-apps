<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Главная страница</h1>
    <p class="text-gray-600 mb-6">Добро пожаловать в ваше приложение!</p>
    <B24Button
        variant="primary"
        :to="{ name: 'settings' }"
    >
      Перейти к настройкам
    </B24Button>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>