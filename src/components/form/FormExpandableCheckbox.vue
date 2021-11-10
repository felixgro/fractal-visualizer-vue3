<template>
	<label>
		<input
			type="checkbox"
			:checked="modelValue"
			@change="emitUpdateEvent"
		/>
		{{ label }}
	</label>
	<div v-if="modelValue">
		<slot />
	</div>
</template>

<script lang="ts" setup>
import useUid from '@/composables/useUid';

const { uid } = useUid();

const emits = defineEmits(['update:modelValue']);

defineProps({
	modelValue: {
		required: true,
		type: Boolean,
	},
	label: {
		required: true,
		type: String,
	},
});

const emitUpdateEvent = (e: Event) => {
	const value = (e.target as HTMLInputElement).checked;
	emits('update:modelValue', value);
};
</script>
