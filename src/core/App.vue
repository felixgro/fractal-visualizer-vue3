<script lang="ts" setup>
import FractalRenderer from '@/core/FractalRenderer.vue';
</script>

<template>
	<h1>Fractal Visualizer</h1>
	<router-view />
	<FractalRenderer />
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
