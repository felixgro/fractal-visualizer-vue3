<script lang="ts" setup>
import useUid from '@/composables/useUid';

const { id } = useUid();

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

<template>
	<label :for="id('checkbox')">
		<input
			type="checkbox"
			:id="id('checkbox')"
			:checked="modelValue"
			@change="emitUpdateEvent"
		/>
		{{ label }}
	</label>
	<div v-if="modelValue">
		<slot />
	</div>
</template>
