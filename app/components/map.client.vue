<script setup lang="ts">
import {
  MglMap,
  MglNavigationControl,
  MglPopup,
} from "@indoorequal/vue-maplibre-gl";
import { CENTER_INDIA } from "~~/lib/constant";

const mapStore = useMapStore();
const colorMode = useColorMode();
const lightMode = "https://tiles.openfreemap.org/styles/liberty";
const darkMode = "/style/dark.json";
const style = computed(() => colorMode.value === "dark" ? darkMode : lightMode);
const zoom = 3;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <div>
    <MglMap
      :map-style="style"
      :center="CENTER_INDIA"
      :zoom="zoom"
    >
      <MglNavigationControl />
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div class="tooltip hover:cursor-pointer" :data-tip="point.name">
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="mapStore.selectedPoints === point ? 'text-accent' : 'text-primary'"
              @mouseenter="mapStore.selectedPoints = point"
              @mouseleave="mapStore.selectedPoints = null"
            />
          </div>
        </template>
        <MglPopup>
          <h3 class="text-xl text-black">
            {{ point.name }}
          </h3>
          <p v-if="point.description" class="text-black text-sm font-medium">
            {{ point.description }}
          </p>
        </MglPopup>
      </MglMarker>
    </MglMap>
  </div>
</template>
