<script setup>
import {computed, ref, watch} from 'vue'
import { useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()

const durationValue = computed({
  get: () => fieldsStore.durationValue,
  set: (val) => fieldsStore.durationValue = val
})

const durationUnit = computed({
  get: () => fieldsStore.durationType,
  set: (val) => fieldsStore.durationType = val
})


const unitToMinutes = {
  minutes: 1,
  hours: 60,
  days: 1440,
  weeks: 10080,
  months: 43200,
  years: 525600
}

const thresholds = [
  { max: 10, energy: 1 },
  { max: 30, energy: 2 },
  { max: 60, energy: 3 },
  { max: 180, energy: 4 },
  { max: 360, energy: 5 },
  { max: 720, energy: 6 },
  { max: 1440, energy: 7 },
  { max: 4320, energy: 8 },
  { max: 10080, energy: 9 },
  { max: 20160, energy: 10 },
  { max: 43200, energy: 11 }
]

function calculateEnergy(minutes) {
  const oneMonth = unitToMinutes.months
  const oneYear = unitToMinutes.years

  if (minutes >= oneYear) {
    const years = Math.ceil(minutes / oneYear)
    return years + 21
  }

  for (let i = 0; i < thresholds.length; i++) {
    if (minutes <= thresholds[i].max) {
      return thresholds[i].energy
    }
  }

  const monthsOver = Math.ceil((minutes - oneMonth) / oneMonth)
  return 11 + monthsOver
}

watch([durationValue, durationUnit], () => {
  const minutes = durationValue.value * unitToMinutes[durationUnit.value]
  const energy = minutes <= 0 ? 0 : calculateEnergy(minutes)
  energyStore.setDuration(energy)
})
</script>

<template>
  <div class="duration-component">
    <div class="input-group">
      <input
          v-model.number="durationValue"
          type="number"
          min="0"
          placeholder="Enter value"
          class="input"
      />
      <select v-model="durationUnit" class="select">
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
        <option value="years">Years</option>
      </select>
    </div>

    <div class="output">
      <strong>Energy: +{{ energyStore.duration }}</strong>
    </div>
  </div>
</template>

<style scoped>
.duration-component {
  margin-top: 1em;
  margin-left: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
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
  padding-bottom: 1em;
}
</style>
