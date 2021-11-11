<script lang="ts" setup>
import * as Form from '@/components/form';
import useFractal from '@/composables/useFractal';
import drawHandler, { HFractal } from '@/core/algorithms/HFractal';

const { config } = useFractal<HFractal>({
	config: {
		step: 5,
		scale: 0.5,
		angleDeg: 90,
		angle: 0,
		trunkRatio: 0.5,
		random: true,
		seed: 40,
		angleVariation: 0,
		lengthVariation: 0,
	},
	drawHandler,
	ignore: ['angle'],
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
	<Form.Range
		label="Trunk Ratio"
		v-model="config.trunkRatio"
		:max="1"
		:step="0.01"
	/>
	<Form.ExpandableCheckbox
		label="Randomize"
		v-model="config.random"
	>
		<Form.Number label="Seed" v-model="config.seed" :max="1000" />
		<Form.Range
			label="Angle Variation"
			v-model="config.angleVariation"
			:max="360"
		/>
		<Form.Range
			label="Length Variation"
			v-model="config.lengthVariation"
			:max="100"
		/>
	</Form.ExpandableCheckbox>
</template>
