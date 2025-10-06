<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const chartData = {
  labels: ["Postulantes", "Empresas", "Administradores"],
  datasets: [
    {
      label: "Distribución de usuarios",
      backgroundColor: ["#3f51b5", "#4caf50", "#ff9800"],
      data: [60, 30, 10],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Usuarios por rol",
    },
  },
};
</script>
