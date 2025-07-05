<script setup>
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import InputFields from './components/InputFields.vue'
import MarkdownBoard from './components/MarkdownBoard.vue'

const name = ref('')
const selectedEffect = ref('')
const selectedPath = ref('')
const selectedSize = ref('')

const effects = ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform']
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']
const sizes = ['Greater', 'Lesser']

const energy = computed(() => {
  let base = 0
  switch (selectedEffect.value) {
    case 'Sense': base += 2; break
    case 'Strengthen': base += 3; break
    case 'Restore': base += 4; break
    case 'Control':
    case 'Destroy': base += 5; break
    case 'Create': base += 6; break
    case 'Transform': base += 7; break
  }
  if (selectedSize.value === 'Greater') base *= 3
  return base
})

const markdownPreview = computed(() =>
    `## Spell: ${name.value || '[No Name]'}\n` +
    `**Path:** ${selectedSize.value || '[None Size]'} ${selectedEffect.value || '[None Effect]'} ${selectedPath.value || '[None Path]'}\n` +
    `**Energy:** ${energy.value || '[None Energy]'}\n`
)

function copyMarkdown() {
  navigator.clipboard.writeText(markdownPreview.value)
      .then(() => console.log('Copied to clipboard'))
      .catch(err => console.error('Failed to copy:', err))
}

const spellComponents = ref([
  { size: '', effect: '', path: '' }  // начальная группа
])

function addSpellComponent() {
  spellComponents.value.push({ size: '', effect: '', path: '' })
}

</script>

<template>
  <Header />
  <div class="content">
    <InputFields
        v-model:name="name"
        v-model:selectedEffect="selectedEffect"
        v-model:selectedPath="selectedPath"
        v-model:selectedSize="selectedSize"
        :effects="effects"
        :paths="paths"
        :sizes="sizes"
    />
    <MarkdownBoard
        :markdownPreview="markdownPreview"
        @copy="copyMarkdown"
    />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  color: #DFD0B8;
}

.content {
  display: flex;
  gap: 3em;
  max-width: 120em;
  padding: 1em;
}
</style>
