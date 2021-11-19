<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ExportModal from '@/components/ExportModal.vue';
import useImageState from '@/composables/useImageState';
import useEmitter from '@/composables/useEmitter';
import * as Form from '@/components/form';

const show = ref(true);
const emitter = useEmitter();
const imageState = useImageState();

const SpaceBarEvent = (e: KeyboardEvent) => {
	if (e.code === 'Space') show.value = !show.value;
};

onMounted(() => {
	window.addEventListener('keydown', SpaceBarEvent);
});

onUnmounted(() => {
	window.removeEventListener('keydown', SpaceBarEvent);
});

const handleImageSave = () => {
	console.log('hii');
	emitter.emit('fractal:export');
};
</script>

<template>
	<form
		@submit.prevent
		style="width: 160px; background: #ccc"
		v-show="show"
	>
		<Form.Button label="Save" v-on:click="handleImageSave" />
		<Form.Color label="BG" v-model="imageState.styles.bg" />
		<Form.Color label="FG" v-model="imageState.styles.fg" />
		<Form.Number
			label="LW"
			v-model="imageState.styles.lw"
			:step="0.1"
		/>

		<RouterView />
	</form>
</template>
