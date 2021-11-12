<script lang="ts" setup>
import type { FractalStyles } from '@/composables/useFractal';
import useEmitter from '@/composables/useEmitter';
import * as Form from '@/components/form';
import { reactive, watch } from 'vue';

const emitter = useEmitter();

const styles = reactive<FractalStyles>({
	bg: '#ffffff',
	fg: '#000000',
	lw: 3,
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
	<form @submit.prevent>
		<Form.Button label="Save" @click="emitSaveEvent" />
		<Form.Color label="BG" v-model="styles.bg" />
		<Form.Color label="FG" v-model="styles.fg" />
		<Form.Number label="LW" v-model="styles.lw" :step="0.1" />

		<RouterView />
	</form>
</template>
