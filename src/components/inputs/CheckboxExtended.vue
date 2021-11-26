<script lang="ts" setup>
import Checkbox from '@/components/inputs/Checkbox.vue';
import { useHeightTransition } from '@/composables/useHeightTransition';
import { useUid } from '@/composables/useUid';
import { ref, onMounted, watch } from 'vue';

const { id } = useUid();
const isOpen = ref(false);
const emits = defineEmits(['update:modelValue']);
const transition = useHeightTransition();

const props = defineProps({
	modelValue: {
		required: true,
		type: Boolean,
	},
	label: {
		required: true,
		type: String,
	},
});

onMounted(() => {
	if (props.modelValue) isOpen.value = true;
});

watch(isOpen, (val) => {
	emits('update:modelValue', val);
});
</script>

<template>
	<Checkbox :label="label" v-model="isOpen" />
	<transition
		name="expand"
		@enter="transition.enter"
		@after-enter="transition.afterEnter"
		@leave="transition.leave"
	>
		<div v-show="isOpen" :aria-hidden="!isOpen">
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
