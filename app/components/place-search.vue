<script setup lang="ts">
import type { NominatimResult } from "~~/lib/types";

import { SearchSchema } from "~~/lib/zod-schema";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult ];
}>();
const q = ref("");
const error = ref("");
const searchResult = ref<NominatimResult[]>([]);
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  error.value = "";
  const result = SearchSchema.safeParse({ q: q.value });
  if (!result.success) {
    error.value = result.error.issues[0]?.message || "Invalid input";
    return;
  }
  try {
    searchResult.value = [];
    error.value = "";
    const response = await $fetch("/api/search", {
      query: result.data,
    });
    searchResult.value = response;
  }
  catch (err: any) {
    error.value = err?.statusMessage;
  }
  loading.value = false;
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResult.value = [];
  q.value = "";
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <form class="flex flex-col items-center justify-center" @submit.prevent="onSubmit">
      <div class="flex  justify-center">
        <div class="min-w-full">
          <label class="input">
            <Icon name="tabler:search" />
            <input
              v-model="q"
              type="text"
              name="q"
              placeholder="search for a locaton.."
              :class="{
                'input-error': error,
              }"
            >
            <span v-if="loading" class="loading loading-spinner loading-md" />
          </label>
          <div v-if="error" class="text-error">
            {{ error }}
          </div>
        </div>

        <button class="btn btn-neutral" :disabled="loading">
          Search
        </button>
      </div>
    </form>
    <div class="flex flex-col overflow-auto max-h-72 my-4">
      <div
        v-for="result in searchResult"
        :key="result.place_id"
        class="card bg-base-100 card-sm "
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
