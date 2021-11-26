<script lang="ts" setup>
import { ref, onMounted, onUpdated } from '@vue/runtime-core';
import { throwIf } from '@/utils/error';
import { useUid } from '@/composables/useUid';

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

onUpdated(() => {
	colorizeSvg();
});

const emitInputEvent = (e: Event) => {
	emits('update:modelValue', (e.target as HTMLInputElement).value);
	colorizeSvg();
};
</script>

<template>
	<div>
		<label :for="id('color')">
			<slot />
		</label>
		<input
			type="color"
			:id="id('color')"
			:value="modelValue"
			@input="emitInputEvent"
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
	width: 100%;
	height: 100%;
	opacity: 0;
	border: none;
}
</style>
