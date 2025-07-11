<script setup>
import { ref, computed } from 'vue'

const power = ref(0)
const controlType = ref('summoned') // or 'controlled'

// Таблица порогов для энергии
const thresholds = [
  { max: 25, energy: 4 },
  { max: 50, energy: 8 },
  { max: 75, energy: 12 },
  { max: 100, energy: 20 },
  { max: 150, energy: 40 }
]

const calculatedEnergy = computed(() => {
  let baseEnergy = 0

  for (let i = 0; i < thresholds.length; i++) {
    if (power.value <= thresholds[i].max) {
      baseEnergy = thresholds[i].energy
      break
    }
  }

  // Если выше 150%, прибавляем по +20 за каждые 50%
  if (power.value > 150) {
    const extraSteps = Math.ceil((power.value - 150) / 50)
    baseEnergy = 40 + (extraSteps * 20)
  }

  // Controlled стоит в 2 раза меньше (округл. вверх)
  if (controlType.value === 'controlled') {
    return Math.ceil(baseEnergy / 2)
  }

  return baseEnergy
})
</script>

<template>
  <div class="summon-energy-component">
    <div class="input-group">
      <input
          v-model.number="power"
          type="number"
          min="1"
          placeholder="Power (%)"
          class="input"
      />
      <select v-model="controlType" class="select">
        <option value="summoned">Summoned</option>
        <option value="controlled">Controlled</option>
      </select>
    </div>

    <div class="output">
      Energy: <strong>+{{ calculatedEnergy }}</strong>
    </div>
  </div>
</template>

<style scoped>
.summon-energy-component {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
  margin-top: 1em;
}

.input-group {
  display: flex;
  gap: 1em;
}

.input, .select {
  text-align: center;
  height: 2em;
  font-size: 1em;
  border: 2px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.4em;
  padding: 0 0.5em;
  width: 100%;
}

.output {
  font-weight: bold;
}
</style>
