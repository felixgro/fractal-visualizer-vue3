<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import * as Input from '@/components/inputs';
import { useFractal } from '@/composables/useFractal';
import drawHandler, { HFractal } from '@/core/algorithms/HFractal';

const { state } = useFractal<HFractal>({
	state: {
		step: 4,
		scale: 0.7,
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

onMounted(() => {
	window.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.code === 'KeyS' && e.shiftKey) return state.seed--;
		if (e.code === 'KeyS') state.seed++;
	});
});
</script>

<template>
	<Input.Range label="Step" v-model="state.step" :max="15" />
	<Input.Range
		label="Scale"
		v-model="state.scale"
		:max="3"
		:step="0.01"
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
		<!-- <Input.Color label="FROM" v-model="state.fromColor">
		</Input.Color>
		<Input.Color label="TO" v-model="state.toColor" />
		<Input.Range
			label="Range"
			v-model="state.range"
			:min="0.1"
			:max="1"
			:step="0.1"
		/> -->
	</Input.CheckboxExtended>
</template>
