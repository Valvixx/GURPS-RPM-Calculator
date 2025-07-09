<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

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
  {intValue: '0', addValue: '0', type: '', spellModifiers: [] },
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
    intValue: '0',
    addValue: '0',
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

function onWheel(event, obj, key, step = 1) {
  event.preventDefault() // предотвращает прокрутку страницы

  const delta = Math.sign(event.deltaY) * step
  const current = parseInt(obj[key]) || 0
  obj[key] = (current - delta).toString()
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
      <button class="add-effect-btn" @click="deleteSpellEffect">Delete Spell Effect</button>
      <button class="add-effect-btn" @click="addSpellEffect">Add Spell Effect</button>
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
        <input @wheel="onWheel($event, Damage, 'intValue')" v-model="Damage.intValue" type="number" class="damage">
        <!--      <h3 class="letter">d+</h3>-->
        <input @wheel="onWheel($event, Damage, 'addValue')" v-model="Damage.addValue" type="number" class="damage">
        <select v-model="Damage.type" class="input effect">
          <option disabled value="">-- Select a type of damage --</option>
          <option v-for="type in damageTypes" :key="type">{{type}}</option>
        </select>
        <button @click="deleteModifier(index)" class="modifier-btn"> - Modifier</button>
        <button @click="addModifier(index)" class="modifier-btn"> + Modifier</button>
      </div>

      <div v-for="(modifier, index2) in Damage.spellModifiers" :key = "index2" class="modifierWrapper">
        <input v-model="modifier.name" class="input"  id="modifier-name" placeholder="Modifier Name">
        <input @wheel="onWheel($event, modifier, 'value', 5)" v-model="modifier.value" type="number" class="input"  id="modifier-value" placeholder="Modifier Value (Percents)" step="5" >
      </div>
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
  width: 7.5em;
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
  margin-left: 8.5em;
  width: 24.5em;
}

#modifier-value {
  width: 16em;
}
</style>
