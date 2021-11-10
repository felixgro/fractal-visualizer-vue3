<script lang="ts" setup>
import useEmitter from './composables/useEmitter';

const emitter = useEmitter();

emitter.emit('test', 'Hello World!');
</script>

<template>
	<main>
		<h1>Sandbox</h1>
	</main>
</template>
