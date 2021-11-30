<script lang="ts" setup>
import { ref, useSlots, onMounted } from 'vue';
import { useUid } from '@/composables/useUid';

defineProps<{
	modelValue: number;
	label: string;
	max?: number;
	min?: number;
	step?: number;
}>();

const { id } = useUid();
const slots = useSlots();
const emits = defineEmits(['update:modelValue']);
const showLabel = ref(false);

const emitUpdateEvent = (e: Event) => {
	emits(
		'update:modelValue',
		parseFloat((e.target as HTMLInputElement).value)
	);
};

onMounted(() => {
	if (!slots.default) showLabel.value = true;
});
</script>

<template>
	<label :aria-label="label" :for="id('number')">
		<span v-if="showLabel">{{ label }}</span>
		<slot />
	</label>
	<input
		type="number"
		:value="modelValue"
		:max="max || 100"
		:min="min || 0"
		:step="step || 1"
		:id="id('number')"
		@input="emitUpdateEvent"
		:data-key="label.toLowerCase()"
	/>
</template>

<style scoped>
input {
	width: 65px;
}
</style>
