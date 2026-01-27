<template>
  <B24App>
    <div class="min-h-screen bg-gray-50">
      <!-- Основной контент -->
      <main>
        <router-view />
      </main>
    </div>
  </B24App>
</template>

<script>
export default {
  name: 'App'
}
</script>