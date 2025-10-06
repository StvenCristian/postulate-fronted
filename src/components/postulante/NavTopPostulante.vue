<template>
  <v-app-bar color="primary" dark flat>
    <v-container>
      <v-row align="center" justify="space-between" class="flex-wrap">
        <v-col cols="auto" class="d-md-none">
          <v-menu>
            <template #activator="{ props }">
              <v-app-bar-nav-icon v-bind="props" />
            </template>
            <v-list>
              <v-list-item @click="toggleTheme">
                <v-list-item-title> Cambiar tema </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  {{ authStore.username }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title> Cerrar sesión </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>

        <v-col cols="auto" class="d-none d-md-flex align-center justify-end">
          <v-btn icon @click="toggleTheme" class="ms-4" color="white">
            <v-icon>
              {{
                theme.name.value === "dark"
                  ? "mdi-weather-sunny"
                  : "mdi-weather-night"
              }}
            </v-icon>
          </v-btn>

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
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

const authStore = useAuthStore();
const router = useRouter();
const theme = useTheme();

const logout = () => {
  authStore.logout();
  router.push("/login");
};

function toggleTheme() {
  const newTheme = theme.name.value === "dark" ? "light" : "dark";
  theme.change(newTheme);
  localStorage.setItem("theme", newTheme);
}

const newSave = localStorage.getItem("theme");
if (newSave) {
  theme.change(newSave);
}
</script>
