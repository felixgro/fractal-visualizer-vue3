<script lang="ts" setup>
import { ref, computed } from 'vue';
import useUid from '@/composables/useUid';

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
</script>

<template>
	<div class="toggle-dialog-container">
		<button v-on:click="isOpen = !isOpen" :id="id('button')">
			<slot />
		</button>
		<transition name="fade" v-if="stayInDom">
			<div
				v-show="isOpen"
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
