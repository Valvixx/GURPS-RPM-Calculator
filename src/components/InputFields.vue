<script setup>
defineProps({
  name: String,
  selectedEffect: String,
  selectedPath: String,
  selectedSize: String,
  effects: Array,
  paths: Array,
  sizes: Array
})

const emit = defineEmits(['update:name', 'update:selectedEffect', 'update:selectedPath', 'update:selectedSize'])
</script>

<template>
  <div class="input-container">
    <input
        id="name-field"
        class="input"
        type="text"
        placeholder="Spell Name"
        maxlength="65"
        :value="name"
        @input="emit('update:name', $event.target.value)"
    />

    <h3 class="head-3">Effects</h3>

    <div class="effects-container">
      <select class="input effect" :value="selectedSize" @change="emit('update:selectedSize', $event.target.value)">
        <option disabled value="">-- Select a size --</option>
        <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <select class="input effect" :value="selectedEffect" @change="emit('update:selectedEffect', $event.target.value)">
        <option disabled value="">-- Select an effect --</option>
        <option v-for="effect in effects" :key="effect" :value="effect">{{ effect }}</option>
      </select>

      <select class="input effect" :value="selectedPath" @change="emit('update:selectedPath', $event.target.value)">
        <option disabled value="">-- Select a path --</option>
        <option v-for="path in paths" :key="path" :value="path">{{ path }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  margin-left: 1em;
}

#name-field {
  height: 2em;
  width: 66em;
}

#name-field:hover {
  border-color: #dfd0b8;
}

.effects-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3em;
}

.input {
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid #948979;
  background-color: #222831;
  border-radius: 0.5em;
}

.input.effect {
  height: 2em;
  width: 20em;
}

.input.effect:hover {
  cursor: pointer;
  border-color: #dfd0b8;
}
</style>
