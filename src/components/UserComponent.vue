<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template #activator="{ props }">
        <v-chip color="indigo" v-bind="props" pill class="ma-2">
          <v-avatar start>
            <v-img v-if="data?.avatar" :src="data.avatar" cover style="width: 100%; height: 100%" />
            <span v-else>
              <v-icon prepend color="indigo" small>mdi-account-circle</v-icon>
            </span>
          </v-avatar>

          <v-list-item class="px-2">
            {{ data?.nome || candidateName }}
          </v-list-item>
        </v-chip>
      </template>

      <v-card min-width="300" max-width="330">
        <v-list>
          <!-- LOADING -->
          <v-row v-if="loading" class="d-flex align-center pa-4 ml-1">
            <v-col>Carregando...</v-col>
          </v-row>

          <!-- ERROR -->
          <v-row v-else-if="error" class="d-flex align-center pa-4 ml-1">
            <v-col>Erro ao carregar candidato.</v-col>
          </v-row>

          <!-- DADOS -->
          <template v-else>
            <v-row class="d-flex align-center pa-4 ml-1">
              <v-col class="pa-0" cols="auto">
                <v-avatar>
                  <v-img
                    v-if="data?.avatar"
                    :src="data.avatar"
                    cover
                    style="width: 100%; height: 100%"
                  />
                  <span v-else>
                    <v-icon prepend>mdi-account-circle</v-icon>
                  </span>
                </v-avatar>
              </v-col>

              <v-col>
                <v-list-item>
                  <v-list-item-title>{{ data?.nome }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ data?.senioridade }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider />

            <v-list>
              <v-list-item class="ma-0 py-0">
                <v-list-item-subtitle>Tecnologias</v-list-item-subtitle>
              </v-list-item>

              <v-row class="d-flex flex-wrap ma-2 mt-1 pa-0">
                <v-col v-for="tec in data?.competencias" :key="tec" cols="auto" class="pa-1">
                  <v-chip class="my-0" color="blue" small>{{ tec }}</v-chip>
                </v-col>
              </v-row>
            </v-list>
          </template>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'

const menu = ref(false)

const props = defineProps<{
  candidateName: string
}>()

interface Candidate {
  nome: string
  senioridade: string
  cidade: string
  avatar: string | null
  competencias: string[]
}

// ---------------- MOCK REQUISIÇÃO
const mockCandidates = [
  {
    nome: 'João Silva',
    senioridade: 'Pleno',
    cidade: 'São Paulo',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    competencias: ['Vue', 'Node', 'PostgreSQL'],
  },
  {
    nome: 'Maria Santos',
    senioridade: 'Sênior',
    cidade: 'Rio de Janeiro',
    avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
    competencias: ['Python', 'Django', 'Docker'],
  },
  {
    nome: 'Julia Rocha',
    senioridade: 'Júnior',
    cidade: 'Curitiba',
    avatar: null,
    competencias: ['HTML', 'CSS', 'JavaScript'],
  },
]

// ---------------- STATE
const data = ref<Candidate | null>(null)
const loading = ref(true)
const error = ref(false)

// ---------------- FETCH MOCK
const fetchCandidate = async () => {
  loading.value = true

  try {
    const result = mockCandidates.find(
      (c) => c.nome.toLowerCase() === props.candidateName.toLowerCase(),
    )

    if (!result) throw new Error('Candidato não encontrado')

    data.value = result
  } catch (e) {
    error.value = true
    return e
  } finally {
    loading.value = false
  }
}

// Buscar ao montar
onMounted(fetchCandidate)
</script>
