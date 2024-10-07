import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'tipo-servicio';

export const useStoreTipoServicio = defineStore(
    modelo,
    () => {
        const tiposServicio = ref([]);
        const estatus = ref('');
        const validacion = ref('');
        const nuevoTipoServicio = ref('');
        const tipoServicioSeleccionado = ref(null);
        const tipoServicioId = ref('');

        // Obtener todos los tipos de servicio
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                tiposServicio.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener tipo de servicio por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                tipoServicioSeleccionado.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Registrar un nuevo tipo de servicio
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                nuevoTipoServicio.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar un tipo de servicio existente
        const editar = async (id, data) => {
            try {
                const response = await axios.put(`/${modelo}/editar/${id}`, data);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Activar un tipo de servicio
        const activar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/activar/${id}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Desactivar un tipo de servicio
        const inactivar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/inactivar/${id}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        return {
            getAll,
            getPorId,
            registro,
            editar,
            activar,
            inactivar,
            tiposServicio,
            estatus,
            validacion,
            nuevoTipoServicio,
            tipoServicioSeleccionado,
            tipoServicioId,
        };
    },
    {
        persist: true, // Para mantener el estado después de recargar la página
    }
);
