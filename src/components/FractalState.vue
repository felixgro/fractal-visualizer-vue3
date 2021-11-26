<script lang="ts" setup>
import FractalStateHeader from './FractalStateHeader.vue';
</script>

<template>
	<form @submit.prevent>
		<FractalStateHeader />

		<div class="fractal-state">
			<RouterView />
		</div>
	</form>
</template>

<style scoped>
form {
	width: 250px;
	max-height: 420px;
	overflow-y: scroll;
	border: 1px solid #ccc;
	background: #eee;
}

.fractal-state {
	padding: 12px;
	padding-top: 0;
}
</style>
