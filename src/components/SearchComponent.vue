<template>
  <v-select
    v-model="value"
    :items="items"
    label="Selecione"
    multiple
    clearable
    rounded="pill"
    hide-details
    variant="solo"
  >
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index < 3" :text="item.title"></v-chip>

      <span v-if="index === 3" class="text-grey text-caption align-self-center">
        (+{{ value.length - 3 }} others)
      </span>
    </template>
  </v-select>
</template>
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef([])
const items = [
  'Frontend',
  'Backend',
  'Senior',
  'Pleno',
  'Junior',
  'Remoto',
  'Presencial',
  'Híbrido',
]
</script>
