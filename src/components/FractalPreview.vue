<script lang="ts" setup>
import type * as FRCTL from '@/types/fractal';
import { ref } from 'vue';

const preview = ref<HTMLCanvasElement>();

defineProps<{
	config: FRCTL.ExportConfig;
}>();
</script>

<template>
	<canvas ref="preview"></canvas>
</template>
