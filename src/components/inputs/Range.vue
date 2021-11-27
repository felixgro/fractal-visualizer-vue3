<script lang="ts" setup>
import { useUid } from '@/composables/useUid';
import { useKeypad } from '@/composables/useKeypad';
import { ref } from 'vue';

const props = defineProps<{
	modelValue: number;
	label: string;
	min?: number;
	max?: number;
	step?: number;
	warn?: boolean;
}>();

const input = ref<HTMLInputElement>();
const emits = defineEmits(['update:modelValue']);
const { id } = useUid();

const { stringNum } = useKeypad({
	target: input,
	delay: 1000,
	allowFloats: true,
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

// const stringNum = ref<string>('');
// const commaSymbols = ['.', ','];
// let tid: number | null = null;
// const tdelay = 1000;

// const typing = (e: KeyboardEvent) => {
// 	const isComma = commaSymbols.includes(e.key);
// 	const isNumber = !isNaN(parseFloat(e.key));

// 	if (isComma) {
// 		stringNum.value += stringNum.value ? '.' : '0.';
// 	} else if (isNumber) {
// 		stringNum.value += e.key;
// 	}

// 	if (tid) {
// 		clearTimeout(tid);
// 		tid = null;
// 	}

// 	tid = setTimeout(() => {
// 		const num = parseFloat(stringNum.value);
// 		stringNum.value = '';

// 		if (props.warn && props.max && num > props.max) {
// 			const confirmed = window.confirm(
// 				`${props.label} has a defined maximum of ${props.max}. Exceeding this limit could lead to performance issues. Are you sure you want to set ${num} as the new ${props.label} value?`
// 			);
// 			if (!confirmed) return;
// 		}

// 		emits('update:modelValue', num);
// 	}, tdelay);
// };
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
		:min="min || 0"
		:max="max || 100"
		:step="step || 1"
		:value="modelValue"
		@input="handleModelUpdate"
	/>
</template>

<style scoped>
input {
	width: 100%;
}

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
}
</style>
