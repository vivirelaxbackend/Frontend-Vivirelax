<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ImgCarrousel from '../assets/Vivirelax-carrousel.png';
import ImgCarrousel2 from '../assets/Vivirelax-carrousel2.png';
import ImgCarrousel3 from '../assets/Vivirelax-carrousel3.png';

// Router for navigation
const router = useRouter()
const slide = ref(1);
const autoplay = true;
</script>

<template>
  <div class="carousel-container">
    <q-carousel animated height="700px" v-model="slide" navigation infinite :autoplay="autoplay" arrows transition-prev="slide-right"
      transition-next="slide-left" @mouseenter="autoplay = false" @mouseleave="autoplay = true" >
      <q-carousel-slide :name="1"  :img-src="ImgCarrousel"/>
      <q-carousel-slide :name="2" img-src="https://www.pranaspa.com.co/wp-content/uploads/2022/02/facial-1.jpg" />
      <q-carousel-slide :name="3" img-src="https://www.bellatriz.com/wp-content/uploads/2022/04/woman-relaxing-in-the-spa-scaled.jpg" />
    </q-carousel>
  </div>
</template>

<style scoped>

</style>
