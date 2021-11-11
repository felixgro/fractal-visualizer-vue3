<template>
	<label :for="id('number')">{{ label }}</label>
	<input
		type="number"
		:id="id('number')"
		:max="max"
		:min="min"
		:step="step"
		:value="modelValue"
		@input="emitUpdateEvent"
	/>
</template>

<script lang="ts" setup>
import useUid from '@/composables/useUid';

const { id } = useUid();

const emits = defineEmits(['update:modelValue']);

defineProps({
	modelValue: {
		type: Number,
		required: true,
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

const emitUpdateEvent = (e: Event) => {
	const value = (e.target as HTMLInputElement).value;
	emits('update:modelValue', parseFloat(value));
};
</script>
