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

function formatPrice(price) {
    if (price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return price;
}

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
        serviciosPorTipo.value = response;
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
    console.log("idServicio", idServicio)
    const url = router.resolve({ path: '/detalle-servicio', query: { id: idServicio } }).href;
    window.open(url, '_blank');
}
</script>

<template>
    <q-page class="q-pa-md q-page-bg">
        <!-- Title of the selected service type in the center -->
        <div class="text-center q-mb-md">
            <h1 class="service-title text-uppercase">{{ nombreTipoServSelec }}</h1>
            <p class="text-subtitle2 service-subtitle">¡Explora nuestros servicios y selecciona el que más te guste!</p>
        </div>

        <!-- Display service cards in a horizontal layout -->
        <div class=" q-card-container">
            <q-card v-for="(servicio, index) in serviciosPorTipo" :key="index" class="q-mb-lg service-card">
                <!-- Image on the left, filling the entire height and 100% width -->
                <q-img :src="servicio.galeria[0]?.url || 'https://via.placeholder.com/150'" :alt="servicio.nombre_serv"
                    class="q-card-img" />

                <!-- Card content on the right -->
                <q-card-section class="q-card-content">
                    <div class="text-h5 service-card-principal-title text-bold">{{ servicio.nombre_serv }}</div>
                    <p>{{ servicio.descripcion.slice(0, 250) }}...</p>

                    <div>
                        <p class="service-card-title text-bold">Beneficios:</p>
                        <div style="display: flex; flex-direction: column;">
                            <p v-for="(beneficio, i) in servicio.beneficios.slice(0, 3)" :key="i">
                                <q-icon name="check_circle" color="green" />
                                {{ beneficio.descrip }}
                            </p>
                        </div>
                    </div>
                    <!-- Precio y Duración -->
                    <div class="service-details">
                        <div class="service-price">
                            <q-icon name="monetization_on" color="black" size="20px" />
                            {{ formatPrice(servicio.precio) }}
                        </div>
                        <div class="service-duration">
                            <q-icon name="schedule" color="black" size="20px" />
                            {{ servicio.duracion }}
                        </div>
                    </div>

                    <!-- "Ver información" Button -->
                    <div style="display: flex; justify-content: end;">
                        <q-btn label="Ver más" class="q-mt-md service-btn text-end"
                            @click="verInformacion(servicio._id)" />
                    </div>

                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<style scoped>
/* Body background and fonts */
.q-page-bg {
    background-color: #f9f9f9;
    min-height: 100vh;
    padding-bottom: 40px;
    font-family: 'Lora', serif;
}

.service-title {
    font-size: 2.8rem;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.5px;
}

.service-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 40px;
}

.q-card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

/* Horizontal card styles */
.service-card {
    width: 80%;
    display: flex;
    align-items: stretch;
    /* Ensure both image and content stretch to the same height */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 10px;
    background-color: white;
}

.service-card:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Image now uses 100% height and width of the left side */
.q-card-img {
    width: 35%;
    /* Takes up 35% of the card width */
    height: auto;
    object-fit: cover;
    /* Ensures the image covers the entire area without distortion */
    border-radius: 10px 0 0 10px;
}

/* Content section styles */
.q-card-content {
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
}

.service-card-principal-title {
    font-size: 2rem;
    color: #444;
    margin-bottom: 10px;
}

.service-card-title {
    font-size: 1.4rem;
    color: #444;
    margin-bottom: 10px;
}

.service-btn {
    background-color: #4a90e2;
    color: white;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.service-btn:hover {
    background-color: #357abd;
}

/* Service details for price and duration */
.service-details {
    display: flex;
    gap: 20px;
    color: #000000;
}

.service-price,
.service-duration {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
}

/* Responsive styles to adapt to mobile */
@media (max-width: 600px) {
    .service-card {
        flex-direction: column;
        max-width: 100%;
    }

    .q-card-img {
        width: 100%;
        height: auto;
        border-radius: 10px 10px 0 0;
    }

    .q-card-section {
        padding: 15px;
    }
}
</style>
