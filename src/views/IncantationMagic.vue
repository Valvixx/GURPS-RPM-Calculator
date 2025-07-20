<script setup lang="ts">

import {ref} from "vue";
import IncInputFields from "../components/IncInputFields.vue";
import IncMarkdownBoard from "../components/IncMarkdownBoard.vue";

const name = ref('')
const spellEffects = ref([])

function updateSpellEffects(effects) {
  spellEffects.value = effects
}
</script>

<template>
  <div class="wrapper">
    <div class="content">
      <IncInputFields
          v-model="name"
          @update:spellEffects="updateSpellEffects"
      />

      <IncMarkdownBoard
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