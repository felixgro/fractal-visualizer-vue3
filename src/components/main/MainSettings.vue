<script lang="ts" setup>
import type { FractalStyles } from '@/composables/useFractal';
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import useEmitter from '@/composables/useEmitter';
import * as Form from '@/components/form';

const show = ref(true);
const emitter = useEmitter();
const styles = reactive<FractalStyles>({
	bg: '#ffffff',
	fg: '#000000',
	lw: 0.5,
});

const SpaceBarEvent = (e: KeyboardEvent) => {
	if (e.code === 'Space') show.value = !show.value;
};

onMounted(() => {
	window.addEventListener('keydown', SpaceBarEvent);
});

onUnmounted(() => {
	window.removeEventListener('keydown', SpaceBarEvent);
});

watch(styles, (newStyles) => {
	emitter.emit('fractal:style', newStyles);
	emitter.emit('fractal:render');
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
