<script lang="ts" setup>
const emits = defineEmits(['click']);
</script>

<template>
	<button @click="emits('click')">
		<slot />
	</button>
</template>
