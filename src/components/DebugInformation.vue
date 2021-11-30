<script lang="ts" setup>
import { useDebugStore } from '@/stores/debug';

const debugStore = useDebugStore();
</script>

<template>
	<ul>
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
