<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

import LocationForm from "~/components/location-form.vue";

const route = useRoute();
const locationStore = useLocationStore();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/location/${route.params.slug}`, {
    method: "put",
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
      v-if="locationStore.currentLocationStatus !== 'pending' && locationStore.currentLocation"
      :on-submit
      :is-submit-completed
      :initial-values="locationStore.currentLocation as unknown as InsertLocation"
      submit-lable="Update"
      submit-icon="tabler:map-pin-up"
    />
  </div>
</template>

<style scoped>

</style>
