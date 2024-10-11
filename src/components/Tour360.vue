<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

</script>

<template>
    <div class="text-center">
        <iframe src="https://webobook.com/public/66eaf9733f56564235392752,en" width="80%" height="570px" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen class="q-mt-lg">
        </iframe>
    </div>
</template>

<style scoped></style>
