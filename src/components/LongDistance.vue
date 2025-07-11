<script setup>
import { ref, computed } from 'vue'

const distanceValue = ref(0)
const distanceUnit = ref('miles')

const unitToYards = {
  yards: 1,
  miles: 1760
}

const thresholds = [
  { max: 200, modifier: 0 },
  { max: 880, modifier: 1 },     // 1/2 mile
  { max: 1760, modifier: 2 },    // 1 mile
  { max: 5280, modifier: 3 },    // 3 miles
  { max: 17600, modifier: 4 },   // 10 miles
  { max: 52800, modifier: 5 },   // 30 miles
  { max: 176000, modifier: 6 },  // 100 miles
  { max: 528000, modifier: 7 },  // 300 miles
  { max: 1760000, modifier: 8 }  // 1000 miles
]

const modifier = computed(() => {
  const yards = distanceValue.value * unitToYards[distanceUnit.value]

  for (let i = 0; i < thresholds.length; i++) {
    if (yards <= thresholds[i].max) {
      return thresholds[i].modifier
    }
  }

  const overYards = yards - 1760000
  const extra10Miles = Math.floor(overYards / 17600)
  return 8 + (2 * extra10Miles)
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
      </select>
    </div>

    <div class="output">
      Energy: <strong>+{{ modifier }}</strong>
    </div>
  </div>
</template>

<style scoped>
.long-distance-component {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 24em;
  margin: 1em 0 1em 0;
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
  width: 100%;
}

.output{
  font-weight: bold;
  padding-bottom: 1em;
}
</style>
