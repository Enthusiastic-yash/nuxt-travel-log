<script setup lang="ts">
const route = useRoute();
const locationStore = useLocationStore();
const { currentLocation: location, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationStore);
const mapStore = useMapStore();

watchEffect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value];
  }
});

watchEffect(() => {
  if (route.params.slug && route.name !== "dashboard-location-slug-add") {
    locationStore.refreshCurrentLocation();
  }
});

// onBeforeRouteUpdate((to) => {
//   if (to.name === "dashboard-location-slug") {
//     locationStore.refreshCurrentLocation();
//   }
// });
</script>

<template>
  <div class="p-4 min-h-64 container max-w-md">
    <div v-if="status === 'pending'">
      <div class="loading " />
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location?.name }}
      </h2>
      <p class="text-sm">
        {{ location?.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="text-sm mt-4">
        <p>
          Add location log to get started.
        </p>
        <button class="btn btn-primary mt-2">
          Add Location log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="error && status !== 'pending'">
      <h2 class="text-lg alert alert-error">
        {{ error.statusMessage }}
      </h2>
    </div>

    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>

</style>
