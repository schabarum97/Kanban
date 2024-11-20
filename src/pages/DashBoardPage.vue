<template>
  <q-page class="full-height">
    <!-- Gráfico de barras existente -->
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
              responsive: true,
              maintainAspectRatio: false
            }"
            style="height: 300px;"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Gráfico de pizza -->
    <q-card class="col-12 q-pa-md q-mt-md">
      <q-card-section>
        <div class="text-h6">Gráfico de Projetos por Status</div>

        <div v-if="projects.length > 0">
          <q-pie-chart
            :data="{
              labels: Object.keys(groupedProjects),
              datasets: [
                {
                  label: 'Quantidade de Projetos',
                  data: Object.values(groupedProjects),
                  backgroundColor: generateColors(Object.keys(groupedProjects).length),
                }
              ]
            }"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.raw}`;
                    }
                  }
                }
              }
            }"
            style="height: 300px;"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useRouter } from "vue-router";
import { Tarefa } from "../services/TarefaService";
import { Projeto } from "../services/ProjetoService";
import { Bar, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  ArcElement
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  ArcElement
);

export default {
  components: {
    'q-bar-chart': Bar,
    'q-pie-chart': Pie
  },
  data() {
    return {
      router: useRouter(),
      tarefas: [],
      projects: [],
      groupedProjects: {},
      dialogVisible: false,
      selectedTask: null
    };
  },
  methods: {
    checkIfLoggedIn() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      }
    },
    async fetchTarefas() {
      try {
        this.tarefas = [];
        for (let i = 1; i <= 100; i++) {
          const res = await Tarefa.getTarefa(i);
          if (res && res.tarefa && res.tarefa.length > 0) {
            this.tarefas.push(res.tarefa[0]);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err);
      }
    },
    async fetchProjects() {
      try {
        this.projects = [];
        for (let i = 1; i <= 150; i++) {
          try {
            const res = await Projeto.getProjeto(i);
            if (res && res.projeto && res.projeto.length > 0) {
              this.projects.push(res.projeto[0]);
            } else {
              console.warn(`Nenhum projeto encontrado para o ID ${i}`);
            }
          } catch (err) {
            console.warn(`Erro ao buscar projeto com ID ${i}:`, err);
          }
        }
        this.groupProjectsByStatus();
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    },
    groupProjectsByStatus() {
      this.groupedProjects = this.projects.reduce((acc, project) => {
        const status = project.stt_id || "Sem status";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    }, 
    generateColors(count) {
      return Array.from({ length: count }, (_, i) =>
        `hsl(${(i * 360) / count}, 70%, 50%)`
      );
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    },
    calculateDateDifference(startDate, endDate) {
      if (!startDate || !endDate) return "Datas inválidas";
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    showTaskDetails(index) {
      this.selectedTask = this.tarefas[index];
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.checkIfLoggedIn();
    this.fetchTarefas();
    this.fetchProjects();
  }
};
</script>
