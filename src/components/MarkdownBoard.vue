<script setup>
import { ref, computed } from 'vue'
import ClipboardIcon from '../assets/clipboard.svg'
import { useEnergyStore} from '../stores/energy.js'
import {useFieldsStore} from "../stores/fields.js";

const energyStore = useEnergyStore()
const fieldsStore = useFieldsStore()

const durationValue = computed({
  get: () => fieldsStore.durationValue,
})

const durationUnit = computed({
  get: () => fieldsStore.durationType,
})

const props = defineProps({
  name: String,
  spellEffects: Array
})

const viewMode = ref('markdown')

const damage = computed(() => {
  return fieldsStore.spellDamage.map(dmg => {
    let dice = dmg.intValue || 0
    let bonus = dmg.addValue || 0
    const category = dmg.category

    switch (category) {
      case 'External':
        ({ dice, bonus } = multiplyDamage(dice, bonus, 3))
        break
      case 'External Explosive':
        ({ dice, bonus } = multiplyDamage(dice, bonus, 2))
        break
      case 'Internal':
      default:
        break
    }

    let result = `${dice}d`

    if (bonus > 0) {
      result += `+${bonus}`
    } else if (bonus < 0) {
      result += `${bonus}`
    }

    return result
  }).join(', ')
})

function damageToIndex(dice, bonus) {
  if (bonus > 2 || bonus < -1) {
    return null;
  }
  if (dice <= 1) {
    return bonus;
  }
  else {
    const base = 3 + (dice - 2) * 4;
    const offset = bonus + 1;
    return base + offset;
  }
}

function damageEnergy(dice, bonus) {
  return damageToIndex(dice, bonus);
}

function indexToDamage(index) {
  if (index < 3) {
    // это зона 1d
    return { dice: 1, bonus: index };
  } else {
    // убираем первую тройку, получаем зону ≥2d
    const idx = index - 3;
    // сколько полных кубиков после первого?
    const cubesAfter1 = Math.floor(idx / 4);
    const dice = 2 + cubesAfter1;
    const offset = idx % 4;
    const bonus = offset - 1;
    return { dice, bonus };
  }
}

function multiplyDamage(dice, bonus, multiplier) {
  const rawDice  = dice * multiplier
  const rawBonus = bonus * multiplier

  let extra, newDice, newBonus

  if (rawBonus >= 0) {
    extra    = Math.floor(rawBonus / 3)
    newBonus = rawBonus % 3
    newDice  = rawDice + extra
  } else {
    extra    = Math.ceil(Math.abs(rawBonus) / 3)
    newBonus = Math.abs(rawBonus) % 3
    newDice  = rawDice - extra
  }

  newDice = Math.max(0, newDice)
  return { dice: newDice, bonus: newBonus }
}

const energy = computed(() => {
  // EFFECTS
  let base = 0
  let greaterCount = 0
  let effects

  for (const eff of props.spellEffects) {
    switch (eff.effect) {
      case 'Sense': base += 2; break
      case 'Strengthen': base += 3; break
      case 'Restore': base += 4; break
      case 'Control': base += 5; break
      case 'Destroy': base += 5; break
      case 'Create': base += 6; break
      case 'Transform': base += 8; break
    }
    if (eff.size === 'Greater') {
      greaterCount++
    }
  }
  effects =  base * (1 + greaterCount * 2)

  const damageEnergyValue = fieldsStore.spellDamage.reduce((acc, dmg) => {
    const dice = dmg.intValue || 0
    const bonus = dmg.addValue || 0
    const type = dmg.type

    let energy = 0
    switch (type) {
      case 'burn':
        energy = damageEnergy(dice, bonus)
        break
      case 'cr':
        energy = damageEnergy(dice, bonus)
        break
      case 'cor':
        energy = Math.ceil(damageEnergy(dice, bonus) * 2)
        break
      case 'cut':
        energy = Math.ceil(damageEnergy(dice, bonus) * 1.5)
        break
      case 'fat':
        energy = Math.ceil(damageEnergy(dice, bonus) * 2)
        break
      case 'heal':
        energy = damageEnergy(dice, bonus)
        break
      case 'imp':
        energy = Math.ceil(damageEnergy(dice, bonus) * 2)
        break
      case 'pi-':
        energy = Math.ceil(damageEnergy(dice, bonus) * 0.5)
        break
      case 'pi':
        energy = damageEnergy(dice, bonus)
        break
      case 'pi+':
        energy = Math.ceil(damageEnergy(dice, bonus) * 1.5)
        break
      case 'pi++':
        energy = Math.ceil(damageEnergy(dice, bonus) * 2)
        break
      case 'tox':
        energy = Math.ceil(damageEnergy(dice, bonus) * 2)
        break
    }

    return acc + energy
  }, 0)

  return effects + damageEnergyValue
})

const markdownPreview = computed(() => {
  const effectsMarkdown = props.spellEffects.map((eff) => {
    const size = eff.size || '[No Size]'
    const effect = eff.effect || '[No Effect]'
    const path = eff.path || '[No Path]'
    return `- ${size} ${effect} ${path}`
  }).join('\n')

  return `## Spell: ${props.name || '[No Name]'}\n` +
      `**Energy:** ${energy.value || '[None Energy]'}\n` +
      `**Effects:**\n${effectsMarkdown || '- [No Effects]'}\n` +
      `**Distance** \n` +
      `**Damage** ${damage.value || '[No Damage]'}\n` +
      `**Duration** ${durationValue.value || '[No Duration]'} ${durationUnit.value || '[No Units]'}\n` +
      `[Description] \n` +
      `**Typical Casting:** `
})

const jsonPreview = computed(() => ({
  name: props.name || null,
  effects: props.spellEffects.map((eff) => ({
    size: eff.size || null,
    effect: eff.effect || null,
    path: eff.path || null,
  })),
  energy: energy.value
}))

const currentPreview = computed(() =>
    viewMode.value === 'markdown'
        ? markdownPreview.value
        : JSON.stringify(jsonPreview.value, null, 2)
)

function copyCurrent() {
  navigator.clipboard.writeText(currentPreview.value)
      .catch(err => console.error('Copy failed:', err))
}




</script>

<template>
  <div class="markdown-preview">
    <div class="switcher-group">
      <button
          id="md"
          class="switcher"
          :class="{ active: viewMode === 'markdown' }"
          @click="viewMode = 'markdown'"
      >Markdown</button>
      <button
          id="json"
          class="switcher"
          :class="{ active: viewMode === 'json' }"
          @click="viewMode = 'json'"
      >JSON</button>
    </div>

    <div class="pre-wrapper">
      <pre>{{ currentPreview }}</pre>
      <button @click="copyCurrent" id="copy-button">
        <ClipboardIcon class="icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.markdown-preview {
  width: 40em;
  background: var(--Color2);
  padding: 1em;
  border: 3px solid var(--Color3);
  border-radius: 0.5em;
}

.pre-wrapper {
  position: relative;
}

.pre-wrapper pre {
  white-space: pre-wrap;
  background-color: var(--Color5);
  padding: 1em;
  border-radius: 0.5em;
  min-height: 20em;
  line-height: 1.5em;
}

.icon {
  width: 1.5em;
  height: 1.5em;
}

#copy-button {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0.2em;
  transition: opacity 0.2s;
  opacity: 0.6;
}

#copy-button:hover {
  opacity: 1;
}

.switcher {
  background-color: var(--Color5);
  border: 2px solid var(--Color3);
  width: 8em;
}

#md {
  border-right: 0;
  border-radius: 0.5em 0 0 0.5em;
}

#json{
  border-left: 0;
  border-radius: 0 0.5em 0.5em 0;
}

.switcher:hover{
  cursor: pointer;
  border: 2px solid var(--Color4);
  #json{border: 2px solid var(--Color4) }
}

.switcher-group {
  display: flex;
  margin-bottom: 1em;
}

.switcher.active {
  border-color: var(--Color4);
  font-weight: bold;
  background-color: var(--Color3);
}
</style>
