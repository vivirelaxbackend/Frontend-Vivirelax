<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const mobileMenu = ref(false)
const isServiciosMenuOpen = ref(false) // Estado para controlar el menú de servicios
const router = useRouter();

// Simple navigation function
const goTo = (page) => {
    console.log(`Navigating to ${page}`)
    // Implement your router logic here, e.g., this.$router.push(`/${page}`)
}
</script>

<template>
    <q-layout>
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
                        <q-item clickable v-ripple @click="goTo('masajes')">
                            <q-item-section>Masajes</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="goTo('mascarillas')">
                            <q-item-section>Mascarillas Corporales</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="goTo('limpieza_facial')">
                            <q-item-section>Limpieza Facial</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="goTo('reflexologia')">
                            <q-item-section>Reflexología Podal</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="goTo('desintoxicacion')">
                            <q-item-section>Desintoxicación Iónica</q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>

                <q-btn flat label="SOBRE NOSOTROS" @click="goTo('info')" class="text-bold" style="color: black;" />
                <q-btn flat label="CONTÁCTANOS" @click="goTo('contacto')" class="text-bold" style="color: black;" />

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
                    <q-item clickable v-ripple @click="goTo('contact')">
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
