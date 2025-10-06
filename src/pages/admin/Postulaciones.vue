<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  roles:
    - ADMIN
</route>
<template>
  <v-container>
    <v-btn color="error" class="mb-4" @click="backPage">
      <v-icon start>mdi-arrow-left</v-icon>
      Volver
    </v-btn>

    <v-card class="mb-6 pa-4">
      <v-card-title class="text-h5">
        Postulaciones para: {{ vacante?.titulo || "Vacante no encontrada" }}
      </v-card-title>
      <v-card-text>
        <p><strong>Descripción:</strong> {{ vacante?.descripcion }}</p>
        <p><strong>Ubicación:</strong> {{ vacante?.ubicacion }}</p>
        <p>
          <strong>Fecha Publicación:</strong>
          {{ formatDate(vacante?.fechaPublic) }}
        </p>
        <p>
          <strong>Fecha Vencimiento:</strong>
          {{ formatDate(vacante?.fechaVenc) }}
        </p>
      </v-card-text>
    </v-card>

    <h3 class="text-center">Listado de postulantes</h3>
    <v-data-table
      :headers="headers"
      :items="postulaciones"
      class="elevation-1"
      :items-per-page="5"
    >
      <template v-slot:item.actionDownload="{ item }">
        <v-btn icon color="success" @click="downloadCV(item)">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.fechaPostulacion="{ item }">
        {{ formatDate(item.fechaPostulacion) }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getVacanteById,
  getPostulacionesByVacanteId,
  getCVByPostulacionId,
} from "@/services/vacanteService";

const route = useRoute();
const router = useRouter();
const vacanteId = route.query.id;

const vacante = ref(null);
const postulaciones = ref([]);

const headers = [
  { title: "Postulante", key: "postulante" },
  { title: "Nombre CV", key: "nombreCV" },
  { title: "Descargar CV", key: "actionDownload", sortable: false },
  { title: "Comentario", key: "comentarioOpc" },
  { title: "Teléfono", key: "telefonoOpc" },
  { title: "Fecha Postulación", key: "fechaPostulacion" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE");
};

const backPage = () => {
  router.push("/admin/vacantes");
};

const downloadCV = async (postulacion) => {
  const resp = await getCVByPostulacionId(postulacion.id);
  if (!resp?.isSuccess) {
    alert(resp.message || "Error al obtener el archivo.");
    return;
  }

  const base64 = resp.data;
  const link = document.createElement("a");
  link.href = `data:application/octet-stream;base64,${base64}`;
  link.download = postulacion.nombreCV;
  link.click();
};

onMounted(async () => {
  if (!vacanteId) return;

  const vacanteResp = await getVacanteById(vacanteId);
  if (vacanteResp?.isSuccess) {
    vacante.value = vacanteResp.data;
  }

  const postulacionesResp = await getPostulacionesByVacanteId(vacanteId);
  if (postulacionesResp?.isSuccess) {
    postulaciones.value = postulacionesResp.data;
  }
});
</script>
