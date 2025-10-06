<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  roles:
    - ADMIN
</route>

<template>
  <v-container>
    <AppMessage
      v-if="message"
      :message="message"
      :type="messageType"
      @closed="message = ''"
    />

    <v-card class="mb-6 pa-4">
      <v-card-title class="text-h5">
        Bienvenido, {{ authStore.username }}
      </v-card-title>
    </v-card>

    <h2 class="text-center text-h6 text-md-h4">DASHBOARD PRINCIPAL</h2>

    <v-divider :thickness="4" class="my-4" />

    <v-row>
      <v-col cols="12" sm="6" md="4">
        <div style="height: 300px">
          <PieChart
            v-if="chartDashboardVacante"
            :data="chartDashboardVacante.data"
            :options="chartDashboardVacante.options"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <div style="height: 300px">
          <BarChart
            v-if="chartDashboardPostulaciones"
            :data="chartDashboardPostulaciones.data"
            :options="chartDashboardPostulaciones.options"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <div style="height: 300px">
          <BarChart
            v-if="chartDashboardVisualizaciones"
            :data="chartDashboardVisualizaciones.data"
            :options="chartDashboardVisualizaciones.options"
          />
        </div>
      </v-col>
    </v-row>

    <v-row class="my-4" justify="center">
      <v-btn color="primary" @click="goToVacantes">
        Ir al Maestro de Vacantes
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";
import {
  getDashboardVacanteAll,
  getTopPostulacionAll,
  getTopVisualizacionAll,
} from "@/services/dashboardService";
import AppMessage from "@/components/shared/AppMessage.vue";
import { useRouter } from "vue-router";
import BarChart from "@/components/shared/BarChart.vue";

const router = useRouter();
const authStore = useAuthStore();

const dashboardVacante = ref([]);
const dashboardPostulaciones = ref([]);
const dashboardVisualizaciones = ref([]);

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

const loadDashboardVacante = async () => {
  const resp = await getDashboardVacanteAll();
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  dashboardVacante.value = resp.data;
};

const loadDashboardPostulacion = async () => {
  const resp = await getTopPostulacionAll();
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  dashboardPostulaciones.value = resp.data;
};

const loadDashboardVisualizacion = async () => {
  const resp = await getTopVisualizacionAll();
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  dashboardVisualizaciones.value = resp.data;
};

const chartDashboardVacante = computed(() => {
  if (
    !dashboardVacante.value.label ||
    !dashboardVacante.value.dataSet ||
    !dashboardVacante.value.dataSet[0]?.data
  ) {
    return null;
  }

  return {
    data: {
      labels: dashboardVacante.value.label,
      datasets: [
        {
          label: "Vacantes",
          backgroundColor: ["#4caf50", "#f44336"],
          data: dashboardVacante.value.dataSet[0].data,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "ESTADO DE VACANTES",
        },
      },
    },
  };
});

const chartDashboardPostulaciones = computed(() => {
  if (
    !dashboardPostulaciones.value.label ||
    !dashboardPostulaciones.value.dataSet ||
    !dashboardPostulaciones.value.dataSet[0]?.data
  ) {
    return null;
  }

  return {
    data: {
      labels: dashboardPostulaciones.value.label,
      datasets: [
        {
          label: "Postulaciones",
          backgroundColor: [
            "#4caf50",
            "#f44336",
            "#2196f3",
            "#ff9800",
            "#9c27b0",
          ],
          data: dashboardPostulaciones.value.dataSet[0].data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "TOP POSTULACIONES POR VACANTE",
        },
      },
    },
  };
});

const chartDashboardVisualizaciones = computed(() => {
  if (
    !dashboardVisualizaciones.value.label ||
    !dashboardVisualizaciones.value.dataSet ||
    !dashboardVisualizaciones.value.dataSet[0]?.data
  ) {
    return null;
  }

  return {
    data: {
      labels: dashboardVisualizaciones.value.label,
      datasets: [
        {
          label: "Visualizaciones",
          backgroundColor: ["#ff9800"],
          data: dashboardVisualizaciones.value.dataSet[0].data,
        },
        {
          label: "Postulaciones",
          backgroundColor: ["rgba(33, 150, 243, 0.4)"],
          borderColor: ["#2196f3"],
          borderWidth: 2,
          data: dashboardVisualizaciones.value.dataSet[1].data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "TOP VISUALIZACIONES POR VACANTE / POSTULACIONES REALES",
        },
      },
    },
  };
});
const goToVacantes = () => {
  router.push("vacantes"); // Asegúrate que esta ruta exista en tu router
};

onMounted(async () => {
  const res = await getCurrentUser();
  authStore.username = res.data.username;
  authStore.roles = res.data.roles;
  authStore.userId = res.data.id;

  await loadDashboardVacante();
  await loadDashboardPostulacion();
  await loadDashboardVisualizacion();
});
</script>
