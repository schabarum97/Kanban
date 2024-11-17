<template>
    <q-page class="full-height">
      <div class="row full-height">
        <q-card class="col-12 col-md-5 q-pa-md full-height scrollable-card">
          <q-card-section>
            <div class="text-h6">{{ formData.stt_id ? 'Editar Status' : 'Novo Status' }}</div>
          </q-card-section>
          <q-form @submit="handleSubmit">
            <q-input
              v-model="formData.stt_id"
              label="ID do Status"
              type="number"
              @blur="fetchStatusById"
              hint="Digite um ID para buscar um status"
              required
            />
            <q-input v-model="formData.stt_nome" label="Nome do Status" required />
            <q-input v-model="formData.stt_tabela" label="Tabela do Status" required />
            <q-input v-model="formData.stt_dataini" label="Data Início" type="date" required />
            <q-input v-model="formData.stt_datafim" label="Data Fim" type="date" />
            
            <div class="q-mt-md">
                <label class="text-caption">Cor</label>
                <q-color
                v-model="formData.stt_cor"
                format-model="hex"
                default-view="view-sat"
                square
                />
            </div>
            
            <q-btn label="Salvar" color="secondary" @click="handleSubmit" class="q-mt-sm" />
            <q-btn label="Limpar" color="secondary" @click="clearForm" class="q-mt-sm" />
          </q-form>
        </q-card>
  
        <q-card class="col-12 col-md-7 q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">Lista de Status</div>
            <q-table
              :rows="formattedStatus"
              :columns="columns"
              row-key="stt_id"
              :rows-per-page-options="[1, 3, 5, 10, 15, 20, 25]"
              v-model:pagination="pagination"
              :filter="filter"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>{{ props.row.stt_id }}</q-td>
                  <q-td>{{ props.row.stt_nome }}</q-td>
                  <q-td>{{ props.row.stt_tabela }}</q-td>
                  <q-td>{{ props.row.stt_dataini }}</q-td>
                  <q-td>{{ props.row.stt_datafim }}</q-td>
                  <q-td>{{ props.row.stt_cor }}</q-td>
                  <q-td class="action-buttons">
                    <q-btn label="Editar" color="black" @click="editStatus(props.row)" size="sm" />
                    <q-btn label="Excluir" color="red" @click="deleteStatus(props.row.stt_id)" size="sm" />
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
  import { Status } from "../services/StatusService";
  import { useQuasar } from 'quasar';
  import { useRouter } from "vue-router";
  
  export default {
    data() {
      return {
        q: useQuasar(),
        router: useRouter(),
        statusList: [],
        columns: [
          { name: "stt_id", label: "ID", align: "left", field: "stt_id" },
          { name: "stt_nome", label: "Nome", align: "left", field: "stt_nome" },
          { name: "stt_tabela", label: "Tabela", align: "left", field: "stt_tabela" },
          { name: "stt_dataini", label: "Data Início", align: "left", field: "stt_dataini" },
          { name: "stt_datafim", label: "Data Fim", align: "left", field: "stt_datafim" },
          { name: "stt_cor", label: "Cor", align: "left", field: "stt_cor" },
          { name: "actions", label: "Ações", align: "center" }
        ],
        pagination: {
          rowsPerPage: 10
        },
        filter: "",
        formData: {
          stt_id: null,
          stt_nome: "",
          stt_tabela: "",
          stt_dataini: "",
          stt_datafim: "",
          stt_cor: ""
        }
      };
    },
    computed: {
      formattedStatus() {
        return this.statusList.map((status) => ({
          ...status,
          stt_dataini: this.formatDate(status.stt_dataini),
          stt_datafim: this.formatDate(status.stt_datafim)
        }));
      }
    },
    methods: {
      checkIfLoggedIn() {
        // Verifica se há um token de autenticação ou algo que indique que o usuário está logado
        const token = localStorage.getItem('token');
        console.log(token)
        if (!token) {
          // Se não estiver logado, redireciona para a página de login
          this.$router.push('/login');
        }
      },
      async fetchStatusList() {
        try {
          this.statusList = [];
          for (let i = 1; i <= 10; i++) {
            try {
              const res = await Status.getStatus(i);
              if (res && res.status && res.status.length > 0) {
                this.statusList.push(res.status[0]);
              } else {
                console.warn(`Nenhum status encontrado para o ID ${i}`);
              }
            } catch (err) {
              console.warn(`Erro ao buscar status com ID ${i}:`, err);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar lista de status:", err);
        }
      },
      async fetchStatusById() {
        if (!this.formData.stt_id) return;
        try {
          const status = await Status.getStatus(this.formData.stt_id);
          if (status.status && status.status.length > 0) {
            const fetchedStatus = status.status[0];
            this.formData = {
              ...fetchedStatus,
              stt_dataini: this.formatDate(fetchedStatus.stt_dataini),
              stt_datafim: this.formatDate(fetchedStatus.stt_datafim)
            };
          } else {
            this.clearForm();
          }
        } catch (err) {
          this.clearForm();
          console.error("Erro ao buscar status:", err);
        }
      },
      formatDate(dateString) {
        return dateString ? dateString.split("T")[0] : "";
      },
      async handleSubmit() {
        const statusData = {
          nome: this.formData.stt_nome,
          tabela: this.formData.stt_tabela,
          dataini: this.formData.stt_dataini ? new Date(this.formData.stt_dataini).toISOString() : null,
          datafim: this.formData.stt_datafim ? new Date(this.formData.stt_datafim).toISOString() : null,
          cor: this.formData.stt_cor
        };
        const statusDataPut = {
          id: this.formData.stt_id,
          ...statusData
        };
        
        console.log(statusDataPut)
        try {
          if (this.formData.stt_id) {
            await Status.updateStatus(statusDataPut);
            this.q.notify({
                    type: 'positive',
                    message: 'Status atualizado com sucesso!',
                    position: 'top-right',
                    timeout: 3000
                  })
          } else {
            await Status.createStatus(statusData);
            this.q.notify({
                    type: 'positive',
                    message: 'Status inserido com sucesso!',
                    position: 'top-right',
                    timeout: 3000
                  })
          }
          this.clearForm();
          this.fetchStatusList();
        } catch (err) {
          this.q.notify({
                    type: 'negative',
                    message: 'Erro ao gravar registro do status',
                    position: 'top-right',
                    timeout: 3000
                  })
          console.error("Erro ao salvar status:", err);
        }
      },
      editStatus(status) {
        this.formData = {
          ...status,
          stt_dataini: this.formatDate(status.stt_dataini),
          stt_datafim: this.formatDate(status.stt_datafim)
        };
      },
      async deleteStatus(id) {
        try {
          await Status.deleteStatus(id);
          this.clearForm();
          this.fetchStatusList();
          this.q.notify({
                    type: 'positive',
                    message: 'Status deletado com sucesso!',
                    position: 'top-right',
                    timeout: 3000
                  })
        } catch (err) {
          this.q.notify({
                    type: 'negative',
                    message: 'Erro ao deletar registro',
                    position: 'top-right',
                    timeout: 3000
                  })
          console.error("Erro ao excluir status:", err);
        }
      },
      clearForm() {
        this.formData = {
          stt_id: null,
          stt_nome: "",
          stt_tabela: "",
          stt_dataini: "",
          stt_datafim: "",
          stt_cor: ""
        };
      }
    },
    mounted() {
      this.checkIfLoggedIn();
      this.fetchStatusList();
    }
  };
  </script>
  