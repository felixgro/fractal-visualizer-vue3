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
	<div>
		{{ globalKeyStore.key || 'no key set' }}
		{{ globalKeyStore.value }}
	</div>
</template>
