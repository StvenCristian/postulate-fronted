<template>
  <v-container fluid class="register-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="5">
        <v-card class="pa-6" elevation="10">
          <v-card-title class="text-h5 text-center">Crear Cuenta</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="form.username"
                label="Usuario"
                prepend-inner-icon="mdi-email"
                outlined
                dense
                required
              />
              <v-text-field
                v-model="form.password"
                label="Contraseña"
                type="password"
                prepend-inner-icon="mdi-lock"
                outlined
                dense
                required
              />
              <v-text-field
                v-model="form.nombre"
                label="Nombre"
                prepend-inner-icon="mdi-account"
                outlined
                dense
              />
              <v-text-field
                v-model="form.paterno"
                label="Apellido Paterno"
                prepend-inner-icon="mdi-account"
                outlined
                dense
              />
              <v-text-field
                v-model="form.materno"
                label="Apellido Materno"
                prepend-inner-icon="mdi-account"
                outlined
                dense
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                <v-icon left>mdi-account-plus</v-icon>
                Registrarse
              </v-btn>
            </v-form>

            <AppMessage
              v-if="message"
              :message="message"
              :type="messageType"
              @closed="message = ''"
            />

            <div class="text-center mt-6">
              <span>¿Ya tienes una cuenta?</span>
              <v-btn variant="text" color="secondary" @click="goToLogin">
                Iniciar sesión
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppMessage from "@/components/shared/AppMessage.vue";
import { registerUser, loginUser } from "@/services/authService";

import { getCurrentUser } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: "",
  password: "",
  paterno: "",
  materno: "",
  nombre: "",
});

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

const handleRegister = async () => {
  try {
    const res = await registerUser(form.value);
    if (!res.isSuccess) {
      showMessage(res.message, "error");
      return;
    }

    const loginRes = await loginUser(form.value.username, form.value.password);
    if (!loginRes.isSuccess) {
      showMessage(res.message, "error");
      return;
    }
    authStore.setAuth(loginRes.data.token);

    const user = await getCurrentUser();
    authStore.username = user.data.username;
    authStore.roles = user.data.roles;

    const roleRoutes = {
      ADMIN: "/admin/home",
      USER_POST: "/postulante/home",
    };

    const matchedRoute = authStore.roles.find((role) => roleRoutes[role]);

    if (matchedRoute) {
      router.push(roleRoutes[matchedRoute]);
    } else {
      router.push("/unauthorized");
    }

    showMessage("Usuario registrado correctamente.", "success");
  } catch (err) {
    showMessage(
      err.response?.data?.message || "Error al registrar usuario.",
      "error"
    );
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container {
  background-image: url("https://source.unsplash.com/1600x900/?career,success");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>
