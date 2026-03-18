<script setup lang="ts">
const route = useRoute();
const isSideBarOpen = ref(false);
const sideBarStore = useSidebarStore();
const locationStore = useLocationStore();
function toggleSideBar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSideBarOpen", isSideBarOpen.value.toString());
}

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationStore.refresh();
  }
});
</script>

<template>
  <div class="flex flex-1">
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
          icon="tabler:map"
          label="Locations"
          href="/dashboard"
          :show-label="isSideBarOpen"
        />
        <SidebarButton
          icon="tabler:circle-plus-filled"
          label="Add Location"
          href="/dashboard/add"
          :show-label="isSideBarOpen"
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

    <div class="flex-1 overflow-auto">
      <div class="flex flex-col size-full">
        <NuxtPage />
        <Map class="flex-1" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
