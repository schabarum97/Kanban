<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      
      <q-card v-for="item in produtos" :key="item.nome" v-show="item.exibir" class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{item.nome}}</div>
          <div class="text-subtitle2">{{item.descricao}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">

          <q-icon :name="item.icone" />

          <div class="text-subtitle1">
            {{item.preco}}
          </div>
          <div class="text-caption text-grey">
            {{item.desc2}}
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn flat @click="exibirAlerta(item)">ADD</q-btn>
          <q-btn flat>VER MAIS</q-btn>
        </q-card-actions>
      </q-card>

      <q-dialog v-model="showAlert">
        <q-card>
          <q-card-section>
            <div class="text-h6">ADD AO CARRINHO</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{produtoSelecionado}}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    
     <!-- {{ listabotoes }}
      <q-btn v-for="item in listabotoes" :key="item.id">
          {{ item }}
      </q-btn>
      <q-btn>Inserir</q-btn>
      <q-btn>Deletar</q-btn>
      <q-btn>Salvar</q-btn>
      <q-btn>Editar</q-btn>
      <q-btn>Cancelar</q-btn>
      TEXTO {{ texto }}
      i18 {{ $t('failed') }}
      <cardInicial v-model:texto="texto" v-model:qtdeClicks="qtdeClicks"/>
      <cardInicial v-model:texto="texto" v-model:qtdeClicks="qtdeClicks"/>
      <q-input label="Usuário" v-model="usuario"> </q-input>
      <q-input label="Senha" v-model="senha"> </q-input>
       <q-btn>{{$t('button.insert')}}</q-btn>
      <q-btn>{{$t('button.delete')}}</q-btn>
      <select v-model="$i18n.locale">
        <option>en-US</option>
        <option>pt-BR</option>
      </select> -->
    </div>
  </q-page>
</template>

<script setup>

import i18n from 'src/i18n';
import cardInicial from '../components/cardInicial.vue'
defineOptions({
  name: 'IndexPage',
  data: () => ({
    showAlert: true, // controlar quando exibir o alerta
    produtoSelecionado: '', // qual produto foi clicado
    produtos: [
      { exibir: true, nome: 'Chinelo', descricao: 'chinelo havaianas, todo mundo usa', preco: '$ 15,00', desc2: 'qualquer coisa', icone: 'warning' },
      { exibir: false, nome: 'Tenis', descricao: 'All Stars', preco: '$ 100,00', desc2: 'akjsdakjshd', icone: 'print' },
      { exibir: true, nome: 'Camiseta', descricao: 'Gremio', preco: '$ 150,00', desc2: '', icone: 'today' },
      { exibir: true, nome: 'Tamanco', descricao: '', preco: '$ 500,00', desc2: '...', icone: 'style' }
    ]
  }),

  methods: {
    exibirAlerta(nome) {
      this.showAlert = true;
      this.produtoSelecionado = nome;
    }
  }
  // data: () => ({
  //   qtdeClicks: 0,
  //   texto: 'ABC',
  //   usuario: '',
  //   senha: '',
  //   listabotoes:[
  //     'Inserir',
  //     'Deletar',
  //     'Salvar'
  // ]
  // }),
  // components: {
  //    cardInicial
  // }
});
</script>