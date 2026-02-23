<script setup>
import { computed } from 'vue'
import { useFieldsStore } from "../stores/fields.js"

const fieldsStore = useFieldsStore()
const denseMode = computed(() => fieldsStore.uiDenseMode)

function toggleDenseMode() {
  fieldsStore.uiDenseMode = !fieldsStore.uiDenseMode
}
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <div class="siteName"> <b>GURPS RPM Calculator</b></div>

      <nav>
        <RouterLink to="/">RPM</RouterLink>
        <RouterLink to="/incantation">Incantation Magic</RouterLink>
      </nav>

      <button class="dense-toggle" @click="toggleDenseMode">
        {{ denseMode ? 'Comfort Mode' : 'Dense Mode' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  height: 3.6em;
  width: 100%;
  background-color: var(--Color2);
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 2px solid var(--Color3);
}

.header-inner {
  height: 100%;
  width: 98%;
  max-width: 180em;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.8em;
}

.siteName {
  font-size: 1.2em;
}
nav{
  display: flex;
  flex-direction: row;
  gap: 0.8em;
  justify-self: center;
  font-size: 0.95em;
}

.dense-toggle {
  height: 1.9em;
  padding: 0 0.7em;
  font-size: 0.88em;
  font-family: inherit;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.dense-toggle:hover {
  cursor: pointer;
  border-color: var(--Color4);
}
</style>
