<script lang="ts" setup>
import * as Form from '@/components/form';
import useImageState from '@/composables/useImageState';
import useEmitter from '@/composables/useEmitter';

defineProps<{
	modelValue: boolean;
}>();

const emits = defineEmits(['update:modelValue']);
const emitter = useEmitter();
const { exportConfig } = useImageState();

const submitFractalExport = () => {
	emitter.emit('fractal:save');
	emits('update:modelValue', false);
};
</script>

<template>
	<div v-if="modelValue">
		<h1>Export Config</h1>
		<Form.Number label="Width" v-model="exportConfig.width" />
		<Form.Number label="Height" v-model="exportConfig.height" />
		<Form.Text label="Format" v-model="exportConfig.format" />
		<br />
		<Form.Button
			label="Export"
			v-on:click="submitFractalExport"
		/>
	</div>
</template>

<style scoped>
div {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ccc;
	padding: 20px;
}
</style>
