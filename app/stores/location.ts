const listLocationInSidebar = new Set(["dashboard", "dashboard-add"]);
export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/location", {
    lazy: true,
  });

  const route = useRoute();

  const sideBarStore = useSidebarStore();
  const mapStore = useMapStore();
  watchEffect(() => {
    if (data.value && listLocationInSidebar.has(route.name?.toString() || "")) {
      sideBarStore.loading = false;
      sideBarStore.sideBarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        location,
        to: { name: "dashboard-location-slug", params: { slug: location.slug } },
      }));
      mapStore.mapPoints = data.value;
    }
    else {
      sideBarStore.loading = status.value === "pending";
      sideBarStore.sideBarItems = [];
    }
  });
  return {
    locations: data,
    status,
    refresh,
  };
});
