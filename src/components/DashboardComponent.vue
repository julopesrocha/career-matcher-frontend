<template>
  <ToolbarComponent />
  <v-row dense class="ma-3 pa-4">
    <v-col cols="12" md="3" v-for="v in paginatedVacancies" :key="v.title">
      <VacancyComponent :vacancy="v" />
    </v-col>
  </v-row>
  <v-pagination v-model="currentPage" :length="setPagination()"></v-pagination>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolbarComponent from './ToolbarComponent.vue'
import VacancyComponent from './VacancyComponent.vue'

const vacanciesPerpage = 8
const currentPage = ref(1)

const paginatedVacancies = computed(() => {
  const start = (currentPage.value - 1) * vacanciesPerpage
  const end = start + vacanciesPerpage
  return vacancies.value.slice(start, end)
})

const avatarFromName = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash % 99)
  return `https://randomuser.me/api/portraits/men/${index}.jpg`
}

const vacancies = ref([
  {
    title: 'Desenvolvedor FrontEnd',
    level: 'Senior',
    workType: 'Presencial',
    location: 'Rio de Janeiro',
    description: 'Experiência com TypeScript e testes de frontend...',
    candidate: {
      name: 'Mike Almeida',
      role: 'Desenvolvedor Frontend',
      avatar: avatarFromName('Mike Almeida'),
      techs: ['Vue.js', 'TypeScript', 'Jest', 'HTML', 'CSS'],
    },
  },
  {
    title: 'Backend Node.js',
    level: 'Pleno',
    workType: 'Remoto',
    location: 'São Paulo',
    description: 'Node, Express, MongoDB...',
    candidate: {
      name: 'Ana Costa',
      role: 'Desenvolvedor Backend',
      avatar: avatarFromName('Ana Costa'),
      techs: ['Node.js', 'MongoDB', 'Express', 'Docker'],
    },
  },
])

const setPagination = () => {
  return Math.ceil(vacancies.value.length / 8)
}
</script>

<style scoped></style>
