<route lang="yaml">
meta:
  layout: postulante
  requiresAuth: true
  roles:
    - USER_POST
</route>

<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="900px" persistent>
      <v-card class="rounded-lg elevation-4">
        <v-card-title class="bg-warning text-white">
          <v-icon class="mr-2">mdi-briefcase</v-icon>
          Postulación a Vacante
        </v-card-title>

        <v-divider class="mx-4 my-2" />
        <v-card-text v-if="vacanteSeleccionada">
          <v-row>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-briefcase-outline</v-icon>
              <strong>Título:</strong> {{ vacanteSeleccionada.titulo }}
            </v-col>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-map-marker</v-icon>
              <strong>Ubicación:</strong> {{ vacanteSeleccionada.ubicacion }}
            </v-col>
            <v-col cols="12">
              <v-icon class="mr-1" size="18">mdi-text</v-icon>
              <strong>Descripción:</strong>
              {{ vacanteSeleccionada.descripcion }}
            </v-col>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-cash</v-icon>
              <strong>Salario:</strong>
              {{
                vacanteSeleccionada.salarioOpc
                  ? `S/. ${vacanteSeleccionada.salarioOpc}`
                  : "No especificado"
              }}
            </v-col>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-check-circle</v-icon>
              <strong>Estado:</strong> {{ vacanteSeleccionada.estado }}
            </v-col>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-calendar</v-icon>
              <strong>Publicado:</strong>
              {{ formatDate(vacanteSeleccionada.fechaPublic) }}
            </v-col>
            <v-col cols="12" md="6">
              <v-icon class="mr-1" size="18">mdi-calendar-alert</v-icon>
              <strong>Vence:</strong>
              {{ formatDate(vacanteSeleccionada.fechaVenc) }}
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mx-4 my-2" />

        <!-- Formulario de postulación -->
        <v-form ref="formRef" v-model="formValid">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="postulacionForm.telefonoOpc"
                  label="Teléfono opcional"
                  placeholder="Ej. 987654321"
                  prepend-inner-icon="mdi-phone"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="postulacionForm.comentarioOpc"
                  label="Comentario opcional"
                  rows="3"
                  auto-grow
                  prepend-inner-icon="mdi-comment-text"
                />
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="postulacionForm.cvFile"
                  label="Subir CV"
                  accept=".pdf,.doc,.docx"
                  show-size
                  prepend-icon="mdi-upload"
                  :rules="[
                    (v) => !!v || 'Se debe cargar el CV',
                    (v) =>
                      !v ||
                      v.size <= 2 * 1024 * 1024 ||
                      'El archivo no debe superar los 2MB',
                  ]"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="px-4 pb-4">
            <v-spacer />
            <v-btn color="grey" variant="text" @click="dialog = false">
              <v-icon left>mdi-close</v-icon>
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              variant="elevated"
              @click="submitPostulacion"
            >
              <v-icon left>mdi-send</v-icon>
              Enviar
            </v-btn>
          </v-card-actions>

          <AppMessage
            v-if="message"
            :message="message"
            :type="messageType"
            @closed="message = ''"
          />
        </v-form>
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
        <v-card class="elevation-4 rounded-lg" hover>
          <v-card-title class="text-h6 bg-primary text-white">
            {{ vacante.titulo }}
          </v-card-title>

          <v-card-subtitle class="px-4 pt-2 text-subtitle-2 text-grey-darken-1">
            <v-icon size="18" class="mr-1">mdi-map-marker</v-icon>
            {{ vacante.ubicacion }}
          </v-card-subtitle>

          <v-divider class="mx-4 my-2" />

          <v-card-text class="px-4">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="text-truncate"
                  style="max-width: 100%; font-size: 14px"
                >
                  <strong>Descripción:</strong> {{ vacante.descripcion }}
                </div>
              </template>
              <span>{{ vacante.descripcion }}</span>
            </v-tooltip>

            <div class="mt-2">
              <v-icon size="18" class="mr-1">mdi-cash</v-icon>
              <strong>Salario:</strong>
              {{
                vacante.salarioOpc
                  ? `S/. ${vacante.salarioOpc}`
                  : "No especificado"
              }}
            </div>

            <div class="mt-1">
              <v-icon size="18" class="mr-1">mdi-calendar</v-icon>
              <strong>Publicado:</strong> {{ formatDate(vacante.fechaPublic) }}
            </div>

            <div class="mt-1">
              <v-icon size="18" class="mr-1">mdi-calendar-alert</v-icon>
              <strong>Vence:</strong> {{ formatDate(vacante.fechaVenc) }}
            </div>

            <div class="mt-1">
              <v-icon size="18" class="mr-1">mdi-check-circle</v-icon>
              <strong>Estado:</strong> {{ vacante.estado }}
            </div>
          </v-card-text>

          <v-divider class="mx-4 my-2" />

          <v-card-actions class="px-4 pb-4">
            <v-spacer />
            <v-btn
              color="primary"
              variant="elevated"
              @click="openDialog(vacante.id)"
              v-if="!postulaciones.find((x) => x.idVacante === vacante.id)"
            >
              <v-icon left>mdi-send</v-icon>
              Postular
            </v-btn>
            <v-btn
              color="success"
              variant="elevated"
              @click="openDialogDetalle(vacante.id)"
              v-if="postulaciones.find((x) => x.idVacante === vacante.id)"
            >
              <v-icon left>mdi-eye</v-icon>
              Ver Postulación
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getCurrentUser } from "@/services/userService";
import {
  getAllVacantes,
  postulacionCreate,
  getPostulacionesByUsuarioId,
  createPostulacionVisualiza,
} from "@/services/postulanteService";
import AppMessage from "@/components/shared/AppMessage.vue";

const maxSizeBytes = 2 * 1024 * 1024;

const authStore = useAuthStore();

const vacantes = ref([]);
const postulaciones = ref([]);

const formRef = ref(null);
const formValid = ref(false);

const vacanteSeleccionada = ref(null);

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

const openDialog = async (idVacante) => {
  const item = vacantes.value.find((v) => v.id === idVacante);
  vacanteSeleccionada.value = item;

  dialog.value = true;
  postulacionForm.idVacante = idVacante;

  const payload = {
    IdVacante: idVacante,
    IdUsuario: authStore.userId,
  };

  const response = await createPostulacionVisualiza(payload);
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const isSubmitting = ref(false);
const submitPostulacion = async () => {
  if (isSubmitting.value) return;

  const isValid = await formRef.value?.validate();
  if (!isValid) {
    showMessage("Por favor completa los campos requeridos.", "error");
    return;
  }

  isSubmitting.value = true;
  try {
    const base64CV = await readFileAsBase64(postulacionForm.cvFile);

    const data = {
      IdVacante: postulacionForm.idVacante,
      IdUsuario: authStore.userId,
      TelefonoOpc: postulacionForm.telefonoOpc,
      ComentarioOpc: postulacionForm.comentarioOpc,
      NombreCV: postulacionForm.cvFile.name,
      Base64CV: base64CV,
    };

    const resp = await postulacionCreate(data);

    if (!resp.isSuccess) {
      showMessage(resp.message || "Error al postular.", "error");
      return;
    }

    showMessage("Postulación exitosa.", "success");
    dialog.value = false;
    clearForm();

    await loadDataVacante();
    await loadDataPostulaciones();
  } catch (err) {
    console.log(err);
    showMessage("Error al enviar la postulación.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const clearForm = () => {
  Object.assign(postulacionForm, {
    telefonoOpc: "",
    comentarioOpc: "",
    cvFile: null,
    idVacante: null,
  });
};
</script>
