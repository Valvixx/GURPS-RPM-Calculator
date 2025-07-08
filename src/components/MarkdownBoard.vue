<script setup>
import { ref, computed } from 'vue'
import ClipboardIcon from '../assets/clipboard.svg'
const props = defineProps({
  markdownPreview: String,
  jsonPreview: Object
})
const viewMode = ref('markdown')

const currentPreview = computed(() => {
  return viewMode.value === 'markdown'
      ? props.markdownPreview
      : JSON.stringify(props.jsonPreview, null, 2)
})

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
