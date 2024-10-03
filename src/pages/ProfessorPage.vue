<template>
  <q-btn @click="navigate()">ALunos </q-btn>
</template>

<script setup>
defineOptions({
  name: "ProfessorPage",
  methods: {
    navigate() {
      this.$router.push("/alunos");
    },
  },
});
</script>
