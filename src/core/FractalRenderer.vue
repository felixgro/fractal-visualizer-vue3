<template>
	<canvas ref="renderer" class="fractalRenderer"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useEmitter from '@/composables/useEmitter';

const renderer = ref<HTMLCanvasElement>();

// used to emit fractal.render events
const emitter = useEmitter();

// resizes canvas to fit the browsers current window dimensions
const resizeCanvas = (): void => {
	if (!renderer.value) return;
	renderer.value.width = window.innerWidth;
	renderer.value.height = window.innerHeight;

	// redraw fractal to prevent distortion of current fractal state
	emitter.emit('fractal.render');
};

onMounted(() => {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
	// clean up event listener to prevent memory leaks when unmounting
	window.removeEventListener('resize', resizeCanvas);
});
</script>
