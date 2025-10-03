<template>
  <v-app-bar color="#5865f2" dark flat>
    <v-container>
      <v-row align="center" justify="end">
        <v-col class="d-flex align-center" cols="auto">
          <v-icon class="me-2">mdi-account</v-icon>
          <span>{{ authStore.username }}</span>
          <v-btn variant="outlined" color="white" class="ms-4" @click="logout">
            Cerrar sesión
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout(); // Asegúrate de tener este método en tu store
  router.push("/login"); // Redirige al login
};
</script>
