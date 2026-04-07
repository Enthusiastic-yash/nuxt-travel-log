<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

import LocationForm from "~/components/location-form.vue";

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/location", {
    method: "post",
    body: values,
  });
};

function isSubmitCompleted() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <div>
    <LocationForm
      :is-submit-completed
      :on-submit
      submit-lable="Add"
      submit-icon="tabler:circle-plus-filled"
    />
  </div>
</template>

<style scoped>

</style>
