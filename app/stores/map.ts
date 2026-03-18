import type { MapPoints } from "~~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoints[]>([]);

  return { mapPoints };
});
