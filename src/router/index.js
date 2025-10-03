// router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// 🔐 Guard global para validar autenticación y roles
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.path === "/login" && authStore.token) {
    return next("/"); // o redirige según rol
  }

  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return next("/login");
    }

    // Si aún no se ha cargado el usuario, lo obtenemos desde el backend
    if (!authStore.username) {
      try {
        const res = await getCurrentUser();
        authStore.username = res.data.username;
        authStore.roles = res.data.roles;
      } catch {
        return next("/login");
      }
    }

    // Validar roles si la ruta lo requiere
    const requiredRoles = to.meta.roles;
    if (
      requiredRoles &&
      !requiredRoles.some((role) => authStore.roles.includes(role))
    ) {
      return next("/unauthorized");
    }
  }

  next();
});

// 🔄 Workaround para error de importación dinámica en Vite
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
