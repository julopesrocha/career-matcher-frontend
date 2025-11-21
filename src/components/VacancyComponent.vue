<template>
  <v-row class="ma-4" dense>
    <v-col md>
      <v-card class="" max-width="320" rounded="lg">
        <v-card-title> Desenvolvedor FrontEnd </v-card-title>
        <v-card-text class="d-flex justify-space-between">
          <v-chip
            size="small"
            prepend-icon="mdi-briefcase-variant"
            variant="tonal"
            color="green darken-6"
          >
            Senior
          </v-chip>
          <v-chip size="small" prepend-icon="mdi-laptop" color="green darken-6">
            Presencial
          </v-chip>
          <v-chip size="small" prepend-icon="mdi-map-marker" color="green darken-6">
            Rio de Janeiro
          </v-chip>
        </v-card-text>
        <v-card-subtitle> Descrição </v-card-subtitle>
        <v-card-text>
          Experiência com TypeScript Conhecimento em testes de frontend e boas práticas de
          performance</v-card-text
        >
        <v-divider class="mx-4" />
        <v-row align="center" justify="space-between">
          <v-col>
            <v-card-subtitle>Candidato</v-card-subtitle>
          </v-col>
          <v-col>
            <v-chip class="ma-2" color="indigo" prepend-icon="mdi-account-circle">
              Mike Almeida
            </v-chip>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
