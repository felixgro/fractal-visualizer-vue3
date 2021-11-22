<script lang="ts" setup>
import * as Main from '@/components/main';
import * as Layout from '@/components/layout';
import imageState from '@/core/ImageState';
import { provide } from 'vue';

provide('state', imageState);
</script>

<template>
	<Layout.Header />

	<main>
		<!-- Renders current fractal state on screen -->
		<Main.Renderer />
	</main>

	<Layout.Footer />
</template>

<style>
@import '@/assets/styles/main.css';
</style>
