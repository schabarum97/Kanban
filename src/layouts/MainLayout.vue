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

defineOptions({
  name: "MainLayout",
});
</script>

<style>
body.bg-color {
  background-color: white;
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
  background-color: white; 
  color: #333;
}

.light {
  background-color: white;
  color: #333;
}
</style>
