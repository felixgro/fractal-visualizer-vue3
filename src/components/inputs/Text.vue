<script lang="ts" setup>
import { useUid } from '@/composables/useUid';

defineProps<{
	label: string;
	modelValue: string;
}>();

const emits = defineEmits(['update:modelValue']);
const { id } = useUid();
const handleModelUpdate = (e: Event) => {
	const value = (e.target as HTMLInputElement).value;
	emits('update:modelValue', value);
};
</script>

<template>
	<label :for="id('text')">{{ label }}</label>
	<input
		type="text"
		:id="id('text')"
		:value="modelValue"
		@input="handleModelUpdate"
	/>
</template>
