<template>
  <v-card class="ma-1 px-2 pt-2" rounded="lg" max-width="340" elevation="2">
    <v-card-title> {{ props.vacancy.title }} </v-card-title>
    <v-card-text class="d-flex">
      <v-chip
        size="small"
        prepend-icon="mdi-briefcase-variant"
        variant="tonal"
        color="green darken-6"
        class="mr-1"
      >
        {{ props.vacancy.level }}
      </v-chip>
      <v-chip size="small" prepend-icon="mdi-laptop" color="green darken-6" class="mr-1">
        {{ props.vacancy.workType }}
      </v-chip>
      <v-chip size="small" prepend-icon="mdi-map-marker" color="green darken-6" class="mr-1">
        {{ props.vacancy.location }}
      </v-chip>
    </v-card-text>
    <v-card-subtitle> Descrição </v-card-subtitle>
    <v-card-text class="custom-description-height mb-2">
      {{ props.vacancy.description }}</v-card-text
    >
    <v-divider class="mx-4" />
    <v-row align="center" justify="space-between" class="py-1">
      <v-col>
        <v-card-subtitle>Candidato</v-card-subtitle>
      </v-col>
      <v-col align-self="end">
        <!-- <UserComponent :candidate="props.vacancy.candidate" /> -->
        <v-chip color="indigo" v-bind="props" pill class="ma-2">
          <v-avatar start>
            <v-img
              v-if="props.vacancy.candidate.avatar"
              :src="props.vacancy.candidate.avatar"
              cover
              style="width: 100%; height: 100%"
            />
            <span v-else> <v-icon prepend>mdi-account-circle</v-icon> </span>
          </v-avatar>
          {{ props.vacancy.candidate.name }}
        </v-chip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
// import UserComponent from './UserComponent.vue'

const props = defineProps<{
  vacancy: {
    title: string
    level: string
    workType: string
    location: string
    description: string
    candidate: {
      name: string
      role: string
      avatar: string
      techs: string[]
    }
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
