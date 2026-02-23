<script setup lang="ts">
import { computed } from 'vue'
import { useFieldsStore } from '../stores/fields.js'

const fieldsStore = useFieldsStore()

const radiusValue = computed({
  get: () => fieldsStore.rpmAoeRadius,
  set: (val: number) => fieldsStore.rpmAoeRadius = val
})

const radiusUnit = computed({
  get: () => fieldsStore.rpmAoeUnit,
  set: (val: string) => fieldsStore.rpmAoeUnit = val
})

const YARDS_PER_MILE = 2000
const BASE_THRESHOLDS = [2, 3, 5, 7, 10, 15]

function thresholdForModifier(modifier: number): number {
  return BASE_THRESHOLDS[modifier % 6] * (10 ** Math.floor(modifier / 6))
}

function calculateModifier(yards: number): number {
  if (yards <= 0) return 0

  let modifier = 0
  while (thresholdForModifier(modifier) < yards) {
    modifier += 1
  }
  return modifier
}

const aoeEnergy = computed(() => {
  const radius = Number(radiusValue.value) || 0
  if (radius <= 0) return 0

  const yards = radiusUnit.value === 'miles' ? radius * YARDS_PER_MILE : radius
  const modifier = calculateModifier(yards)
  return modifier * 2
})
</script>

<template>
  <div class="aoe-component">
    <div class="input-group">
      <input
          v-model.number="radiusValue"
          type="number"
          min="0"
          step="any"
          placeholder="Radius"
          class="input"
      />
      <select v-model="radiusUnit" class="select">
        <option value="yards">Yards</option>
        <option value="miles">Miles</option>
      </select>
    </div>

    <div class="output">
      <strong>Energy: +{{ aoeEnergy }}</strong>
    </div>
  </div>
</template>

<style scoped>
.aoe-component {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
  margin: 1em 0;
}

.input-group {
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
  padding-bottom: 1em;
}
</style>
