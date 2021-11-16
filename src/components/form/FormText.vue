<script lang="ts" setup>
import useUid from '@/composables/useUid';

const { id } = useUid();

const emits = defineEmits(['update:modelValue']);

defineProps({
	label: {
		type: String,
		required: true,
	},
	modelValue: {
		type: String,
		required: true,
	},
});

const emitUpdateEvent = (e: Event) => {
	emits('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
	<label :for="id('text')">{{ label }}</label>
	<input
		type="text"
		:id="id('text')"
		:value="modelValue"
		@change="emitUpdateEvent"
	/>
</template>
