<script setup>
import { ref } from 'vue';
import { useStoreUsuarios } from '../stores/usuario.js'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const cedula = ref("");
const password = ref("");
const showPassword = ref(false); // New ref for toggling password visibility
const useUsuario = useStoreUsuarios();
const router = useRouter();
const isCleaning = ref(false);
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const login = async () => {
    const data = {
        cedula: cedula.value,
        password: password.value,
    };

    try {
        const response = await useUsuario.login(data);

        if (useUsuario.estatus === 200) {
            console.log(response);
            router.push('/panel-admin')
        } else if (useUsuario.estatus === 400 || useUsuario.estatus === 401) {
            notificar('negative', 'Usuario o contraseña incorrectos');
            return;
        }
    } catch (error) {
        console.log(error);
        notificar('negative', 'Usuario o contraseña incorrectos');
    }
};
</script>

<template>
    <div class="login-container">
        <div class="login-form">
            <q-form class="form" @submit.prevent="login">
                <p class="form-title">Inicia sesión con tu cuenta</p>
                <div class="input-container">
                    <q-input v-model="cedula" type="number" label="Usuario" color="black" lazy-rules
                        :rules="[val => !!val || 'Ingrese su usuario']" />
                </div>
                <div class="input-container">
                    <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña" color="black" lazy-rules
                        :rules="[val => !!val || 'Ingrese la contraseña']">
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="showPassword = !showPassword" />
                        </template>
                    </q-input>
                </div>
                <div class="q-pt-md">
                    <q-btn type="submit" color="black" class="submit">Ingresar</q-btn>
                </div>
            </q-form>
            <p class="signup-link">
                ¿Olvidaste tu contraseña? <router-link to="/recuperar-contrasena">
                    <a href="#">Haz clic aquí</a>
                </router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Contenedor principal */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #d4eac8; /* Verde suave */
}

/* Formulario de inicio de sesión */
.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5dc; /* Beige suave */
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

/* Título del formulario */
.form-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #4a4a4a; /* Gris oscuro */
}

/* Contenedor de los campos de entrada */
.input-container {
  margin-bottom: 1.2rem;
  width: 100%;
}

.q-input {
  width: 100%;
  color: #4a4a4a; /* Texto primario en gris oscuro */
}

/* Botón de enviar */
.submit {
  background-color: #a3c093; /* Verde oliva claro */
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0.5rem;
  width: 100%;
  color: white;
}

.submit:hover {
  background-color: darken(#a3c093, 10%);
}

/* Link de recuperación de contraseña */
.signup-link {
  margin-top: 1.5rem;
  color: #6e6e6e; /* Gris medio */
  font-size: 0.875rem;
  text-align: center;
}

.signup-link a {
  color: #a3c093; /* Verde oliva claro */
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* Notificación de error */
.q-notify {
  background-color: #e68b77; /* Terracota suave */
  color: white;
}
</style>

