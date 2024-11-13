<template>
    <q-page class="full-height">
      <div class="row full-height">
        <q-card class="col-12 col-md-5 q-pa-md full-height scrollable-card">
          <q-card-section>
            <div class="text-h6">{{ formData.tar_id ? 'Editar Tarefa' : 'Nova Tarefa' }}</div>
          </q-card-section>
          <q-form @submit="handleSubmit">
            <q-input
              v-model="formData.tar_id"
              label="ID da Tarefa"
              type="number"
              @blur="fetchTarefaById"
              hint="Digite um ID para buscar uma tarefa"
              required
            />
            <q-input v-model="formData.tar_descricao" label="Descrição da Tarefa" required />
            <q-input v-model="formData.tar_dataini" label="Data Início" type="date" required />
            <q-input v-model="formData.tar_datafim" label="Data Fim" type="date" />
            <q-input v-model="formData.tar_horasTrab" label="Horas Trabalhadas" type="time" required />
            <q-input v-model="formData.stt_id" label="Status ID" type="number" required />
            <q-input v-model="formData.fun_id" label="Funcionário ID" type="number" required />
            <q-input v-model="formData.prj_id" label="ID do Projeto" type="number" required />
  
            <q-btn label="Salvar" color="secondary" @click="handleSubmit" class="q-mt-sm" />
            <q-btn label="Limpar" color="secondary" @click="clearForm" class="q-mt-sm" />
          </q-form>
        </q-card>
        
        <q-card class="col-12 col-md-7 q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">Lista de Tarefas</div>
            <q-table
              :rows="formattedTarefas"
              :columns="columns"
              row-key="tar_id"
              :rows-per-page-options="[1, 3, 5, 10, 15, 20, 25]"
              v-model:pagination="pagination"
              :filter="filter"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>{{ props.row.tar_id }}</q-td>
                  <q-td>{{ props.row.tar_descricao }}</q-td>
                  <q-td>{{ props.row.tar_dataini }}</q-td>
                  <q-td>{{ props.row.tar_datafim }}</q-td>
                  <q-td>{{ props.row.tar_horasTrab }}</q-td>
                  <q-td>{{ props.row.stt_id }}</q-td>
                  <q-td>{{ props.row.fun_id }}</q-td>
                  <q-td>{{ props.row.prj_id }}</q-td>
                  <q-td class="action-buttons">
                    <q-btn label="Editar" color="primary" @click="editTarefa(props.row)" size="sm" />
                    <q-btn label="Excluir" color="negative" @click="deleteTarefa(props.row.tar_id)" size="sm" />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </template>
  
  <script>
  import { Tarefa } from "../services/TarefaService";
  
  export default {
    data() {
      return {
        tarefas: [],
        columns: [
          { name: "tar_id", label: "ID", align: "left", field: "tar_id" },
          { name: "tar_descricao", label: "Descrição", align: "left", field: "tar_descricao" },
          { name: "tar_dataini", label: "Data Início", align: "left", field: "tar_dataini" },
          { name: "tar_datafim", label: "Data Fim", align: "left", field: "tar_datafim" },
          { name: "tar_horasTrab", label: "Horas Trabalhadas", align: "left", field: "tar_horasTrab" },
          { name: "stt_id", label: "Status ID", align: "left", field: "stt_id" },
          { name: "fun_id", label: "Funcionário ID", align: "left", field: "fun_id" },
          { name: "prj_id", label: "ID do Projeto", align: "left", field: "prj_id" },
          { name: "actions", label: "Ações", align: "center" }
        ],
        pagination: {
          rowsPerPage: 10
        },
        filter: "",
        formData: {
          tar_id: null,
          tar_descricao: "",
          tar_dataini: "",
          tar_datafim: "",
          tar_horasTrab: null,
          stt_id: null,
          fun_id: null,
          prj_id: null
        },
        hasFetched: false
      };
    },
    computed: {
      formattedTarefas() {
        return this.tarefas.map((tarefa) => ({
          ...tarefa,
          tar_dataini: this.formatDate(tarefa.tar_dataini),
          tar_datafim: this.formatDate(tarefa.tar_datafim)
        }));
      }
    },
    methods: {
      async fetchTarefas() {
        try {
          this.tarefas = [];
          for (let i = 1; i <= 10; i++) {
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
        } catch (err) {
          console.error("Erro ao buscar tarefas:", err);
        }
      },
      async fetchTarefaById() {
        if (!this.formData.tar_id) return;
        try {
          const tarefa = await Tarefa.getTarefa(this.formData.tar_id);
          if (tarefa.tarefa && tarefa.tarefa.length > 0) {
            const fetchedTarefa = tarefa.tarefa[0];
            this.formData = {
              ...fetchedTarefa,
              tar_dataini: this.formatDate(fetchedTarefa.tar_dataini),
              tar_datafim: this.formatDate(fetchedTarefa.tar_datafim)
            };
          } else {
            this.clearForm();
          }
        } catch (err) {
          this.clearForm();
          console.error("Erro ao buscar tarefa:", err);
        }
      },
  
      formatDate(dateString) {
        return dateString ? dateString.split("T")[0] : "";
      },
      async handleSubmit() {
        if (!this.formData.tar_horasTrab) {
            this.formData.tar_horasTrab = "00:00";
        }

        const tarefaData = {
          descricao: this.formData.tar_descricao,
          dataini: new Date(this.formData.tar_dataini).toISOString(),
          datafim: new Date(this.formData.tar_datafim).toISOString(),
          horasTrab: this.formData.tar_horasTrab,
          status: this.formData.stt_id,
          funcionario: this.formData.fun_id,
          projeto: this.formData.prj_id
        };
  
        const tarefaDataPut = {
          id: this.formData.tar_id,
          descricao: this.formData.tar_descricao,
          dataini: new Date(this.formData.tar_dataini).toISOString(),
          datafim: new Date(this.formData.tar_datafim).toISOString(),
          horasTrab: this.formData.tar_horasTrab,
          status: this.formData.stt_id,
          funcionario: this.formData.fun_id,
          projeto: this.formData.prj_id
        };

        console.log(tarefaData)
  
        try {
          if (this.formData.tar_id) {
            await Tarefa.updateTarefa(tarefaDataPut);
          } else {
            await Tarefa.createTarefa(tarefaData);
          }
          this.clearForm();
          this.fetchTarefas();
        } catch (err) {
          console.error("Erro ao salvar tarefa:", err);
        }
      },
      editTarefa(tarefa) {
        this.formData = {
          ...tarefa,
          tar_dataini: this.formatDate(tarefa.tar_dataini),
          tar_datafim: this.formatDate(tarefa.tar_datafim)
        };
      },
      async deleteTarefa(id) {
        try {
          await Tarefa.deleteTarefa(id);
          this.clearForm();
          this.fetchTarefas();
        } catch (err) {
          console.error("Erro ao excluir tarefa:", err);
        }
      },
      clearForm() {
        this.formData = {
          tar_id: null,
          tar_descricao: "",
          tar_dataini: "",
          tar_datafim: "",
          tar_horasTrab: null,
          stt_id: null,
          fun_id: null,
          prj_id: null
        };
      }
    },
    mounted() {
      this.fetchTarefas();
    }
  };
  </script>
  