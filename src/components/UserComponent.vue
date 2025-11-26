<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-chip color="white" v-bind="props" pill>
          <v-avatar start>
            <v-img
              v-if="candidate.avatar"
              :src="candidate.avatar"
              cover
              style="width: 100%; height: 100%"
            />
            <span v-else> <v-icon prepend>mdi-account-circle</v-icon> </span>
          </v-avatar>

          <v-list-item-item class="px-2">
            {{ candidate.name }}
          </v-list-item-item>
        </v-chip>
      </template>

      <v-card min-width="300" max-width="330">
        <v-list>
          <v-row class="d-flex align-center pa-4 ml-1">
            <v-col class="pa-0" cols="auto">
              <v-avatar>
                <v-img
                  v-if="candidate.avatar"
                  :src="candidate.avatar"
                  cover
                  style="width: 100%; height: 100%"
                />
                <span v-else> <v-icon prepend>mdi-account-circle</v-icon> </span>
              </v-avatar>
            </v-col>

            <v-col>
              <v-list-item-content>
                <v-list-item-title>{{ candidate.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ candidate.role }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item class="ma-0 py-0">
            <v-list-item-subtitle>Tecnologias</v-list-item-subtitle>
          </v-list-item>

          <v-row class="d-flex flex-wrap ma-2 mt-1 pa-0">
            <v-col v-for="tech in candidate.techs" :key="tech" cols="auto" class="pa-1">
              <v-chip class="my-0" color="blue" small>{{ tech }}</v-chip>
            </v-col>
          </v-row>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const menu = ref(false)

// 🔥 Simulando resposta da API
const candidate = ref({
  name: 'Marcos Souza',
  role: 'Desenvolvedor Frontend',
  avatar: null as string | null,
  techs: ['Vue.js', 'TypeScript', 'Node', 'Pinia', 'Vuetify'],
})

// 🔥 Função que gera avatar estável baseado no nome
const avatarFromName = (name: string) => {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const index = hash % 99
  return `https://randomuser.me/api/portraits/men/${index}.jpg`
}

// Gera o avatar quando “carrega”
candidate.value.avatar = avatarFromName(candidate.value.name)
</script>
