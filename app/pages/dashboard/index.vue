<script setup lang="ts">
const isSideBarOpen = ref(false);

function toggleSideBar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSideBarOpen", isSideBarOpen.value.toString());
}

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
});
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 transition-all ease-in-out duration-400" :class="{ 'w-64': isSideBarOpen, 'w-16': !isSideBarOpen }">
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

        <div class="divider" />
        <SidebarButton
          icon="tabler:logout-2"
          label=" Sign Out"
          href="/sign-out"
          :show-label="isSideBarOpen"
        />
      </div>
    </div>

    <div class="flex-1 bg-amber-200" />
  </div>
</template>

<style scoped>

</style>
