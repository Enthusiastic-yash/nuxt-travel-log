import type { SelectLocationWithLogs } from "~~/lib/db/schema";

const listLocationInSidebar = new Set(["dashboard", "dashboard-add"]);
export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();
  const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch("/api/location", {
    lazy: true,
  });

  const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);

  const { data: currentLocation, status: currentLocationStatus, error: currentLocationError, refresh: refreshCurrentLocation } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,

  });

  const sideBarStore = useSidebarStore();
  const mapStore = useMapStore();
  watchEffect(() => {
    if (locations.value && listLocationInSidebar.has(route.name?.toString() || "")) {
      sideBarStore.loading = false;
      sideBarStore.sideBarItems = locations.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        location,
        to: { name: "dashboard-location-slug", params: { slug: location.slug } },
      }));
      mapStore.mapPoints = locations.value;
    }
    else {
      sideBarStore.loading = locationsStatus.value === "pending";
      sideBarStore.sideBarItems = [];
    }
  });
  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,

  };
});
