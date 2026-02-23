<script setup lang="ts">
import { computed, watch } from 'vue'
import { useEnergyStore } from '../stores/energy.js'
import { useFieldsStore } from "../stores/fields.js"
import StyledDropdown from "./StyledDropdown.vue";

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()

const distanceValue = computed({
  get: () => fieldsStore.longDistanceValue,
  set: (val: number) => fieldsStore.longDistanceValue = val
})

const distanceUnit = computed({
  get: () => fieldsStore.longDistanceType,
  set: (val: string) => fieldsStore.longDistanceType = val
})

const unitToYards = {
  yards: 1,
  miles: 2000,
  days: 2000 // если это логически так задумано
}

const thresholds = [
  { max: 200, modifier: 0 },
  { max: 1000, modifier: 1 },
  { max: 2000, modifier: 2 },
  { max: 6000, modifier: 3 },
  { max: 20000, modifier: 4 },
  { max: 60000, modifier: 5 },
  { max: 200000, modifier: 6 },
  { max: 600000, modifier: 7 },
  { max: 2000000, modifier: 8 }
]

function calculateLongDistanceEnergy(yards: number): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (yards <= thresholds[i].max) {
      return thresholds[i].modifier
    }
  }

  const base = 2000000
  const factor = Math.log10(yards / base)
  const extraSteps = Math.ceil(factor)
  return 8 + extraSteps * 2
}

watch([distanceValue, distanceUnit], () => {
  const val = distanceValue.value
  const unit = distanceUnit.value
  if (val <= 0 || !unitToYards[unit]) {
    energyStore.setLongDistance(0)
    return
  }

  const yards = val * unitToYards[unit]
  const modifier = calculateLongDistanceEnergy(yards)
  energyStore.setLongDistance(modifier)
})
</script>


<template>
  <div class="long-distance-component">
    <div class="input-group">
      <input
          v-model.number="distanceValue"
          type="number"
          min="0"
          placeholder="Enter distance"
          class="input"
      />
      <StyledDropdown
          v-model="distanceUnit"
          :options="[
            { label: 'Yards', value: 'yards' },
            { label: 'Miles', value: 'miles' },
            { label: 'Days', value: 'days' }
          ]"
          class="select"
      />
    </div>

    <div class="output">
      Energy: <strong>+{{ energyStore.longDistance }}</strong>
    </div>
  </div>
</template>

<style scoped>
.long-distance-component {
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

.input {
  text-align: center;
  height: 2em;
  font-size: 1em;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
  width: 100%;
}

.select {
  width: 100%;
}

.input:hover {
  border-color: var(--Color4);
}

.output {
  font-weight: bold;
  padding-bottom: 1em;
}
</style>
