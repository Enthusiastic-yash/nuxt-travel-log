import type { MapPoints } from "~~/lib/types";
import type { LngLatBounds } from "maplibre-gl";

import { CENTER_INDIA } from "~~/lib/constant";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoints[]>([]);
  const selectedPoints = ref<MapPoints | null>(null);
  const addedPoint = ref<MapPoints & { centerMap?: boolean } | null>(null);

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
          speed: 0.8,
          essential: true,

        });
        return;
      }
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat] as [number, number]);
      }, new LngLatBounds([firstPoints.long, firstPoints.lat], [firstPoints.long, firstPoints.lat]));
      map.map?.fitBounds(bounds, {
        padding,
        maxZoom: 10,
      });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          zoom: 6,
          speed: 0.8,
          essential: true,
        });
      }
    }, {
      immediate: true,
    });
  }

  return { mapPoints, selectedPoints, init, addedPoint };
});
