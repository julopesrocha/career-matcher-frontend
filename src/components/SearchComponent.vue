<template>
  <v-row dense justify="center">
    <v-col cols="12">
      <v-select
        chips
        ref="searchField"
        label="Busca"
        :items="items"
        multiple
        clearable
        class="search-box"
        hide-details
        rounded="pill"
        bg-color="white"
        variant="solo"
        v-model="selected"
      >
        <template #selection="{ item, index }">
          <!-- Mostra só os 2 primeiros chips -->
          <v-chip v-if="index < 2" class="mr-1" size="small">
            {{ item.title }}
          </v-chip>

          <!-- Mostra o +N ONLY quando index == 2 -->
          <span v-else-if="index === 2" class="text-grey text-caption align-self-center">
            (+{{ selected.length - 2 }} outros)
          </span>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>([])

const items = [
  'California',
  'Colorado',
  'Florida',
  'Georgia',
  'Texas',
  'Wyoming',
  'Rio de Janeiro',
  'Londres',
  'Geodgia',
  'Texads',
  'Wyomsing',
]
</script>
