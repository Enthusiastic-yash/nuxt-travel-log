<script setup lang="ts">
const props = defineProps<{
  error?: string;
  label: string;
  name: string;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
}>();
</script>

<template>
  <div>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ props.label }}
      </legend>
      <Field
        :as="type === 'textarea' ? 'textarea' : 'input'"
        :name="props.name"
        :type="type"
        :disabled="disabled"
        class="w-full ring-0 outline-0"
        :class="{
          'input-error': props.error,
          'input': !type || type === 'text' || type === 'number',
          'textarea': type === 'textarea',
        }"
      />
      <ErrorMessage :name="props.name" class="text-error" />
    </fieldset>
  </div>
</template>
