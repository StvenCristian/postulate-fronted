<template>
  <v-container fluid class="login-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="10">
          <v-card-title class="text-h5 text-center"
            >Iniciar Sesión</v-card-title
          >
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Correo"
                prepend-inner-icon="mdi-email"
                outlined
                dense
                required
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                prepend-inner-icon="mdi-lock"
                outlined
                dense
                required
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                <v-icon left>mdi-login</v-icon>
                Ingresar
              </v-btn>
            </v-form>

            <!-- ✅ Mensaje general -->
            <AppMessage
              v-if="message"
              :message="message"
              :type="messageType"
              @closed="message = ''"
            />

            <div class="text-center mt-6">
              <span>¿No tienes una cuenta?</span>
              <v-btn color="secondary" variant="text" @click="goToRegister">
                Crear cuenta
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-container {
  background-image: url("https://source.unsplash.com/1600x900/?technology,office");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { loginUser } from "@/services/authService";
import { getCurrentUser } from "@/services/userService";
import AppMessage from "@/components/shared/AppMessage.vue";

const username = ref("");
const password = ref("");
const message = ref("");
const messageType = ref("info");

const router = useRouter();
const authStore = useAuthStore();

const roleRoutes = {
  ADMIN: "/admin/home",
  USER_POST: "/postulante/home",
};

const showMessage = (msg, type = "info", duration = 3000) => {
  message.value = msg;
  messageType.value = type;

  setTimeout(() => {
    message.value = "";
    messageType.value = "info";
  }, duration);
};

const handleLogin = async () => {
  try {
    const res = await loginUser(username.value, password.value);
    if (!res.isSuccess) {
      showMessage(res.message, "error");
      return;
    }
    authStore.setAuth(res.data.token);

    const user = await getCurrentUser();
    authStore.username = user.data.username;
    authStore.roles = user.data.roles;

    const matchedRoute = authStore.roles.find((role) => roleRoutes[role]);

    if (matchedRoute) {
      router.push(roleRoutes[matchedRoute]);
    } else {
      router.push("/unauthorized");
    }
  } catch (err) {
    showMessage(
      err.response?.data?.message || "Error al iniciar sesión.",
      "error"
    );
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>
