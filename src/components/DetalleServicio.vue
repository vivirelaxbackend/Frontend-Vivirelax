<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStoreServicio } from '../stores/servicio.js';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const useServicio = useStoreServicio();
const idServicio = ref();
const servicio = ref();
const $q = useQuasar();
const showModal = ref(false);
const currentImgIndex = ref(0);

// Notify the user
function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

// Fetch services for the selected service type
async function cargarServicio(id) {
  try {
    const response = await useServicio.getPorId(id);

    if (response) {
      servicio.value = response;
    }
  } catch (error) {
    notificar('negative', 'Error al cargar el servicio');
    console.error('Error al cargar', error);
  }
}

// Open the modal and set the index of the clicked image
function openModal(index) {
  currentImgIndex.value = index;
  showModal.value = true;
}

function formatearDescripcion(texto) {
  // Si el texto es undefined o null, devolvemos una cadena vacía.
  return texto ? texto.replace(/\n/g, '<br>') : '';
}

onMounted(async () => {
    const Servicio = route.query.id;
    if (Servicio) {
        idServicio.value = Servicio;
        await cargarServicio(Servicio); // Fetch services based on the selected type
    }   
});
</script>

<template>
    <q-page class="q-pa-md">
        <div v-if="servicio">
            <!-- Collage Image Section -->
            <div class="image-collage q-mb-lg">
                <div v-for="(img, index) in servicio.galeria.slice(0, 4)" :key="img._id"
                    class="collage-image" @click="openModal(index)">
                    
                    <!-- Si no es la última imagen, muestra la imagen normal -->
                    <q-img v-if="index < 3" :src="img.url" alt="gallery image" />

                    <!-- Si es la última imagen, muestra el overlay con "Ver más" -->
                    <div v-else class="last-image">
                        <q-img :src="img.url" alt="gallery image" />
                        <div class="overlay-text">Ver más...</div>
                    </div>
                </div>
            </div>

            <!-- Modal for viewing all images -->
            <q-dialog v-model="showModal" full-width full-height>
                <q-carousel  v-model="currentImgIndex" :value="currentImgIndex" arrows navigation infinite control-color="black">
                    <q-carousel-slide v-for="(img, index) in servicio.galeria" :key="img._id" :name="index" >
                        <q-img :src="img.url" />
                    </q-carousel-slide>
                </q-carousel>
            </q-dialog>

            <!-- Service Details -->
            <q-card class=" service-details-card" style="max-width: 900px; margin: 0 auto;">
                <q-card-section>
                    <div class="text-h2 text-bold text-center">{{ servicio.nombre_serv }}</div>
                    <p class="q-mt-lg" v-html="formatearDescripcion(servicio.descripcion)"></p>

                    <!-- Beneficios -->
                    <div>
                        <p class="text-bold text-h5 ">Beneficios:</p class="text-bold text-h5 ">
                            <p v-for="beneficio in servicio.beneficios" :key="beneficio._id">
                                <q-icon name="check_circle" color="green" />
                                {{ beneficio.descrip }}
                            </p>
                    </div>

                    <!-- Precio y Duración -->
                    <div class="q-mt-md">
                        <p><strong>Precio: </strong> {{ servicio.precio }}</p>
                        <p><strong>Duración: </strong> {{ servicio.duracion }}</p>
                    </div>

                    <!-- Botón para Reservar -->
                    <div class="text-center">
                        <q-btn label="Reservar" color="dark" class="q-mt-lg" size="18px" />
                    </div>

                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<style scoped>
.image-collage {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
}

.collage-image {
    width: 250px; /* Fijamos el ancho del contenedor */
    height: 170px; /* Fijamos la altura */
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.collage-image q-img {
    object-fit: cover; /* Asegura que la imagen llene el contenedor sin deformarse */
    width: 100%;
    height: 100%;
}

.last-image {
    position: relative;
    width: 250px; /* Aseguramos que también tenga el mismo ancho que las demás imágenes */
    height: 150px;
    border-radius: 8px;
}

.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo negro semitransparente */
    padding: 10px;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    pointer-events: none;
}

.service-details-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.q-mt-md {
    margin-top: 16px;
}

.q-mt-lg {
    margin-top: 24px;
}

</style>
