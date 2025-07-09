<script setup>
import { ref, computed } from 'vue'
import ClipboardIcon from '../assets/clipboard.svg'

const props = defineProps({
  name: String,
  spellEffects: Array
})

const viewMode = ref('markdown')

const energy = computed(() => {
  let base = 0
  let greaterCount = 0

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

  return base * (1 + greaterCount * 2)
})

const markdownPreview = computed(() => {
  const effectsMarkdown = props.spellEffects.map((eff) => {
    const size = eff.size || '[No Size]'
    const effect = eff.effect || '[No Effect]'
    const path = eff.path || '[No Path]'
    return `- ${size} ${effect} ${path}`
  }).join('\n')

  return `## Spell: ${props.name || '[No Name]'}\n` +
      `**Effects:**\n${effectsMarkdown || '- [No Effects]'}\n` +
      `**Energy:** ${energy.value || '[None Energy]'}\n`
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
