<script lang="ts" setup>
import useUID from '@/composables/useUid';
const { uid } = useUID();

const emits = defineEmits(['update:modelValue']);

defineProps({
	modelValue: {
		required: true,
		type: String,
	},
	label: {
		type: String,
		required: true,
	},
});

const emitUpdateEvent = (event: Event) => {
	const value = (event.target as HTMLInputElement).value;
	emits('update:modelValue', value);
};
</script>

<template>
	<label :for="uid">{{ label }}</label>
	<input type="color" :id="uid" @input="emitUpdateEvent" />
</template>
