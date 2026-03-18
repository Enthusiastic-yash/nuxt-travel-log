<script setup lang="ts">
import {
  MglMap,
  MglNavigationControl,
} from "@indoorequal/vue-maplibre-gl";
import { CENTER_INDIA } from "~~/lib/constant";

const mapStore = useMapStore();
const colorMode = useColorMode();
const lightMode = "https://tiles.openfreemap.org/styles/liberty";
const darkMode = "/style/dark.json";
const style = computed(() => colorMode.value === "dark" ? darkMode : lightMode);
const zoom = 3;
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
          <div class="tooltip" :data-tip="point.label">
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-primary"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
