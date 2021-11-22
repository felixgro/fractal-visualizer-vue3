<script lang="ts" setup>
import { ref, onUpdated } from '@vue/runtime-core';
import * as Form from '@/components/form';
import useEmitter from '@/composables/useEmitter';
import { useStore } from '@/stores/fractal';

// FIXME: Triggers on every change even when hiding modal
// onUpdated(() => {
// 	emitter.emit('fractal:preview');
// });

const preview = ref<HTMLImageElement>();
const emitter = useEmitter();
const store = useStore();

const saveFractal = () => emitter.emit('fractal:save');

emitter.on('fractal:previewBlob', (blob: Blob) => {
	preview.value!.src = URL.createObjectURL(blob);
	preview.value!.onload = () => {
		const conBcr = preview.value!.parentElement!.getBoundingClientRect();
		const imgBcr = preview.value!.getBoundingClientRect();

		if (imgBcr.height > imgBcr.width) {
			preview.value!.style.height = '100%';
			preview.value!.style.width = 'auto';
		} else {
			preview.value!.style.width = '100%';
			preview.value!.style.height = 'auto';
		}

		console.log(imgBcr);
		console.log(conBcr);
	};
});
</script>

<template>
	<div class="modal">
		<h1>Export Config</h1>
		<div class="preview">
			<img ref="preview" />
		</div>
		<p>v Custom</p>
		<div class="row">
			<Form.Number label="Width" v-model="store.width" />
			<Form.Number label="Height" v-model="store.height" />
			<Form.Text label="Format" v-model="store.format" />
		</div>
		<Form.Button label="Download" v-on:click="saveFractal" />
	</div>
</template>

<style scoped>
div.modal {
	position: fixed;
	display: block;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 450px;
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
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 200px;
	padding: 10px;
	background: #bbb;
	margin: 15px 0;
	overflow: hidden;
}
</style>
