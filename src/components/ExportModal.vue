<script lang="ts" setup>
import type * as FRCTL from '@/types/fractal';
import * as Input from '@/components/inputs';
import ExportPresets from './ExportPresets.vue';
import ImageWorker from '@/core/imageWorker.ts?worker';
import { useWorker } from '@/composables/useWorker';
import { useFractalStore } from '@/stores/fractal';
import { useExportStore } from '@/stores/export';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import { downloadBlob } from '@/utils/file';
import { ref, onMounted, onUpdated, watch } from '@vue/runtime-core';
import { debounce } from '@/utils/debounce';
import { useRoute } from 'vue-router';

const props = defineProps<{
	modelValue: boolean;
}>();

const previewImage = ref<HTMLImageElement>();
const route = useRoute();
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
		fractal: route.name as string,
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

// this replaces onMounted hook because component get's pre-mounted event when it is not visible
// props.modelvalue is not set to false when component is pre-mounted or when it gets visually hidden.
// this enables a reuse of previously spawned ImageWorker.
onUpdated(() => {
	if (!props.modelValue || imageWorker.isRunning()) return;
	generatePreviewImage();
});

// debounce when fractal state change to avoid unnecessary image generation
const stateDebounce = {
	timeout: 1000,
	trailing: true,
	leading: false,
};

const stateObserver = debounce(() => {
	if (!props.modelValue) return;
	generatePreviewImage();
}, stateDebounce);

fractalStore.$subscribe(stateObserver);
styleStore.$subscribe(stateObserver);
exportStore.$subscribe(stateObserver);

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
});

const setExportPreset = (d: [number, number] | 'custom') => {
	if (d === 'custom') return;
	exportStore.width = d[0];
	exportStore.height = d[1];
};
</script>

<template>
	<div class="modal">
		<header>
			<h2>Export Fractal</h2>
		</header>
		<div class="preview">
			<img ref="previewImage" />
		</div>
		<form @submit.prevent="downloadImage">
			<ExportPresets @update="setExportPreset" />
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
		<div class="shadow"></div>
	</div>
</template>

<style scoped>
div.modal {
	position: absolute;
	display: block;
	top: 100%;
	z-index: 0;
	width: 100%;
	right: 100%;
	margin-right: calc(var(--state-border-radius) * -1.8);
	top: 0;
	border-radius: var(--state-border-radius);
	background: var(--state-bg);
	overflow: hidden;
}

.shadow {
	position: absolute;
	right: 0;
	top: 0;
	width: 0;
	height: 100%;
	box-shadow: -30px 0 30px 10px rgba(0, 0, 0, 0.2);
	z-index: 100;
}

.dimensions {
	padding-right: calc(var(--state-border-radius) * 1.8);
}

.preview {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	overflow: hidden;
	height: var(--state-preview-height);
	padding: var(--state-preview-padding);
	background: var(--state-preview-bg);
	padding-right: calc(
		var(--state-border-radius) * 1.8 +
			var(--state-preview-padding)
	);
}

select {
	background: none;
	border: none;
	font-weight: bold;
	cursor: pointer;
	margin: 0;
}

header {
	padding: 0 var(--state-padding);
	height: var(--state-header-size);
	display: flex;
	align-items: center;
	background: var(--state-header-bg);
}

form {
	position: relative;
	padding: var(--state-preview-padding) var(--state-padding);
	padding-right: calc(
		var(--state-border-radius) * 1.8 +
			var(--state-preview-padding)
	);
}

button {
	display: block;
	margin: 0 auto;
	margin-top: 5px;
}
</style>
