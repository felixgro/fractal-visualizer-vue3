<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useUid } from '@/composables/useUid';
import { useClickOutside } from '@/composables/useClickOutside';

const props = defineProps<{
	align: 'left' | 'right';
	initialState?: boolean;
	stayInDom?: boolean;
}>();

const { id } = useUid();
const isOpen = ref(props.initialState ?? false);
const alignStyle = computed(() => {
	if (props.align === 'left') {
		return { left: 0 };
	} else {
		return { right: 0 };
	}
});

const btn = ref<HTMLButtonElement>();
const container = ref<HTMLDivElement>();

useClickOutside(
	container,
	(e: Event) => {
		if (!isOpen) return;
		isOpen.value = false;
	},
	{ ignore: [btn] }
);
</script>

<template>
	<div class="toggle-dialog-container">
		<button
			v-on:click="isOpen = !isOpen"
			:id="id('button')"
			ref="btn"
		>
			<slot />
		</button>
		<transition name="slide-down" v-if="stayInDom">
			<div
				v-show="isOpen"
				ref="container"
				class="toggle-dialog"
				:style="alignStyle"
				:aria-hidden="!isOpen"
				:aria-labelledby="id('button')"
			>
				<slot name="dialog" />
			</div>
		</transition>
		<transition name="fade" v-else>
			<div
				v-if="isOpen"
				ref="container"
				class="toggle-dialog"
				:style="alignStyle"
				:aria-labelledby="id('button')"
			>
				<slot name="dialog" />
			</div>
		</transition>
	</div>
</template>

<style scoped>
.toggle-dialog-container {
	position: relative;
}

.toggle-dialog {
	position: absolute;
	margin-top: 15px;
}
</style>
