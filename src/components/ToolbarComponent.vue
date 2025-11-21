<template>
  <div class="hero-section">
    <h1 class="app-title">Career Matcher</h1>

    <div class="search-wrapper">
      <SearchComponent />
    </div>
  </div>

  <v-row>
    <v-col cols="12" md="3" v-for="v in vacancies" :key="v.title">
      <VacancyComponent :vacancy="v" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchComponent from './SearchComponent.vue'
import VacancyComponent from './VacancyComponent.vue'

const vacancies = ref([
  {
    title: 'Desenvolvedor FrontEnd',
    level: 'Senior',
    workType: 'Presencial',
    location: 'Rio de Janeiro',
    description: 'Experiência com TypeScript e testes de frontend...',
    candidate: 'Mike Almeida',
  },
  {
    title: 'Backend Node.js',
    level: 'Pleno',
    workType: 'Remoto',
    location: 'São Paulo',
    description: 'Node, Express, MongoDB...',
    candidate: 'Ana Costa',
  },
])
</script>

<style scoped>
.hero-section {
  background-color: #6a1b9a; /* roxo bonito */
  padding: 40px 0 60px;
  text-align: center;
}

.app-title {
  color: white;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
}

.search-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
</style>
