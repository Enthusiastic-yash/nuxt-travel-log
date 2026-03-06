<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div>
    <button
      :disabled="authStore.loading"
      class="btn btn-accent"
      @click="authStore.signIn"
    >
      Sign In with Github
      <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
      <icon
        v-else
        name="tabler:brand-github"
        size="24"
      />
    </button>
  </div>
</template>

<style scoped>

</style>
