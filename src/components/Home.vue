<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router for navigation
const router = useRouter()

// Function to navigate to other pages
</script>

<template>
  <q-page class="q-pa-md">

    <!-- Welcome Banner -->
    <div class="text-h4 q-mb-lg">
      Welcome to MyApp!
    </div>

    <!-- Intro text or content -->
    <p class="text-body1">
      This is the homepage of MyApp, built with Quasar and Vue 3. Use the navigation bar to explore the app.
    </p>

    <!-- Sample content area -->
    <div class="q-my-lg">
      <q-card>
        <q-card-section>
          <div class="text-h5">
            Featured Section
          </div>
          <p class="text-body2 q-mt-sm">
            Here you can add some featured content, an introduction to your app, or any other relevant information.
          </p>
        </q-card-section>

        <!-- Example button leading to another page -->
        <q-card-actions align="right">
          <q-btn flat label="Learn More"" />
        </q-card-actions>
      </q-card>
    </div>

  </q-page>
</template>



<style scoped>
/* Add custom styles for your Home page here */
</style>
