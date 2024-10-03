import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'servicio';

export const useStoreServicio = defineStore(
    modelo,
    () => {
        const servicios = ref([]);
        const estatus = ref('');
        const validacion = ref('');
        const nuevoServicio = ref('');
        const servicioSeleccionado = ref(null);

        // Obtener todos los servicios
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                servicios.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener servicio por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                servicioSeleccionado.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Obtener servicios por nombre
        const getPorNombre = async (nombre) => {
            try {
                const response = await axios.get(`/${modelo}/buscarNombre/${nombre}`);
                servicios.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        const getPorTipoServicio = async (idTipoServicio) => {
            try {
                const response = await axios.get(`/${modelo}/tipo-servicio/${idTipoServicio}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };


        // Registrar un nuevo servicio
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                nuevoServicio.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar un servicio existente
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

        // Activar un servicio
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

        // Desactivar un servicio
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
            getPorNombre,
            getPorTipoServicio,
            registro,
            editar,
            activar,
            inactivar,
            servicios,
            estatus,
            validacion,
            nuevoServicio,
            servicioSeleccionado,
        };
    },
    {
        persist: true, 
    }
);
