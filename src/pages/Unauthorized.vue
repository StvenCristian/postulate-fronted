<template>
  <v-container class="text-center mt-10">
    <v-card class="mx-auto" max-width="400">
      <v-card-title class="text-h5">Acceso Denegado</v-card-title>
      <v-card-text>
        No tienes permiso para acceder a esta sección.
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" to="/login">Volver al Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
