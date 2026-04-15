<script setup lang="ts">
import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGE } from "~~/lib/constant";

const route = useRoute();
const isSideBarOpen = ref(false);
const sideBarStore = useSidebarStore();
// const locationStore = useLocationStore();
const mapStore = useMapStore();
function toggleSideBar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSideBarOpen", isSideBarOpen.value.toString());
}

// if (LOCATION_PAGE.has(route.name?.toString() || "")) {
//   await locationStore.refreshLocations();
// }
// if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
//   locationStore.refreshCurrentLocation();
// }

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
});

watchEffect(() => {
  if (LOCATION_PAGE.has(route.name?.toString() || "")) {
    sideBarStore.sideBarTopItems = [
      {
        id: "link-dashboard",
        label: "Locations",
        href: "/dashboard",
        icon: "tabler:map",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        href: "/dashboard/add",
        icon: "tabler:circle-plus-filled",
      },
    ];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sideBarStore.sideBarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        href: "/dashboard",
        icon: "tabler:arrow-left",
      },
      {
        id: "link-dashboard",
        label: String(route.params.slug),
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:map",
      },
      // {
      //   id: "link-location-add",
      //   label: "Add Location Log",
      //   to: {
      //     name: "dashboard-location-slug-add",
      //     params: {
      //       slug: route.params.slug,
      //     },
      //   },
      //   icon: "tabler:circle-plus-filled",
      // },
      {
        id: "link-location-edit",
        label: "Edit Location",
        to: {
          name: "dashboard-location-slug-edit",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:map-pin-cog",
      },
    ];
  }
});
</script>

<template>
  <div class="flex flex-1 min-h-64">
    <div class="bg-base-100 transition-all ease-in-out duration-400 shrink-0" :class="{ 'w-64': isSideBarOpen, 'w-16': !isSideBarOpen }">
      <div class="flex" :class="{ 'justify-end': isSideBarOpen, 'justify-center': !isSideBarOpen }">
        <Icon
          :name="isSideBarOpen ? 'tabler:chevron-left' : 'tabler:chevron-right'"
          size="32"
          class="cursor-pointer p-2"
          @click="toggleSideBar"
        />
      </div>
      <div class="flex flex-col gap-2">
        <SidebarButton
          v-for="item in sideBarStore.sideBarTopItems"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          :href="item.href"
          :show-label="isSideBarOpen"
          :to="item.to"
        />

        <div v-if="sideBarStore.loading || sideBarStore.sideBarItems.length" class="divider" />
        <div v-if="sideBarStore.loading" class="px-4">
          <div class="skeleton h-6  w-full" />
        </div>
        <div v-else-if="sideBarStore.sideBarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sideBarStore.sideBarItems"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
            :show-label="isSideBarOpen"
            :to="item.to"
            :icon-color="mapStore.selectedPoints === item.location ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoints = item.location ?? null"
            @mouseleave="mapStore.selectedPoints = null"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          icon="tabler:logout-2"
          label=" Sign Out"
          href="/sign-out"
          :show-label="isSideBarOpen"
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-base-200">
      <div class="flex size-full" :class="{ 'flex-col': !EDIT_PAGES.has(route.name?.toString() || '') }">
        <NuxtPage />
        <Map class="flex-1" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
