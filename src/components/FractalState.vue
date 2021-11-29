<script lang="ts" setup>
import FractalStateHeader from './FractalStateHeader.vue';
</script>

<template>
	<form @submit.prevent>
		<FractalStateHeader />

		<div class="fractal-state hide-scrollbar">
			<RouterView />
		</div>
	</form>
</template>

<style scoped>
form {
	width: 280px;
	border-radius: var(--state-border-radius);
	overflow: hidden;
	color: var(--dialog-txt);
	background: var(--dialog-bg);
	transition: var(--color-transition);
}

.fractal-state {
	max-height: 620px;
	padding: 20px;
	overflow-y: scroll;
}
</style>
