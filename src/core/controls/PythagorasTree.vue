<script lang="ts" setup>
import * as Form from '@/components/form';
import useFractal from '@/core/useFractal';
import drawHandler, {
	PyTree,
} from '@/core/algorithms/PythagorasTree';

const { state } = useFractal<PyTree>({
	state: {
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
	<Form.Range label="Step" v-model="state.step" :max="15" />
	<Form.Range
		label="Scale"
		v-model="state.scale"
		:max="1"
		:step="0.01"
	/>
	<Form.Range
		label="Angle"
		v-model="state.angleDeg"
		:max="360"
		:step="1"
	/>
</template>
