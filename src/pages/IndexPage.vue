<template>
    <q-page class="flex flex-center">
      <div class="q-pa-md row items-start q-gutter-md">
        <div class="col">
          contador: {{ counter }}
          <div class="row" style="margin: 10px;">
            <q-btn @click="getStatus()">Carregar dados</q-btn>
            <div>
                Lista
                 {{ status }}
            </div>
          </div>
        </div>
      </div>
    </q-page>
</template>
  
<script setup>
  import { useStatusStore } from '../stores/status'
  import { mapActions, mapState } from 'pinia'
  defineOptions({
    name: 'IndexPage',
    computed: {
      ...mapState(useStatusStore, ['status'])
    },
    methods: {
      ...mapActions(useStatusStore, ['getStatus'])
    }
  });
</script>