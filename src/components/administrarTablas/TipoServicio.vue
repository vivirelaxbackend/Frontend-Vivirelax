<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreTipoServicio } from '../../stores/tipo_servicio.js'; // Store debe adaptarse para TipoServicio
import { useRouter } from 'vue-router';

const useServicio = useStoreTipoServicio();  // Asumimos que la store maneja el modelo TipoServicio
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

const columns = [
    { name: "nombre_tip", label: "Nombre del tipo de servicio", field: "nombre_tip", sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useServicio.getAll(); // Se espera que la store maneje TipoServicio
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        rows.value = response.reverse(); // Invertir si es necesario mostrar los últimos primero
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

getInfo();

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
    }
};

const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const response = await useServicio.registro(data.value); // Agregar tipo de servicio
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            modal.value = false;
            notificar('positive', 'Tipo de servicio agregado exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            const response = await useServicio.editar(data.value._id, data.value); // Editar tipo de servicio
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualizar la fila en el frontend
            modal.value = false;
            notificar('positive', 'Tipo de servicio editado exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
}

function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            errorCamposVacios();
            return;
        }
    }
    enviarInfo[estado.value](); // Llama a la acción de agregar o editar
}

const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useServicio.activar(id); // Activar tipo de servicio
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualizar la fila en el frontend
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useServicio.inactivar(id); // Inactivar tipo de servicio
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualizar la fila en el frontend
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

function verServicios(servicio) {
    /* console.log(servicio) */
    router.push({ path: '/panel-admin/servicio', query: { id: servicio._id } }).href;
    useServicio.tipoServicioId = servicio;
}

</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Tipo de Servicio</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_tip" label="Nombre del tipo de servicio" color="black"
                            :rules="[val => !!val || 'Digite el nombre']" />
                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="black"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_tip" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Tipos de Servicios"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay tipos de servicio registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Tipos de Servicios</h4>
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
                        <button class="editBtn bg-black" @click="verServicios(props.row)">
                            Ver servicios
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