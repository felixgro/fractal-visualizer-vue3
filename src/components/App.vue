<script lang="ts" setup>
import * as Main from '@/components/main';
import * as Layout from '@/components/layout';
</script>

<template>
	<Layout.Header />

	<main>
		<!-- Default fractal settings combined with specific fractal controls defined in each fractal's template -->
		<Main.Settings />
		<!-- Renders current fractal state on screen -->
		<Main.Renderer />
	</main>

	<Layout.Footer />
</template>

<style>
@import '@/assets/styles/main.css';
</style>
