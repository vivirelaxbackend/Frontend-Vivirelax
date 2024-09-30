<script setup>
import { ref } from 'vue'
const mobileMenu = ref(false)

// Simple navigation function
const goTo = (page) => {
  console.log(`Navigating to ${page}`)
  // Implement your router logic here, e.g., this.$router.push(`/${page}`)
}
</script>


<template>
    <q-layout>
    <q-header elevated>
        <q-toolbar>

            <!-- Logo or Title of the app -->
            <q-toolbar-title>
                MyApp
            </q-toolbar-title>

            <!-- Spacer to push buttons to the right -->
            <q-space />

            <!-- Navigation buttons -->
            <q-btn flat label="Home" @click="goTo('home')" />
            <q-btn flat label="About" @click="goTo('about')" />
            <q-btn flat label="Contact" @click="goTo('contact')" />

            <!-- Mobile Menu -->
            <q-btn flat round icon="menu" @click="mobileMenu = !mobileMenu" class="hide-on-desktop" />
        </q-toolbar>

        <!-- Drawer for mobile navigation -->
        <q-drawer v-model="mobileMenu" side="right" overlay>
            <q-list>
                <q-item clickable v-ripple @click="goTo('home')">
                    <q-item-section>Home</q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="goTo('about')">
                    <q-item-section>About</q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="goTo('contact')">
                    <q-item-section>Contact</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>
    </q-header>
</q-layout>
</template>

<style scoped>

/* Hide the mobile menu button on desktop screens */
.hide-on-desktop {
    display: none;
}

@media (max-width: 600px) {
    .hide-on-desktop {
        display: inline-block;
    }
}
</style>