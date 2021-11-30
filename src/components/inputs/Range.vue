<script lang="ts" setup>
import { useUid } from '@/composables/useUid';
import { useKeypad } from '@/composables/useKeypad';
import { isFloat } from '@/utils/math';
import { ref } from 'vue';

const props = defineProps<{
	modelValue: number;
	label: string;
	min?: number;
	max?: number;
	step?: number;
	warn?: boolean;
	keyy?: string;
}>();

const input = ref<HTMLInputElement>();
const emits = defineEmits(['update:modelValue']);
const { id } = useUid();

const { stringNum } = useKeypad({
	target: input,
	delay: 1000,
	allowFloats: props.step ? isFloat(props.step) : false,
	handler: (num: number) => {
		if (props.warn && props.max && num > props.max) {
			const confirmed = window.confirm(
				`${props.label} has a defined maximum of ${props.max}. Exceeding this limit could lead to performance issues. Are you sure you want to set ${num} as the new ${props.label} value?`
			);
			if (!confirmed) return;
		}

		emits('update:modelValue', num);
	},
});

const handleModelUpdate = (e: Event) => {
	const value = (e.target as HTMLInputElement).value;
	emits('update:modelValue', parseFloat(value));
};
</script>

<template>
	<label :for="id('range')">
		<span>{{ label }}</span>
		<div>
			<small v-if="stringNum">({{ stringNum }})</small>
			{{ modelValue }}
		</div>
	</label>
	<input
		ref="input"
		type="range"
		:id="id('range')"
		:min="min"
		:max="max"
		:step="step"
		:value="modelValue"
		@input="handleModelUpdate"
		:data-key="label.toLowerCase()"
	/>
</template>

<style scoped>
label {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

label > div {
	display: flex;
	align-items: center;
}

label > div > small {
	margin-right: 0.5rem;
	font-size: 0.75rem;
}

/* Reset default Range styles */
input[type='range'] {
	-webkit-appearance: none;
	background: transparent;
	width: 100%;
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
}

/* Range Styles */
input[type='range'] {
	--range-thumb-width: 14px;
	--range-thumb-height: 26px;
	--range-thumb-border: 1px solid #ccc;
	--range-thumb-border-radius: 3px;
	--range-thumb-bg: #fff;

	--range-track-bg: #ccc;
	--range-track-bg-focus: #ddd;
	--range-track-height: 4px;
	--range-track-border: 1px solid #ccc;
	--range-track-border-radius: 0;
}

/** THUMB */
/* Special styling for WebKit/Blink */
input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: var(--range-thumb-border);
	height: var(--range-thumb-height);
	width: var(--range-thumb-width);
	border-radius: var(--range-thumb-border-radius);
	background: var(--range-thumb-bg);
	cursor: pointer;
	transform: translateY(
		calc(
			var(--range-thumb-height) * -0.5 +
				var(--range-track-height) * 0.5
		)
	);
}

/* All the same stuff for Firefox */
input[type='range']::-moz-range-thumb {
	border: var(--range-thumb-border);
	height: var(--range-thumb-height);
	width: var(--range-thumb-width);
	border-radius: var(--range-thumb-border-radius);
	background: var(--range-thumb-bg);
	cursor: pointer;
}

/** TRACK */
input[type='range']::-webkit-slider-runnable-track {
	border-radius: var(--range-track-border-radius);
	height: var(--range-track-height);
	background: var(--range-track-bg);
	cursor: pointer;
	width: 100%;
}

input[type='range']:focus::-webkit-slider-runnable-track {
	background: var(--range-track-bg-focus);
}

input[type='range']::-moz-range-track {
	border-radius: var(--range-track-border-radius);
	height: var(--range-track-height);
	background: var(--range-track-bg);
	cursor: pointer;
	width: 100%;
}
</style>
