<template>
  <div class="hero-section">
    <h1 class="app-title">Career Matcher</h1>

    <div class="search-wrapper">
      <SearchComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchComponent from './SearchComponent.vue'
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
