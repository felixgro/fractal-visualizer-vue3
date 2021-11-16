<script lang="ts" setup>
import type * as FRCTL from '@/types/fractal';
import {
	ref,
	reactive,
	watch,
	onMounted,
	onUnmounted,
	inject,
} from 'vue';
import useEmitter from '@/composables/useEmitter';
import * as Form from '@/components/form';

const show = ref(true);
const emitter = useEmitter();

const state = inject('state') as any;

// TODO: move styles to global storage
const styles = reactive<FRCTL.Styles>({
	bg: '#ffffff',
	fg: '#000000',
	lw: 0.5,
});

const SpaceBarEvent = (e: KeyboardEvent) => {
	if (e.code === 'Space') show.value = !show.value;
};

onMounted(() => {
	// TODO: remove this testing code!
	setInterval(() => {
		state.methods.setDimensions(
			500 * Math.random(),
			500 * Math.random()
		);
	}, 1000);
	window.addEventListener('keydown', SpaceBarEvent);
});

onUnmounted(() => {
	window.removeEventListener('keydown', SpaceBarEvent);
});

watch(styles, (newStyles) => {
	emitter.emit('fractal:style', newStyles);
});

const emitSaveEvent = () => {
	emitter.emit('fractal:save');
};
</script>

<template>
	<form
		@submit.prevent
		style="width: 160px; background: #ccc"
		v-show="show"
	>
		<Form.Button label="Save" @click="emitSaveEvent" />
		<Form.Color label="BG" v-model="styles.bg" />
		<Form.Color label="FG" v-model="styles.fg" />
		<Form.Number label="LW" v-model="styles.lw" :step="0.1" />

		<RouterView />
	</form>
</template>
