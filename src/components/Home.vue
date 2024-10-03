<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreServicio } from '../stores/servicio.js';
import { useQuasar } from 'quasar';
import ImgCarrousel from '../assets/Vivirelax-carrousel.png';
import ImgCarrousel2 from '../assets/Vivirelax-carrousel2.png';
import ImgCarrousel3 from '../assets/Vivirelax-carrousel3.png';

const router = useRouter();
const useServicio = useStoreServicio();
const slide = ref(1);
const autoplay = true;
const servicios = ref([]);
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

onMounted(async () => {
  getInfo();
});
</script>

<template>
  <div >
    <!-- Carousel seccion -->
    <div class="carousel-container">
      <q-carousel animated height="700px" v-model="slide" navigation infinite :autoplay="autoplay" arrows
        transition-prev="slide-right" transition-next="slide-left" @mouseenter="autoplay = false"
        @mouseleave="autoplay = true">
        <q-carousel-slide :name="1" :img-src="ImgCarrousel" />
        <q-carousel-slide :name="2" img-src="https://www.pranaspa.com.co/wp-content/uploads/2022/02/facial-1.jpg" />
        <q-carousel-slide :name="3"
          img-src="https://www.bellatriz.com/wp-content/uploads/2022/04/woman-relaxing-in-the-spa-scaled.jpg" />
      </q-carousel>
    </div>

        <!-- Bienvenida seccion -->
    <div class="header-section">
      <h1 class="spa-title">Bienvenid@ a VIVIRELAX</h1>
      <h2 class="spa-subtitle">Tu escape perfecto para la relajación y el bienestar</h2>
      <p class="spa-description">
        En ViVIRELAX ofrecemos una variedad de servicios de Relajación y Estética para tu renovación física y espiritual.
        Contamos con personal calificado y productos naturales para asegurar una experiencia de calidad.
      </p>
    </div>

    <!-- Servicios seccion -->
    <div class="services-section">
      <h3 class="text-center text-bold">NUESTROS SERVICIOS</h3>
      <div class="services-container">
        <div v-for="(servicio, index) in servicios.slice(0, 3)" :key="index" class="card">
          <img :src="servicio.galeria[0]?.url" alt="Imagen del servicio" class="card-img" />
          <div class="card-body">
            <h4>{{ servicio.nombre_serv }}</h4>
            <p>{{ servicio.descripcion.slice(0, 100) }}...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.header-section {
  text-align: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.spa-title {
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
}

.spa-subtitle {
  font-size: 1.8rem;
  color: #ff6f61;
  margin-top: 10px;
}

.spa-description {
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Carousel Styles */


/* Services Section Styles */
.services-section {
  padding: 20px;
  background-color: #fff;
}

.services-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 16px;
}

.card h4 {
  margin: 0;
  font-size: 1.25rem;
}

.card p {
  margin: 8px 0 0;
  font-size: 1rem;
  color: #666;
}
</style>
