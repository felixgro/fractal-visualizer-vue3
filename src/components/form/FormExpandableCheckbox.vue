<script lang="ts" setup>
import useHeightTransition from '@/composables/useHeightTransition';
import useUid from '@/composables/useUid';

const { id } = useUid();
const emits = defineEmits(['update:modelValue']);
const transition = useHeightTransition();

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
	<transition
		name="expand"
		@enter="transition.enter"
		@after-enter="transition.afterEnter"
		@leave="transition.leave"
	>
		<div v-show="modelValue" :aria-hidden="!modelValue">
			<slot />
		</div>
	</transition>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
	transition: height 160ms ease-in-out;
	overflow: hidden;
}

.expand-enter,
.expand-leave-to {
	height: 0;
}
</style>
