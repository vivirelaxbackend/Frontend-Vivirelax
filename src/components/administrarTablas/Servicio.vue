<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreServicio } from '../../stores/servicio.js'; // Store para servicios
import { useStoreTipoServicio } from '../../stores/tipo_servicio.js'; // Store para tipos de servicios
import { useRouter, useRoute } from 'vue-router';

const useServicio = useStoreServicio();  // Instancia del store de servicios
const useTipoServicio = useStoreTipoServicio();  // Instancia del store de tipos de servicio
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const modalBeneficios = ref(false); // Benefits modal
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const nombre_tip = ref('');

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

const estado = ref('agregar');
const data = ref({
    nombre_serv: '',
    descripcion: '',
    galeria: [],
    precio: null,
    duracion: '',
    beneficios: [{ descrip: '' }],
    idTipoServicio: null,
    estado: true
});
const tiposServicios = ref([]); // Lista de tipos de servicio para el select

const columns = [
    { name: "nombre_serv", label: "Nombre del servicio", field: "nombre_serv", sortable: true, align: "left" },
    { name: "descripcion", label: "Descripción", field: "descripcion", sortable: true, align: "left" },
    { name: "precio", label: "Precio", field: "precio", sortable: true, align: "left" },
    { name: "duracion", label: "Duración", field: "duracion", sortable: true, align: "left" },
    {
        name: "tipoServicio",
        label: "Tipo de servicio",
        field: (row) => row.idTipoServicio ? row.idTipoServicio.nombre_tip : '',
        sortable: true,
        align: "left"
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

// Obtener tipos de servicio
async function getTiposServicios() {
    try {
        const response = await useTipoServicio.getAll(); // Obtener los tipos de servicio
        if (response && !response.error) {
            tiposServicios.value = response; // Guardamos la lista de tipos de servicio
        } else {
            notificar('negative', 'Error al obtener los tipos de servicio');
        }
    } catch (error) {
        console.log(error);
    }
}

// Obtener servicios
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useServicio.getAll();
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        rows.value = response.reverse();
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

async function getServiciosPorTipoServicio(idTipoServicio) {
    try {
        loadingTable.value = true;
        const response = await useServicio.getPorTipoServicio(idTipoServicio);
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        }
        rows.value = response.reverse();
        nombre_tip.value = useTipoServicio.tipoServicioId.nombre_tip;
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

const opciones = {
    agregar: () => {
        data.value = {
        };

        estado.value = 'agregar';
        modal.value = true;
        const idTipoServicio = route.query.id; // Obtener el id del departamento desde la URL
        if (idTipoServicio) {
            data.value.idTipoServicio = idTipoServicio; // Asignar el ID del departamento al campo correspondiente
        }
        console.log("tipo servicio ID:", data.value.idTipoServicio); // Asegúrate de que el ID esté presente

    },
    editar: (info) => {
        data.value = { ...info }; // Copiamos los datos de la ciudad que queremos editar
        estado.value = 'editar'; // Cambiamos el estado a "editar"
        modal.value = true; // Mostramos el modal
    }
};

const enviarInfo = {
    agregar: async () => {
        console.log("dataaa", data.value)
        loadingModal.value = true;
        try {

            console.log('Datos originales que se enviarán:', data.value);

            const dataToSend = {
                ...data.value,
                idTipoServicio: typeof data.value.idTipoServicio === 'object' && data.value.idTipoServicio !== null
                    ? data.value.idTipoServicio._id
                    : data.value.idTipoServicio
            };

            console.log('Datos procesados que se enviarán:', dataToSend);

            const response = await useServicio.registro(dataToSend);

            console.log('Response:', response);

            if (!response || Object.keys(response).length === 0) {
                notificar('negative', 'La API no devolvió respuesta válida.');
                return;
            }
            if (response.error) {
                notificar('negative', response.error);
                return;
            }

            // Actualiza la tabla después de agregar la nueva ciudad
            if (route.query.id) {
                await getServiciosPorTipoServicio(route.query.id);
            } else {
                await getInfo();
            }

            modal.value = false;
            notificar('positive', 'Servicio agregado exitosamente');
        } catch (error) {
            console.error('Error en el registro:', error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {

            const dataToSend = {
                ...data.value,
                idTipoServicio: data.value.idTipoServicio ? data.value.idTipoServicio._id : null
            };
            const response = await useServicio.editar(dataToSend._id, dataToSend);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }

            const idTipoServicio = route.query.id;
            if (idTipoServicio) {
                await getServiciosPorTipoServicio(idTipoServicio);
                const index = buscarIndexLocal(response._id);
                rows.value.splice(index, 1);
                rows.value.unshift(response);
            } else {
                await getInfo();
                const index = buscarIndexLocal(response._id);
                rows.value.splice(index, 1);
                rows.value.unshift(response);
            }

            modal.value = false;
            notificar('positive', 'Servicio editado exitosamente');
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
            const response = await useServicio.activar(id);
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
            const response = await useServicio.inactivar(id);
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

function openBeneficiosModal() {
    modalBeneficios.value = true;
}

function addBeneficio() {
    if (!Array.isArray(data.value.beneficios)) {
        data.value.beneficios = [{ descrip: '' }];
    } else {
        data.value.beneficios.push({ descrip: '' });
    }
}

function removeBeneficio(index) {
    if (data.value.beneficios.length > 1) {
        data.value.beneficios.splice(index, 1);
    }
}


function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

onMounted(() => {
    const idTipoServicio = route.query.id;
    if (idTipoServicio) {
        data.value.idServicio = idTipoServicio;
    }

    getTiposServicios();

    if (idTipoServicio) {
        getServiciosPorTipoServicio(idTipoServicio);
    } else {
        getInfo();
    }
});
</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 500px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Servicio</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_serv" label="Digite el nombre del servicio"
                            color="black" :rules="[val => !!val || 'Digite el nombre']" />
                        <q-input filled v-model.trim="data.descripcion" label="Digite la descripción del servicio"
                            color="black" :rules="[val => !!val || 'Digite la descripción']" type="textarea" />
                        <q-input filled v-model.number="data.precio" label="Digite el precio del servicio" color="black"
                            :rules="[val => !!val || 'Digite el precio']" type="number" />
                        <q-input filled v-model.trim="data.duracion"
                            label="Digite la duración del servicio (por ejemplo 30 Minutos)" color="black"
                            :rules="[val => !!val || 'Digite la duración']" />
                        <q-select filled v-model="data.idTipoServicio" label="Seleccione un tipo de servicio"
                            :options="tiposServicios" option-value="_id" option-label="nombre_tip" map-options
                            :rules="[val => !!val || 'Seleccione un tipo de servicio']" />
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <label>Beneficios:</label>
                            <q-btn label="Ver Beneficios" color="black" @click="openBeneficiosModal" style="width: 50%;" />
                        </div>


                        <!-- Agregar la galería si es necesario -->

                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="black" :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_serv" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Servicios"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay servicios registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Servicios <span v-if="nombre_tip">de {{ nombre_tip }}</span></h4>
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
        <!-- Modal para Administrar Beneficios -->
        <q-dialog v-model="modalBeneficios">
            <q-card class="modal" style="width: 500px;">
                <q-toolbar class="bg-black" style="color: white">
                    <q-toolbar-title>Administrar Beneficios</q-toolbar-title>
                    <q-btn flat dense icon="close" v-close-popup />
                </q-toolbar>

                <!-- Sección desplazable con beneficios -->
                <q-card-section class="q-gutter-md scrollable-content">
                    <div v-for="(beneficio, index) in data.beneficios" :key="index" style="display: flex; gap: 10px;">
                        <q-input filled v-model.trim="beneficio.descrip" label="Descripción del beneficio" color="black"
                            :rules="[val => !!val || 'Ingrese la descripción del beneficio']" type="textarea"  />
                        <div style="display: flex; align-items: center;">
                            <q-btn icon="delete" color="negative" @click="removeBeneficio(index)"
                                style="width: 30px; height: 30px;" />
                        </div>
                    </div>

                </q-card-section>

                <!-- Sección fija del botón Aceptar -->
                <q-card-actions align="right" class="fixed-footer">
                    <q-btn icon="add" color="positive" @click="addBeneficio">Añadir Beneficio</q-btn>
                    <q-btn label="Aceptar" color="black" @click="modalBeneficios = false" />
                </q-card-actions>
            </q-card>
        </q-dialog>

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
</style>