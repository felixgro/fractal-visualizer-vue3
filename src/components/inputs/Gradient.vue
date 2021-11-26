<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue';
import Color from '@/components/inputs/Color.vue';

const props = defineProps<{
	label: string;
	from: string;
	to: string;
	range: number;
}>();

const emits = defineEmits([
	'update:from',
	'update:to',
	'update:range',
]);

const state = reactive({
	from: '#000000',
	to: '#ffffff',
	range: 1,
});

onMounted(() => {
	state.from = props.from;
	state.to = props.to;
	state.range = props.range;
});

watch(
	() => state.from,
	(c) => emits('update:from', c)
);

watch(
	() => state.to,
	(c) => emits('update:to', c)
);

watch(
	() => state.range,
	(c) => emits('update:range', c)
);
</script>

<template>
	<Color label="from" v-model="state.from" colorSelector="circle">
		<svg
			width="28"
			height="28"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="50" cy="50" r="30" fill="black"></circle>
		</svg>
	</Color>
	<Color label="to" v-model="state.to" colorSelector="circle">
		<svg
			width="28"
			height="28"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="50" cy="50" r="30" fill="black"></circle>
		</svg>
	</Color>
</template>
