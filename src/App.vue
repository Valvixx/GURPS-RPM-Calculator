<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import InputFields from './components/InputFields.vue'
import MarkdownBoard from './components/MarkdownBoard.vue'

const name = ref('')
const spellEffects = ref([])

function updateSpellEffects(effects) {
  spellEffects.value = effects
}
</script>

<template>
  <Header />
  <div class="wrapper">
    <div class="content">
      <InputFields
          v-model="name"
          @update:spellEffects="updateSpellEffects"
      />

      <MarkdownBoard
          :name="name"
          :spellEffects="spellEffects"
      />
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  color: var(--TextColor);
}

.content {
  display: flex;
  flex-direction: row;
  gap: 3em;
  margin: 1em;
}

</style>
