<script setup lang="ts">
const route = useRoute();
const { slug } = route.params;
const { data: location, status, error } = useFetch(`/api/location/${slug}`, {
  lazy: true,
});
const mapStore = useMapStore();

watchEffect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value];
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading " />
    </div>
    <div v-if="location && status !== 'pending'">
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
  </div>
</template>

<style scoped>

</style>
