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
  let greaterCount = 0

  for (const eff of spellEffects.value) {
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

const spellEffects = ref([
  { size: '', effect: '', path: '' }  // начальная группа
])

function addSpellEffect() {
  spellEffects.value.push({ size: '', effect: '', path: '' })
}

</script>

<template>
  <Header />
  <div class="wrapper">
    <div class="content">
      <InputFields
          v-model:name="name"
          :spellEffects="spellEffects"
          :effects="effects"
          :paths="paths"
          :sizes="sizes"
      />
      <MarkdownBoard
          :markdownPreview="markdownPreview"
          @copy="copyMarkdown"
      />
    </div>
    <button class="add-effect-btn" @click="addSpellEffect">Add Spell Effect</button>
  </div>


</template>

<style>
* {
  box-sizing: border-box;
  color: #DFD0B8;
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

.add-effect-btn {
  width: 50em;
  height: 2em;
  margin-left: 1em;
  padding: 0 2em;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid #948979;
  background-color: #222831;
  border-radius: 0.5em;
}
</style>
