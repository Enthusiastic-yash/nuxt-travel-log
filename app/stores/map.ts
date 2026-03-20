import type { MapPoints } from "~~/lib/types";
import type { LngLatBounds } from "maplibre-gl";

import { CENTER_INDIA } from "~~/lib/constant";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoints[]>([]);
  const selectedPoints = ref<MapPoints | null>(null);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();
    let bounds: LngLatBounds | null = null;
    const padding = 60;

    watchEffect(() => {
      const firstPoints = mapPoints.value[0];
      if (!firstPoints) {
        map.map?.flyTo({
          center: CENTER_INDIA,
          zoom: 2,
        });
        return;
      }
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoints.long, firstPoints.lat], [firstPoints.long, firstPoints.lat]));
      map.map?.fitBounds(bounds, {
        padding,
        maxZoom: 10,
      });
    });

    watchEffect(() => {
      const selected = selectedPoints.value;
      if (!selected)
        return bounds;
      map.map?.flyTo({
        center: [selected.long, selected.lat],
        zoom: 9,
        speed: 0.7,
        easing(t) {
          return t;
        },
        essential: true,
      });
    });
  }

  return { mapPoints, selectedPoints, init };
});
