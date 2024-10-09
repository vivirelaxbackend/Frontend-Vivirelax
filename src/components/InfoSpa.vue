<script setup>
import { ref, onMounted } from 'vue';
import Vivirelax from "../assets/Vivirelax-carrousel.png";
import { useStoreServicio } from "../stores/servicio.js";
import { useQuasar } from 'quasar';
import { useRouter } from "vue-router";

const servicios = ref([]);
const useServicio = useStoreServicio();
const router = useRouter();
const $q = useQuasar();

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
};



async function getInfo() {
  try {
    const response = await useServicio.getAll();
    if (!response) return;
    if (response.error) {
      notificar('negative', response.error);
      return;
    };
    servicios.value = response;
  } catch (error) {
    console.log(error);
  }
}

const irTipoServicio = (idServicio) => {
  console.log(idServicio)
    const url = router.resolve({ path: '/tipo-servicio', query: { id: idServicio._id } }).href;
    window.open(url, '_blank');
}

onMounted(()=>{
    getInfo();
})
</script>

<template>
    <div class="info-container q-pa-md">
        <!-- Banner section -->
        <q-img :src="Vivirelax" alt="Spa Banner" class="info-banner" :ratio="16 / 9" />

        <!-- About Us Section -->
        <div class="about-section q-mt-xl">
            <h2 class="section-title text-uppercase">Sobre Nosotros</h2>
            <p class="section-description">
                En <strong>ViVIRELAX</strong>, nos dedicamos a ofrecer una experiencia de relajación total. Nuestro
                centro cuenta con un ambiente cálido y acogedor, rodeado de naturaleza, diseñado para brindarte paz y
                bienestar. Ofrecemos tratamientos de spa de alta calidad, ideales para revitalizar tu cuerpo y mente.
            </p>
        </div>

        <!-- Our Philosophy Section -->
        <div class="philosophy-section q-mt-xl q-pb-md">
            <q-card flat bordered class="philosophy-card">
                <q-card-section>
                    <div class="text-center q-mb-md">
                        <q-icon name="spa" size="64px" color="green-8" />
                    </div>
                    <h3 class="text-center philosophy-title">Nuestra Filosofía</h3>
                    <p class="text-center philosophy-text">
                        Creemos en la conexión entre el cuerpo, la mente y el espíritu. En ViVIRELAX, nuestros
                        tratamientos están diseñados no solo para relajarte, sino también para armonizar tus energías y
                        restaurar el equilibrio interior.
                    </p>
                </q-card-section>
            </q-card>
        </div>

        <!-- Services Highlights Section -->
        <div class="services-highlights q-mt-xl">
            <h3 class="section-title">Destacados del Spa</h3>
            <div class="services-cards-container q-gutter-md q-mt-md">
                <q-card flat bordered v-for="(servicio, index) in servicios.slice(2, 5)" :key="index" class="service-card" @click="irTipoServicio(servicio.idTipoServicio)">
                    <q-img :src="servicio.galeria[0]?.url" alt="Imagen del servicio" class="service-img"
                    :ratio="4 / 3" />
                    <q-card-section>
                        <h4 class="service-title">{{ servicio.nombre_serv }}</h4>
                        <p class="service-description">
                            {{ servicio.descripcion.slice(0, 200) }}..
                        </p>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.info-container {
    background-color: #f4f4f4;
}

.info-banner {
    border-radius: 12px;
    max-height: 100%;
    object-fit: cover;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.about-section,
.philosophy-section,
.services-highlights {
    text-align: center;
    padding: 20px;
}

.section-title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.section-description {
    font-size: 1.2rem;
    color: #666;
    margin-top: 10px;
    line-height: 1.6;
}

.philosophy-card {
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

.philosophy-title {
    font-size: 1.8rem;
    color: #333;
}

.philosophy-text {
    font-size: 1.2rem;
    color: #666;
    padding: 0 20px;
}

.services-cards-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.service-card {
    width: 100%;
    max-width: 300px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.service-img {
    border-radius: 12px 12px 0 0;
    object-fit: cover;
}

.service-title {
    font-size: 1.4rem;
    color: #333;
    margin: 0;
}

.service-description {
    font-size: 1rem;
    color: #666;
    margin-top: 10px;
}

@media (max-width: 768px) {
    .services-cards-container {
        flex-direction: column;
    }
}
</style>