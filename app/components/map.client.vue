<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

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

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.long = location.lng;
    mapStore.addedPoint.lat = location.lat;
  }
}

function onDoubleClick(event: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.long = event.event.lngLat.lng;
    mapStore.addedPoint.lat = event.event.lngLat.lat;
  }
}
</script>

<template>
  <div>
    <MglMap
      :map-style="style"
      :center="CENTER_INDIA"
      :zoom="zoom"
      @map:dblclick="onDoubleClick"
    >
      <MglMarker
        v-if="mapStore.addedPoint"
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        draggable
        @update:coordinates="updateAddedPoint($event)"
      >
        <template #marker>
          <div class="tooltip tooltip-open hover:cursor-pointer" data-tip="Drag to your desired location">
            <Icon
              name="tabler:map-pin-filled"
              size="35"
              class="text-warning"
            />
          </div>
        </template>
      </MglMarker>
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
