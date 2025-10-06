<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

// Registrar los módulos necesarios
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Datos de ejemplo
const chartData = {
  labels: ["Marketing", "Ventas", "RRHH", "TI", "Finanzas"],
  datasets: [
    {
      label: "Cantidad de registros",
      backgroundColor: "#42A5F5",
      borderColor: "#1E88E5",
      borderWidth: 1,
      data: [120, 90, 60, 150, 80],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Ejemplo de gráfico de barras por departamento",
    },
  },
};
</script>
