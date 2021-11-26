<script lang="ts" setup>
import * as Input from '@/components/inputs';
import { useFractal } from '@/composables/useFractal';
import drawHandler, {
	SierpinskiTriangle,
} from '@/core/algorithms/SierpinskiTriangle';

const { state } = useFractal<SierpinskiTriangle>({
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
		:max="360"
		:step="1"
	/>
</template>
