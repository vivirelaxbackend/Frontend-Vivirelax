<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreTipoServicio } from '../stores/tipo_servicio.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useStoreUsuarios } from '../stores/usuario.js';
import { useQuasar } from 'quasar';

const useTipoServicio = useStoreTipoServicio();
const useReserva = useStoreReserva();
const useUsuario = useStoreUsuarios();
const router = useRouter();
const tiposServicio = ref();
const showProfileModal = ref(false);

const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

function toggleProfileModal() {
    showProfileModal.value = !showProfileModal.value;
}

function cerrarSesion() {
    showProfileModal.value = false;
    useUsuario.token = '';
    useUsuario.usuario = '';
    useUsuario.id = '';
    router.push("/home")
}

function editarPerfil() {
    router.push('/panel-admin/editar-perfil');
}

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
    console.log(`Navigating to ${page}`);
}

onMounted(async () => {
    getInfo();
});

// Function to navigate to login
const goToLogin = () => {
    router.push('/login');
};
</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated style="padding: 10px;">
            <q-toolbar class="navbar">
                <!-- Logo or Title of the app -->
                <q-toolbar-title class="navbar-title" style="display: flex; align-items: center; padding: 5px;">
                    <q-img src="../assets/Vivirelax-logo3.png" style="width: 80px; height: auto; cursor: pointer;"
                        @click="router.push('/home')"></q-img>
                    <p class="text-bold" style="color: black; margin: 10px 10px; cursor: pointer;"
                        @click="router.push('/home')">VIVIRELAX</p>
                </q-toolbar-title>

                <!-- Navigation Menu -->
                <div class="navbar-menu">
                    <q-btn-dropdown flat label="SERVICIOS" class="text-bold" style="color: black;">
                        <q-list>
                            <q-item v-for="(servicio, index) in tiposServicio" :key="index" clickable v-ripple
                                @click="goTo(servicio._id)">
                                <q-item-section>{{ servicio.nombre_tip }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>

                    <q-btn flat label="SOBRE NOSOTROS" @click="goTo('info')" class="text-bold" style="color: black;" />

                    <!-- Login Button with icon -->
                    <div class="right-side d-none d-lg-flex"> <!-- Ocultar en pantallas menores de 984px -->
                        <q-btn v-if="!useUsuario.token" flat label="Contáctanos" class="right-btn bg-secondary"
                            @click="contactarnos" />
                        <q-btn v-if="useUsuario.token" flat label="Administrar servicios" class="right-btn bg-secondary" id="administrarboton"
                            @click="router.push('/panel-admin')" />

                        <template v-if="useUsuario.token">
                            <q-btn flat round icon="account_circle" class="right-btn bg-black"
                                @click="toggleProfileModal" />
                        </template>
                        <template v-else>
                            <router-link to="/login">
                                <q-btn flat round icon="login" class="right-btn bg-secondary" />
                            </router-link>
                        </template>
                    </div>
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>

        <!-- Modal de Perfil -->
        <q-dialog v-model="showProfileModal">
            <q-card class="custom-card">
                <q-card-section class="q-pt-none">
                    <div class="profile-info">
                        <q-avatar size="100px" rounded>
                            <q-icon name="person" />
                        </q-avatar>
                        <div class="profile-details">
                            <h6>{{ useUsuario.usuario.nombre }}</h6>
                            <p>{{ useUsuario.usuario.rol }}</p>
                        </div>
                    </div>
                    <q-card-actions align="center" class="q-pt-none "
                        style="gap: 10px; display: flex; justify-content: center; align-items: center;">
                        <q-btn flat label="Editar Perfil" class="bg-secondary" @click="editarPerfil"
                            style="width: 150px;" />
                        <q-btn flat label="Cerrar Sesión" class="bg-negative" color="white" @click="cerrarSesion"
                            style="width: 150px;" />
                    </q-card-actions>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-layout>
</template>

<style scoped>
/* Flexbox styles for responsive navigation */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-menu {
    display: flex;
    gap: 15px;
}

.right-btn {
    color: white;
}

.right-side {
    display: flex;
    align-items: center;
    gap: 10px;
}

.custom-card {
    width: 300px;
    border-radius: 20px;
    background-color: #f4f4f9;
}

.profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-details h6 {
    font-weight: bold;
    margin: 0;
}

.profile-details p {
    margin: 5px 0;
}

.bg-secondary:hover {
 background-color: black;
}

@media (max-width: 768px) {


    .navbar-menu {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .navbar-title {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
