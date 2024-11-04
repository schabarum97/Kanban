<template>
  <q-page class="flex flex-center">
    <q-layout class="q-pa-md row justify-around kanban-board">
      <q-card v-for="(card, index) in kanbanCards" :key="index" class="col-2 kanban-column">
        <q-card-section class="kanban-card">
          <q-item>
            <q-item-section class="kanban-card-title">
              ID: {{ card.tarefa.tar_id }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Descrição:</strong> {{ card.tarefa[0].tar_descricao }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Data Início:</strong> {{ card.tarefa[0].tar_dataini }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Data Fim:</strong> {{ card.tarefa[0].tar_datafim }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Horas Trabalhadas:</strong> {{ card.tarefa[0].tar_horasTrab }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Status ID:</strong> {{ card.tarefa[0].stt_id }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Funcionário ID:</strong> {{ card.tarefa[0].fun_id }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="kanban-card-field">
              <strong>Projeto ID:</strong> {{ card.tarefa[0].prj_id }}
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-layout>
  </q-page>
</template>

<script>
import { Kanban } from "../services/KanbanService";

export default {
  data() {
    return {
      kanbanCards: [],
    };
  },
  methods:{
      async getDadosKanbans(){
        for (let id = 1; id <= 5; id++) {
           await Kanban.getDadosKanban(id).then(res => {
            console.log(res)
            this.kanbanCards.push(res)
           })
        }
        console.log(this.kanbanCards)
      }
  },
  mounted(){
    this.getDadosKanbans()
  }
};
</script>

<style>
.kanban-board {
  gap: 35px;
}

.kanban-column {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 6px;
  margin: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.kanban-card {
  background-color: green;
  color: white;
  border-radius: 6px;
  margin: 25px 0;
  padding: 8px;
  font-size: 0.8em;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.kanban-card-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.kanban-card-field {
  font-size: 0.8em;
}
</style>
