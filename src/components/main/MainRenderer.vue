<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useEmitter from '@/composables/useEmitter';

// canvas element for rendering fractal
const canvas = ref<HTMLCanvasElement>();

// used to emit fractal.render event
const emitter = useEmitter();

// resizes canvas to fit the browsers current window dimensions
const resizeCanvas = (): void => {
	if (!canvas.value) return;
	canvas.value.width = window.innerWidth;
	canvas.value.height = window.innerHeight;

	// redraw fractal to prevent distortion of current fractal state
	emitter.emit('fractal.render');
};

onMounted(() => {
	resizeCanvas();
	// TODO: debounce resize event
	window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
	// clean up event listener to prevent memory leaks when unmounting
	window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
	<canvas ref="canvas" class="fractalRenderer"></canvas>
</template>
