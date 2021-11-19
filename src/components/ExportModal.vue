<script lang="ts" setup>
import { ref, watchEffect } from '@vue/runtime-core';
import * as Form from '@/components/form';
import useImageState from '@/composables/useImageState';
import useEmitter from '@/composables/useEmitter';

const preview = ref<HTMLCanvasElement>();
const emitter = useEmitter();
const { exportConfig } = useImageState();

watchEffect(() => {
	if (!preview.value) return;
	exportConfig;
	const relHeight =
		(preview.value.width / preview.value.height) *
		preview.value.clientWidth;
	preview.value.style.height = `${relHeight}px`;
});

emitter.on('fractal:preview', (img: Blob) => {
	console.log(img);
});

const submitFractalExport = () => {
	emitter.emit('fractal:save');
};
</script>

<template>
	<div class="modal">
		<h1>Export Config</h1>
		<div class="preview">
			<canvas
				ref="preview"
				:width="exportConfig.width"
				:height="exportConfig.height"
			></canvas>
		</div>
		<p>v Custom</p>
		<div class="row">
			<Form.Number label="Width" v-model="exportConfig.width" />
			<Form.Number
				label="Height"
				v-model="exportConfig.height"
			/>
			<Form.Text label="Format" v-model="exportConfig.format" />
		</div>
		<Form.Button
			label="Download"
			v-on:click="submitFractalExport"
		/>
	</div>
</template>

<style scoped>
div.modal {
	position: fixed;
	display: block;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ccc;
	padding: 20px;
}

div.row {
	display: flex;
}

button {
	margin-top: 10px;
	width: 100%;
}

.preview {
	position: relative;
	display: block;
	width: 100%;
	margin: 15px 0;
}

canvas {
	position: relative;
	background: red;
	width: 100%;
	height: 100%;
}
</style>
