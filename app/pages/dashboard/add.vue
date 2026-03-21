<script setup lang="ts">
import type { FetchError } from "ofetch";

import { CENTER_INDIA } from "~~/lib/constant";
import { InsertLocation } from "~~/lib/db/schema";

const mapStore = useMapStore();
const submitError = ref("");
const isSubmitted = ref(false);
const router = useRouter();
const { $csrfFetch } = useNuxtApp();

type FormValues = {
  name: string;
  description: string;
  lat: number | null;
  long: number | null;
};

const { handleSubmit, errors, meta, setErrors, isSubmitting, setFieldValue, controlledValues } = useForm<FormValues>({
  initialValues: {
    name: "",
    description: "",
    lat: CENTER_INDIA[1],
    long: CENTER_INDIA[0],
  },
});

watchEffect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added point",
    description: "",
    lat: CENTER_INDIA[1],
    long: CENTER_INDIA[0],
  };
});

onBeforeRouteLeave(() => {
  if (!isSubmitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});

const onSubmit = handleSubmit(async (values) => {
  submitError.value = "";
  const result = InsertLocation.safeParse(values);

  if (!result.success) {
    const formErrors = Object.fromEntries(
      result.error.issues.map(issue => [
        issue.path.join("."),
        issue.message,
      ]),
    );

    setErrors(formErrors);
    return;
  }
  try {
    await $csrfFetch("/api/location", {
      method: "post",
      body: result.data,
    });
    isSubmitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.statusMessage || "An unknown error occured.";
  }
});
</script>

<template>
  <div class="container max-w-md mx-auto  mt-4 p-4">
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="tracking-tight capitalize text-sm">
        A Locaiton is place you have travele or travel to. it can be a city,country, state or point of interest. you can add specific times you visited the locaiton after adding it.
      </p>
    </div>
    <form class="flex flex-col  gap-2" @submit.prevent="onSubmit">
      <FormField
        name="name"
        label="name"
        :error="errors.name"
        :disabled="isSubmitting"
      />
      <FormField
        name="description"
        type="textarea"
        label="Description"
        :error="errors.description"
        :disabled="isSubmitting"
      />
      <p>
        Drag the <Icon
          name="tabler:map-pin-filled"
          size="18"
          class="text-warning"
        />  marker to your desired location.
      </p>
      <p class="text-sm text-gray-400">
        Longitude: {{ controlledValues.long?.toFixed(4) }},  Latitude:{{ controlledValues.lat?.toFixed(4) }}
      </p>
      <p class="text-sm text-gray-400">
        Or double click on the map.
      </p>
      <div class="flex justify-end gap-x-2">
        <button
          type="button"
          class="btn btn-neutral my-2"
          :disabled="isSubmitting"
          @click="router.back"
        >
          Cancel
          <Icon name="tabler:arrow-left" size="24" />
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn btn-primary my-2"
        >
          Add
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
