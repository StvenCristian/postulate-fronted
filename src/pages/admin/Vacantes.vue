<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  roles:
    - ADMIN
</route>

<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.display.smAndDown"
      max-width="600"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{
            vacanteSelect ? "Actualizar Vacante" : "Registrar Vacante"
          }}</span>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <VacanteForm :vacante="vacanteSelect" @submitted="closeForm" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDisable" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Eliminar registro</span>
          <v-btn icon @click="closeDialogDisable">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> ¿Seguro de eliminar la vacante? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="confirmDisable">Eliminar</v-btn>
          <v-btn color="grey" @click="closeDialogDisable">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h2 class="text-center">Maestro de vacantes</h2>
    <v-btn variant="outlined" color="primary" class="mb-6" @click="openForm">
      <v-icon>mdi-plus</v-icon>
      Agregar
    </v-btn>

    <AppMessage
      v-if="message"
      :message="message"
      :type="messageType"
      @closed="message = ''"
    />

    <v-data-table
      :headers="headers"
      :items="vacantes"
      class="elevation-1"
      :items-per-page="5"
    >
      <template v-slot:item.salarioOpc="{ item }">
        {{ item.salarioOpc ? `S/. ${item.salarioOpc}` : "No especificado" }}
      </template>
      <template v-slot:item.fechaPublic="{ item }">
        {{ formatDate(item.fechaPublic) }}
      </template>
      <template v-slot:item.fechaVenc="{ item }">
        {{ formatDate(item.fechaVenc) }}
      </template>
      <template v-slot:item.actionUpdate="{ item }">
        <v-btn icon color="primary" @click="editVacante(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.actionDelete="{ item }">
        <v-btn icon color="error" @click="deleteVacante(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.actionPostulaciones="{ item }">
        <v-btn icon color="success" @click="verPostulaciones(item)">
          <v-icon>mdi-account-group</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";
import { getAllVacantes, disableVacante } from "@/services/vacanteService";
import AppMessage from "@/components/shared/AppMessage.vue";
import VacanteForm from "@/components/admin/VacanteForm.vue";

import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();

const vacantes = ref([]);

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

const headers = [
  { title: "Título", key: "titulo" },
  { title: "Descripción", key: "descripcion" },
  { title: "Ubicación", key: "ubicacion" },
  { title: "Salario", key: "salarioOpc" },
  { title: "Fecha Publicación", key: "fechaPublic" },
  { title: "Fecha Vencimiento", key: "fechaVenc" },
  { title: "Estado", key: "estado" },
  { title: "Actualizar", key: "actionUpdate", sortable: false },
  { title: "Eliminar", key: "actionDelete", sortable: false },
  { title: "Postulaciones", key: "actionPostulaciones", sortable: false },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE");
};

const loadDataVacante = async () => {
  const resp = await getAllVacantes();
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  vacantes.value = resp.data;
};

onMounted(async () => {
  const res = await getCurrentUser();
  authStore.username = res.data.username;
  authStore.roles = res.data.roles;
  authStore.userId = res.data.id;
  await loadDataVacante();
});

const dialog = ref(false);
const dialogDisable = ref(false);
const vacanteSelect = ref(null);

const openForm = () => {
  vacanteSelect.value = null;
  dialog.value = true;
};

const closeForm = () => {
  dialog.value = false;
  vacanteSelect.value = null;
  loadDataVacante();
};

const editVacante = (vacante) => {
  vacanteSelect.value = { ...vacante };
  dialog.value = true;
};

const deleteVacante = (vacante) => {
  vacanteSelect.value = { ...vacante };
  dialogDisable.value = true;
};

const closeDialogDisable = () => {
  dialogDisable.value = false;
  loadDataVacante();
};

const confirmDisable = async () => {
  if (!vacanteSelect.value?.id) return;

  try {
    const resp = await disableVacante(vacanteSelect.value);
    if (!resp?.isSuccess) {
      showMessage(resp?.message || "Error al eliminar la vacante", "error");
      return;
    }

    showMessage("Vacante eliminada correctamente.", "success");
    dialogDisable.value = false;
    vacanteSelect.value = null;
    await loadDataVacante();
  } catch (err) {
    showMessage(
      err.response?.data?.message || "Error al eliminar la vacante",
      "error"
    );
  }
};
const verPostulaciones = (vacante) => {
  router.push({
    path: "/admin/postulaciones",
    query: { id: vacante.id },
  });
};
</script>
