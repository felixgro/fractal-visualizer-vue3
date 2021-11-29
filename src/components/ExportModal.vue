<script lang="ts" setup>
import type * as FRCTL from '@/types/fractal';
import * as Input from '@/components/inputs';
import ExportPresets from './ExportPresets.vue';
import ImageWorker from '@/core/imageWorker?worker';
import { useWorker } from '@/composables/useWorker';
import { useFractalStore } from '@/stores/fractal';
import { useExportStore } from '@/stores/export';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import { downloadBlob } from '@/utils/file';
import { ref, onMounted } from '@vue/runtime-core';

const previewImage = ref<HTMLImageElement>();

const fractalStore = useFractalStore();
const styleStore = useStyleStore();
const exportStore = useExportStore();

const imageWorker = useWorker(ImageWorker, {
	terminateAfter: 15000,
});

imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
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

const setExportPreset = (d: [number, number] | 'custom') => {
	if (d === 'custom') return;
	exportStore.width = d[0];
	exportStore.height = d[1];
};
</script>

<template>
	<div class="modal">
		<div class="preview">
			<img ref="previewImage" />
		</div>
		<ExportPresets @update="setExportPreset" />
		<form @submit.prevent="downloadImage">
			<div class="dimensions">
				<Input.Number
					label="Width"
					:max="10000"
					v-model="exportStore.width"
				/>
				<Input.Number
					label="Height"
					:max="10000"
					v-model="exportStore.height"
				/>
			</div>
			<Input.Button label="Download">
				Save as
				<select v-model="exportStore.format" @click.prevent>
					<option value="image/png">PNG</option>
					<option value="image/jpeg">JPEG</option>
					<option value="image/jpg">JPG</option>
					<option value="image/webp">WEBP</option>
				</select>
			</Input.Button>
		</form>
	</div>
</template>

<style scoped>
div.modal {
	position: absolute;
	display: block;
	top: 100%;
	width: 100%;
	left: 0;
	background: #ccc;
	border-bottom-left-radius: var(--state-border-radius);
	border-bottom-right-radius: var(--state-border-radius);
}

.dimensions {
	display: flex;
	padding: 15px;
}

button {
	display: block;
	margin-top: 10px;
	width: 100%;
	border: 0;
	height: 40px;
	background: #aaa;
	border-radius: var(--state-border-radius);
}

.preview {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 120px;
	padding: 10px;
	background: #bbb;
	overflow: hidden;
}

select {
	background: none;
	border: none;
	font-weight: bold;
	cursor: pointer;
}
</style>
