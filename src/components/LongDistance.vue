<script setup>
import {computed } from 'vue'
import {useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()

const distanceValue = computed({
  get: () => fieldsStore.longDistanceValue,
  set: (val) => fieldsStore.longDistanceValue = val
})

const distanceUnit = computed({
  get: () => fieldsStore.longDistanceType,
  set: (val) => fieldsStore.longDistanceType = val
})

const unitToYards = {
  yards: 1,
  miles: 2000,
  days: 2000
}

const thresholds = [
  { max: 200, modifier: 0 },
  { max: 1000, modifier: 1 },     // ~1/2 mile
  { max: 2000, modifier: 2 },     // 1 mile
  { max: 6000, modifier: 3 },     // 3 miles
  { max: 20000, modifier: 4 },    // 10 miles
  { max: 60000, modifier: 5 },    // 30 miles
  { max: 200000, modifier: 6 },   // 100 miles
  { max: 600000, modifier: 7 },   // 300 miles
  { max: 2000000, modifier: 8 }   // 1000 miles
]

energyStore.longDistance = computed(() => {
  const yards = distanceValue.value * unitToYards[distanceUnit.value]

  for (let i = 0; i < thresholds.length; i++) {
    if (yards <= thresholds[i].max) {
      return thresholds[i].modifier
    }
  }

  // после 2,000,000 ярдов (1000 миль) каждые ×10 → +2
  const factor = Math.log10(yards / 2000000)
  const extraSteps = Math.ceil(factor)
  return 8 + extraSteps * 2
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
      <select v-model="distanceUnit" class="select">
        <option value="yards">Yards</option>
        <option value="miles">Miles</option>
        <option value="days">Days</option>
      </select>
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

.output {
  font-weight: bold;
  padding-bottom: 1em;
}
</style>
