<template>
  <v-alert
    v-if="visible"
    :type="type"
    variant="tonal"
    border="start"
    elevation="2"
    dismissible
    @click:close="onClose"
  >
    {{ message }}
  </v-alert>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info", // 'success', 'error', 'warning', 'info'
  },
  duration: {
    type: Number,
    default: 3000, // duración por defecto
  },
});

const visible = ref(true);
const emit = defineEmits(["closed"]);

const onClose = () => {
  visible.value = false;
  emit("closed");
};

// Mostrar y ocultar automáticamente
watch(
  () => props.message,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      setTimeout(() => {
        onClose();
      }, props.duration);
    }
  },
  { immediate: true }
);
</script>
