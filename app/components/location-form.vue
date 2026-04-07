<script setup lang="ts">
import type { NominatimResult } from "~~/lib/types";
import type { FetchError } from "ofetch";

import { CENTER_INDIA } from "~~/lib/constant";
import { InsertLocation } from "~~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation | null;
  submitLable: string;
  submitIcon: string;
  isSubmitCompleted: () => void;
  onSubmit: (location: InsertLocation) => Promise<any>;

}>();
const submitError = ref("");
const mapStore = useMapStore();
const router = useRouter();
const isSubmitted = ref(false);

type FormValues = {
  name: string;
  description: string | null;
  lat: number | null;
  long: number | null;
};

const { handleSubmit, errors, meta, setErrors, isSubmitting, setFieldValue, controlledValues } = useForm<FormValues>({
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    lat: props.initialValues?.lat || CENTER_INDIA[1],
    long: props.initialValues?.long || CENTER_INDIA[0],
  },
});

function searchResult(result: NominatimResult) {
  setFieldValue("name", result.name);

  mapStore.addedPoint = {
    id: 1,
    name: "",
    description: "",
    lat: Number(result.lat),
    long: Number(result.lon),
    centerMap: true,
  };
}

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
    lat: props.initialValues?.lat || CENTER_INDIA[1],
    long: props.initialValues?.long || CENTER_INDIA[0],
  };
});

const onSubmit = handleSubmit(async (values) => {
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
    await props.onSubmit(values as InsertLocation);
    isSubmitted.value = true;
    props.isSubmitCompleted();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    // submitErrors.value = error.statusMessage || "An unknown error occured.";
  }
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
</script>

<template>
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
  <div>
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
      <p class=" text-sm">
        Drag the <Icon
          name="tabler:map-pin-filled"
          size="18"
          class="text-warning
         "
        />  marker to your desired location.
      </p>
      <p class="text-sm">
        Or double click on your desired location.
      </p>
      <p class="text-sm">
        Or search for location below.
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
          {{ props.submitLable }}
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            :name="props.submitIcon"
            size="24"
          />
        </button>
      </div>
    </form>
    <div class="divider" />
    <PlaceSearch @result-selected="searchResult" />
  </div>
</template>

<style scoped>

</style>
