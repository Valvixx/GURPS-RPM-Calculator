<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select option'
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const rootRef = ref(null)

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return {
        label: String(option.label ?? option.value ?? ''),
        value: option.value ?? option.label ?? ''
      }
    }

    return {
      label: String(option),
      value: option
    }
  })
})

const selectedLabel = computed(() => {
  const current = normalizedOptions.value.find(
      option => String(option.value) === String(props.modelValue)
  )
  return current ? current.label : props.placeholder
})

function toggle() {
  isOpen.value = !isOpen.value
}

function selectOption(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function close() {
  isOpen.value = false
}

function handleOutsideClick(event) {
  if (!rootRef.value) return
  if (!rootRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <div ref="rootRef" class="styled-dropdown">
    <button type="button" class="styled-dropdown-trigger" @click="toggle">
      <span class="styled-dropdown-label">{{ selectedLabel }}</span>
      <span class="styled-dropdown-caret">▾</span>
    </button>

    <div v-if="isOpen" class="styled-dropdown-menu">
      <button
          v-for="(option, index) in normalizedOptions"
          :key="`${option.label}-${index}`"
          type="button"
          class="styled-dropdown-option"
          @click="selectOption(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.styled-dropdown {
  position: relative;
  width: 100%;
}

.styled-dropdown-trigger {
  width: 100%;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6em;
  padding: 0 0.7em;
  font-size: 1em;
  font-family: inherit;
  text-align: left;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
}

.styled-dropdown-trigger:hover {
  cursor: pointer;
  border-color: var(--Color4);
}

.styled-dropdown-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.styled-dropdown-caret {
  flex: 0 0 auto;
  line-height: 1;
}

.styled-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.2em);
  left: 0;
  right: 0;
  max-height: 15em;
  overflow-y: auto;
  overflow-x: hidden;
  border: 3px solid var(--Color3);
  background-color: var(--Color2);
  border-radius: 0.5em;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 30;
}

.styled-dropdown-option {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--Color3);
  background: transparent;
  text-align: left;
  font: inherit;
  padding: 0.55em 0.7em;
  line-height: 1.3;
}

.styled-dropdown-option:last-child {
  border-bottom: none;
}

.styled-dropdown-option:hover {
  cursor: pointer;
  background-color: var(--Color5);
}
</style>
