<script setup>
import {defineEmits, defineProps, ref, watch} from 'vue'
import SpellDuration from './SpellDuration.vue'
import SubjectWeight from './SubjectWeight.vue'
import SpellDistance from './SpellDistance.vue'
import LongDistance from './LongDistance.vue'
import SummonedModifier from "./SummonedModifier.vue";
import { useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";
import IncAOE from "./IncAOE.vue";
import StyledDropdown from "./StyledDropdown.vue";

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
const AOE = ref(0)
const description = ref('')

const spellEffects = ref([
  { effect: '', path: '' },
])

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
const paths = ['Arcanum', 'Augury', 'Demonology', 'Elementalism', 'Mesmerism', 'Necromancy', 'Protection', 'Transfiguration']
const damageTypes = ['burn', 'cor', 'cr', 'cut', 'fat', 'heal', 'imp', 'pi-', 'pi', 'pi+', 'pi++', 'tox']
const damageCategories = ['Direct', 'Indirect', 'Indirect Explosive']
const bonusCategories = ['Broad', 'Moderate', 'Narrow']

watch(() => props.modelValue, (newVal) => {
  name.value = newVal
})

watch(name, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(spellEffects, (newVal) => {
  fieldsStore.setSpellEffects(newVal)
  emit('update:spellEffects', newVal)
}, { deep: true })

watch(description, (newVal) => {
  fieldsStore.setDescription(newVal)
})

function addSpellEffect() {
  if (spellEffects.value.length <= 5) {
    spellEffects.value.push({effect: '', path: '' })
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
    <div class="name-card">
      <div class="head-3 name-card-head">
        <h3>Spell Identity</h3>
      </div>
      <div class="name-card-grid">
        <input
            id="name-field"
            class="input"
            type="text"
            placeholder="Spell Name"
            maxlength="65"
            v-model="name"
        />
        <textarea
            id="description-field"
            class="input"
            placeholder="Spell Description"
            v-model="description"
        />
      </div>
    </div>

    <div class="section-layout">
      <details class="section-card effects-section" open>
        <summary class="head-3">
          <h3>Effects</h3>
        </summary>

        <div class="buttonWrapper">
          <button class="add-effect-btn" @click="deleteSpellEffect">Delete a Spell Effect</button>
          <button class="add-effect-btn" @click="addSpellEffect">Add a Spell Effect</button>
        </div>

        <div
            v-for="(spellEffect, index) in spellEffects"
            :key="index"
            class="effects-container"
            id="eff-container"
        >
          <StyledDropdown v-model="spellEffect.effect" :options="effects" placeholder="-- Select an effect --" class="effect" />
          <StyledDropdown v-model="spellEffect.path" :options="paths" placeholder="-- Select a path --" class="effect" />
        </div>
      </details>

      <details class="section-card damage-section" open>
        <summary class="head-3">
          <h3>Damage or Healing</h3>
        </summary>

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
            <StyledDropdown v-model="Damage.category" :options="damageCategories" placeholder="--Category--" class="dmgType" />
            <StyledDropdown v-model="Damage.type" :options="damageTypes" placeholder="--Type--" class="dmgType" />
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
      </details>

      <details class="section-card traits-section" open>
        <summary class="head-3">
          <h3>Traits</h3>
        </summary>

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
      </details>

      <details class="section-card features-section" open>
        <summary class="head-3">
          <h3>Spell Features</h3>
        </summary>

        <div class="features-wrapper">
          <div class="bonuses-container">
            <div class="head-4">
              <h4>Bestows a Bonus or Penalty</h4>
            </div>
            <div class="bestows-btn-wrapper">
              <button class="bestows-btn" @click="deleteBonus">Delete a Bonus/Penalty</button>
              <button class="bestows-btn" @click="addBonus">Add a Bonus/Penalty</button>
            </div>

            <div class="bonus-list">
              <div v-for="(Bonus, index) in spellBonuses" :key="index" class="bonus-row">
                <input v-model="Bonus.value" class="input" id="trait-value" type="number" placeholder="Value(+1/-1)">
                <StyledDropdown v-model="Bonus.category" :options="bonusCategories" placeholder="- Category -" class="bonus-category" />
                <input v-model="Bonus.subject" class="input" id="trait-subject" placeholder="Subject(s)">
              </div>
            </div>

            <div class="features-subwrapper">
              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Long Distance/Time</h4>
                </div>
                <LongDistance v-model="longDistance"></LongDistance>
              </div>

              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Duration</h4>
                </div>
                <SpellDuration v-model="duration" />
              </div>

              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Summoned or Controlled</h4>
                </div>
                <SummonedModifier v-model="summonedModifier"></SummonedModifier>
              </div>

              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Range</h4>
                </div>
                <SpellDistance v-model="distance"></SpellDistance>
              </div>

              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Weight</h4>
                </div>
                <SubjectWeight v-model="weight"></SubjectWeight>
              </div>

              <div class="feature-item">
                <div class="head-4-2">
                  <h4>Area of Effect</h4>
                </div>
                <IncAOE v-model="AOE"> </IncAOE>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  --section-gap: 0.8em;
  --block-gap: 0.9em;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
  width: min(72em, 100%);
  box-sizing: border-box;
}

.section-layout {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

.section-card {
  border: 3px solid var(--Color3);
  border-radius: 0.7em;
  padding: 0.6em 0.8em 0.9em 0.8em;
  background: color-mix(in srgb, var(--Color2) 90%, white 10%);
  width: 100%;
  box-sizing: border-box;
}

.head-3 {
  list-style: none;
}

.head-3::-webkit-details-marker {
  display: none;
}

.head-3 h3 {
  margin: 0;
}

.name-card {
  border: 3px solid var(--Color3);
  border-radius: 0.7em;
  background: color-mix(in srgb, var(--Color2) 90%, white 10%);
  padding: 0.55em 0.8em;
  display: flex;
  flex-direction: column;
  gap: 0.55em;
}

.name-card-head {
  margin-top: 0;
}

.name-card-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.6em;
  align-items: stretch;
}

#name-field {
  height: 2em;
  width: 100%;
  box-sizing: border-box;
}

#description-field {
  height: 3.3em;
  width: 100%;
  margin-top: 0;
  resize: none;
  box-sizing: border-box;
}

#name-field:hover {
  border-color: var(--Color4);
}

#description-field:hover {
  border-color: var(--Color4);
}

.effects-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 1em;
  margin-top: var(--block-gap);
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

.effect {
  height: 2em;
  width: 100%;
}

.effect:hover {
  cursor: pointer;
  border-color: var(--Color4);
}

.dmgType{
  height: 2em;
  width: 100%;
}

.buttonWrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  margin-top: var(--block-gap);
}

.add-effect-btn {
  width: 100%;
  height: 2em;
  margin-top: 0;
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
  margin-top: 0.2em;
  text-align: center;
  border: 3px solid var(--Color4);
  border-radius: 0.5em;
  height: 2.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
  box-sizing: border-box;
}

.head-4-2{
  margin-top: 1em;
  text-align: center;
  border: 3px solid var(--Color4);
  border-radius: 0.5em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.damage-container{
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.damage-subcontainer{
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto auto;
  margin-top: var(--block-gap);
  gap: 1em;
}

.damage{
  height: 2em;
  width: 100%;
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
  width: 33em;
}

#modifier-value {
  margin-left: 8.5em;
  width: 7.5em;
}

.traits-container {
  display: flex;
  flex-direction: column;
  margin-top: var(--block-gap);
  gap: 0.7em;
}

.traits-subcontainer{
  display: grid;
  grid-template-columns: 6.5em minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.55em;
}

.traits-subcontainer .modifier-btn {
  width: 5.2em;
  font-size: 0.92em;
}

#trait-name{
  width: 100%;
}

#trait-value{
  width: 100%;
}

#trait-subject{
  width: 100%;
}

.bonus-row {
  display: grid;
  grid-template-columns: 8em 10em minmax(0, 1fr);
  align-items: center;
  gap: 1em;
  margin-top: var(--block-gap);
}

.bonus-list {
  margin-bottom: 0.9em;
}

.bonus-category {
  width: 100%;
}

.bestows-btn{
  width: 100%;
  height: 2em;
  margin-top: 0;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 2em;
  margin-top: var(--block-gap);
}

.features-subwrapper{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1em;
  align-items: start;
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.55em;
}

.feature-item .head-4-2 {
  margin-top: 0;
  min-height: 2.2em;
}

.feature-item :deep(.duration-component),
.feature-item :deep(.mass-component),
.feature-item :deep(.ranged-distance-component),
.feature-item :deep(.long-distance-component),
.feature-item :deep(.summon-energy-component),
.feature-item :deep(.container) {
  width: 100%;
  margin: 0;
  gap: 0.45em;
}

.feature-item :deep(.output) {
  margin-top: 0.1em;
  margin-bottom: 0.6em;
  padding-bottom: 0 !important;
}

@media (max-width: 1380px) {
  .damage-subcontainer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .traits-subcontainer {
    grid-template-columns: minmax(0, 1fr);
  }

  .features-subwrapper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .features-subwrapper {
    grid-template-columns: minmax(0, 1fr);
  }

  .bonus-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
