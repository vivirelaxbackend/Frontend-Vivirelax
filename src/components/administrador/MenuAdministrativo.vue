<script setup>
import { ref } from 'vue';
import TipoServicio from '../../assets/spa-y-relax.png';
import Servicio from '../../assets/masaje.png';
import Cliente from '../../assets/cliente.png';
import Reserva from '../../assets/reserva.png';
import Consulta from '../../assets/consulta.png';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
    <q-layout view="hhh LpR fFf">

        <q-page-container>
            <div class="lcare">
                <div class="card-info text-uppercase"><router-link class="router" to="/panel-admin/tipo-servicio"><img
                            :src="TipoServicio" alt=""></router-link>Tipos de Servicio</div>
                <div class="card-info text-uppercase"><router-link class="router" to="/panel-admin/servicio"><img :src="Servicio"
                            alt=""></router-link>Servicios
                </div>
                <div class="card-info text-uppercase"><router-link class="router" to="/panel-admin/cliente"><img :src="Cliente"
                            alt=""></router-link> Clientes
                </div>
                <div class="card-info text-uppercase"><router-link class="router" to="/panel-admin/reserva"><img :src="Reserva"
                            alt=""></router-link> Reservas
                </div>
<!--                 <div class="card-info text-uppercase"><router-link class="router" to="/panel-admin/consulta"><img :src="Consulta"
                            alt=""></router-link> Consultas
                </div> -->
            </div>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style>
img {
    width: 200px;
    height: 200px;
}

.cont {
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

button {
    width: 100%;
    height: 50px;
}

.router {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.lcare {
    display: flex;
    gap: 30px;
    margin: 100px;
    flex-wrap: wrap;
    justify-content: center;
}

.card-info {
    box-sizing: border-box;
    width: 250px;
    height: 254px;
    background: rgba(217, 217, 217, 0.58);
    border: 1px solid #ccc;
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    padding: 10px;
    /* Espaciado interno de las tarjetas (opcional) */
    text-align: center;
    /* Alineación de texto al centro (opcional) */
}

.card-info:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.card-info:active {
    transform: scale(0.95) rotateZ(1.7deg);
}
</style>
