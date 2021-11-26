<script lang="ts" setup>
import { useUid } from '@/composables/useUid';
import { ref } from '@vue/reactivity';

defineProps({
	modelValue: {
		required: true,
		type: Number,
	},
	label: {
		type: String,
		required: true,
	},
	min: {
		type: Number,
		default: 0,
	},
	max: {
		type: Number,
		default: 100,
	},
	step: {
		type: Number,
		default: 1,
	},
});

const emits = defineEmits(['update:modelValue']);
const { id } = useUid();

const handleModelUpdate = (event: Event) => {
	const value = (event.target as HTMLInputElement).value;
	emits('update:modelValue', parseFloat(value));
};

// TODO: exclude logic to composable
const num = ref<string>('');
const tid = ref<number | null>(null);

const typing = (e: KeyboardEvent) => {
	const commaSymbols = ['.', ','];
	const isComma = commaSymbols.includes(e.key);
	const isNumber = !isNaN(parseFloat(e.key));
	if (isComma) {
		num.value += '.';
	} else if (isNumber) {
		num.value += e.key;
	}

	if (tid.value) {
		clearTimeout(tid.value);
		tid.value = null;
	}

	tid.value = setTimeout(() => {
		emits('update:modelValue', parseFloat(num.value));
		num.value = '';
	}, 1000);
};
</script>

<template>
	<label :for="id('range')">
		<span>{{ label }}</span>
		<div>
			<small v-if="num">({{ num }})</small>
			{{ modelValue }}
		</div>
	</label>
	<input
		type="range"
		:id="id('range')"
		:min="min"
		:max="max"
		:step="step"
		:value="modelValue"
		@input="handleModelUpdate"
		v-on:keypress="typing"
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
