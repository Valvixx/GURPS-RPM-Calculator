<script setup>
import {defineEmits, defineProps, ref, watch} from 'vue'
import SpellDuration from './SpellDuration.vue'
import SubjectWeight from './SubjectWeight.vue'
import SpellDistance from './SpellDistance.vue'
import LongDistance from './LongDistance.vue'
import SummonedModifier from "./SummonedModifier.vue";
import { useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()


const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:spellEffects'])

const name = ref(props.modelValue)

const duration = ref('')

const weight = ref(0)

const distance = ref(0)
const longDistance = ref(0)

const summonedModifier = ref(0)

const spellEffects = ref([
  { size: '', effect: '', path: '' },
  { size: '', effect: '', path: '' }
])
watch(spellEffects, (newVal) => {
  fieldsStore.setSpellEffects(newVal)
}, { deep: true })

const spellDamage = ref([
  {intValue: '', addValue: '', category:'', type: '', spellModifiers: [], isExplosive: false},
])
watch(spellDamage, (newVal) => {
  fieldsStore.setSpellDamage(newVal)
}, { deep: true })

const spellTraits = ref([
  {name:'', value:'', traitModifiers: []}
])
watch(spellTraits, (newVal) => {
  fieldsStore.setSpellTraits(newVal)
}, { deep: true })

const spellBonuses = ref([
    {value:'', category:'', subject:''}
])
watch(spellBonuses, (newVal) => {
  fieldsStore.setSpellBonuses(newVal)
}, { deep: true })


const effects = ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform']
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']
const sizes = ['Greater', 'Lesser']
const damageTypes = ['cr', 'pi', 'cut', 'burn', 'pi-', 'pi+', 'pi++', 'fatigue', 'healing']
const damageCategories = ['Internal', 'External']
const bonusCategories = ['Broad', 'Moderate', 'Narrow']

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
    category:'',
    type: '',
    spellModifiers: [],
    isExplosive: false
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

function addTraitModifier(index) {
  spellTraits.value[index].traitModifiers.push({ name: '', value: '' })
}
function deleteTraitModifier(index) {
  spellTraits.value[index].traitModifiers.pop()
}

function addTrait() {
  spellTraits.value.push({name: '', value: '', traitModifiers: []})
}

function deleteTrait() {
  spellTraits.value.pop()
}

function addBonus() {
  spellBonuses.value.push({value:'', category:'', subject:''})
}
function deleteBonus() {
  spellBonuses.value.pop()
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

    <!-- --EFFECTS-- -->

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

    <!-- --DAMAGE-- -->

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
        <select v-model="Damage.category" class="input dmgType">
          <option disabled value="">--Category--</option>
          <option v-for="category in damageCategories" :key="category">{{category}}</option>
        </select>
        <select v-model="Damage.type" class="input dmgType">
          <option disabled value="">--Type--</option>
          <option v-for="type in damageTypes" :key="type">{{type}}</option>
        </select>
        <div class="checkboxWrapper">
          <input v-model="Damage.isExplosive" type="checkbox" class="checkbox">
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

    <!-- --TRAITS-- -->

    <div class="head-3">
      <h3>Traits</h3>
    </div>

    <div class="buttonWrapper">
      <button class="add-effect-btn" @click="deleteTrait">Delete a Trait</button>
      <button class="add-effect-btn" @click="addTrait">Add a Trait</button>
    </div>

    <div v-for="(Trait, index) in spellTraits" class="traits-container">
      <div class="traits-subcontainer">
        <input v-model="Trait.value" class="input" id="trait-value" type="number" placeholder="Value (pts)">
        <input v-model="Trait.name" class="input" id="trait-name" placeholder="Trait Name">
        <button @click="deleteTraitModifier(index)" class="modifier-btn"> - Mod</button>
        <button @click="addTraitModifier(index)" class="modifier-btn"> + Mod</button>
      </div>

      <div v-for="(modifier, index2) in Trait.traitModifiers" :key = "index2" class="modifierWrapper">
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

    <!-- --FEATURES-- -->

    <div class="head-3">
      <h3>Spell Features</h3>
    </div>


    <!-- --BESTOWS A BONUS-- -->
    <div class="features-wrapper">
      <div class="bonuses-container">
        <div class="head-4">
          <h4>Bestows a Bonus or Penalty</h4>
        </div>
        <div class="bestows-btn-wrapper">
          <button class="bestows-btn" @click="deleteBonus">Delete a Bonus/Penalty</button>
          <button class="bestows-btn" @click="addBonus">Add a Bonus/Penalty</button>
        </div>

        <div v-for="(Bonus, index) in spellBonuses" :key="index" class="effects-container">
          <input v-model="Bonus.value" class="input" id="trait-value" type="number" placeholder="Value(+1/-1)">
          <select v-model="Bonus.category" class="input dmgType" style="width: 7em">
            <option disabled value="">- Category -</option>
            <option v-for="category in bonusCategories" :key="category">{{category}}</option>
          </select>
          <input v-model="Bonus.subject" class="input" id="trait-value" placeholder="Subject(s)">
        </div>

        <div style="" class="head-4">
          <h4 style="">Long Distance/Time</h4>
        </div>
        <LongDistance v-model="longDistance"></LongDistance>
        <div style="" class="head-4">
          <h4 style="">Summoned or Controlled</h4>
        </div>
        <SummonedModifier v-model="summonedModifier"></SummonedModifier>

      </div>
      <div>
        <div style="margin-left: 0.5em" class="head-4">
          <h4 style="">Duration</h4>
        </div>
          <SpellDuration v-model="duration" />
        <div style="margin-left: 0.5em" class="head-4">
          <h4 style="">Weight</h4>
        </div>
          <SubjectWeight v-model="weight"></SubjectWeight>
        <div style="margin-left: 0.5em" class="head-4">
          <h4 style="">Distance</h4>
        </div>
          <SpellDistance v-model="distance"></SpellDistance>


      </div>

    </div>

    <!-- --ADDITIONAL MODIFIERS-- -->

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
  height: 2em;
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
  height: 2em;
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
  flex-direction: column;
  margin-top: 1em;
  gap: 1em;
}

.traits-subcontainer{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;

}

#trait-name{
  width: 29.5em;
}

#trait-value{
  width: 7.5em;
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

.features-wrapper{
  display: flex;
  flex-direction: row;
  gap: 1.5em;
}
</style>
