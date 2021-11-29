<script lang="ts" setup>
import * as Input from '@/components/inputs';
import { useFractal } from '@/composables/useFractal';
import drawHandler, {
	PyTree,
} from '@/core/algorithms/PythagorasTree';

const { state } = useFractal<PyTree>({
	state: {
		step: 5,
		scale: 0.5,
		angleDeg: 0,
		angle: 0,
	},
	ignore: ['angle'],
	drawHandler,
});
</script>

<template>
	<Input.Range label="Step" v-model="state.step" :max="15" />
	<Input.Range
		label="Scale"
		v-model="state.scale"
		:max="1"
		:step="0.01"
	/>
	<Input.Range
		label="Angle"
		v-model="state.angleDeg"
		:max="90"
		:step="1"
	/>
</template>
