<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStoreServicio } from '../stores/servicio.js';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const useServicio = useStoreServicio();
const serviciosPorTipo = ref([]);
const idTipoServicio = ref();
const servicios = ref([]);
const $q = useQuasar();

// Get the name of the selected service type from the store
const nombreTipoServSelec = ref("");

// Notify the user
function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

// Fetch services for the selected service type
async function getServiciosPorTipo() {
    try {
        const response = await useServicio.getPorTipoServicio(idTipoServicio.value);
        if (response) {
            serviciosPorTipo.value = response;
            if (response.length > 0) {
                // Set the name of the selected service type
                nombreTipoServSelec.value = response[0].idTipoServicio.nombre_tip;
            }
        }
        console.log(serviciosPorTipo);
    } catch (error) {
        console.log(error);
    }
}

// Fetch all services if no specific type is selected
async function getInfo() {
    try {
        const response = await useServicio.getAll();
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        }
        servicios.value = response;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    const TipoServicio = route.query.id;
    if (TipoServicio) {
        idTipoServicio.value = TipoServicio;
        await getServiciosPorTipo(); // Fetch services based on the selected type
    } else {
        getInfo(); // Fetch all services
    }
});




// Navigate to detailed service information
function verInformacion(idServicio) {
    router.push({ path: `/servicio/${idServicio}` });
}
</script>

<template>
    <q-page class="q-pa-md">
        <!-- Title of the selected service type in the center -->
        <div class="text-center q-mb-md">
            <h1>{{ nombreTipoServSelec }}</h1>
            <p class="text-subtitle2 text-bold">¡Explora nuestros servicios y selecciona el que más te guste!</p>
        </div>

        <!-- Display service cards in a horizontal layout -->
        <div class="q-gutter-md ">
            <q-card v-for="(servicio, index) in serviciosPorTipo" :key="index" class="q-mb-lg"
                style="max-width: 1000px; margin: 0; display: flex;">
                <!-- Card Image with fixed width -->
                <q-img :src="servicio.galeria[0]?.url || 'https://via.placeholder.com/150'" :alt="servicio.nombre_serv"
                    class="q-card-img" style="width: 300px; height: auto;" />
                <q-card-section style="flex: 1; padding-left: 30px;"> 
                    <div class="text-h5 text-bold">{{ servicio.nombre_serv }}</div>
                    <p>{{ servicio.descripcion.slice(0, 250) }}...</p>
                    <div class="text-bold text-h6">BENEFICIOS:</div>
                    <p v-for="(beneficio, i) in servicio.beneficios.slice(0, 3)" :key="i"><q-icon name="check_circle"
                            color="green" />
                        {{ beneficio.descrip }}
                    </p>
                    <!-- "Ver información" Button -->
                    <q-btn label="Más información" class="q-mt-md text-center" @click="verInformacion(servicio._id)" />
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<style scoped>
.q-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Horizontal card styles */
.q-card {
    flex-direction: row;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* Add some shadow for better visual */
}

/* Adjust image sizing for horizontal layout */
.q-card-img {
    object-fit: cover;
    border-radius: 8px 0 0 8px;
}

/* Responsive styles to adapt to mobile */
@media (max-width: 600px) {
    .q-card {
        flex-direction: column;
        max-width: 100%;
    }

    .q-card-img {
        width: 100%;
        /* Make the image take full width on mobile */
        height: auto;
    }
}
</style>
