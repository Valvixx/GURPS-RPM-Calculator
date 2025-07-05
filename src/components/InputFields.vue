<script setup>
defineProps({
  name: String,
  spellEffects: Array,
  effects: Array,
  paths: Array,
  sizes: Array
})

const emit = defineEmits(['update:name'])
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

    <div
        v-for="(spellEffect, index) in spellEffects"
        :key="index"
        class="effects-container"
    >
      <select v-model="spellEffect.size" class="input effect">
        <option disabled value="">-- Select a size --</option>
        <option v-for="size in sizes" :key="size">{{ size }}</option>
      </select>

      <select v-model="spellEffect.effect" class="input effect">
        <option disabled value="">-- Select an effect --</option>
        <option v-for="effect in effects" :key="effect">{{ effect }}</option>
      </select>

      <select v-model="spellEffect.path" class="input effect">
        <option disabled value="">-- Select a path --</option>
        <option v-for="path in paths" :key="path">{{ path }}</option>
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
  width: 50em;
}

#name-field:hover {
  border-color: #dfd0b8;
}

.effects-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
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
  width: 16em;
}

.input.effect:hover {
  cursor: pointer;
  border-color: #dfd0b8;
}
</style>
