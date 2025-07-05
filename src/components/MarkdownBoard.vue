<script setup>
import ClipboardIcon from '../assets/clipboard.svg'
defineProps({
  markdownPreview: String
})
const emit = defineEmits(['copy'])
</script>

<template>
  <div class="markdown-preview">
    <h3>Markdown Spell</h3>
    <div class="pre-wrapper">
      <pre>{{ markdownPreview }}</pre>
      <button @click="emit('copy')" id="copy-button">
        <ClipboardIcon class="icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.markdown-preview {
  width: 40em;
  background: #1f1f1f;
  color: #dfd0b8;
  padding: 1em;
  border: 3px solid #948979;
  border-radius: 0.5em;
}

.pre-wrapper {
  position: relative;
}

.pre-wrapper pre {
  white-space: pre-wrap;
  background-color: #2e2e2e;
  padding: 1em;
  border-radius: 0.5em;
  min-height: 10em;
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
  color: #dfd0b8;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0.2em;
  transition: opacity 0.2s;
  opacity: 0.6;
}

#copy-button:hover {
  opacity: 1;
}
</style>
