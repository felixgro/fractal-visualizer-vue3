<script lang="ts" setup>
import * as Form from '@/components/form';
import useFractal from '@/composables/useFractal';
import drawHandler, {
	PyTree,
} from '@/core/algorithms/PythagorasTree';

const { config } = useFractal<PyTree>({
	config: {
		step: 5,
		scale: 0.5,
		angleDeg: 90,
		angle: 0,
	},
	ignore: ['angle'],
	drawHandler,
});
</script>

<template>
	<Form.Range label="Step" v-model="config.step" :max="15" />
	<Form.Range
		label="Scale"
		v-model="config.scale"
		:max="1"
		:step="0.01"
	/>
	<Form.Range
		label="Angle"
		v-model="config.angleDeg"
		:max="360"
		:step="1"
	/>
</template>
