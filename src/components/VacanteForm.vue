<template>
  <AppMessage v-if="errorMessage" :message="errorMessage" type="error" />
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
      v-model="form.estado"
      label="Estado"
      :items="['Activa', 'Vencida']"
    ></v-select>
    <v-btn type="submit" color="primary">
      {{ vacante ? "Actualizar" : "Registrar" }}
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { createVacante, updateVacante } from "@/services/vacanteService";
import AppMessage from "@/components/AppMessage.vue";
import { nextTick } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";

const authStore = useAuthStore();

const props = defineProps({
  vacante: Object,
});

const emit = defineEmits(["submitted"]);
const errorMessage = ref("");

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
  await cleanMessage();

  const isValid = await formRef.value?.validate();
  if (!isValid) {
    errorMessage.value = "Por favor completa los campos obligatorios.";
    return;
  }

  try {
    let resp;

    if (props.vacante) {
      resp = await updateVacante(props.vacante.id, form.value);
    } else {
      resp = await createVacante(form.value);
    }
    console.log(resp);
    if (!resp?.isSuccess) {
      errorMessage.value = resp?.message || "Error desconocido.";
      return;
    }

    emit("submitted");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Error al enviar el formulario.";
  }
};

const cleanMessage = async () => {
  errorMessage.value = "";
  await nextTick();
};

const validateAccess = async () => {
  if (!authStore.token) {
    router.push("/login");
    return false;
  }

  try {
    const res = await getCurrentUser();
    authStore.username = res.data.username;
    authStore.roles = res.data.roles;

    if (!authStore.roles.includes("ADMIN")) {
      router.push("/unauthorized");
      return false;
    }

    return true;
  } catch (err) {
    router.push("/login");
    return false;
  }
};

onMounted(async () => {
  const isValid = await validateAccess();
});
</script>
