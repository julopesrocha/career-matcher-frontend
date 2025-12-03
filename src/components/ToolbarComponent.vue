<template>
  <div class="hero-section">
    <div class="hero-content">
      <v-icon size="48" class="hero-icon mb-2">mdi-briefcase-search</v-icon>
      <h1 class="app-title">Career Matcher</h1>
      <p class="app-subtitle">Encontre a vaga perfeita para você</p>
    </div>

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 24px 64px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-icon {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.app-title {
  color: white;
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.app-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 24px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.search-wrapper {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .app-title {
    font-size: 2rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }

  .hero-icon {
    font-size: 40px !important;
  }
}
</style>
