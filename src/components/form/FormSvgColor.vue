<script lang="ts" setup>
import { ref, onMounted } from '@vue/runtime-core';
import { throwIf } from '@/utils/error';
import useUid from '@/composables/useUid';

const props = defineProps<{
	label: string;
	modelValue: string;
	colorSelector: string;
}>();

const colorables = ref<NodeListOf<SVGElement>>();
const emits = defineEmits(['update:modelValue']);
const { id } = useUid();

const colorizeSvg = () => {
	if (!colorables.value) return;
	colorables.value.forEach((svg) => {
		svg.style.fill = props.modelValue;
	});
};

onMounted(() => {
	const svgElement = document.querySelector<SVGElement>(
		`label[for='${id('color')}'] svg`
	);

	throwIf(!svgElement, 'SVG element not found');

	colorables.value = svgElement!.querySelectorAll(
		props.colorSelector
	);

	colorizeSvg();
});

const emitInputEvent = (e: Event) => {
	colorizeSvg();
	emits('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
	<label :for="id('color')">
		<slot />
	</label>
	<input
		type="color"
		:id="id('color')"
		:value="modelValue"
		@input="emitInputEvent"
	/>
</template>

<style scoped>
label {
	cursor: pointer;
}
input {
	width: 0;
	height: 0;
	padding: 0;
	margin: 0;
	border: none;
}
</style>
