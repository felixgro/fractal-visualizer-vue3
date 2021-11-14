<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
const cover = ref<HTMLDivElement>();
const factor = 0.462; // device pixel factor related to height

const resize = () => {
	if (cover.value)
		cover.value.style.width = window.innerHeight * factor + 'px';
};

onMounted(() => {
	resize();
	window.addEventListener('resize', resize);
});

onUnmounted(() => window.removeEventListener('resize', resize));
</script>

<template>
	<div ref="cover"></div>
</template>

<style scoped>
div {
	pointer-events: none;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translate(-50%);
	height: 100%;
	z-index: 1000;
	border: 4px dashed rgba(204, 204, 204, 60%);
}
</style>
