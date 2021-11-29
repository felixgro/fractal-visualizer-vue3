<script lang="ts" setup>
import FractalStateHeader from './FractalStateHeader.vue';
import ExportModal from '@/components/ExportModal.vue';
import { ref } from 'vue';

const exporting = ref(false);
</script>

<template>
	<form @submit.prevent>
		<transition name="slide-left">
			<ExportModal v-show="exporting" v-model="exporting" />
		</transition>

		<FractalStateHeader @toggleExport="exporting = !exporting" />

		<div class="fractal-state hide-scrollbar">
			<RouterView />
		</div>
	</form>
</template>

<style scoped>
form {
	display: block;
	position: relative;
	width: 280px;
	border-radius: var(--state-border-radius);
	color: var(--txt);
	transition: var(--color-transition);
}

.fractal-state {
	position: relative;
	max-height: 520px;
	padding: 20px;
	z-index: 10;
	background: var(--state-bg);
	overflow: hidden;
	overflow-y: scroll;
	border-bottom-left-radius: var(--state-border-radius);
	border-bottom-right-radius: var(--state-border-radius);
}
</style>
