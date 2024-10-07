<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreCliente } from '../../stores/cliente.js'; // Assuming you have this store for managing "Clientes"
import { useRouter } from 'vue-router';

const useClienteStore = useStoreCliente();
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const router = useRouter();
const $q = useQuasar();

// Notification utility function
function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const estado = ref('agregar');
const data = ref({}); // Data for form submission

// Define the table columns to display Cliente details
const columns = [
    { name: "nombre_cli", label: "Nombre", field: "nombre_cli", sortable: true, align: "left" },
    { name: "apellido_cli", label: "Apellido", field: "apellido_cli", sortable: true, align: "left" },
    { name: "cedula_cli", label: "Cédula", field: "cedula_cli", sortable: true, align: "left" },
    { name: "edad_cli", label: "Edad (años)", field: "edad_cli", sortable: true, align: "center" },
    { name: "telefono_cli", label: "Teléfono", field: "telefono_cli", sortable: true, align: "left" },
    { name: "correo_cli", label: "Correo", field: "correo_cli", sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]); // List of clientes

// Fetch Cliente data from the store
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useClienteStore.getAll(); // Assuming 'getAll()' fetches all Clientes
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        rows.value = response.reverse(); // Display newest first
    } catch (error) {
        console.error(error);
    } finally {
        loadingTable.value = false;
    }
}

// Load data when the component is mounted
onMounted(getInfo);

// Actions to open modal for adding or editing a Cliente
const opciones = {
    agregar: () => {
        data.value = {}; // Reset the form data
        estado.value = 'agregar';
        modal.value = true;
    },
    editar: (info) => {
        data.value = { ...info }; // Populate form with the selected row data
        estado.value = 'editar';
        modal.value = true;
    }
};

// Handle form submission to add or edit a Cliente
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const response = await useClienteStore.registro(data.value); // Assuming 'registro()' adds a new Cliente
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            modal.value = false;
            notificar('positive', 'Cliente agregado exitosamente');
            getInfo(); // Refresh the table
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        try {
            loadingModal.value = true;
            const response = await useClienteStore.editar(data.value._id, data.value); // Assuming 'editar()' updates the Cliente
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            modal.value = false;
            notificar('positive', 'Cliente editado exitosamente');
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Update the local list
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    }
};

// Validate form fields before submission
function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            notificar('negative', 'Por favor, complete todos los campos obligatorios.');
            return;
        }
    }
    enviarInfo[estado.value](); // Call either agregar or editar depending on the state
}

// Actions to activate or deactivate Clientes
const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useClienteStore.activar(id); // Assuming 'activar()' activates a Cliente
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Update local list
        } catch (error) {
            console.error(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useClienteStore.inactivar(id); // Assuming 'inactivar()' deactivates a Cliente
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

// Helper function to find Cliente index in local rows by _id
function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal for adding/editing Clientes -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Cliente</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_cli" label="Nombre del cliente" :rules="[val => !!val || 'Digite el nombre del cliente']" color="black" />
                        <q-input filled v-model.trim="data.apellido_cli" label="Apellido del cliente" :rules="[val => !!val || 'Digite el apellido del cliente']" color="black" />
                        <q-input filled v-model.trim="data.cedula_cli" label="Cédula del cliente" :rules="[val => !!val || 'Digite la cedula del cliente']" color="black" />
                        <q-input filled v-model.trim="data.edad_cli" label="Edad del cliente" :rules="[val => !!val || 'Digite la edad del cliente']" color="black" />
                        <q-input filled v-model.trim="data.telefono_cli" label="Teléfono del cliente" :rules="[val => !!val || 'Digite el telefono del cliente']" color="black" />
                        <q-input filled v-model.trim="data.correo_cli" label="Correo electrónico" :rules="[val => !!val || 'Digite el correo electrónico del cliente']" color="black" />
                        <q-input filled v-model.trim="data.detalle_ult_vis" label="Detalle última visita" :rules="[val => !!val || 'Digite el detalle de la última']" type="textarea" color="black" />

                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="black" :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Table to display list of Clientes -->
        <q-table :rows="rows" :columns="columns" row-key="cedula_cli" :loading="loadingTable" loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas" no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Clientes" style="width: 90%; margin-top: 40px;" no-data-label="No hay clientes registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Clientes</h4>
                    <q-btn @click="opciones.agregar" color="black">
                        <q-icon name="add" color="white" />
                    </q-btn>
                </div>
            </template>

            <template v-slot:top-right>
                <q-input outlined dense debounce="300" color="black" v-model="filter" placeholder="Buscar cualquier campo">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <q-btn :loading="props.row.estado === 'load'" :label="props.row.estado ? 'Activo' : 'Inactivo'" :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small" @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id); props.row.estado = 'load'" />
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