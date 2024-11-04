<template>
  <div class="q-pa-md row justify-around kanban-board">
    <div v-for="(card, index) in kanbanCards" :key="index" class="col-2 kanban-column">
      <div class="kanban-card">
        <div class="kanban-card-title">ID: {{ card.tar_id }}</div>
        <div class="kanban-card-field"><strong>Descrição:</strong> {{ card.tar_descricao }}</div>
        <div class="kanban-card-field"><strong>Data Início:</strong> {{ card.tar_dataini }}</div>
        <div class="kanban-card-field"><strong>Data Fim:</strong> {{ card.tar_datafim }}</div>
        <div class="kanban-card-field"><strong>Horas Trabalhadas:</strong> {{ card.tar_horasTrab }}</div>
        <div class="kanban-card-field"><strong>Status ID:</strong> {{ card.stt_id }}</div>
        <div class="kanban-card-field"><strong>Funcionário ID:</strong> {{ card.fun_id }}</div>
        <div class="kanban-card-field"><strong>Projeto ID:</strong> {{ card.prj_id }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchKanbanCards } from "../services/KanbanService";

export default {
  data() {
    return {
      kanbanCards: [],
    };
  },
  created() {
    // Realiza o fetch para 10 IDs (exemplo)
    const fetchPromises = [];
    for (let id = 1; id <= 10; id++) {
      fetchPromises.push(fetchKanbanCards(id));
    }

    Promise.all(fetchPromises)
      .then(results => {
        this.kanbanCards = results; // Adapte isso conforme a estrutura do retorno
      })
      .catch(error => {
        console.error('Erro ao carregar os cards do kanban:', error);
      });
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
  background-color: #6d6d6d;
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
