<script setup>
</script>

<template>
  <header class="header">
    <div class="siteName"> <b>GURPS RPM Calculator</b></div>

    <nav>
      <RouterLink to="/">RPM</RouterLink>
      <RouterLink to="/incantation">Incantation Magic</RouterLink>
    </nav>

  </header>
</template>

<style scoped>
header {
  height: 5em;
  width: 100vw;
  background-color: var(--Color2);
  box-sizing: border-box;
}

.siteName {
  font-size: 1.5em;
  padding-top: 1.5em;
  padding-left: 1.5em;
}
nav{
  margin-left: 20em;
  display: flex;
  flex-direction: row;
  gap: 1em;
}
</style>
