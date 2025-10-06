<template>
  <AppMessage
    v-if="message"
    :message="message"
    :type="messageType"
    @closed="message = ''"
  />
  <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.titulo"
      label="Título"
      :rules="[(v) => !!v || 'El título es obligatorio']"
    />

    <v-textarea
      v-model="form.descripcion"
      label="Descripción"
      :rules="[(v) => !!v || 'La descripción es obligatoria']"
    />

    <v-text-field
      v-model="form.ubicacion"
      label="Ubicación"
      :rules="[(v) => !!v || 'La ubicación es obligatoria']"
    />

    <v-text-field v-model="form.salarioOpc" label="Salario" type="number" />

    <v-text-field
      v-model="form.fechaPublic"
      label="Fecha de publicación"
      type="date"
      :rules="[(v) => !!v || 'La fecha de publicación es obligatoria']"
    />

    <v-text-field
      v-model="form.fechaVenc"
      label="Fecha de vencimiento"
      type="date"
    />
    <v-select
      v-if="form.id > 0"
      variant="solo-filled"
      v-model="form.estado"
      label="Estado"
      :items="['Activa', 'Vencida']"
      disabled
    ></v-select>

    <v-col cols="12" class="text-center">
      <v-btn
        type="submit"
        color="primary"
        :disabled="form.estado === 'Expirada'"
        class="ma-2"
      >
        {{ vacante ? "Actualizar" : "Registrar" }}
      </v-btn>

      <v-btn
        v-if="vacante"
        color="error"
        @click="handleFinalizar"
        :disabled="form.estado === 'Expirada'"
        class="ma-2"
      >
        Finalizar
      </v-btn>
    </v-col>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  createVacante,
  updateVacante,
  expireVacante,
} from "@/services/vacanteService";
import AppMessage from "@/components/shared/AppMessage.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const props = defineProps({
  vacante: Object,
});

const emit = defineEmits(["submitted"]);

const message = ref("");
const messageType = ref("info");
const showMessage = (msg, type = "info", duration = 3000) => {
  message.value = msg;
  messageType.value = type;

  setTimeout(() => {
    message.value = "";
    messageType.value = "info";
  }, duration);
};

const formRef = ref(null);
const formValid = ref(false);

const form = ref({
  titulo: "",
  descripcion: "",
  ubicacion: "",
  salarioOpc: null,
  fechaPublic: null,
  fechaVenc: null,
});

watch(
  () => props.vacante,
  (newVal) => {
    if (newVal) {
      form.value = {
        titulo: newVal.titulo || "",
        descripcion: newVal.descripcion || "",
        ubicacion: newVal.ubicacion || "",
        salarioOpc: newVal.salarioOpc || null,
        fechaPublic: newVal.fechaPublic?.slice(0, 10) || "", // formato YYYY-MM-DD
        fechaVenc: newVal.fechaVenc?.slice(0, 10) || null,
        username: authStore.username,
        estado: newVal.estado,
        id: newVal.id,
      };
    } else {
      form.value = {
        titulo: "",
        descripcion: "",
        ubicacion: "",
        salarioOpc: null,
        fechaPublic: null,
        fechaVenc: null,
        username: authStore.username,
        id: 0,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    showMessage("Por favor completa los campos obligatorios.", "error");
    return;
  }

  try {
    const isEditing = !!props.vacante;

    const resp = isEditing
      ? await updateVacante(form.value)
      : await createVacante(form.value);

    if (!resp?.isSuccess) {
      showMessage(resp?.message, "error");
      return;
    }

    emit("submitted");
  } catch (err) {
    showMessage(err.response?.data?.message, "error");
  }
};

const handleFinalizar = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    showMessage("Por favor completa los campos obligatorios.", "error");
    return;
  }

  try {
    const resp = await expireVacante(form.value);

    if (!resp?.isSuccess) {
      showMessage(resp?.message, "error");
      return;
    }

    emit("submitted");
  } catch (err) {
    showMessage(err.response?.data?.message, "error");
  }
};
</script>
