<template>
  <q-page class="flex flex-center">
    <q-layout class="q-pa-md row justify-around kanban-board">
      <div v-for="(cards, statusId) in groupedCards" :key="statusId" class="kanban-column">
        <h4 class="kanban-column-title">{{ cards[0].tarefa[0].stt_nome }}</h4>
        <q-card
          v-for="(card, index) in cards"
          :key="index"
          class="kanban-card"
          :style="{ backgroundColor: card.tarefa[0].stt_cor }"
        >
          <q-card-section>
            <q-item>
              <q-item-section class="kanban-card-title">
                <strong>ID:</strong> {{ card.tarefa[0].tar_id }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="kanban-card-field">
                <strong>Descrição:</strong> {{ card.tarefa[0].tar_descricao }}
              </q-item-section>
            </q-item>

            <!-- Exibir cada campo na mesma linha, sem quebra -->
            <q-item v-for="(field, label) in cardFields(card)" :key="label">
              <q-item-section class="kanban-card-field-inline">
                <strong>{{ label }}:</strong> {{ field }}
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
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
  computed: {
    groupedCards() {
      return this.kanbanCards.reduce((groups, card) => {
        const statusId = card.tarefa[0].stt_id;
        if (!groups[statusId]) {
          groups[statusId] = [];
        }
        groups[statusId].push(card);
        return groups;
      }, {});
    },
  },
  methods: {
    async getDadosKanbans() {
      for (let id = 1; id <= 60; id++) {
        await Kanban.getDadosKanban(id).then((res) => {
          this.kanbanCards.push(res);
        });
      }
    },
    cardFields(card) {
      return {
        "Data Início": card.tarefa[0].tar_dataini,
        "Data Fim": card.tarefa[0].tar_datafim,
        "Horas Trabalhadas": card.tarefa[0].tar_horasTrab,
        "Funcionário ID": card.tarefa[0].fun_id,
        "Projeto ID": card.tarefa[0].prj_id,
      };
    },
  },
  mounted() {
    this.getDadosKanbans();
  },
};
</script>

<style>
.kanban-board {
  gap: 20px;
}

.kanban-column {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  width: 297px;
  max-width: 100%;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.kanban-column-title {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
}

.kanban-card {
  width: 275px;
  max-width: 100%;
  height: 360px; 
  max-height: 1000px;
  overflow: auto;
  color: #333;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.85em;
  margin-bottom: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.kanban-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.kanban-card-title {
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 4px;
  color: #333;
}

.kanban-card-field {
  font-size: 0.85em;
  margin: 4px 0;
  color: #555;
}

.kanban-card-field-inline {
  font-size: 0.85em;
  margin: 4px 0;
  color: #555;
  display: flex;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
