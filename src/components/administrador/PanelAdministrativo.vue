<script setup>
import { ref } from 'vue';
import { useStoreUsuarios } from '../../stores/usuario.js';
import Perfil from '../../assets/perfil.png'

const leftDrawerOpen = ref(false);
const useUsuario = useStoreUsuarios();

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
    <q-layout view="hHh lpR lFf">
        <q-header bordered class="bg-black text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title class="text-center">
                    ADMINISTRAR SERVICIOS
                </q-toolbar-title>
            </q-toolbar>
        </q-header>


        <q-drawer v-model="leftDrawerOpen" side="left" elevated>
            <div class="container-info">
                <div class="cont" style="display: flex; justify-content: center;">
                    <q-img :src="Perfil" style="max-width: 200px;"></q-img>
                </div>
                <p class="user text-h5">{{ useUsuario.usuario.nombre }}</p>
                <p class="user text-h5">Administrativo</p>
            </div>
            <div class="container-button">
                <div>
                    <router-link class="router" to="/panel-admin/tipo-servicio"> <button class="btn text-uppercase">Tipos de
                            Servicio</button></router-link>
                </div>
                <div>
                    <router-link class="router" to="/panel-admin/servicio"> <button
                            class="btn text-uppercase">Servicios</button></router-link>
                </div>
                <div>
                    <router-link class="router" to="/panel-admin/cliente"> <button
                            class="btn text-uppercase">Clientes</button></router-link>
                </div>
                <div>
                    <router-link class="router" to="/panel-admin/reserva"> <button
                            class="btn text-uppercase">Reservas</button></router-link>
                </div>
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>



<style scoped>
.container-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.btn {
    width: 200px;
    /* Tamaño fijo para el ancho del botón */
    height: 50px;
    /* Tamaño fijo para la altura del botón */
    display: flex;
    align-items: center;
    /* Centra el texto verticalmente */
    justify-content: center;
    /* Centra el texto horizontalmente */
    text-align: center;
    /* Asegura que el texto esté centrado */
    border: none;
    /* Sin borde */
    border-radius: 4px;
    /* Esquinas redondeadas */
    font-size: 16px;
    /* Tamaño del texto */
    cursor: pointer;
    /* Cursor tipo mano */
    transition: background-color 0.3s;
    /* Efecto de transición para el hover */
}

.btn:hover {
    background-color: black;
    /* Color de fondo al pasar el ratón */
    color: white;
    /* Color del texto al pasar el ratón */
}

.user {
    justify-content: center;
    align-items: center;
    display: flex;
}

.cont {
    align-items: center;
    justify-content: center;
    display: flex;
}

.btns-m {
    margin: 25px;
    margin-top: 40px;
}

.text {
    color: #fff;
    text-decoration: none;
}

.router {
    width: 100%;
    height: 100%;
    text-decoration: none;
}

.q-header {
    position: relative;
    /* Elimina la posición fixed o absolute */
    z-index: 1;
    height: auto;
    /* Permite que la altura del header sea dinámica */
}

.q-layout {
    margin-top: 0;
    /* Asegúrate de que no haya márgenes superiores no deseados */
    padding-top: 0;
    /* Evita que el padding superior mueva el layout */
}

/* Asegura que el q-page-container se apile correctamente debajo del Nav */
.q-page-container {
    padding-top: var(--q-header-height);
    /* Ajusta el padding dinámicamente según la altura del header */
}
</style>
