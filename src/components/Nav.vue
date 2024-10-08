<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreTipoServicio } from '../stores/tipo_servicio.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useStoreUsuarios } from '../stores/usuario.js';
import { useStoreConsulta } from '../stores/consulta.js';
import { useQuasar } from 'quasar';

const useTipoServicio = useStoreTipoServicio();
const useReserva = useStoreReserva();
const useUsuario = useStoreUsuarios();
const useConsulta = useStoreConsulta();
const nombre_con = ref('');
const correo_con = ref('');
const telefono_con = ref('');
const mensaje_con = ref('Hola, me gustaría solicitar más información sobre los servicios y el catálogo que ofrece su SPA. ¿Podrían proporcionarme detalles, por favor?');
const router = useRouter();
const tiposServicio = ref();
const showProfileModal = ref(false);
const mostrarModalContacto = ref(false);
const loading = ref(false);
const navbarShrink = ref(false);

const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

function abrirContactoModal() {
    mostrarModalContacto.value = !mostrarModalContacto.value;
}

const limpiar = () => {
    nombre_con.value = '';
    correo_con.value = '';
    telefono_con.value = '';
    mensaje_con.value = 'Hola, me gustaría solicitar más información sobre los servicios y el catálogo que ofrece su SPA. ¿Podrían proporcionarme detalles, por favor?';
    mostrarModalContacto.value = false;
}

// Función para enviar la consulta
const enviarConsulta = async () => {
    loading.value = true;
    const data = {
        mensaje_con: mensaje_con.value,
        nombre_con: nombre_con.value,
        correo_con: correo_con.value,
        telefono_con: telefono_con.value,
    };


    try {
        const response = await useConsulta.registro(data);
        console.log(response);

        if (useConsulta.estatus === 200) {
            notificar('positive', "Consulta enviada con éxito");
            limpiar();
        } else if (useConsulta.estatus === 400) {
            notificar('negative', useConsulta.validacion);
        }
    } catch (error) {
        console.log(error);
        notificar('negative', 'Error al enviar la reserva. Intenta nuevamente.');
    } finally {
        loading.value = false;
    }
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
    window.open(enlaceWhatsApp, '_blank');
}


const goTo = (page) => {
    const url = router.resolve({ path: '/tipo-servicio', query: { id: page } }).href;
    window.open(url, '_blank');
    console.log(`Navigating to ${page}`);
}

const handleScroll = () => {
    if (window.scrollY > 50) { // Change the threshold as per your need
        navbarShrink.value = true;
    } else {
        navbarShrink.value = false;
    }
};

onMounted(async () => {
    window.addEventListener('scroll', handleScroll);
    getInfo();
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-header :class="{ 'navbar-shrink': navbarShrink }" elevated style="padding: 10px;">
            <q-toolbar class="navbar">
                <!-- Logo or Title of the app -->
                <q-toolbar-title class="navbar-title" style="display: flex; align-items: center; padding: 5px;">
                    <q-img src="../assets/Vivirelax-logo3.png" style="width: 80px; height: auto; cursor: pointer;"
                        @click="router.push('/home')"></q-img>
                    <p class="text-bold" style="color: black; margin: 10px 10px; cursor: pointer; font-size: 1.7rem;"
                        @click="router.push('/home')">VIVIRELAX</p>
                </q-toolbar-title>

                <!-- Navigation Menu -->
                <div class="navbar-menu">
                    <q-btn-dropdown flat label="SERVICIOS" class="text-bold" style="color: black; font-size: 1.1rem;">
                        <q-list style="padding: 7px;">
                            <q-item v-for="(servicio, index) in tiposServicio" class="spa-service-item" :key="index"
                                clickable v-ripple @click="goTo(servicio._id)">
                                <q-item-section>{{ servicio.nombre_tip }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>

                    <q-btn flat label="SOBRE NOSOTROS" @click="goTo('info')" class="text-bold" style="color: black; font-size: 1.1rem;" />

                    <!-- Login Button with icon -->
                    <div class="right-side d-none d-lg-flex"> <!-- Ocultar en pantallas menores de 984px -->
                        <q-btn v-if="!useUsuario.token" flat label="Contáctanos" class="text-bold" color="black" style="font-size: 1.1rem;"
                            @click="abrirContactoModal" />
                        <q-btn v-if="useUsuario.token" flat label="Administrar servicios" class="right-btn bg-secondary"
                            id="administrarboton" @click="router.push('/panel-admin')" />

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

        <q-btn v-if="!useUsuario.token" fab class="whatsapp-btn" @click="contactarnos">
            <i class="fa-brands fa-whatsapp fa-3x"></i>
        </q-btn>

        <!-- Modal de Contactanos -->
        <q-dialog v-model="mostrarModalContacto">
            <q-card style="min-width: 400px">
                <q-card-section class="text-h6 text-bold text-uppercase">
                    <div class="text-h6 text-bold">Contáctanos</div>
                </q-card-section>

                <q-card-section>
                    <p class="text-body2 q-mb-lg">
                        Rellena este formulario y el SPA VIVIRELAX se pondrá en contacto contigo en breve.
                        Todos los datos que envíes serán tratados de forma confidencial.
                    </p>

                    <!-- Formulario -->
                    <q-form @submit="enviarConsulta" class="q-gutter-md">
                        <q-input filled v-model="mensaje_con" color="black" label="Mensaje" type="textarea" :rows="4" />
                        <q-input filled v-model="nombre_con" color="black" label="Digite su nombre y apellidos"
                            :rules="[val => !!val || 'El nombre es obligatorio']" />
                        <q-input filled v-model="correo_con" color="black" label="Digite un correo electrónico"
                            type="email"
                            :rules="[val => !!val || 'El correo es obligatorio', val => /.+@.+\..+/.test(val) || 'Correo no válido']" />
                        <q-input filled v-model="telefono_con" color="black" label="Digite un número telefónico"
                            type="number" :rules="[val => !!val || 'El teléfono es obligatorio']" />
                    </q-form>

                </q-card-section>

                <!-- Botones del diálogo -->
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="black" @click="abrirContactoModal" />
                    <q-btn label="Enviar" color="black" @click="enviarConsulta" :loading="loading"
                        :disabled="loading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Modal de Perfil -->
        <q-dialog v-model="showProfileModal">
            <q-card class="custom-card" style="padding: 10px; border-radius: 15px;">
                <q-card-section class="q-pt-none">
                    <div class="profile-info">
                        <q-avatar size="100px">
                            <q-icon name="person" />
                        </q-avatar>
                        <div class="profile-details">
                            <h6>{{ useUsuario.usuario.nombre }}</h6>
                            <p>{{ useUsuario.usuario.rol }}</p>
                        </div>
                    </div>
                    <q-card-actions align="center" class="q-pt-none"
                        style="gap: 10px; display: flex; justify-content: center; align-items: center; width: 100%;">
                        <q-btn flat label="Editar Perfil" class="bg-secondary" color="white" @click="editarPerfil"
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
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: height 0.3s ease-in-out, padding 0.3s ease-in-out;
    height: 100%;
}

.navbar-shrink {
    height: 12%;
    padding: 20px;
}

.navbar-title {
    transition: font-size 0.5s ease-in-out;
}

.navbar-shrink .navbar-title {
    font-size: 1.1rem;
    /* Smaller font size when navbar shrinks */
}

.navbar-menu {
    transition: transform 0.3s ease-in-out;
}

.navbar-shrink .navbar-menu {
    transform: scale(0.9);
    /* Slightly smaller menu items on scroll */
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



.spa-service-item {
    background-color: #f9f9f9;
    border-radius: 10px;
    margin: 10px 0;
    padding: 15px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.spa-service-item:hover {
    background-color: #fff0f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.spa-service-item q-item-section {
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: #333;
    text-align: center;
}

.spa-service-item q-item-section:hover {
    color: #d32f2f;
}

.spa-service-item {
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.spa-service-item:hover {
    transform: scale(1.03);
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

.whatsapp-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    background-color: #25D366;
    /* Color oficial de WhatsApp */
    color: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.whatsapp-btn:hover {
    background-color: #128C7E;
    /* Color más oscuro al pasar el mouse */
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
