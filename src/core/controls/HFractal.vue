<script lang="ts" setup>
import drawHandler, { HFractal } from '@/core/algorithms/HFractal';
import { useWindowSize } from '@/composables/useWindowSize';
import { useFractal } from '@/composables/useFractal';
import { useHotkey } from '@/composables/useHotkey';
import * as Input from '@/components/inputs';

const { height } = useWindowSize();

const { state } = useFractal<HFractal>({
	state: {
		step: 4,
		rootLength: height.value * 0.75,
		xShift: 0,
		yShift: 0,
		angleDeg: 15,
		angle: 0,
		trunkRatio: 0.3,
		random: false,
		seed: 40,
		angleVariation: 30,
		lengthVariation: 0,
		gradient: false,
		fromColor: '#0000ff',
		toColor: '#ff0000',
		range: 1,
	},
	ignore: ['angle'],
	drawHandler,
});

useHotkey(['s', 'shift'], () => console.log('hi'));
useHotkey(['q'], () => console.log('swag'));
</script>

<template>
	<Input.Range
		label="Step"
		v-model="state.step"
		:max="10"
		:warn="true"
	/>
	<Input.Range
		label="Root Length"
		v-model="state.rootLength"
		:max="1000"
		:min="10"
		:step="1"
	/>
	<Input.Range
		label="Angle"
		v-model="state.angleDeg"
		:max="360"
		:step="1"
	/>
	<Input.Range
		label="Trunk Ratio"
		v-model="state.trunkRatio"
		:max="1"
		:step="0.01"
	/>
	<Input.Range
		label="X-Shift"
		v-model="state.xShift"
		:max="1"
		:min="-1"
		:step="0.001"
	/>
	<Input.Range
		label="Y-Shift"
		v-model="state.yShift"
		:max="1"
		:min="-1"
		:step="0.001"
	/>
	<Input.CheckboxExtended label="Randomize" v-model="state.random">
		<Input.Number label="Seed" v-model="state.seed" :max="1000" />
		<Input.Range
			label="Angle Variation"
			v-model="state.angleVariation"
			:max="360"
		/>
		<Input.Range
			label="Length Variation"
			v-model="state.lengthVariation"
			:max="1"
			:step="0.001"
		/>
	</Input.CheckboxExtended>
	<Input.CheckboxExtended label="Gradient" v-model="state.gradient">
		<Input.Gradient
			label="Gradient"
			v-model:from="state.fromColor"
			v-model:to="state.toColor"
			v-model:range="state.range"
		/>
	</Input.CheckboxExtended>
</template>
