export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/location", {
    lazy: true,
  });

  const sideBarStore = useSidebarStore();
  const mapStore = useMapStore();
  watchEffect(() => {
    if (data.value) {
      sideBarStore.loading = false;
      sideBarStore.sideBarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
      }));
      mapStore.mapPoints = data.value.map(location => ({
        id: location.id,
        lat: location.lat,
        long: location.long,
        label: location.name,
      }));
    }
    else {
      sideBarStore.loading = status.value === "pending";
    }
  });
  return {
    locations: data,
    status,
    refresh,
  };
});
