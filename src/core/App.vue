<script lang="ts" setup>
import * as Main from '@/components/main';
import FractalRenderer from '@/components/main/FractalRenderer.vue';
</script>

<template>
	<Main.Header />
	<Main.Menu>
		<router-view />
	</Main.Menu>

	<FractalRenderer />
</template>

<style>
@import '@/assets/styles/main.css';
</style>
