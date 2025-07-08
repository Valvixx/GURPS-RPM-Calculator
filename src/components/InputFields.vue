<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const effects = ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform']
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']
const sizes = ['Greater', 'Lesser']


const spellEffects = ref([
  { size: '', effect: '', path: '' },
  { size: '', effect: '', path: '' }
])

function getSpellEffects(){
  return spellEffects.value
}

function getName(){
  return name.value
}

defineExpose({
  getSpellEffects,
  getName
})


function addSpellEffect() {
  if (spellEffects.value.length <=5) {
    spellEffects.value.push({ size: '', effect: '', path: '' })
  }
}
function deleteSpellEffect() {
  spellEffects.value.pop()
}

// ---


const props = defineProps({
  modelValue: String // это для v-model
})
const emit = defineEmits(['update:modelValue'])

const name = ref(props.modelValue)

// Слежение за внешним изменением
watch(() => props.modelValue, (newVal) => {
  name.value = newVal
})

// Слежение за внутренним вводом
watch(name, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <div class="input-container">
    <input
        id="name-field"
        class="input"
        type="text"
        placeholder="Spell Name"
        maxlength="65"
        v-model="name"
    />

    <div class="head-3">
      <h3 >Effects</h3>
    </div>


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
    <div class="buttonWrapper">
      <button class="add-effect-btn" @click="deleteSpellEffect">Delete Spell Effect</button>
      <button class="add-effect-btn" @click="addSpellEffect">Add Spell Effect</button>
    </div>
  </div>
</template>




<style scoped>
.input-container {
  margin-left: 1em;
  display: flex;
  flex-direction: column;
}

#name-field {
  height: 2em;
  width: 50em;
}

#name-field:hover {
  border-color: var(--Color4);
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
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.input.effect {
  height: 2em;
  width: 16em;
}

.input.effect:hover {
  cursor: pointer;
  border-color: var(--Color4);
}

.buttonWrapper {
  display: flex;
  gap: 2em
}

.add-effect-btn {
  width: 24em;
  height: 2em;
  margin-top: 1em;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.add-effect-btn:hover{
  cursor: pointer;
  border-color: var(--Color4);
}

.head-3{
  margin-top: 1em;
  text-align: center;
  border: 3px solid var(--Color4);
  border-radius: 0.5em;
  height: 2.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
