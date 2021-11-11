<script lang="ts" setup>
import * as Form from '@/components/form';
import useFractal from '@/composables/useFractal';
import useRandom from '@/composables/useRandom';
import Vec2 from '@/libs/Vec2';

const random = useRandom();

const { draw, config } = useFractal(
	{
		angleDeg: 55,
		angle: 0,
		trunkRatio: 0.5,
		step: 10,
		scale: 0.9,
		random: true,
		seed: 40,
		angleRange: 50,
		lengthRange: 0,
	},
	{
		ignore: ['angle'],
	}
);

draw((pen) => {
	// assigns current seed to pseudo random number generator
	// & resets the prng even if the seed value has not changed.
	random.setSeed(config.seed);
	config.angle = Vec2.degToRad(config.angleDeg);

	// recursive fractal function
	const hFractal = (a: Vec2, b: Vec2, limit: number): void => {
		const diff = b.clone().subtract(a);

		let angle = Vec2.right().angleTo(diff);
		let branchLength = diff.length * (1 - config.trunkRatio);

		if (config.random) {
			angle +=
				random.range(1, true) *
				Vec2.degToRad(config.angleRange);
			branchLength +=
				random.range(1, true) * config.lengthRange;
			if (branchLength <= 0) branchLength = 0.000001;
		}

		const pA = diff.multiply(config.trunkRatio).add(a);

		const pB = Vec2.right()
			.rotate(angle + config.angle)
			.setMagnitude(branchLength)
			.add(pA);

		const pC = Vec2.right()
			.rotate(angle - config.angle)
			.setMagnitude(branchLength)
			.add(pA);

		// draw base branch
		pen.line(a.pos, pA.pos).stroke();

		// recursion limit
		if (limit > 0) {
			hFractal(pA, pC, limit - 1);
			hFractal(pA, pB, limit - 1);
		} else {
			// draw splitted branch and stop recursion
			pen.line(pB.pos, pA.pos, pC.pos).stroke();
		}
	};

	// initial points for first iteration
	const pA = new Vec2(pen.canvas.width / 2, pen.canvas.height);
	const pB = new Vec2(
		pen.canvas.width / 2,
		2 - (1 - pen.canvas.height * (1 - config.scale))
	);

	// start fractal recursion..
	hFractal(pA, pB, config.step);
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
			v-model="config.angleRange"
			:max="360"
		/>
		<Form.Range
			label="Length Variation"
			v-model="config.lengthRange"
			:max="100"
		/>
	</Form.ExpandableCheckbox>
</template>
