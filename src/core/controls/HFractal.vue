<script lang="ts" setup>
import * as Form from '@/components/form';
import useFractal from '@/composables/useFractal';
import drawHandler, { HFractal } from '@/core/algorithms/HFractal';
import { onMounted } from '@vue/runtime-core';

onMounted(() => {
	window.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.code === 'KeyS' && e.shiftKey) return state.seed--;
		if (e.code === 'KeyS') state.seed++;
	});
});

const { state } = useFractal<HFractal>({
	state: {
		step: 4,
		scale: 0.7,
		angleDeg: 15,
		angle: 0,
		trunkRatio: 0.3,
		random: false,
		seed: 40,
		angleVariation: 0,
		lengthVariation: 0,
		gradient: false,
		fromColor: '#0000ff',
		toColor: '#ff0000',
		range: 1,
	},
	drawHandler,
	ignore: ['angle'],
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
	<Form.Range
		label="Trunk Ratio"
		v-model="state.trunkRatio"
		:max="1"
		:step="0.01"
	/>
	<Form.ExpandableCheckbox label="Randomize" v-model="state.random">
		<Form.Number label="Seed" v-model="state.seed" :max="1000" />
		<Form.Range
			label="Angle Variation"
			v-model="state.angleVariation"
			:max="360"
		/>
		<Form.Range
			label="Length Variation"
			v-model="state.lengthVariation"
			:max="100"
		/>
	</Form.ExpandableCheckbox>
	<Form.ExpandableCheckbox
		label="Gradient"
		v-model="state.gradient"
	>
		<Form.Color label="FROM" v-model="state.fromColor" />
		<Form.Color label="TO" v-model="state.toColor" />
		<Form.Range
			label="Range"
			v-model="state.range"
			:min="0.1"
			:max="1"
			:step="0.1"
		/>
	</Form.ExpandableCheckbox>
</template>
