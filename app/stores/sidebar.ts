import type { MapPoints } from "~~/lib/types";
import type { RouteLocationRaw } from "vue-router";

export type sideBarItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  location?: MapPoints | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sideBarItems = ref<sideBarItem[]>([]);
  const loading = ref(false);
  return {
    loading,
    sideBarItems,
  };
});
