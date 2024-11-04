<template>
  <q-layout :class="theme" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-input
          round
          outlined
          placeholder="O que você procura?"
          prepend-icon="search"
          class="q-ml-md"
          style="max-width: 600px; margin: 0 auto"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :class="theme">
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="50px">
              <img src="https://via.placeholder.com/50" alt="User Avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Teste</q-item-label>
            <q-item-label caption>teste@gmail.com</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cadastro</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Consulta</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-space />
      <div class="q-pa-md row items-center justify-center">
        <q-btn icon="light_mode" label="Light" @click="setTheme('light')" />
        <q-btn icon="dark_mode" label="Dark" @click="setTheme('dark')" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const theme = ref('dark');
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setTheme(val) {
  theme.value = val;
  if (val === 'light') {
    document.body.classList.add('light-mode');
    document.body.classList.remove('bg-color');
  } else {
    document.body.classList.add('bg-color');
    document.body.classList.remove('light-mode');
  }
}

defineOptions({
  name: "MainLayout",
});
</script>

<style>
body.bg-color {
  background-color: #1F1B24;
}

body.light-mode {
  background-color: white;
}

body.bg-color .description {
  color: white;
}

body.light-mode .description {
  color: #333;
}

.dark {
  background-color: #333; 
  color: white;
}

.light {
  background-color: white;
  color: #333;
}
</style>
