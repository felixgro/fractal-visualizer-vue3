<template>
	<button>{{ label }}</button>
</template>

<script lang="ts" setup>
defineProps({
	label: {
		type: String,
		required: true,
	},
});
</script>
