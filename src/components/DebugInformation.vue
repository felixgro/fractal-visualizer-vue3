<script lang="ts" setup>
import { useDebugStore } from '@/stores/debug';
import pkg from '../../package.json';

const debugStore = useDebugStore();
</script>

<template>
	<ul>
		<li>{{ pkg.version }}</li>
		<li>{{ debugStore.frameDuration || 0 }} ms</li>
		<li>{{ debugStore.iterations || 0 }} Iterations</li>
	</ul>
</template>

<style scoped>
ul {
	list-style: none;
	padding: 0;
}
</style>
