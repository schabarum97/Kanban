<template>
    <q-page class="full-height">
      <div class="row full-height">
        <q-card class="col-12 col-md-5 q-pa-md full-height scrollable-card">
          <q-card-section>
            <div class="text-h6">{{ formData.fun_id ? 'Editar Funcionário' : 'Novo Funcionário' }}</div>
          </q-card-section>
          <q-form @submit="handleSubmit">
            <q-input
              v-model="formData.fun_id"
              label="ID do Funcionário"
              type="number"
              @blur="fetchFuncionarioById"
              hint="Digite um ID para buscar um funcionário"
              required
            />
            <q-input v-model="formData.fun_nome" label="Nome do Funcionário" required />
            <q-input v-model="formData.fun_funcao" label="Função" required />
            <q-input v-model="formData.fun_email" label="Email" type="email" required />
            <q-input v-model="formData.fun_telefone" label="Telefone" type="tel" required />
            <q-input v-model="formData.fun_cpf" label="CPF" required />
            <q-input v-model="formData.stt_id" label="Status ID" type="number" required />
  
            <q-btn label="Salvar" color="secondary" @click="handleSubmit" class="q-mt-sm" />
            <q-btn label="Limpar" color="secondary" @click="clearForm" class="q-mt-sm" />
          </q-form>
        </q-card>
        
        <q-card class="col-12 col-md-7 q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">Lista de Funcionários</div>
            <q-table
              :rows="formattedFuncionarios"
              :columns="columns"
              row-key="fun_id"
              :rows-per-page-options="[1, 3, 5, 10, 15, 20, 25]"
              v-model:pagination="pagination"
              :filter="filter"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>{{ props.row.fun_id }}</q-td>
                  <q-td>{{ props.row.fun_nome }}</q-td>
                  <q-td>{{ props.row.fun_funcao }}</q-td>
                  <q-td>{{ props.row.fun_email }}</q-td>
                  <q-td>{{ props.row.fun_telefone }}</q-td>
                  <q-td>{{ props.row.fun_cpf }}</q-td>
                  <q-td>{{ props.row.stt_id }}</q-td>
                  <q-td class="action-buttons">
                    <q-btn label="Editar" color="primary" @click="editFuncionario(props.row)" size="sm" />
                    <q-btn label="Excluir" color="negative" @click="deleteFuncionario(props.row.fun_id)" size="sm" />
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
  import { Funcionario } from "../services/FuncionarioService";
  import { useQuasar } from 'quasar';
  
  export default {
    data() {
      return {
        q: useQuasar(),
        funcionarios: [],
        columns: [
          { name: "fun_id", label: "ID", align: "left", field: "fun_id" },
          { name: "fun_nome", label: "Nome", align: "left", field: "fun_nome" },
          { name: "fun_funcao", label: "Função", align: "left", field: "fun_funcao" },
          { name: "fun_email", label: "Email", align: "left", field: "fun_email" },
          { name: "fun_telefone", label: "Telefone", align: "left", field: "fun_telefone" },
          { name: "fun_cpf", label: "CPF", align: "left", field: "fun_cpf" },
          { name: "stt_id", label: "Status ID", align: "left", field: "stt_id" },
          { name: "actions", label: "Ações", align: "center" }
        ],
        pagination: {
          rowsPerPage: 10
        },
        filter: "",
        formData: {
          fun_id: null,
          fun_nome: "",
          fun_funcao: "",
          fun_email: "",
          fun_telefone: "",
          fun_cpf: "",
          stt_id: null
        }
      };
    },
    computed: {
      formattedFuncionarios() {
        return this.funcionarios;
      }
    },
    methods: {
      async fetchFuncionarios() {
        try {
          this.funcionarios = [];
          for (let i = 1; i <= 10; i++) {
            try {
              const res = await Funcionario.getFuncionario(i);
              if (res && res.funcionario && res.funcionario.length > 0) {
                this.funcionarios.push(res.funcionario[0]);
              } else {
                console.warn(`Nenhum funcionário encontrado para o ID ${i}`);
              }
            } catch (err) {
              console.warn(`Erro ao buscar funcionário com ID ${i}:`, err);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar funcionários:", err);
        }
      },
      async fetchFuncionarioById() {
        if (!this.formData.fun_id) return;
        try {
          const funcionario = await Funcionario.getFuncionario(this.formData.fun_id);
          if (funcionario.funcionario && funcionario.funcionario.length > 0) {
            this.formData = funcionario.funcionario[0];
          } else {
            this.clearForm();
          }
        } catch (err) {
          this.clearForm();
          console.error("Erro ao buscar funcionário:", err);
        }
      },
      async handleSubmit() {
        const funcionarioData = {
          nome: this.formData.fun_nome,
          funcao: this.formData.fun_funcao,
          email: this.formData.fun_email,
          telefone: this.formData.fun_telefone,
          cpf: this.formData.fun_cpf,
          status: this.formData.stt_id
        };
  
        const funcionarioDataPut = {
          id: this.formData.fun_id,
          ...funcionarioData
        };
  
        try {
          if (this.formData.fun_id) {
            await Funcionario.updateFuncionario(funcionarioDataPut);
            this.q.notify({
                    type: 'positive',
                    message: 'Funcionario atualizado com sucesso!',
                    position: 'top-right',
                    timeout: 3000
                  })
          } else {
            await Funcionario.createFuncionario(funcionarioData);
            this.q.notify({
                    type: 'positive',
                    message: 'Funcionario inserido com sucesso!',
                    position: 'top-right',
                    timeout: 3000
                  })
          }
          this.clearForm();
          this.fetchFuncionarios();
        } catch (err) {
          this.q.notify({
                    type: 'negative',
                    message: 'Erro ao gravar registro do funcionario',
                    position: 'top-right',
                    timeout: 3000
                  })
          console.error("Erro ao salvar funcionário:", err);
        }
      },
      editFuncionario(funcionario) {
        this.formData = { ...funcionario };
      },
      async deleteFuncionario(id) {
        try {
          await Funcionario.deleteFuncionario(id);
          this.clearForm();
          this.fetchFuncionarios();
          this.q.notify({
                    type: 'positive',
                    message: 'Funcionario deletado com sucesso!',
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
          console.error("Erro ao excluir funcionário:", err);
        }
      },
      clearForm() {
        this.formData = {
          fun_id: null,
          fun_nome: "",
          fun_funcao: "",
          fun_email: "",
          fun_telefone: "",
          fun_cpf: "",
          stt_id: null
        };
      }
    },
    mounted() {
      this.fetchFuncionarios();
    }
  };
  </script>
  