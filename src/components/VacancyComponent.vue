<template>
  <v-row class="ma-4" dense>
    <v-col class="ma-3 pa-0">
      <v-card class="ma-1 pa-0" max-width="320" rounded="lg">
        <v-card-title> Desenvolvedor FrontEnd </v-card-title>
        <v-card-text class="d-flex justify-space-between">
          <v-chip
            size="small"
            prepend-icon="mdi-briefcase-variant"
            variant="tonal"
            color="green darken-6"
          >
            {{ props.vacancy.level }}
          </v-chip>
          <v-chip size="small" prepend-icon="mdi-laptop" color="green darken-6">
            {{ props.vacancy.workType }}
          </v-chip>
          <v-chip size="small" prepend-icon="mdi-map-marker" color="green darken-6">
            {{ props.vacancy.location }}
          </v-chip>
        </v-card-text>
        <v-card-subtitle> Descrição </v-card-subtitle>
        <v-card-text class="custom-description-height mb-2">
          {{ props.vacancy.description }}</v-card-text
        >
        <v-divider class="mx-4" />
        <v-row align="center" justify="space-between">
          <v-col>
            <v-card-subtitle>Candidato</v-card-subtitle>
          </v-col>
          <v-col>
            <v-chip class="ma-2" color="indigo" prepend-icon="mdi-account-circle">
              {{ props.vacancy.candidate }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  vacancy: {
    title: string
    level: string
    workType: string
    location: string
    description: string
    candidate: string
  }
}>()
</script>
<style scoped>
.custom-description-height {
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
