<script setup>
import Header from "./components/Header.vue";
</script>

<template>
<Header></Header>
<div class="input-container">
  <input id="name-field" class="input" type="text" placeholder="Spell Name" v-bind:value="name" @input = "name = $event.target.value" />

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

<!-- Markdown предпросмотр -->
<div class="markdown-preview">
  <h3>Markdown Output</h3>
  <pre>{{ markdownPreview }}</pre>
  <button @click="copyMarkdown">📋Скопировать Markdown</button>
</div>

</div>
</template>

<script>
export default {
  data(){
    return{
      name:'',
      selectedEffect: '',
      selectedPath: '',
      effects: ['Sense', 'Strengthen', 'Restore', 'Control', 'Destroy', 'Create', 'Transform'],
      paths: ['Body', 'Chance', 'Crossroads', 'Energy', 'Magic', 'Matter', 'Mind', 'Spirit', 'Undead', 'Unexistence'],

    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  color: #DFD0B8;
}

form{
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.input{
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  border: 3px solid #948979;
  background-color: #222831;
}

.input.effect{
  height: 2em;
  width: 30em;
}

#name-field{
  height: 2em;
  width: 65em;
}

#paths-container{
  padding: 0;
}

.input-container{
  margin-top: 1em;
  margin-left: 1em;
}

.head-3{
  margin-top: 1em;
}

.effects-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5em; /* регулируй отступ между дропдаунами */
}

</style>