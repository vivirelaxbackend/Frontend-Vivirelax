import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

const modelo = 'consulta';

export const useStoreConsulta = defineStore(
  modelo,
  () => {
    const consultas = ref([]);
    const consultaSeleccionada = ref(null);
    const estatus = ref('');
    const validacion = ref('');
    const nuevaConsulta = ref('');

    // Obtener todas las consultas
    const getAll = async () => {
      try {
        const response = await axios.get(`/${modelo}/all`);
        consultas.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response?.status || 500;
      }
    };

    // Obtener una consulta por ID
    const getPorId = async (id) => {
      try {
        const response = await axios.get(`/${modelo}/buscarId/${id}`);
        consultaSeleccionada.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response?.status || 400;
      }
    };

    // Obtener consultas por correo
    const getPorCorreo = async (correo) => {
      try {
        const response = await axios.get(`/${modelo}/buscarCorreo/${correo}`);
        consultas.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response?.status || 500;
      }
    };

    // Registrar una nueva consulta
    const registro = async (data) => {
      try {
        const response = await axios.post(`/${modelo}/registro`, data);
        nuevaConsulta.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response?.data?.error || 'Error en el registro';
        estatus.value = error.response?.status || 500;
      }
    };

    // Editar una consulta existente
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

    // Activar una consulta
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

    // Inactivar una consulta
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
      getPorCorreo,
      registro,
      editar,
      activar,
      inactivar,
      consultas,
      consultaSeleccionada,
      estatus,
      validacion,
      nuevaConsulta,
    };
  },
  {
    persist: true, // Para mantener el estado después de recargar la página
  }
);
