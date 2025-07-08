<script setup>
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import InputFields from './components/InputFields.vue'
import MarkdownBoard from './components/MarkdownBoard.vue'

const name = ref('')

const inputFieldsRef = ref()

const energy = computed(() => {
  if (!inputFieldsRef.value || typeof inputFieldsRef.value.getSpellEffects !== 'function') {
    return 0
  }
  let base = 0
  let greaterCount = 0

  const spellEffects = inputFieldsRef.value.getSpellEffects()

  for (const eff of spellEffects) {
    switch (eff.effect) {
      case 'Sense': base += 2; break
      case 'Strengthen': base += 3; break
      case 'Restore': base += 4; break
      case 'Control':
      case 'Destroy': base += 5; break
      case 'Create': base += 6; break
    }

    if (eff.size === 'Greater') {
      greaterCount++
    }
  }

  const multiplier = 1 + greaterCount * 2
  return base * multiplier
})

const markdownPreview = computed(() => {
  const spellEffects = inputFieldsRef.value?.getSpellEffects?.() || []

  const effectsMarkdown = spellEffects.map((eff) => {
    const size = eff.size || '[No Size]'
    const effect = eff.effect || '[No Effect]'
    const path = eff.path || '[No Path]'
    return `- ${size} ${effect} ${path}`
  }).join('\n')

  return `## Spell: ${name.value || '[No Name]'}\n` +
      `**Effects:**\n${effectsMarkdown || '- [No Effects]'}\n` +
      `**Energy:** ${energy.value || '[None Energy]'}\n`
})

const jsonPreview = computed(() => {
  const spellEffects = inputFieldsRef.value?.getSpellEffects?.() || []

  return {
    name: name.value || null,
    effects: spellEffects.map((eff) => ({
      size: eff.size || null,
      effect: eff.effect || null,
      path: eff.path || null,
    })),
    energy: energy.value
  }
})




</script>

<template>
  <Header />
  <div class="wrapper">
    <div class="content">
      <InputFields
      ref="inputFieldsRef"
      v-model="name"
      />

      <MarkdownBoard
          :markdownPreview="markdownPreview"
          :jsonPreview="jsonPreview"
      />
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  color: var(--TextColor);
}

.wrapper {
  display: flex;
  flex-direction: column;  /* Колонки сверху, кнопка снизу */
  gap: 1em;
  max-width: 120em;
  padding: 1em;
}

.content {
  display: flex;
  flex-direction: row;
  gap: 3em;
}

</style>
