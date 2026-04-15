<script setup lang="ts">
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const { currentLocation: location, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationStore);
const mapStore = useMapStore();

const isOpen = ref(false);
const deleteError = ref<string | undefined>("");
const isDeleting = ref(false);

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

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/location/${route.params.slug}`, {
      method: "DELETE",
    });
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = error.statusMessage;
  }
  isDeleting.value = false;
}

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

// onBeforeRouteUpdate((to) => {
//   if (to.name === "dashboard-location-slug") {
//     locationStore.refreshCurrentLocation();
//   }
// });
</script>

<template>
  <div class="p-4 min-h-64 container max-w-md">
    <div v-if="errorMessage && !loading">
      <h2 class="text-lg alert alert-error">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="loading">
      <div class="loading " />
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location?.name }}
        <div class="dropdown dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-o"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog()">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
              <NuxtLink :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }">
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>

      <p class="text-sm">
        {{ location?.description }}
      </p>
      <!-- <div v-if="!location.locationLogs.length" class="text-sm mt-4">
        <p>
          Add location log to get started.
        </p>
        <NuxtLink :to="{ name: 'dashboard-location-slug-add', params: { slug: route.params.slug } }" class="btn btn-primary mt-2">
          Add Location log
          <Icon name="tabler:map-pin-plus" size="24" />
        </NuxtLink>
      </div> -->
    </div>

    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <Dialog
      title="Are you sure ? "
      description="Deleting this location will also delete all of the associated logs. This cannot be undone Do you really want to do this ?"
      :is-open="isOpen"
      confirm-label="Yes, Delete this location"
      confirm-class="btn-error"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>

<style scoped>

</style>
