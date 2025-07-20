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

const description = computed(() => fieldsStore.description)

// AOE Energy calculation
const aoeEnergy = computed(() => {
  const radius = Number(fieldsStore.aoeRadius) || 0
  const value = Number(fieldsStore.aoeValue) || 0

  if (radius <= 0) return 0

  const radiusEnergy = radius * 10
  const valueEnergy = fieldsStore.aoeType === 'Everyone' ? 0 : Math.ceil(value / 2)
  return radiusEnergy + valueEnergy
})

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

// Функция для применения модификаторов категории урона (ТОЛЬКО ДЛЯ ОТОБРАЖЕНИЯ)
function applyDamageCategoryForDisplay(dice, bonus, category) {
  switch (category) {
    case 'Indirect':
      return multiplyDamage(dice, bonus, 3)
    case 'Indirect Explosive':
      return multiplyDamage(dice, bonus, 2)
    case 'Direct':
    default:
      return { dice, bonus }
  }
}

const damage = computed(() => {
  return fieldsStore.spellDamage.map(dmg => {
    let dice = dmg.intValue || 0
    let bonus = dmg.addValue || 0
    const category = dmg.category

    // Применяем модификаторы категории ТОЛЬКО для отображения
    const modifiedDamage = applyDamageCategoryForDisplay(dice, bonus, category)
    dice = modifiedDamage.dice
    bonus = modifiedDamage.bonus

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

// Базовая энергия (без умножения)
const baseEnergy = computed(() => {
  // -----EFFECTS-----
  let base = 0

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
  }

  // -----DAMAGE-----
  const damageEnergyValue = fieldsStore.spellDamage.reduce((acc, dmg) => {
    // ВАЖНО: Для расчёта энергии используем ОРИГИНАЛЬНЫЕ значения без применения категории
    let dice = dmg.intValue || 0
    let bonus = dmg.addValue || 0
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
        energy = damageEnergy(dice, bonus) * 2
        break
      case 'cut':
        energy = Math.ceil(damageEnergy(dice, bonus) * 1.5)
        break
      case 'fat':
        energy = damageEnergy(dice, bonus) * 2
        break
      case 'heal':
        energy = damageEnergy(dice, bonus)
        break
      case 'imp':
        energy = damageEnergy(dice, bonus) * 2
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
        energy = damageEnergy(dice, bonus) * 2
        break
      case 'tox':
        energy = damageEnergy(dice, bonus) * 2
        break
    }

    return acc + energy
  }, 0)

  const totalDamageModifier = fieldsStore.spellDamage
      .map(dmg => dmg.spellModifiers || [])
      .reduce((acc, mods) => acc.concat(mods), [])
      .reduce((sum, mod) => sum + (Number(mod.value) || 0), 0)

  const damageModifierEnergy = totalDamageModifier >= 0
      ? Math.floor(totalDamageModifier / 5)
      : Math.ceil(totalDamageModifier / 5)

  // -----TRAITS-----
  const traitsEnergyValue = fieldsStore.spellTraits.reduce((acc, trait) => {
    const basePts = Number(trait.value) || 0;

    const totalPct = (trait.traitModifiers || [])
        .reduce((sum, mod) => sum + (Number(mod.value) || 0), 0);

    const adjustedPts = basePts * (1 + totalPct / 100);

    const energyForTrait = adjustedPts >= 0
        ? Math.ceil(adjustedPts)
        : Math.abs(Math.ceil(adjustedPts / 5));

    return acc + energyForTrait;
  }, 0);

  // -----BESTOWS A BONUS OR PENALTY-----
  const bonusEnergyValue = fieldsStore.spellBonuses.reduce((acc, bonus) => {
    const val = Number(bonus.value) || 0;
    if (val === 0) return acc;

    const lvl = Math.abs(val);
    const factor = 2 ** (lvl - 1);

    let cell;
    switch (bonus.category) {
      case 'Broad':
        cell = 5 * factor;
        break;
      case 'Moderate':
        cell = 2 * factor;
        break;
      case 'Narrow':
        cell = factor;
        break;
      default:
        return acc;
    }

    return acc + cell;
  }, 0);

  const durationEnergy = energyStore.duration
  const weightEnergy = energyStore.weight
  const distanceEnergy = energyStore.distance
  const longDistanceEnergy = energyStore.longDistance
  const summonEnergy = energyStore.summoned

  return base
      + damageEnergyValue
      + damageModifierEnergy
      + traitsEnergyValue
      + bonusEnergyValue
      + durationEnergy
      + weightEnergy
      + distanceEnergy
      + longDistanceEnergy
      + summonEnergy
      + aoeEnergy.value
})

// Итоговая энергия (с умножением)
const totalEnergy = computed(() => {
  return baseEnergy.value
})

// Функция расчета штрафа навыка по общей энергии
const skillPenalty = computed(() => {
  const total = totalEnergy.value
  if (total <= 9) return 0
  if (total <= 19) return -1
  if (total <= 29) return -2
  if (total <= 39) return -3
  if (total <= 49) return -4
  if (total <= 59) return -5
  if (total <= 69) return -6
  if (total <= 79) return -7
  if (total <= 89) return -8
  if (total <= 99) return -9
  if (total <= 109) return -10

  // Для значений выше 109: каждые 10 дополнительных SP дают -1
  return -10 - Math.floor((total - 109) / 10)
})

// Время каста на основе количества эффектов
const castingTime = computed(() => {
  const effectCount = props.spellEffects.filter(eff => eff.effect && eff.path).length

  if (effectCount <= 0) return '5 minutes'
  if (effectCount === 1) return '5 minutes'
  if (effectCount === 2) return '10 minutes'
  if (effectCount === 3) return '30 minutes'
  if (effectCount === 4) return '1 hour'
  if (effectCount === 5) return '3 hours'
  if (effectCount === 6) return '6 hours'
  if (effectCount === 7) return '12 hours'
  if (effectCount === 8) return '24 hours'
  if (effectCount === 9) return '3 days'
  if (effectCount === 10) return '1 week'
  if (effectCount === 11) return '2 weeks'
  if (effectCount === 12) return '1 month'
  if (effectCount === 13) return '2 months'

  // Для значений выше 13: каждый дополнительный эффект добавляет месяц
  const additionalMonths = effectCount - 13
  return `${2 + additionalMonths} months`
})

// Получение уникальных путей из эффектов
const uniquePaths = computed(() => {
  const paths = props.spellEffects
      .filter(eff => eff.effect && eff.path)
      .map(eff => eff.path)
  return [...new Set(paths)]
})

// Форматирование штрафа навыка
const skillPenaltyText = computed(() => {
  const penalty = skillPenalty.value
  const paths = uniquePaths.value

  if (paths.length === 0) return ''
  if (paths.length === 1) {
    return `Path of ${paths[0]}${penalty !== 0 ? penalty : ''}.`
  } else {
    const pathList = paths.map(path => `Path of ${path}${penalty !== 0 ? penalty : ''}`).join(' or ')
    return `The lower of ${pathList}.`
  }
})

// Формат эффектов для вывода
const effectsText = computed(() => {
  return props.spellEffects.filter(eff => eff.effect && eff.path)
      .map(eff => `${eff.effect} ${eff.path}`)
      .join(' + ')
})

// Формат урона для вывода
const damageText = computed(() => {
  return fieldsStore.spellDamage.filter(dmg => dmg.intValue || dmg.addValue)
      .map(dmg => {
        let dice = dmg.intValue || 0
        let bonus = dmg.addValue || 0
        const category = dmg.category || 'Direct'
        const type = dmg.type || ''

        // Применяем модификаторы категории для отображения
        const modifiedDamage = applyDamageCategoryForDisplay(dice, bonus, category)
        dice = modifiedDamage.dice
        bonus = modifiedDamage.bonus

        let result = ''
        if (dice > 0) {
          result += `${dice}d`
        }
        if (bonus > 0) {
          result += dice > 0 ? `+${bonus}` : `${bonus}`
        } else if (bonus < 0) {
          result += `${bonus}`
        }

        if (type) {
          result += ` ${type}`
        }

        return result
      })
      .join(', ')
})

// AOE текст для inherent modifiers
const aoeText = computed(() => {
  const radius = Number(fieldsStore.aoeRadius) || 0
  if (radius <= 0) return ''

  const value = Number(fieldsStore.aoeValue) || 0
  const type = fieldsStore.aoeType

  let text = `Area of Effect, ${radius} yards`

  if (type === 'Include' && value > 0) {
    text += `, Includes ${value} targets`
  } else if (type === 'Exclude' && value > 0) {
    text += `, Excludes ${value} targets`
  }

  return text
})

// Inherent Modifiers
const inherentModifiers = computed(() => {
  const modifiers = []

  // Добавляем урон
  if (damageText.value) {
    modifiers.push(`Damage, ${damageText.value}`)
  }

  // Добавляем AOE
  if (aoeText.value) {
    modifiers.push(aoeText.value)
  }

  // Добавляем бонусы
  fieldsStore.spellBonuses.forEach(bonus => {
    if (bonus.value && bonus.subject) {
      const sign = Number(bonus.value) > 0 ? '+' : ''
      modifiers.push(`Bestows a ${Number(bonus.value) > 0 ? 'Bonus' : 'Penalty'}, ${sign}${bonus.value} to ${bonus.subject}`)
    }
  })

  // Добавляем Summoned если есть
  if (energyStore.summoned > 0) {
    modifiers.push('Summoned')
  }

  return modifiers.length > 0 ? modifiers.join('; ') + '.' : 'None.'
})

// Типичное произнесение
const typicalCasting = computed(() => {
  const parts = []

  // Эффекты
  props.spellEffects.forEach(eff => {
    if (eff.effect && eff.path) {
      const baseEnergy = getEffectBaseEnergy(eff.effect)
      parts.push(`${eff.effect} ${eff.path} (${baseEnergy})`)
    }
  })

  // Урон
  fieldsStore.spellDamage.forEach(dmg => {
    if (dmg.intValue || dmg.addValue) {
      const dice = dmg.intValue || 0
      const bonus = dmg.addValue || 0
      const type = dmg.type || ''
      const category = dmg.category || 'Direct'

      // Для отображения используем модифицированные значения
      const modifiedDamage = applyDamageCategoryForDisplay(dice, bonus, category)
      let damageStr = ''
      if (modifiedDamage.dice > 0) {
        damageStr += `${modifiedDamage.dice}d`
      }
      if (modifiedDamage.bonus > 0) {
        damageStr += modifiedDamage.dice > 0 ? `+${modifiedDamage.bonus}` : `${modifiedDamage.bonus}`
      } else if (modifiedDamage.bonus < 0) {
        damageStr += `${modifiedDamage.bonus}`
      }

      // Энергия рассчитывается по ОРИГИНАЛЬНЫМ значениям
      const energy = calculateDamageEnergy(dice, bonus, type)

      // Формируем строку с модификаторами
      let modifiersStr = ''
      if (dmg.spellModifiers && dmg.spellModifiers.length > 0) {
        const modifiersList = dmg.spellModifiers
            .filter(mod => mod.name && mod.value)
            .map(mod => `${mod.name}, ${mod.value > 0 ? '+' : ''}${mod.value}%`)
            .join('; ')
        if (modifiersList) {
          modifiersStr = ` (${modifiersList})`
        }
      }

      parts.push(`Damage, ${category} ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} ${damageStr}${modifiersStr} (${energy})`)
    }
  })

  // AOE
  if (aoeEnergy.value > 0) {
    const radius = fieldsStore.aoeRadius
    const type = fieldsStore.aoeType
    const value = fieldsStore.aoeValue

    let aoeStr = `Area of Effect, ${radius} yards`
    if (type === 'Include' && value > 0) {
      aoeStr += `, Includes ${value} targets`
    } else if (type === 'Exclude' && value > 0) {
      aoeStr += `, Excludes ${value} targets`
    }

    parts.push(`${aoeStr} (${aoeEnergy.value})`)
  }

  // Длительность
  if (energyStore.duration > 0) {
    parts.push(`Duration, ${durationValue.value} ${durationUnit.value} (${energyStore.duration})`)
  }

  // Вес
  if (energyStore.weight > 0) {
    parts.push(`Subject Weight, ${fieldsStore.weightValue} ${fieldsStore.weightType} (${energyStore.weight})`)
  }

  // Дистанция
  if (energyStore.distance > 0) {
    parts.push(`Range, ${fieldsStore.distanceValue} ${fieldsStore.distanceType} (${energyStore.distance})`)
  }

  // Дальняя дистанция
  if (energyStore.longDistance > 0) {
    parts.push(`Long Distance, ${fieldsStore.longDistanceValue} ${fieldsStore.longDistanceType} (${energyStore.longDistance})`)
  }

  // Призванный
  if (energyStore.summoned > 0) {
    parts.push(`Summoned (${energyStore.summoned})`)
  }

  // Трейты
  fieldsStore.spellTraits.forEach(trait => {
    if (trait.name && trait.value) {
      const energy = Math.abs(calculateTraitEnergy(trait))

      // Формируем строку с модификаторами для трейта
      let modifiersStr = ''
      if (trait.traitModifiers && trait.traitModifiers.length > 0) {
        const modifiersList = trait.traitModifiers
            .filter(mod => mod.name && mod.value)
            .map(mod => `${mod.name}, ${mod.value > 0 ? '+' : ''}${mod.value}%`)
            .join('; ')
        if (modifiersList) {
          modifiersStr = ` (${modifiersList})`
        }
      }

      parts.push(`Altered Traits, ${trait.name} ${trait.value > 0 ? '+' : ''}${trait.value}${modifiersStr} (${energy})`)
    }
  })

  // Бонусы/штрафы
  fieldsStore.spellBonuses.forEach(bonus => {
    if (bonus.value && bonus.subject) {
      const energy = calculateBonusEnergy(bonus)
      const sign = bonus.value > 0 ? '+' : ''
      parts.push(`Bestows a ${bonus.value > 0 ? 'Bonus' : 'Penalty'}, ${sign}${bonus.value} to ${bonus.subject} (${energy})`)
    }
  })

  const joinedParts = parts.join(' + ')
  return `${joinedParts}. ${totalEnergy.value} SP`
})

function getEffectBaseEnergy(effect) {
  switch (effect) {
    case 'Sense': return 2
    case 'Strengthen': return 3
    case 'Restore': return 4
    case 'Control': return 5
    case 'Destroy': return 5
    case 'Create': return 6
    case 'Transform': return 8
    default: return 0
  }
}

function calculateDamageEnergy(dice, bonus, type) {
  // Энергия рассчитывается по ОРИГИНАЛЬНЫМ значениям без применения категории
  let energy = damageEnergy(dice, bonus) || 0

  switch (type) {
    case 'cor':
    case 'fat':
    case 'imp':
    case 'pi++':
    case 'tox':
      energy *= 2
      break
    case 'cut':
    case 'pi+':
      energy = Math.ceil(energy * 1.5)
      break
    case 'pi-':
      energy = Math.ceil(energy * 0.5)
      break
  }

  return energy
}

function calculateTraitEnergy(trait) {
  const basePts = Number(trait.value) || 0
  const totalPct = (trait.traitModifiers || [])
      .reduce((sum, mod) => sum + (Number(mod.value) || 0), 0)

  const adjustedPts = basePts * (1 + totalPct / 100)

  return adjustedPts >= 0
      ? Math.ceil(adjustedPts)
      : Math.ceil(adjustedPts / 5)
}

function calculateBonusEnergy(bonus) {
  const val = Number(bonus.value) || 0
  if (val === 0) return 0

  const lvl = Math.abs(val)
  const factor = 2 ** (lvl - 1)

  let cell
  switch (bonus.category) {
    case 'Broad':
      cell = 5 * factor
      break
    case 'Moderate':
      cell = 2 * factor
      break
    case 'Narrow':
      cell = factor
      break
    default:
      return 0
  }

  return cell
}

const markdownPreview = computed(() => {
  return `### ${props.name || '[No Name]'}\n` +
      `**Spell Effects:** ${effectsText.value || '[No Effects]'}.\n` +
      `**Inherent Modifiers:** ${inherentModifiers.value}\n` +
      `**Skill Penalty:** ${skillPenaltyText.value}\n` +
      `**Casting Time:** ${castingTime.value}.\n` +
      `*${description.value || '[No description]'}*\n` +
      `**Typical Casting:** ${typicalCasting.value}\n`
})

const jsonPreview = computed(() => ({
  name: props.name || null,
  effects: props.spellEffects.map((eff) => ({
    effect: eff.effect || null,
    path: eff.path || null,
  })),
  baseEnergy: baseEnergy.value,
  totalEnergy: totalEnergy.value,
  skillPenalty: skillPenalty.value,
  castingTime: castingTime.value,
  aoeEnergy: aoeEnergy.value
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
  min-height: 30em;
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
  top: 0.1em;
  right: 0.1em;
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