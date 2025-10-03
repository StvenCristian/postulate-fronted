<template>
  <v-container>
    <NavTop />

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <!-- ✅ Mensaje general -->
        <AppMessage
          v-if="message"
          :message="message"
          :type="messageType"
          @closed="message = ''"
        />

        <v-card-title class="text-h6">Postulación a Vacante</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="postulacionForm.telefonoOpc"
            label="Teléfono opcional"
            placeholder="Ej. 987654321"
          />
          <v-textarea
            v-model="postulacionForm.comentarioOpc"
            label="Comentario opcional"
            rows="3"
            auto-grow
          />
          <v-file-input
            v-model="postulacionForm.cvFile"
            label="Subir CV"
            accept=".pdf,.doc,.docx"
            show-size
            prepend-icon="mdi-upload"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            variant="elevated"
            @click="submitPostulacion"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetalle" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h6">Detalle de Postulación</v-card-title>
        <v-card-text v-if="detallePostulacion">
          <v-text-field
            label="Teléfono opcional"
            :model-value="detallePostulacion.telefonoOpc"
            disabled
          />
          <v-textarea
            label="Comentario opcional"
            :model-value="detallePostulacion.comentarioOpc"
            rows="3"
            auto-grow
            disabled
          />
          <v-text-field
            label="Nombre del CV"
            :model-value="detallePostulacion.nombreCV"
            disabled
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="dialogDetalle = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-6 pa-4">
      <v-card-title class="text-h5">
        Bienvenido, {{ authStore.username }}
      </v-card-title>
    </v-card>

    <h2 class="text-center mb-6">Vacantes disponibles</h2>

    <v-row>
      <v-col
        v-for="vacante in vacantes"
        :key="vacante.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="elevation-2">
          <v-card-title class="text-h6">{{ vacante.titulo }}</v-card-title>
          <v-card-subtitle>{{ vacante.ubicacion }}</v-card-subtitle>
          <v-card-text>
            <div><strong>Descripción:</strong> {{ vacante.descripcion }}</div>
            <div>
              <strong>Salario:</strong>
              {{
                vacante.salarioOpc
                  ? `S/. ${vacante.salarioOpc}`
                  : "No especificado"
              }}
            </div>
            <div>
              <strong>Publicado:</strong> {{ formatDate(vacante.fechaPublic) }}
            </div>
            <div>
              <strong>Vence:</strong> {{ formatDate(vacante.fechaVenc) }}
            </div>
            <div><strong>Estado:</strong> {{ vacante.estado }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="outlined"
              @click="openDialog(vacante.id)"
              v-if="!postulaciones.find((x) => x.idVacante === vacante.id)"
            >
              Postular
            </v-btn>
            <v-btn
              color="success"
              variant="outlined"
              @click="openDialogDetalle(vacante.id)"
              v-if="postulaciones.find((x) => x.idVacante === vacante.id)"
            >
              Ver Postulación
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { definePage } from "vue-router/auto";
definePage({
  meta: {
    requiresAuth: true,
    roles: ["USER_POST"],
  },
});

import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";
import {
  getAllVacantes,
  postulacionCreate,
  getPostulacionesByUsuarioId,
  createPostulacionVisualiza,
} from "@/services/postulanteService";
import NavTop from "@/components/NavTop.vue";
import AppMessage from "@/components/AppMessage.vue";

const maxSizeMB = 2;
const maxSizeBytes = maxSizeMB * 1024 * 1024;

const authStore = useAuthStore();

const vacantes = ref([]);
const postulaciones = ref([]);

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

const dialog = ref(false);

const postulacionForm = reactive({
  telefonoOpc: "",
  comentarioOpc: "",
  cvFile: null,
  idVacante: null,
});

const dialogDetalle = ref(false);
const detallePostulacion = ref(null);

const formatDate = (dateStr) => {
  if (!dateStr) return "No disponible";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE");
};

const loadDataVacante = async () => {
  const resp = await getAllVacantes();
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  vacantes.value = resp.data;
};

const loadDataPostulaciones = async () => {
  const resp = await getPostulacionesByUsuarioId(authStore.userId);
  if (!resp?.isSuccess) {
    showMessage(resp?.message || "Error desconocido.", "error");
    return;
  }
  postulaciones.value = resp.data;
};

const openDialogDetalle = (idVacante) => {
  const postulacion = postulaciones.value.find(
    (x) => x.idVacante === idVacante
  );

  if (postulacion) {
    detallePostulacion.value = postulacion;
    dialogDetalle.value = true;
  } else {
    showMessage("No se encontró la postulación.", "error");
  }
};

onMounted(async () => {
  const res = await getCurrentUser();
  authStore.username = res.data.username;
  authStore.roles = res.data.roles;
  authStore.userId = res.data.id;

  await loadDataVacante();
  await loadDataPostulaciones();
});

const openDialog = async (vacante) => {
  console.log(vacante);
  dialog.value = true;
  postulacionForm.value = vacante;

  const payload = {
    IdVacante: vacante,
    IdUsuario: authStore.userId,
  };

  const response = await createPostulacionVisualiza(payload);
};

const isSubmitting = ref(false);

const submitPostulacion = async () => {
  if (isSubmitting.value) return;

  const file = postulacionForm.cvFile;

  if (!postulacionForm.idVacante || !authStore.userId || !file) {
    showMessage("Debe subir un archivo CV.", "error");
    return;
  }

  if (file.size > maxSizeBytes) {
    showMessage(`El archivo supera el límite de ${maxSizeMB}MB.`, "error");
    return;
  }

  isSubmitting.value = true;

  const reader = new FileReader();

  reader.onload = async () => {
    const base64CV = reader.result.split(",")[1];

    const data = {
      IdVacante: postulacionForm.idVacante,
      IdUsuario: authStore.userId,
      TelefonoOpc: postulacionForm.telefonoOpc,
      ComentarioOpc: postulacionForm.comentarioOpc,
      NombreCV: file.name,
      Base64CV: base64CV,
    };

    try {
      const resp = await postulacionCreate(data);
      if (!resp.isSuccess) {
        showMessage(resp.message || "Error al postular.", "error");
        return;
      }
      showMessage("Postulación exitosa.", "success");
      dialog.value = false;
      Object.assign(postulacionForm, {
        telefonoOpc: "",
        comentarioOpc: "",
        cvFile: null,
        idVacante: null,
      });
      await loadDataVacante();
      await loadDataPostulaciones();
    } catch (err) {
      showMessage("Error al enviar la postulación.", "error");
    } finally {
      isSubmitting.value = false;
    }
  };

  reader.readAsDataURL(file);
};
</script>
