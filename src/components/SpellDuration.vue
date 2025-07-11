<script setup>
import { ref, watch } from 'vue'

const durationValue = ref(0)
const durationUnit = ref('minutes')
const addedEnergy = ref(0)

const unitToMinutes = {
  minutes: 1,
  hours: 60,
  days: 1440,
  weeks: 10080,
  months: 43200,
  years: 525600
}

const thresholds = [
  { min: 0, energy: 0 },
  { min: 10, energy: 1 },
  { min: 30, energy: 2 },
  { min: 60, energy: 3 },
  { min: 180, energy: 4 },
  { min: 360, energy: 5 },
  { min: 720, energy: 6 },
  { min: 1440, energy: 7 },
  { min: 4320, energy: 8 },
  { min: 10080, energy: 9 },
  { min: 20160, energy: 10 },
  { min: 43200, energy: 11 },
  { min: 129600, energy: 12 } // +1 month
]

function calculateEnergy(minutes) {
  if (minutes > unitToMinutes.years) {
    const years = Math.floor(minutes / unitToMinutes.years)
    return years + 21
  }

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (minutes >= thresholds[i].min) {
      return thresholds[i].energy
    }
  }
  return 0
}

watch([durationValue, durationUnit], () => {
  const minutes = durationValue.value * unitToMinutes[durationUnit.value]
  addedEnergy.value = calculateEnergy(minutes)
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
      <strong>Energy: +{{ addedEnergy }}</strong>
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

.output{
  padding-bottom: 1em;
}
</style>
