import type { MapPoints } from "~~/lib/types";

export type sideBarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
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
