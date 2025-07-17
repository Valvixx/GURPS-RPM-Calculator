<script setup lang="ts">
import { computed, watch } from 'vue'
import { useEnergyStore } from '../stores/energy.js'
import { useFieldsStore } from "../stores/fields.js"

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()

const distanceValue = computed<number>({
  get: () => fieldsStore.distanceValue,
  set: (val: number) => fieldsStore.distanceValue = val
})

const distanceUnit = computed({
  get: () => fieldsStore.distanceType,
  set: (val: string) => fieldsStore.distanceType = val
})

const thresholds = [
  { maxYards: 2, energy: 0 },
  { maxYards: 3, energy: 1 },
  { maxYards: 5, energy: 2 },
  { maxYards: 7, energy: 3 },
  { maxYards: 10, energy: 4 },
  { maxYards: 15, energy: 5 },
  { maxYards: 20, energy: 6 },
  { maxYards: 30, energy: 7 },
  { maxYards: 50, energy: 8 },
  { maxYards: 70, energy: 9 },
  { maxYards: 100, energy: 10 },
  { maxYards: 150, energy: 11 },
  { maxYards: 200, energy: 12 },
  { maxYards: 300, energy: 13 },
  { maxYards: 500, energy: 14 },
  { maxYards: 700, energy: 15 },
  { maxYards: 1000, energy: 16 },
  { maxYards: 1500, energy: 17 },
  { maxYards: 2000, energy: 18 },
  { maxYards: 3000, energy: 19 },
  { maxYards: 5000, energy: 20 },
  { maxYards: 7000, energy: 21 },
  { maxYards: 10000, energy: 22 },
  { maxYards: 15000, energy: 23 },
  { maxYards: 20000, energy: 24 },
  { maxYards: 30000, energy: 25 },
  { maxYards: 50000, energy: 26 },
  { maxYards: 70000, energy: 27 },
  { maxYards: 100000, energy: 28 },
  { maxYards: 150000, energy: 29 },
  { maxYards: 200000, energy: 30 }
]

function calculateDistanceEnergy(yards: number): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (yards <= thresholds[i].maxYards) {
      return thresholds[i].energy
    }
  }

  const last = thresholds[thresholds.length - 1]
  const step = 50000
  const extraSteps = Math.ceil((yards - last.maxYards) / step)
  return last.energy + extraSteps
}

watch([distanceValue, distanceUnit], () => {
  let yards = distanceValue.value
  if (distanceUnit.value === 'miles') {
    yards *= 2000
  }

  const energy = yards <= 0 ? 0 : calculateDistanceEnergy(yards)
  energyStore.setDistance(energy)
})
</script>


<template>
  <div class="ranged-distance-component">
    <div class="input-group">
      <input
          v-model.number="distanceValue"
          type="number"
          min="0"
          placeholder="Enter distance"
          class="input"
      />
      <select v-model="distanceUnit" class="select">
        <option value="yards">Yards</option>
        <option value="miles">Miles</option>
      </select>
    </div>

    <div class="output">
      <strong>Energy: +{{ energyStore.distance }}</strong>
    </div>
  </div>
</template>

<style scoped>
.ranged-distance-component {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
  margin: 1em 0 1em 0.5em;

}

.input-group {
  display: flex;
  gap: 1em;
}

.input, .select {
  text-align: center;
  height: 2em;
  font-size: 1em;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
  width: 100%;
}

.input:hover, .select:hover {
  border-color: var(--Color4);
}

.select:hover{
  cursor: pointer;
}

.output{
  font-weight: bold;
  padding-bottom: 1em;
}
</style>
