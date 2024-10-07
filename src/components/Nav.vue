<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreTipoServicio } from '../stores/tipo_servicio.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useQuasar } from 'quasar';

const mobileMenu = ref(false);
const useTipoServicio = useStoreTipoServicio();
const useReserva = useStoreReserva();
const router = useRouter();
const tiposServicio = ref();

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
        const response = await useTipoServicio.getAll();
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        tiposServicio.value = response;
    } catch (error) {
        console.log(error);
    }
}

async function contactarnos() {
  const enlaceWhatsApp = await useReserva.generarEnlaceWhatsApp();
  window.open(enlaceWhatsApp, '_blank'); // Abre el enlace en una nueva pestaña
}


// Simple navigation function
const goTo = (page) => {
    const url = router.resolve({ path: '/tipo-servicio', query: { id: page } }).href;
    window.open(url, '_blank');
    console.log(`Navigating to ${page}`)
    // Implement your router logic here, e.g., this.$router.push(`/${page}`)
}

onMounted(async () => {
    getInfo();
});
</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated style="padding: 10px;">
            <q-toolbar>
                <!-- Logo or Title of the app -->
                <q-toolbar-title style="display: flex;align-items: center; padding: 5px;">
                    <q-img src="../assets/Vivirelax-logo3.png" style="width: 80px;height: auto; cursor: pointer;"
                        @click="router.push('/home')"></q-img>
                    <p class="text-bold" style="color: black;margin: 10px 10px; cursor: pointer;"
                        @click="router.push('/home')">VIVIRELAX</p>
                </q-toolbar-title>

                <!-- Spacer to push buttons to the right -->
                <q-space />

                <!-- Dropdown Menu for Servicios with hover functionality -->
                <q-btn-dropdown flat label="SERVICIOS" class="text-bold" style="color: black;">
                    <q-list>
                        <q-item v-for="(servicio, index) in tiposServicio" :key="index" clickable v-ripple
                            @click="goTo(servicio._id)">
                            <q-item-section>{{ servicio.nombre_tip }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>


                <q-btn flat label="SOBRE NOSOTROS" @click="goTo('info')" class="text-bold" style="color: black;" />
                <q-btn flat label="CONTÁCTANOS" @click="contactarnos"class="text-bold" style="color: black;" />

                <!-- Mobile Menu -->
                <q-btn flat round icon="menu" @click="mobileMenu = !mobileMenu" class="hide-on-desktop" />
            </q-toolbar>

            <!-- Drawer for mobile navigation -->
            <q-drawer v-model="mobileMenu" side="right" overlay>
                <q-list>
                    <q-item clickable v-ripple @click="goTo('home')">
                        <q-item-section>Home</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="goTo('about')">
                        <q-item-section>About</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="contactarnos">
                        <q-item-section>Contact</q-item-section>
                    </q-item>
                </q-list>
            </q-drawer>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style scoped>
/* Hide the mobile menu button on desktop screens */
.hide-on-desktop {
    display: none;
}

@media (max-width: 600px) {
    .hide-on-desktop {
        display: inline-block;
    }
}
</style>
