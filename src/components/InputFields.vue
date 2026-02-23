<script setup>
import {computed, defineEmits, defineProps, ref, watch} from 'vue'
import SpellDuration from './SpellDuration.vue'
import SubjectWeight from './SubjectWeight.vue'
import SpellDistance from './SpellDistance.vue'
import LongDistance from './LongDistance.vue'
import SummonedModifier from "./SummonedModifier.vue";
import RpmAOE from "./RpmAOE.vue";
import StyledDropdown from "./StyledDropdown.vue";
import { useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";
import traitsRaw from '../Basic Set Traits.adq?raw'

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
const denseMode = computed(() => fieldsStore.uiDenseMode)

const description = ref('')

const spellEffects = ref([
  { size: '', effect: '', path: '' },
  { size: '', effect: '', path: '' }
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
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']
const sizes = ['Greater', 'Lesser']
const damageTypes = ['burn', 'cor', 'cr', 'cut', 'fat', 'heal', 'imp', 'pi-', 'pi', 'pi+', 'pi++', 'tox']
const damageCategories = ['Internal', 'External', 'External Explosive']
const bonusCategories = ['Broad', 'Moderate', 'Narrow']

function parsePercent(rawValue) {
  if (typeof rawValue !== 'string') return null
  const match = rawValue.trim().match(/^([+-]?\d+(?:\.\d+)?)%$/)
  return match ? Number(match[1]) : null
}

function parseFlat(rawValue) {
  if (typeof rawValue !== 'string') return null
  const match = rawValue.trim().match(/^([+-]?\d+(?:\.\d+)?)$/)
  return match ? Number(match[1]) : null
}

function parseTraitLibrary() {
  try {
    const parsed = JSON.parse(traitsRaw)
    const rows = Array.isArray(parsed?.rows) ? parsed.rows : []

    return rows
        .filter(row => typeof row?.name === 'string' && row.name.trim() !== '')
        .map(row => ({
          name: row.name.trim(),
          points: Number.isFinite(Number(row?.calc?.points))
              ? Number(row.calc.points)
              : (Number.isFinite(Number(row?.base_points)) ? Number(row.base_points) : null),
          modifiers: Array.isArray(row?.modifiers)
              ? row.modifiers
                  .filter(mod => typeof mod?.name === 'string' && mod.name.trim() !== '')
                  .map(mod => {
                    const percent = parsePercent(mod.cost_adj)
                    const flat = percent === null ? parseFlat(mod.cost_adj) : null

                    return {
                      name: mod.name.trim(),
                      percent,
                      flat,
                      mode: percent !== null ? 'percent' : (flat !== null ? 'flat' : null)
                    }
                  })
              : []
        }))
  } catch (error) {
    console.error('Failed to parse Basic Set Traits.adq:', error)
    return []
  }
}

const traitLibrary = parseTraitLibrary()
const activeTraitDropdownIndex = ref(null)
const activeTraitModifierDropdownKey = ref(null)

const traitLookup = computed(() => {
  const map = new Map()
  for (const trait of traitLibrary) {
    map.set(trait.name.toLowerCase(), trait)
  }
  return map
})

function findTraitByName(name) {
  if (!name) return null
  return traitLookup.value.get(String(name).trim().toLowerCase()) || null
}

function onTraitNameSelected(trait) {
  const selected = findTraitByName(trait.name)
  if (!selected) return

  if (selected.points !== null) {
    trait.value = String(selected.points)
  }
}

function isTraitDropdownOpen(index) {
  return activeTraitDropdownIndex.value === index
}

function openTraitDropdown(index) {
  activeTraitDropdownIndex.value = index
}

function closeTraitDropdown() {
  activeTraitDropdownIndex.value = null
}

function getFilteredTraitOptions(query) {
  const normalized = String(query || '').trim().toLowerCase()

  if (!normalized) {
    return traitLibrary
  }

  const startsWith = []
  const includes = []

  for (const trait of traitLibrary) {
    const name = trait.name.toLowerCase()
    if (name.startsWith(normalized)) {
      startsWith.push(trait)
    } else if (name.includes(normalized)) {
      includes.push(trait)
    }
  }

  return startsWith.concat(includes)
}

function onTraitNameInput(index) {
  openTraitDropdown(index)
}

function onTraitNameBlur() {
  setTimeout(() => {
    closeTraitDropdown()
  }, 120)
}

function selectTraitOption(trait, option) {
  trait.name = option.name
  onTraitNameSelected(trait)
  closeTraitDropdown()
}

function getTraitModifierPresets(traitName) {
  const selected = findTraitByName(traitName)
  return selected?.modifiers || []
}

function getTraitModifierDropdownKey(traitIndex, modifierIndex) {
  return `${traitIndex}-${modifierIndex}`
}

function isTraitModifierDropdownOpen(traitIndex, modifierIndex) {
  return activeTraitModifierDropdownKey.value === getTraitModifierDropdownKey(traitIndex, modifierIndex)
}

function openTraitModifierDropdown(traitIndex, modifierIndex) {
  activeTraitModifierDropdownKey.value = getTraitModifierDropdownKey(traitIndex, modifierIndex)
}

function closeTraitModifierDropdown() {
  activeTraitModifierDropdownKey.value = null
}

function onTraitModifierBlur() {
  setTimeout(() => {
    closeTraitModifierDropdown()
  }, 120)
}

function getTraitModifierPresetLabel(modifier) {
  return modifier.presetLabel || '-- Modifier Preset --'
}

function getTraitModifierMode(modifier) {
  return modifier?.mode === 'flat' ? 'flat' : 'percent'
}

function applyTraitModifierPreset(trait, modifier, preset) {
  if (!preset) return

  const hasPercent = preset.percent !== null
  const hasFlat = preset.flat !== null
  const suffix = hasPercent
      ? ` (${preset.percent > 0 ? '+' : ''}${preset.percent}%)`
      : (hasFlat ? ` (${preset.flat > 0 ? '+' : ''}${preset.flat} pts)` : '')

  modifier.presetLabel = `${preset.name}${suffix}`
  modifier.name = preset.name
  if (hasPercent) {
    modifier.value = String(preset.percent)
    modifier.mode = 'percent'
  } else if (hasFlat) {
    modifier.value = String(preset.flat)
    modifier.mode = 'flat'
  }
  closeTraitModifierDropdown()
}

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
  spellTraits.value[index].traitModifiers.push({ name: '', value: '', mode: 'percent' })
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
  <div class="input-container" :class="{ dense: denseMode }">
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
      <!-- --EFFECTS-- -->
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
      >
        <StyledDropdown v-model="spellEffect.size" :options="sizes" placeholder="-- Select a size --" class="effect" />

        <StyledDropdown v-model="spellEffect.effect" :options="effects" placeholder="-- Select an effect --" class="effect" />

        <StyledDropdown v-model="spellEffect.path" :options="paths" placeholder="-- Select a path --" class="effect" />
      </div>
    </details>

    <!-- --DAMAGE-- -->
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

    <!-- --TRAITS-- -->
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
          <div class="trait-name-field">
            <input
                v-model="Trait.name"
                class="input"
                id="trait-name"
                placeholder="Trait Name"
                autocomplete="off"
                @focus="openTraitDropdown(index)"
                @input="onTraitNameInput(index)"
                @change="onTraitNameSelected(Trait)"
                @blur="onTraitNameBlur"
            >
            <div v-if="isTraitDropdownOpen(index)" class="trait-dropdown">
              <div
                  v-for="(option, optionIndex) in getFilteredTraitOptions(Trait.name)"
                  :key="`${option.name}-${optionIndex}`"
                  class="trait-option"
                  @mousedown.prevent="selectTraitOption(Trait, option)"
              >
                <span>{{ option.name }}</span>
                <span v-if="option.points !== null">{{ option.points > 0 ? `+${option.points}` : option.points }}</span>
              </div>
              <div
                  v-if="getFilteredTraitOptions(Trait.name).length === 0"
                  class="trait-option trait-option-empty"
              >
                No matches
              </div>
            </div>
          </div>
          <button @click="deleteTraitModifier(index)" class="modifier-btn"> - Mod</button>
          <button @click="addTraitModifier(index)" class="modifier-btn"> + Mod</button>
        </div>

        <div v-for="(modifier, index2) in Trait.traitModifiers" :key = "index2" class="modifierWrapper trait-modifier-row">
          <div class="trait-modifier-preset-field">
            <button
                type="button"
                class="input trait-modifier-preset-button"
                @click="openTraitModifierDropdown(index, index2)"
                @blur="onTraitModifierBlur"
            >
              {{ getTraitModifierPresetLabel(modifier) }}
            </button>
            <div
                v-if="isTraitModifierDropdownOpen(index, index2)"
                class="trait-modifier-dropdown"
            >
              <div
                  v-for="(preset, presetIndex) in getTraitModifierPresets(Trait.name)"
                  :key="`${preset.name}-${presetIndex}`"
                  class="trait-modifier-option"
                  @mousedown.prevent="applyTraitModifierPreset(Trait, modifier, preset)"
              >
                {{
                  preset.percent !== null
                      ? `${preset.name} (${preset.percent > 0 ? '+' : ''}${preset.percent}%)`
                      : (preset.flat !== null
                          ? `${preset.name} (${preset.flat > 0 ? '+' : ''}${preset.flat} pts)`
                          : preset.name)
                }}
              </div>
              <div
                  v-if="getTraitModifierPresets(Trait.name).length === 0"
                  class="trait-modifier-option trait-modifier-option-empty"
              >
                No presets
              </div>
            </div>
          </div>
          <input @wheel="onWheel($event, modifier, 'value', 5)"
                 v-model="modifier.value"
                 type="number"
                 class="input trait-modifier-value"
                 id="modifier-value"
                 :placeholder="getTraitModifierMode(modifier) === 'flat' ? 'Value (pts)' : 'Value (%)'"
                 :step="getTraitModifierMode(modifier) === 'flat' ? 1 : 5">
          <StyledDropdown
              :model-value="getTraitModifierMode(modifier)"
              :options="[
                { label: '%', value: 'percent' },
                { label: 'pts', value: 'flat' }
              ]"
              class="trait-modifier-mode"
              @update:modelValue="modifier.mode = $event"
          />
          <input v-model="modifier.name"
                 class="input trait-modifier-name"
                 id="modifier-name"
                 placeholder="Modifier Name">
        </div>
      </div>
    </details>

    <!-- --FEATURES-- -->
    <details class="section-card features-section" open>
      <summary class="head-3">
        <h3>Spell Features</h3>
      </summary>

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
            <RpmAOE />
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

.effects-section,
.traits-section,
.damage-section,
.features-section,
.additional-section {
  grid-column: auto;
  grid-row: auto;
}

.section-card {
  border: 3px solid var(--Color3);
  border-radius: 0.7em;
  padding: 0.6em 0.8em 0.9em 0.8em;
  background: color-mix(in srgb, var(--Color2) 90%, white 10%);
  width: 100%;
  box-sizing: border-box;
}

.section-card + .section-card {
  margin-top: 0;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  width: 100%;
}

#modifier-value {
  margin-left: 0;
  width: 100%;
}

.trait-modifier-preset-field {
  position: relative;
  width: 100%;
}

.trait-modifier-preset-button {
  width: 100%;
  text-align: left;
  padding: 0 0.7em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trait-modifier-dropdown {
  position: absolute;
  top: calc(100% + 0.2em);
  left: 0;
  right: 0;
  max-height: 14em;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--Color2);
  border: 3px solid var(--Color3);
  border-radius: 0.5em;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 20;
  box-sizing: border-box;
}

.trait-modifier-option {
  padding: 0.6em 0.8em;
  border-bottom: 1px solid var(--Color3);
  line-height: 1.35;
  cursor: pointer;
}

.trait-modifier-option:hover {
  background-color: var(--Color5);
}

.trait-modifier-option:last-child {
  border-bottom: none;
}

.trait-modifier-option-empty {
  cursor: default;
}

.trait-modifier-option-empty:hover {
  background-color: transparent;
}

.trait-modifier-value {
  margin-left: 0 !important;
}

.trait-modifier-mode {
  width: 100%;
}

.trait-modifier-name {
  width: 100% !important;
}

.trait-modifier-row {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(9em, 1fr) 6.5em 4.1em minmax(12em, 1.45fr);
  gap: 0.55em;
  align-items: center;
  box-sizing: border-box;
}

.trait-modifier-row .trait-modifier-preset-button,
.trait-modifier-row .trait-modifier-value,
.trait-modifier-row .trait-modifier-mode,
.trait-modifier-row .trait-modifier-name {
  min-width: 0;
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

.trait-name-field {
  position: relative;
  width: 100%;
}

.trait-name-field #trait-name {
  width: 100%;
}

.trait-dropdown {
  position: absolute;
  top: calc(100% + 0.2em);
  left: 0;
  right: 0;
  max-height: 18em;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--Color2);
  border: 3px solid var(--Color3);
  border-radius: 0.5em;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 20;
  box-sizing: border-box;
}

.trait-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2em;
  padding: 0.6em 0.8em;
  border-bottom: 1px solid var(--Color3);
  cursor: pointer;
  line-height: 1.35;
}

.trait-option:hover {
  background-color: var(--Color5);
}

.trait-option:last-child {
  border-bottom: none;
}

.trait-option-empty {
  cursor: default;
  justify-content: center;
}

.trait-option-empty:hover {
  background-color: transparent;
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
.feature-item :deep(.aoe-component) {
  width: 100%;
  margin: 0;
  gap: 0.45em;
}

.feature-item :deep(.output) {
  margin-top: 0.1em;
  margin-bottom: 0.6em;
  padding-bottom: 0 !important;
}

.input-container.dense .section-card {
  padding: 0.45em 0.65em 0.65em 0.65em;
}

.input-container.dense .head-3 {
  height: 2.2em;
}

.input-container.dense .effects-container,
.input-container.dense .damage-subcontainer,
.input-container.dense .traits-container,
.input-container.dense .modifierWrapper {
  margin-top: 0.5em;
  gap: 0.7em;
}

.input-container.dense .input,
.input-container.dense .damage,
.input-container.dense .modifier-btn,
.input-container.dense .bestows-btn,
.input-container.dense .add-effect-btn {
  height: 1.85em;
}

@media (max-width: 1380px) {
  .damage-subcontainer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .traits-subcontainer {
    grid-template-columns: minmax(0, 1fr);
  }

  .trait-modifier-row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .features-subwrapper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bonus-row {
    grid-template-columns: 8em 10em minmax(0, 1fr);
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
