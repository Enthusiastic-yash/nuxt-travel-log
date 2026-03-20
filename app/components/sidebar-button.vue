<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary";
}>();
const route = useRoute();
</script>

<template>
  <div
    class=" tooltip-right"
    :data-tip="props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
      :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !props.showLabel, 'pl-2': props.showLabel }"
      :to="props.href"
      class="flex py-1 gap-x-2 flex-nowrap"
    >
      <Icon
        :name="props.icon"
        size="24"
        :class="props.iconColor"
      />
      <Transition name="grow">
        <span v-if="props.showLabel">
          {{ props.label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.3s ease-in-out;
}
.grow-leave-active {
  animation: grow 0.3s ease-in-out reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
