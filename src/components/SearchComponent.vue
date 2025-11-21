<template>
  <v-row dense justify="center">
    <v-col cols="12">
      <v-text-field
        ref="searchField"
        label="Search"
        variant="solo"
        hide-details
        rounded="pill"
        bg-color="white"
        class="search-box"
        clearable
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<style scoped>
.search-box {
  border-radius: 40px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* leve sombra estilo Google */
}
</style>
