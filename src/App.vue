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

  <main>
    <RouterView />
  </main>

</template>

<style>
* {
  box-sizing: border-box;
  color: var(--TextColor);
}
</style>
