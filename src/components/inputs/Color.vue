<script lang="ts" setup>
import { ref, onMounted, onUpdated } from '@vue/runtime-core';
import { throwIf } from '@/utils/error';
import { useUid } from '@/composables/useUid';

const props = defineProps<{
	label: string;
	modelValue: string;
	colorSelector: string;
}>();

const input = ref<HTMLInputElement>();
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

onUpdated(colorizeSvg);

const handleModelUpdate = (e: Event) => {
	const value = (e.target as HTMLInputElement).value;
	emits('update:modelValue', value);
	colorizeSvg();
};

const handleKeyboardClick = (e: KeyboardEvent) => {
	if (e.key !== 'Enter') return;
	input.value!.click();
};
</script>

<template>
	<div>
		<label
			:for="id('color')"
			tabindex="0"
			@keyup="handleKeyboardClick"
		>
			<slot />
		</label>
		<input
			ref="input"
			type="color"
			tabindex="-1"
			:id="id('color')"
			:value="modelValue"
			@input="handleModelUpdate"
		/>
	</div>
</template>

<style scoped>
div {
	position: relative;
}

label {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

input {
	position: absolute;
	inset: 0;
	opacity: 0;
	width: 100%;
	height: 100%;
	border: none;
}
</style>
