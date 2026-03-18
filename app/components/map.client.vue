<script setup lang="ts">
import {
  MglMap,
  MglNavigationControl,
} from "@indoorequal/vue-maplibre-gl";
import { CENTER_INDIA } from "~~/lib/constant";

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
    </MglMap>
  </div>
</template>
