<script setup>
import { ref, watch } from 'vue'

const massValue = ref(0)
const massUnit = ref('lbs')
const addedEnergy = ref(0)

const unitToLbs = {
  lbs: 1,
  tons: 2000 // 1 ton = 2000 lbs
}

const thresholds = [
  { max: 10, energy: 0 },
  { max: 30, energy: 1 },
  { max: 100, energy: 2 },
  { max: 300, energy: 3 },
  { max: 1000, energy: 4 },
  { max: 30000, energy: 5 },
  { max: 10000, energy: 6 },   // 5 tons = 10000 lbs
  { max: 30000, energy: 7 },   // 15 tons
  { max: 100000, energy: 8 },  // 50 tons
  { max: 300000, energy: 9 },  // 150 tons
  { max: 900000, energy: 10 }, // 450 tons
  { max: 2_700_000, energy: 11 } // 1350 tons
]

function calculateEnergy(lbs) {
  for (let i = 0; i < thresholds.length; i++) {
    if (lbs <= thresholds[i].max) {
      return thresholds[i].energy
    }
  }

  // beyond 1350 tons — +1 energy per ×3 mass
  let lastEnergy = 11
  let extraMass = lbs / thresholds[thresholds.length - 1].max
  return lastEnergy + Math.floor(Math.log(extraMass) / Math.log(3))
}

watch([massValue, massUnit], () => {
  const lbs = massValue.value * unitToLbs[massUnit.value]
  addedEnergy.value = calculateEnergy(lbs)
})
</script>

<template>
  <div class="mass-component">
    <div class="input-group">
      <input
          v-model.number="massValue"
          type="number"
          min="0"
          placeholder="Enter mass"
          class="input"
      />
      <select v-model="massUnit" class="select">
        <option value="lbs">lbs</option>
        <option value="tons">tons</option>
      </select>
    </div>
    <div class="output">
      <strong>Energy: +{{ addedEnergy }}</strong>
    </div>
  </div>
</template>

<style scoped>
.mass-component {
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
