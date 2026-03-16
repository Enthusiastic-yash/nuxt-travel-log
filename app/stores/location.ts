export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/location", {
    lazy: true,
  });

  const sideBarStore = useSidebarStore();
  watchEffect(() => {
    if (data.value) {
      sideBarStore.loading = false;
      sideBarStore.sideBarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        href: "#",
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
