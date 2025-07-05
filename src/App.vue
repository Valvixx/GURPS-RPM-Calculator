<script setup>
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import ClipboardIcon from './assets/clipboard.svg'

const name = ref('')

const selectedEffect = ref('')
const selectedPath = ref('')

const effects = ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform']
const paths = ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence']

const markdownPreview = computed(() =>
    `## Spell: ${name.value || '[No Name]'}
**Path:** ${selectedEffect.value || '[None Effect]'} ${selectedPath.value || '[None Path]'}
**Energy:** [None Energy]
`)
</script>

<template>
<Header></Header>

<div class="content">
  <div class="input-container">
    <input id="name-field" class="input" type="text" placeholder="Spell Name" maxlength="65"
           v-bind:value="name" @input = "name = $event.target.value" />

    <h3 class="head-3">Effects</h3>

    <div class="effects-container">
      <select class="input effect" v-model="selectedEffect">
        <option disabled value="">-- Select an effect --</option>
        <option v-for="effect in effects" :key="effect" :value="effect">
          {{ effect }}
        </option>
      </select>

      <select class="input effect" v-model="selectedPath">
        <option disabled value="">-- Select a path --</option>
        <option v-for="path in paths" :key="path" :value="path">
          {{ path }}
        </option>
      </select>
    </div>
  </div>

  <div class="markdown-preview">
    <h3>Markdown Spell</h3>
    <div class="pre-wrapper">
      <pre v-text="markdownPreview"></pre>
      <button @click="copyMarkdown" id="copy-button">
        <ClipboardIcon class="icon" />
      </button>
    </div>
  </div>
</div>


</template>

<style>
* {
  box-sizing: border-box;
  color: #DFD0B8;
}

/*
Clipboard button
*/
.pre-wrapper {
  position: relative;
}

.pre-wrapper pre {
  white-space: pre-wrap;
  background-color: #2e2e2e;
  padding: 1em;
  border-radius: 4px;
  line-height: 1.5em;
  min-height: 10em;
}

.icon {
  fill: #948979;
  width: 24px;
  height: 24px;
}

#copy-button {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: transparent;
  border: none;
  color: #dfd0b8;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0.2em;
  transition: opacity 0.2s;
}

#copy-button:hover {
  opacity: 0.8;
}

/*
Fields
 */
#name-field{
  height: 2em;
  width: 65em;
}

.effects-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5em; /* регулируй отступ между дропдаунами */
}

.input-container{
  margin-left: 1em;
}

.input{
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid #948979;
  background-color: #222831;
  border-radius: 0.5em;

}

.input.effect{
  height: 2em;
  width: 30em;
}

/*
Markdown board
 */
.markdown-preview {
  width: 40em;
  background: #1f1f1f;
  color: #dfd0b8;
  padding: 1em;
  border: 3px solid #948979;
  border-radius: 0.5em;
}

pre {
  line-height: 2em;
  height: 10em;
  white-space: pre-wrap;
  background-color: #2e2e2e;
  padding: 1em;
  border-radius: 0.5em;
}

.content{
  display: flex;
  gap: 3em;
  max-width: 120em;
  padding: 1em;
}

</style>