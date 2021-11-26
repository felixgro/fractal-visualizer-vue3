<script lang="ts" setup>
import { useUid } from '@/composables/useUid';

defineProps<{
	modelValue: boolean;
	label: string;
}>();

const emits = defineEmits(['update:modelValue']);
const { id } = useUid();

const handleModelUpdate = (event: Event) => {
	const value = (event.target as HTMLInputElement).checked;
	emits('update:modelValue', value);
};
</script>

<template>
	<label :for="id('checkbox')">
		<input
			type="checkbox"
			:id="id('checkbox')"
			:checked="modelValue"
			@change="handleModelUpdate"
		/>

		{{ label }}
	</label>
</template>
