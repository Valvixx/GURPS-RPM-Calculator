<script setup>
import {defineEmits, defineProps, ref, watch} from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue', 'update:spellEffects'])

const name = ref(props.modelValue)
const spellEffects = ref([
  { size: '', effect: '', path: '' },
  { size: '', effect: '', path: '' }
])

const spellDamage = ref([
  {intValue: '', addValue: '', type: '', spellModifiers: [] },
])


const effects = ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform']
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']
const sizes = ['Greater', 'Lesser']
const damageTypes = ['cr', 'pi', 'cut', 'burn', 'pi-', 'pi+', 'pi++', 'fatigue', 'healing']

watch(() => props.modelValue, (newVal) => {
  name.value = newVal
})

watch(name, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(spellEffects, (newVal) => {
  emit('update:spellEffects', newVal)
}, { deep: true })

function addSpellEffect() {
  if (spellEffects.value.length <= 5) {
    spellEffects.value.push({ size: '', effect: '', path: '' })
  }
}
function deleteSpellEffect() {
  spellEffects.value.pop()
}

function addDamage() {
  spellDamage.value.push({
    intValue: '',
    addValue: '',
    type: '',
    spellModifiers: []
  })
}

function deleteDamage() {
  spellDamage.value.pop()
}

function addModifier(index) {
  spellDamage.value[index].spellModifiers.push({ name: '', value: '' })
}
function deleteModifier(index) {
  spellDamage.value[index].spellModifiers.pop()
}

function onWheel(event, obj, key, step = 1, min = -9999, max = 9999) {
  event.preventDefault()

  const delta = Math.sign(event.deltaY) * step
  const current = parseInt(obj[key]) || 0
  let next = current - delta

  // Ограничение значений в заданном диапазоне
  next = Math.min(Math.max(next, min), max)

  obj[key] = next.toString()

}

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
      <h3>Effects</h3>
    </div>

    <div class="buttonWrapper">
      <button class="add-effect-btn" @click="deleteSpellEffect">Delete a Spell Effect</button>
      <button class="add-effect-btn" @click="addSpellEffect">Add a Spell Effect</button>
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

    <div class="head-3">
      <h3>Damage or Healing</h3>
    </div>

    <div class="buttonWrapper">
      <button class="add-effect-btn" @click="deleteDamage">Delete Damage or Healing</button>
      <button class="add-effect-btn" @click="addDamage">Add Damage or Healing</button>
    </div>

    <div v-for="(Damage, index) in spellDamage" :key="index" class="damage-container">
      <div class="damage-subcontainer">
        <input @wheel="onWheel($event, Damage, 'intValue', 1, 0)"
               v-model="Damage.intValue"
               type="number"
               placeholder="Dice dmg"
               class="damage"
               min="0">
        <input @wheel="onWheel($event, Damage, 'addValue')"
               v-model="Damage.addValue"
               type="number"
               placeholder="Flat dmg"
               class="damage">
        <select v-model="Damage.type" class="input dmgType">
          <option disabled value="">--Category--</option>
          <option v-for="type in damageTypes" :key="type">{{type}}</option>
        </select>
        <select v-model="Damage.type" class="input dmgType">
          <option disabled value="">--Type--</option>
          <option v-for="type in damageTypes" :key="type">{{type}}</option>
        </select>
        <div class="checkboxWrapper">
          <input type="checkbox" class="checkbox">
          <div class="subtext">ex</div>
        </div>
        <button @click="deleteModifier(index)" class="modifier-btn"> - Mod</button>
        <button @click="addModifier(index)" class="modifier-btn"> + Mod</button>
      </div>

      <div v-for="(modifier, index2) in Damage.spellModifiers" :key = "index2" class="modifierWrapper">
        <input @wheel="onWheel($event, modifier, 'value', 5)"
               v-model="modifier.value"
               type="number"
               class="input"
               id="modifier-value"
               placeholder="Value (%)"
               step="5">
        <input v-model="modifier.name"
               class="input"
               id="modifier-name"
               placeholder="Modifier Name">
      </div>
    </div>

    <div class="head-3">
      <h3>Traits</h3>
    </div>

    <div class="buttonWrapper">
      <button class="add-effect-btn" @click="deleteDamage">Delete a Trait</button>
      <button class="add-effect-btn" @click="addDamage">Add a Trait</button>
    </div>

    <div class="traits-container">
      <input class="input" id="trait-value" type="number" placeholder="Value (pts)">
      <input class="input" id="trait-name" placeholder="Trait Name">
      <button @click="deleteModifier(index)" class="modifier-btn"> - Mod</button>
      <button @click="addModifier(index)" class="modifier-btn"> + Mod</button>
    </div>

    <div class="head-3">
      <h3>Spell Features</h3>
    </div>

    <div class="head-4">
      <h4>Bestows a Bonus or Penalty</h4>
    </div>
    <div class="bestows-btn-wrapper">
      <button class="bestows-btn" @click="deleteDamage">Delete a Bonus/Penalty</button>
      <button class="bestows-btn" @click="addDamage">Add a Bonus/Penalty</button>
    </div>

    <div class="head-3">
      <h3>Additional Modifiers</h3>
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

.input.dmgType{
  height: 2em;
  width: 7.5em;
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

.head-4{
  margin-top: 1em;
  text-align: center;
  border: 3px solid var(--Color4);
  border-radius: 0.5em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24em;

}

.damage-container{
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.damage-subcontainer{
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  gap: 1em;
}

.damage{
  height: 2em;
  width: 7.5em;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.damage:hover{
  border-color: var(--Color4);
}

.modifier-btn{
  width: 5em;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.modifier-btn:hover{
  cursor: pointer;
  border-color: var(--Color4);
}

.modifierWrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}

#modifier-name {
  width: 33em;
}

#modifier-value {
  margin-left: 8.5em;
  width: 7.5em;
}

.traits-container {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  gap: 1em;
}

#trait-name{
  width: 30em;
}

#trait-value{
  width: 7em;
}

.bestows-btn{
  width: 11.5em;
  height: 2em;
  margin-top: 1em;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.bestows-btn:hover{
  cursor: pointer;
  border-color: var(--Color4);
}

.bestows-btn-wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}

.checkbox{
  height: 1.25em;
  width: 1.25em;
  appearance: none;
  -webkit-appearance: none;
  outline: none;

  border: 2px solid var(--Color3);
  border-radius: 50%;
  background-color: var(--Color2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkboxWrapper{
  width: 4em;
  border: 3px solid var(--Color3);
  border-radius: 0.5em;
  background-color: var(--Color2);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.subtext{
  margin-left: 0.25em;
  font-size: 1em;
}

.checkbox:checked {
  background-color: var(--Color4);
  border-color: var(--Color3);
}
</style>
