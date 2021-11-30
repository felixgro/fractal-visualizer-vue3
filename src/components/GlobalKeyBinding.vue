<script lang="ts" setup>
import { useGlobalKeyStore } from '@/stores/globalKey';
import { useEventListener } from '@/composables/useEventListener';

const increaseKeys = ['ArrowRight', 'ArrowUp'];
const decreaseKeys = ['ArrowLeft', 'ArrowDown'];
const globalKeyStore = useGlobalKeyStore();

useEventListener(document, 'click', (e: PointerEvent) => {
	if (!e.altKey) return;
	const target = e.target as HTMLElement;
	const key = target.dataset.key;
	if (!key) return;

	globalKeyStore.key = key;
});

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
	if (
		globalKeyStore.key === '' ||
		(document.activeElement as HTMLInputElement).value
	)
		return;

	if (increaseKeys.includes(e.key)) {
		globalKeyStore.increment();
	} else if (decreaseKeys.includes(e.key)) {
		globalKeyStore.decrement();
	}
});
</script>

<template>
	<transition name="slide-right">
		<div
			@click="globalKeyStore.reset()"
			v-if="globalKeyStore.key !== ''"
		>
			<span>
				{{ globalKeyStore.key }}
			</span>
			{{ globalKeyStore.value }}
		</div>
	</transition>
</template>

<style scoped>
div {
	position: fixed;
	top: 90px;
	left: 0;
	padding: 14px 20px;
	cursor: pointer;
	background: var(--state-bg);
	border-bottom-right-radius: var(--state-border-radius);
	border-top-right-radius: var(--state-border-radius);
}
span {
	display: block;
}
</style>
