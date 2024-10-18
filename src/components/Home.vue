<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreServicio } from '../stores/servicio.js';
import { useQuasar } from 'quasar';
import ImgCarrousel from '../assets/Vivirelax-carrousel.png';

const router = useRouter();
const useServicio = useStoreServicio();
const slide = ref(1);
const autoplay = true;
const servicios = ref([]);
const $q = useQuasar();

const showMapModal = ref(false);

function toggleMapModal() {
  showMapModal.value = !showMapModal.value;
}

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
    }

    servicios.value = response
      .filter(servicio => servicio.estado === true && servicio.idTipoServicio?.estado === true)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.log(error);
  }
}


const irTipoServicio = (idServicio) => {
  /* console.log(idServicio) */
  const url = router.resolve({ path: '/tipo-servicio', query: { id: idServicio._id } }).href;
  window.open(url, '_blank');
}

onMounted(async () => {
  getInfo();
});
</script>

<template>
  <div>
    <!-- Carousel seccion -->
    <div class="carousel-container">
      <q-carousel animated v-model="slide" navigation infinite :autoplay="autoplay" arrows
        @mouseenter="autoplay = false" @mouseleave="autoplay = true" class="carousel-container">
        <q-carousel-slide :name="1" :img-src="ImgCarrousel" class="carousel-slide" />
        <q-carousel-slide :name="2" img-src="https://www.pranaspa.com.co/wp-content/uploads/2022/02/facial-1.jpg"
          class="carousel-slide" />
        <q-carousel-slide :name="3"
          img-src="https://www.bellatriz.com/wp-content/uploads/2022/04/woman-relaxing-in-the-spa-scaled.jpg"
          class="carousel-slide" />
      </q-carousel>
    </div>

    <!-- Bienvenida seccion -->
    <div class="header-section">
      <h1 class="spa-title" style=" font-family: 'Poppins', sans-serif;">Bienvenid@ a VIVIRELAX</h1>
      <h2 class="spa-subtitle">Tu escape perfecto para la relajación y el bienestar</h2>
      <p class="spa-description">
        En ViVIRELAX ofrecemos una variedad de servicios de Relajación y Estética para tu renovación física y
        espiritual.
        Contamos con personal calificado y productos naturales para asegurar una experiencia de calidad.
      </p>
    </div>

    <!-- Servicios seccion -->
    <div class="services-section">
      <h3 class="text-center text-bold" style=" font-family: 'Poppins', sans-serif;">NUESTROS SERVICIOS</h3>
      <div class="services-container">
        <div v-for="(servicio, index) in servicios.slice(0, 4)" :key="index" class="card"
          @click="irTipoServicio(servicio.idTipoServicio)">
          <q-img :src="servicio.galeria[0]?.url" alt="Imagen del servicio" class="card-img" />
          <div class="card-body">
            <h4>{{ servicio.nombre_serv }}</h4>
            <p>{{ servicio.descripcion.slice(0, 100) }}...</p>
          </div>
        </div>
      </div>
    </div>

    <div class="map-preview">
      <h3 class="text-center text-bold" style=" font-family: 'Poppins', sans-serif;">¿DÓNDE ESTAMOS UBICADOS?</h3>
      <q-img
        src="https://maps.googleapis.com/maps/api/staticmap?center=6.633022899999999%2C-73.2239148&markers=6.633022899999999%2C-73.2239148&zoom=17&size=680x200&key=AIzaSyBHEIamPaljiaFeIRJX0TknCEi84x47yfc"
        alt="Google Maps Location" class="map-image" @click="toggleMapModal" style="cursor: pointer;" />

      <p class="text-center q-mt-lg">Haz clic en el mapa para ver más detalles</p>

      <!-- Name and Address -->
      <div class="flex-1">
        <p class="text-uppercase text-bold">Vivirelax</p>
        <p class="text-uppercase text-bold">Cra. 3 #4-67, Barichara, Santander, Colombia</p>
      </div>
    </div>

    <!-- Modal with Embedded Google Map -->
    <q-dialog v-model="showMapModal">
      <q-card style="min-height: 400px;" full-width>
        <q-card-section>
          <iframe width="100%" height="400" frameborder="0" style="border:0"
            :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyBHEIamPaljiaFeIRJX0TknCEi84x47yfc&center=6.633022899999999%2C-73.2239148&zoom=17&q=Vivirelax'"
            allowfullscreen>
          </iframe>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="negative" @click="toggleMapModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<style scoped>
.header-section {
  text-align: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.carousel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.q-carousel {
  width: 100%;
  height: auto;
}

.q-carousel-slide {
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Servicios Section */
.services-section {
  padding: 20px;
  background-color: #fff;
}

/* Usamos grid para que las tarjetas sean más flexibles y responsivas */
.services-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 20px;
  gap: 20px;
  justify-items: center;
}

/* Estilo de las tarjetas */
.card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Efecto al pasar el mouse sobre la tarjeta */
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Imagen de la tarjeta */
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

.map-preview {
  text-align: center;
  margin-top: 20px;
}

.map-image {
  width: 100%;
  max-width: 680px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.map-image:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
}

/* Ajustes adicionales para pantallas pequeñas */
@media (max-width: 768px) {
  .card-img {
    height: 150px;
  }

  .card h4 {
    font-size: 1.1rem;
  }

  .card p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .card {
    max-width: 100%;
    /* Tarjetas ocupan todo el ancho disponible en pantallas móviles */
  }

  .services-section {
    padding: 10px;
  }

  .card-img {
    height: 120px;
  }

  .card-body {
    padding: 12px;
  }

  .card h4 {
    font-size: 1rem;
  }

  .card p {
    font-size: 0.85rem;
  }
}
</style>
