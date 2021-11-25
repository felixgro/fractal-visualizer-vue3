<script lang="ts" setup>
import type * as FRCTL from '@/types/fractal';
import ExportPresets from './ExportPresets.vue';
import * as Form from '@/components/form';
import { ref, onMounted } from '@vue/runtime-core';
import ImageWorker from '@/core/imageWorker?worker';
import useWorker from '@/composables/useWorker';
import { useFractalStore } from '@/stores/fractal';
import { useExportStore } from '@/stores/export';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import { downloadBlob } from '@/utils/file';

const previewImage = ref<HTMLImageElement>();
const fractalStore = useFractalStore();
const styleStore = useStyleStore();
const exportStore = useExportStore();
const imageWorker = useWorker(ImageWorker, {
	terminateAfter: 15000,
});

imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
	if (!previewImage.value) return;
	// TODO: better error handling for worker tasks
	if (image.error) throw new Error(image.error);
	previewImage.value!.src = URL.createObjectURL(image.blob);
});

const generatePreviewImage = () => {
	const imageData: FRCTL.ExportMessage = {
		fractal: 'hfractal',
		state: { ...fractalStore.$state },
		export: { ...exportStore.$state },
		styles: { ...styleStore.$state },
	};

	imageWorker.post(imageData);
};

const downloadImage = () => {
	fetch(previewImage.value!.src)
		.then((res) => res.blob())
		.then((blob) => {
			downloadBlob(blob, `fractal.${exportStore.extension}`);
		});
};

exportStore.$subscribe(() => {
	generatePreviewImage();
});

onMounted(() => {
	throwIf(!previewImage.value, 'Cannot find PreviewImage Element');
	previewImage.value!.onload = () => {
		const conBcr = previewImage.value!.parentElement!.getBoundingClientRect();
		const imgBcr = previewImage.value!.getBoundingClientRect();

		if (
			imgBcr.height >= conBcr.height ||
			imgBcr.height >= imgBcr.width
		) {
			previewImage.value!.style.height = '100%';
			previewImage.value!.style.width = 'auto';
		} else {
			previewImage.value!.style.width = '100%';
			previewImage.value!.style.height = 'auto';
		}
	};

	generatePreviewImage();
});

const updateDimensions = (d: [number, number] | 'custom') => {
	if (d === 'custom') return;
	exportStore.width = d[0];
	exportStore.height = d[1];
};
</script>

<template>
	<div class="modal">
		<h1>Export Config</h1>
		<div class="preview">
			<img ref="previewImage" />
		</div>
		<ExportPresets @update="updateDimensions" />
		<div class="row">
			<Form.Number
				label="Width"
				:max="10000"
				v-model="exportStore.width"
			/>
			<Form.Number
				label="Height"
				:max="10000"
				v-model="exportStore.height"
			/>
			<Form.Text label="Format" v-model="exportStore.format" />
		</div>
		<Form.Button label="Download" v-on:click="downloadImage" />
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
