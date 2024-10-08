<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreConsulta } from '../../stores/consulta.js'; // Asumiendo que tienes esta store para gestionar "Consultas"
import { useRouter } from 'vue-router';

const useConsultaStore = useStoreConsulta();
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const router = useRouter();
const $q = useQuasar();

// Función para notificaciones
function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const estado = ref('agregar');
const data = ref({}); // Datos para enviar en el formulario

// Columnas de la tabla para mostrar los detalles de la consulta
const columns = [
    { name: "nombre_con", label: "Nombre Cliente", field: "nombre_con", sortable: true, align: "left" },
    { name: "correo_con", label: "Correo Cliente", field: "correo_con", sortable: true, align: "left" },
    { name: "telefono_con", label: "Teléfono Cliente", field: "telefono_con", sortable: true, align: "left" },
    { name: "mensaje_con", label: "Mensaje", field: "mensaje_con", sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]); // Lista de consultas

// Obtener los datos de las consultas desde la store
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useConsultaStore.getAll(); // Asumiendo que 'getAll()' obtiene todas las consultas
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        rows.value = response.reverse(); // Mostrar las consultas más recientes primero
    } catch (error) {
        console.error(error);
    } finally {
        loadingTable.value = false;
    }
}

// Cargar la información cuando el componente se monte
onMounted(getInfo);

// Acciones para abrir el modal para agregar o editar una consulta
const opciones = {
    agregar: () => {
        data.value = {}; // Limpiar los datos del formulario
        estado.value = 'agregar';
        modal.value = true;
    },
    editar: (info) => {
        data.value = { ...info }; // Rellenar el formulario con los datos seleccionados
        estado.value = 'editar';
        modal.value = true;
    }
};

// Manejar el envío de formulario para agregar o editar una consulta
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const response = await useConsultaStore.registro(data.value); // Asumiendo que 'registro()' agrega una nueva consulta
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            modal.value = false;
            notificar('positive', 'Consulta agregada exitosamente');
            getInfo(); // Actualizar la tabla
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        try {
            loadingModal.value = true;
            const response = await useConsultaStore.editar(data.value._id, data.value); // Asumiendo que 'editar()' actualiza la consulta
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            modal.value = false;
            notificar('positive', 'Consulta editada exitosamente');
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualizar la lista local
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    }
};

// Validar los campos del formulario antes de enviar
function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            notificar('negative', 'Por favor, complete todos los campos obligatorios.');
            return;
        }
    }
    enviarInfo[estado.value](); // Llamar a agregar o editar según el estado
}

// Acciones para activar o desactivar consultas
const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useConsultaStore.activar(id); // Asumiendo que 'activar()' activa una consulta
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualizar la lista local
        } catch (error) {
            console.error(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useConsultaStore.inactivar(id); // Asumiendo que 'inactivar()' desactiva una consulta
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.error(error);
        } finally {
            loadIn_activar.value = false;
        }
    }
};

// Función auxiliar para buscar el índice de una consulta en la lista local por _id
function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal para agregar/editar consultas -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Consulta</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_con" label="Nombre del solicitante"
                            :rules="[val => !!val || 'Digite el nombre']" color="black" />
                        <q-input filled v-model.trim="data.correo_con" label="Correo electrónico"
                            :rules="[val => !!val || 'Digite el correo']" color="black" />
                        <q-input filled v-model.trim="data.telefono_con" label="Teléfono"
                            :rules="[val => !!val || 'Digite el teléfono']" color="black" />
                        <q-input filled v-model.trim="data.mensaje_con" label="Mensaje"
                            :rules="[val => !!val || 'Digite el mensaje']" type="textarea" color="black" />

                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="black" :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla para mostrar la lista de consultas -->
        <q-table :rows="rows" :columns="columns" row-key="correo_con" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Consultas"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay consultas registradas.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Consultas de los Clientes</h4>
                    <q-btn @click="opciones.agregar" color="black">
                        <q-icon name="add" color="white" />
                    </q-btn>
                </div>
            </template>

            <template v-slot:top-right>
                <q-input outlined dense debounce="300" color="black" v-model="filter"
                    placeholder="Buscar cualquier campo">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body-cell-mensaje_con="props">
                <q-td :props="props" class="mensaje">
                    <VMenu class="vmenu">
                        <span class="mensaje">{{ props.row.mensaje_con }}</span>
                        <template #popper>
                            <div class="descripVmenu">{{ props.row.mensaje_con }}</div>
                        </template>
                    </VMenu>
                </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <q-btn :loading="props.row.estado === 'load'" :label="props.row.estado ? 'Activo' : 'Inactivo'"
                        :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small"
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

.scrollable-content {
    overflow-y: auto;
    /* Permite el scroll */
}

/* El footer con el botón Aceptar es fijo */
.fixed-footer {
    position: sticky;
    bottom: 0;
    background-color: white;
    box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1);
    /* Añade una sombra sutil */
}

.mensaje {
    max-width: 200px;
    max-height: 5px;
    word-wrap: break-word;
    overflow: hidden;
}

.vmenu {
    max-height: 50px;
}

.descripVmenu {
    padding: 1rem;
    word-wrap: break-word;
    height: fit-content;
    max-height: 300px;
    max-width: 300px;
}
</style>