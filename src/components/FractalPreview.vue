<script lang="ts" setup>
import { ref } from 'vue';
import * as FRCTL from '@/types/fractal';

const preview = ref<HTMLCanvasElement>();

defineProps<{
	config: FRCTL.ExportConfig;
}>();
</script>

<template>
	<canvas ref="preview"></canvas>
</template>
