<template>
    <q-page class="full-height">
      <q-card class="col-12 q-pa-md">
        <q-card-section>
          <div class="text-h6">Gráfico de Tarefas</div>
  
          <div v-if="tarefas.length > 0"> 
            <q-bar-chart
              :labels="tarefas.map(tarefa => formatDate(tarefa.tar_datafim))"
              :data="{
                labels: tarefas.map(tarefa => formatDate(tarefa.tar_datafim)),
                datasets: [{
                  label: 'Dias entre início e fim',
                  data: tarefas.map(tarefa => calculateDateDifference(tarefa.tar_dataini, tarefa.tar_datafim)),
                  backgroundColor: tarefas.map(tarefa => tarefa.stt_cor || 'rgba(75, 192, 192, 0.2)'),
                  borderColor: tarefas.map(tarefa => tarefa.stt_cor || 'rgba(75, 192, 192, 1)'),
                  borderWidth: 1
                }]
              }"
              :options="{
                scales: {
                  x: {
                    type: 'time',
                    title: { text: 'Data Final', display: true },
                    time: {
                      unit: 'day',
                      tooltipFormat: 'yyyy-MM-dd'
                    }
                  },
                  y: {
                    type: 'linear',
                    title: { text: 'Dias entre Início e Fim', display: true },
                    beginAtZero: true
                  }
                },
                onHover: (event, elements) => {
                  if (elements.length) {
                    const index = elements[0].index;
                    this.showTaskDetails(index);
                  }
                },
                responsive: true,
                maintainAspectRatio: false
              }"
              style="height: 300px;"
            />
          </div>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="dialogVisible">
        <q-card>
          <q-card-section>
            <div class="text-h6">Detalhes da Tarefa</div>
            <div v-if="selectedTask">
              <p><strong>ID da Tarefa:</strong> {{ selectedTask.tar_id }}</p>
              <p><strong>Descrição:</strong> {{ selectedTask.tar_descricao || 'Sem descrição' }}</p>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Fechar" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import { Tarefa } from "../services/TarefaService";
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale);
  
  export default {
    components: {
      'q-bar-chart': Bar
    },
    data() {
      return {
        router: useRouter(),
        tarefas: [],
        dialogVisible: false,
        selectedTask: null
      };
    },
    methods: {
      checkIfLoggedIn() {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
          this.$router.push('/login');
        }
      },
      async fetchTarefas() {
        try {
          this.tarefas = [];
          for (let i = 1; i <= 100; i++) {
            try {
              const res = await Tarefa.getTarefa(i);
              if (res && res.tarefa && res.tarefa.length > 0) {
                this.tarefas.push(res.tarefa[0]);
              } else {
                console.warn(`Nenhuma tarefa encontrada para o ID ${i}`);
              }
            } catch (err) {
              console.warn(`Erro ao buscar tarefa com ID ${i}:`, err);
            }
          }
          console.log(this.tarefas);
        } catch (err) {
          console.error("Erro ao buscar tarefas:", err);
        }
      },
      formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Formato ISO 8601
      },
      calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) {
            console.warn("Datas inválidas fornecidas:", startDate, endDate);
            return "Datas inválidas";
        }
  
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            console.warn("Datas inválidas após conversão:", start, end);
            return "Datas inválidas";
        }
  
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      showTaskDetails(index) {
        this.selectedTask = this.tarefas[index];
        this.dialogVisible = true;
      }
    },
    mounted() {
      this.checkIfLoggedIn();
      this.fetchTarefas();
    }
  };
  </script>
  