<script setup lang="ts">
import { computed } from 'vue'
import { useFieldsStore } from "../stores/fields.js"
import { storeToRefs } from "pinia"

const fieldsStore = useFieldsStore()
const { aoeRadius, aoeType, aoeValue } = storeToRefs(fieldsStore)

const aoeEnergy = computed(() => {
  const radius = Number(aoeRadius.value) || 0
  const value = Number(aoeValue.value) || 0

  if (radius <= 0) return 0

  const radiusEnergy = radius * 10
  const valueEnergy = aoeType.value === 'Everyone' ? 0 : Math.ceil(value / 2)
  return radiusEnergy + valueEnergy
})

</script>

<template>
  <div class="container">
    <div class="row">
      <input v-model="aoeRadius" type="number" placeholder="Radius(yd)" class="input" />

      <select v-model="aoeType" class="select">
        <option>Everyone</option>
        <option>Include</option>
        <option>Exclude</option>
      </select>

      <input
          v-model="aoeValue"
          type="number"
          placeholder="Value"
          class="input"
          :disabled="aoeType === 'Everyone'"
      />
    </div>
    <div class="output">
      Energy: +{{ aoeEnergy }}
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
  margin: 1em 0;
}

.row {
  display: flex;
  gap: 1em;
}

.input,
.select {
  text-align: center;
  height: 2em;
  font-size: 1em;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
  width: 100%;
}

.input:hover,
.select:hover {
  border-color: var(--Color4);
}

.select:hover {
  cursor: pointer;
}

.output {
  font-weight: bold;
  padding-bottom: 1em;
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>