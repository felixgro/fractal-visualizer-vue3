<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import useUID from '@/composables/useUid';

const { id } = useUID();

const emits = defineEmits(['update:modelValue']);

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

const emitUpdateEvent = (event: Event) => {
	const value = (event.target as HTMLInputElement).value;
	emits('update:modelValue', parseFloat(value));
};
</script>

<template>
	<label :for="id('range')">{{ label }}</label>
	<input
		type="range"
		:id="id('range')"
		:min="min"
		:max="max"
		:step="step"
		:value="modelValue"
		@input="emitUpdateEvent"
	/>
	<small>{{ modelValue }}</small>
</template>
