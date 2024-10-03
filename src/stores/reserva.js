import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'reserva';

export const useStoreReserva = defineStore(
    modelo,
    () => {
        const reservas = ref([]);
        const estatus = ref('');
        const validacion = ref('');
        const nuevaReserva = ref('');
        const reservaSeleccionada = ref(null);

        // Obtener todas las reservas
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                reservas.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener reserva por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                reservaSeleccionada.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Registrar una nueva reserva
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                nuevaReserva.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar una reserva existente
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

        // Activar una reserva
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

        // Desactivar una reserva
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
            reservas,
            estatus,
            validacion,
            nuevaReserva,
            reservaSeleccionada,
        };
    },
    {
        persist: true, // Para mantener el estado después de recargar la página
    }
);
