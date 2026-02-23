<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'

const name = ref('')
const spellEffects = ref([])

function updateSpellEffects(effects) {
  spellEffects.value = effects
}
</script>

<template>
  <Header/>

  <main class="page-main">
    <RouterView />
  </main>

</template>

<style>
* {
  box-sizing: border-box;
  color: var(--TextColor);
}

.content {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(24em, 1fr);
  align-items: start;
  justify-content: center;
  gap: 0.45em;
  margin: 0.5em auto;
  padding: 0;
  width: 98%;
  max-width: 180em;
  box-sizing: border-box;
}

.page-main {
  padding-top: 0.25em;
}

@media (max-width: 1200px) {
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.35em;
    width: 99%;
    padding: 0;
  }
}

</style>
