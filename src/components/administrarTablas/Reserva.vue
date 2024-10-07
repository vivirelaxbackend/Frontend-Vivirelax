<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreReserva } from '../../stores/reserva.js'; // Store para reservas
import { useStoreServicio } from '../../stores/servicio.js'; // Store para servicios
import { useRouter } from 'vue-router';

const useReserva = useStoreReserva();
const useServicio = useStoreServicio();  // Instancia del store de los servicios
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const router = useRouter();
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

const estado = ref('agregar');
const data = ref({});
const servicios = ref([]); // Lista de servicios que se mostrarán en el q-select

const columns = [
    { name: "nombre_res", label: "Nombre del cliente", field: "nombre_res", sortable: true, align: "left" },
    { name: "correo_res", label: "Correo del cliente", field: "correo_res", sortable: true, align: "left" },
    { name: "telefono_res", label: "Teléfono del cliente", field: "telefono_res", sortable: true, align: "left" },
    {
        name: "nombreServicio",
        label: "Servicio",
        field: (row) => {
            return row.idServicio ? row.idServicio.nombre_serv : ''; // Verifica si existe el servicio
        },
        sortable: true,
        align: "left"
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

// Obtener servicios
async function getServicios() {
    try {
        const response = await useServicio.getAll(); // Asumiendo que este método obtiene los servicios
        if (response && !response.error) {
            servicios.value = response; // Guardamos la lista de servicios
        } else {
            notificar('negative', 'Error al obtener los servicios');
        }
    } catch (error) {
        console.log(error);
    }
}

// Obtener reservas
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useReserva.getAll();
        console.log("reservas", response);
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        // Asignamos las reservas a la tabla
        rows.value = response.reverse();
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

// Al montar el componente, cargar los servicios y las reservas
onMounted(() => {
    getServicios();
    getInfo();
});

const opciones = {
    agregar: () => {
        data.value = {};
        estado.value = 'agregar';
        modal.value = true;
    },
    editar: (info) => {
        data.value = { ...info };
        estado.value = 'editar';
        modal.value = true;
        // Al editar, aseguramos que el servicio aparezca como seleccionado en el q-select
        data.value.idServicio = info.idServicio ? info.idServicio._id : null;
    }
};

const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const response = await useReserva.registro(data.value);
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            modal.value = false;
            notificar('positive', 'Reserva agregada exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            const response = await useReserva.editar(data.value._id, data.value);
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
            modal.value = false;
            notificar('positive', 'Reserva editada exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
};

function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            errorCamposVacios();
            return;
        }
    }
    enviarInfo[estado.value]();
}

const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReserva.activar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReserva.inactivar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    }
};

function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}
</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Reserva</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_res" label="Digite el nombre del cliente" color="black"
                            :rules="[val => !!val || 'Digite el nombre']" type="text" />
                        <q-input filled v-model.trim="data.correo_res" label="Digite el correo del cliente" color="black"
                            :rules="[val => !!val || 'Digite el correo']" type="email" />
                        <q-input filled v-model.trim="data.telefono_res" label="Digite el teléfono del cliente" color="black"
                            :rules="[val => !!val || 'Digite el teléfono']" type="text" />
                        <q-input filled v-model.trim="data.mensaje_res" label="Mensaje" color="black"
                            :rules="[val => !!val || 'Digite un mensaje']" type="textarea" />
                        <q-select v-model="data.idServicio" label="Servicio" color="black"
                            :options="servicios.map(serv => ({ label: serv.nombre_serv, value: serv._id }))" map-options
                            emit-value :rules="[val => !!val || 'Seleccione un servicio']" />
                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="black"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_res" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Reservas"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay reservas registradas.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Reservas</h4>
                    <q-btn @click="opciones.agregar" color="black">
                        <q-icon name="add" color="white" center />
                    </q-btn>
                </div>
            </template>

            <template v-slot:top-right>
                <q-input outlined dense debounce="300" color="black" v-model="filter" class="buscar"
                    placeholder="Buscar cualquier campo">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <q-btn :loading="props.row.estado === 'load'" :label="props.row.estado
                        ? 'Activo'
                        : !props.row.estado
                            ? 'Inactivo'
                            : '‎  ‎   ‎   ‎   ‎ '" :color="props.row.estado ? 'positive' : 'accent'"
                        loading-indicator-size="small"
                        @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id); props.row.estado = 'load'" />
                </q-td>
            </template>

            <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                    <div id="buttons">
                        <button class="editBtn bg-black" @click="opciones.editar(props.row)">
                            Editar
                        </button>
                    </div>
                </q-td>
            </template>
        </q-table>
    </main>
</template>


<style scoped>
#titleTable {
    margin: auto;
}

.editBtn {
    width: 80px;
    height: 55px;
    border-radius: 20px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.123);
    cursor: pointer;
    color: white;
}


.btn-go,
.btn-asignar {
    width: 9em;
    height: 55px;
    border-radius: 15px;
    font-size: 15px;
    font-family: inherit;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 6px 6px 12px #c5c5c5,
        -6px -6px 12px #ffffff;
}

.btn-go::before,
.btn-asignar::before {
    content: '';
    width: 0;
    height: 55px;
    border-radius: 15px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(to right, #39A900 0%, #39A900 100%);
    transition: .5s ease;
    display: block;
    z-index: -1;
}

.btn-go:hover::before,
.btn-asignar:hover::before {
    width: 9em;
}


#buttons {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 25px;
}
</style>