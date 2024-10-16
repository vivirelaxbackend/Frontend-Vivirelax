import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'cliente';

export const useStoreCliente = defineStore(
    modelo,
    () => {
        const clientes = ref([]);
        const estatus = ref('');
        const validacion = ref('');
        const nuevoCliente = ref('');
        const clienteSeleccionado = ref(null);

        // Obtener todos los clientes;
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                clientes.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener cliente por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                clienteSeleccionado.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Obtener cliente por cédula
        const getPorCedula = async (cedula) => {
            try {
                const response = await axios.get(`/${modelo}/buscarCedula/${cedula}`);
                clientes.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Registrar un nuevo cliente
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                nuevoCliente.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar un cliente existente
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

        // Activar un cliente
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

        // Desactivar un cliente
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
            getPorCedula,
            registro,
            editar,
            activar,
            inactivar,
            clientes,
            estatus,
            validacion,
            nuevoCliente,
            clienteSeleccionado,
        };
    },
    {
        persist: true, // Para mantener el estado después de recargar la página
    }
);
