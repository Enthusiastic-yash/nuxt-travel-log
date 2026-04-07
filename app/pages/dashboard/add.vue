<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/location", {
    method: "post",
    body: values,
  });
};

function isSubmitCompleted() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container max-w-md mx-auto  mt-4 p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="tracking-tight capitalize text-sm">
        A Location is place you have travele or travel to. it can be a city,country, state or point of interest. you can add specific times you visited the location after adding it.
      </p>
    </div>
    <LocationForm
      :is-submit-completed
      :on-submit
      submit-lable="Add"
      submit-icon="tabler:circle-plus-filled"
    />
  </div>
</template>

<style scoped>

</style>
