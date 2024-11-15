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
            serviciosPorTipo.value = response.filter(servicioSalon => servicioSalon.estado === true);;
            if (response.length > 0) {
                // Set the name of the selected service type
                nombreTipoServSelec.value = response[0].idTipoServicio.nombre_tip;
            }
        }
        /* console.log(serviciosPorTipo); */
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
    /* console.log("idServicio", idServicio) */
    const url = router.resolve({ path: '/detalle-servicio', query: { id: idServicio } }).href;
    window.open(url, '_blank');
}
</script>

<template>
    <q-page class="q-pa-md q-page-bg">
        <!-- Title of the selected service type in the center -->
        <div class="service-header text-center q-mb-md">
            <h1 class="service-title text-uppercase">{{ nombreTipoServSelec }}</h1>
            <div class="decorative-bar"></div>
            <p class="text-subtitle2 service-subtitle">
                ¡Explora nuestros servicios y selecciona el que más te guste!
            </p>
        </div>


        <!-- Display service cards in a horizontal layout -->
        <div class=" q-card-container">
            <q-card v-for="(servicio, index) in serviciosPorTipo" :key="index" class="q-mb-lg service-card">
                <!-- Image on the left, filling the entire height and 100% width -->
                <q-img :src="servicio.galeria[0]?.url || 'https://via.placeholder.com/150'" :alt="servicio.nombre_serv"
                style="object-fit: cover; width: 100%; height: 320px;" />

                <!-- Card content on the right -->
                <q-card-section class="q-card-content">
                    <div class="text-h5 service-card-principal-title text-bold">{{ servicio.nombre_serv }}</div>
                    <p>{{ servicio.descripcion.slice(0, 180) }}...</p>

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
                        <div v-if="servicio.precio > 0" class="service-price">
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
/* Background general y tipografías */
.q-page-bg {
    background-color: #f4f4f9;
    min-height: 100vh;
    padding-bottom: 40px;
    font-family: 'Lora', serif;
}

/* Contenedor general de la cabecera de servicio */
.service-header {
    background: linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%);
    padding: 15px 15px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 40px;
    position: relative;
}

/* Título del servicio */
.service-title {
    font-size: 2.8rem;
    font-weight: 700;
    color: #333;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
}

/* Barra decorativa debajo del título */
.decorative-bar {
    width: 100px;
    height: 4px;
    background-color: #68a5be;
    margin: 0 auto;
    border-radius: 2px;
    transition: width 0.3s ease;
    position: relative;
    z-index: 1;
}

.service-title:hover+.decorative-bar {
    width: 150px;
}

/* Subtítulo */
.service-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-top: 20px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
    position: relative;
    z-index: 1;
}

/* Decoración visual adicional: sombra flotante */
.service-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    z-index: 0;
}


/* Contenedor de tarjetas */
.q-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    justify-content: center;
}

/* Estilos de las tarjetas */
.service-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 10px;
    background-color: #fff;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Imagen dentro de la tarjeta */
.q-card-img {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
}

/* Contenido de la tarjeta */
.q-card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Título de servicio */
.service-card-principal-title {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 10px;
}

/* Beneficios y detalles del servicio */
.service-card-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #555;
}

.service-details {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    font-size: 1.1rem;
}

/* Precio y duración */
.service-price,
.service-duration {
    display: flex;
    align-items: center;
    color: #333;
}

/* Estilos del botón */
.service-btn {
    background-color: #357ABD;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    transition: background-color 0.3s ease;
    align-self: flex-end;
    margin-top: 15px;
}

.service-btn:hover {
    background-color: #4d6f1c;
}

/* Estilos responsivos */
@media (max-width: 768px) {
    .service-card {
        max-width: 100%;
    }
}

@media (max-width: 600px) {
    .service-title {
        font-size: 2rem;
    }
}
</style>
