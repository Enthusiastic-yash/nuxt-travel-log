<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <navbar />
    <main class=" flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
