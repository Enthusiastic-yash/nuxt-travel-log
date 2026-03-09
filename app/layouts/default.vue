<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <navbar />
    <main>
      <slot />
    </main>
  </div>
</template>
