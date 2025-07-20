<script setup lang="ts">

import InputFields from "../components/InputFields.vue";
import MarkdownBoard from "../components/MarkdownBoard.vue";
import {ref} from "vue";

const name = ref('')
const spellEffects = ref([])

function updateSpellEffects(effects) {
  spellEffects.value = effects
}
</script>

<template>
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

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>