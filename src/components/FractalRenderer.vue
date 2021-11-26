<script lang="ts" setup>
import { useEventListener } from '@/composables/useEventListener';
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement>();

const resizeCanvas = (): void => {
	if (!canvas.value) return;
	canvas.value.width = window.innerWidth;
	canvas.value.height = window.innerHeight;
};

onMounted(resizeCanvas);
useEventListener(window, 'resize', resizeCanvas);
</script>

<template>
	<canvas ref="canvas" class="fractalRenderer"></canvas>
</template>
