<template>
    <q-page class="full-height">
      <div class="row full-height">
        <q-card class="col-6 q-pa-md full-height scrollable-card">
          <q-card-section>
            <div class="text-h6">{{ formData.prj_id ? 'Editar Projeto' : 'Novo Projeto' }}</div>
          </q-card-section>
          <q-form @submit="handleSubmit">
            <q-input
              v-model="formData.prj_id"
              label="ID do Projeto"
              type="number"
              @blur="fetchProjectById"
              hint="Digite um ID para buscar um projeto"
              required
            />
            <q-input v-model="formData.prj_nome" label="Nome do Projeto" required />
            <q-input v-model="formData.prj_descricao" label="Descrição" type="textarea" required />
            <q-input v-model="formData.prj_dataini" label="Data Início" type="date" required />
            <q-input v-model="formData.prj_datafim" label="Data Fim" type="date" />
            <q-input v-model="formData.stt_id" label="Status ID" type="number" required />
    
            <q-btn label="Salvar" color="secondary" @click="handleSubmit" class="q-mt-sm" />
            <q-btn label="Limpar" color="secondary" @click="clearForm" class="q-mt-sm" />
          </q-form>
        </q-card>
    
        <q-card class="col-6 q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">Lista de Projetos</div>
            <q-table
            :rows="formattedProjects"
            :columns="columns"
            row-key="prj_id"
            :rows-per-page-options="[1, 3, 5, 10, 15, 20, 25]"
            v-model:pagination="pagination"
            :filter="filter"
            >
            <template v-slot:body="props">
                <q-tr :props="props">
                <q-td>{{ props.row.prj_id }}</q-td>
                <q-td>{{ props.row.prj_nome }}</q-td>
                <q-td>{{ props.row.prj_descricao }}</q-td>
                <q-td>{{ props.row.prj_dataini }}</q-td>
                <q-td>{{ props.row.prj_datafim }}</q-td>
                <q-td>{{ props.row.stt_id }}</q-td>
                <q-td>
                    <q-btn label="Editar" color="primary" @click="editProject(props.row)" size="sm" />
                    <q-btn label="Excluir" color="negative" @click="deleteProject(props.row.prj_id)" size="sm" />
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
  import { Projeto } from "../services/ProjetoService";
  import { Notify } from 'quasar';
  
  export default {
    data() {
      return {
        projects: [],
        columns: [
          { name: "prj_id", label: "ID", align: "left", field: "prj_id" },
          { name: "prj_nome", label: "Nome", align: "left", field: "prj_nome" },
          { name: "prj_descricao", label: "Descrição", align: "left", field: "prj_descricao" },
          { name: "prj_dataini", label: "Data Início", align: "left", field: "prj_dataini" },
          { name: "prj_datafim", label: "Data Fim", align: "left", field: "prj_datafim" },
          { name: "stt_id", label: "Status ID", align: "left", field: "stt_id" },
          { name: "actions", label: "Ações", align: "center" }
        ],
        pagination: {
          rowsPerPage: 10
        },
        filter: "",
        formData: {
          prj_id: null,
          prj_nome: "",
          prj_descricao: "",
          prj_dataini: "",
          prj_datafim: "",
          stt_id: null
        },
        hasFetched: false
      };
    },
    computed: {
      formattedProjects() {
        return this.projects.map((project) => ({
          ...project,
          prj_dataini: this.formatDate(project.prj_dataini),
          prj_datafim: this.formatDate(project.prj_datafim)
        }));
      }
    },
    methods: {
      async fetchProjects() {
        if (this.hasFetched) return;
        try {
          this.projects = [];
          for (let i = 1; i <= 5; i++) {
            const res = await Projeto.getProjeto(i);
            if (res && res.projeto && res.projeto.length > 0) {
              this.projects.push(res.projeto[0]);
            }
          }
          this.hasFetched = true;
        } catch (err) {
          console.error("Erro ao buscar projetos:", err);
        }
      },
      async fetchProjectById() {
        if (!this.formData.prj_id) return;
        try {
          const project = await Projeto.getProjeto(this.formData.prj_id);
          if (project.projeto && project.projeto.length > 0) {
            const fetchedProject = project.projeto[0];
            this.formData = {
              ...fetchedProject,
              prj_dataini: this.formatDate(fetchedProject.prj_dataini),
              prj_datafim: this.formatDate(fetchedProject.prj_datafim)
            };
          } else {
            this.$q.notify({ color: "warning", message: "Projeto não encontrado!", timeout: 3000 });
            this.clearForm();
          }
          console.log("Fetched project by ID:", this.formData);
        } catch (err) {
          console.error("Erro ao buscar projeto:", err);
          this.$q.notify({ color: "negative", message: "Erro ao buscar projeto", timeout: 3000 });
        }
      },
      formatDate(dateString) {
        return dateString ? dateString.split("T")[0] : "";
      },
      async handleSubmit() {
        const projectData = {
          nome: this.formData.prj_nome,
          descricao: this.formData.prj_descricao,
          dataini: new Date(this.formData.prj_dataini).toISOString(),
          datafim: new Date(this.formData.prj_datafim).toISOString(),
          status: this.formData.stt_id
        };
  
        try {
          if (this.formData.prj_id) {
            await Projeto.updateProjeto({ ...projectData, id: this.formData.prj_id });
          } else {
            await Projeto.createProjeto(projectData);
          }
          this.clearForm();
          this.$q.notify({ color: "positive", message: "Projeto salvo com sucesso!", timeout: 3000 });
        } catch (err) {
          console.error("Erro ao salvar projeto:", err);
          this.$q.notify({ color: "negative", message: "Erro ao salvar projeto", timeout: 3000 });
        }
      },
      editProject(project) {
        console.log("Editing project:", project);
        this.formData = {
          ...project,
          prj_dataini: this.formatDate(project.prj_dataini),
          prj_datafim: this.formatDate(project.prj_datafim)
        };
      },
      async deleteProject(id) {
        try {
          await Projeto.deleteProjeto(id);
        } catch (err) {
          console.error("Erro ao excluir projeto:", err);
        }
      },
      clearForm() {
        this.formData = { prj_id: null, prj_nome: "", prj_descricao: "", prj_dataini: "", prj_datafim: "", stt_id: null };
      }
    },
    mounted() {
      this.fetchProjects();
    }
  };
  </script>
  
  <style scoped>
  .full-height {
    min-height: 100vh;
  }
  </style>
  