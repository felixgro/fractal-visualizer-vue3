<script lang="ts" setup>
import MainHeader from '@/components/MainHeader.vue';
import FractalRenderer from '@/components/FractalRenderer.vue';
import GlobalKeyBinding from './GlobalKeyBinding.vue';
import DebugInformation from './DebugInformation.vue';
import { useStyleStore } from '@/stores/style';
import { watch } from 'vue';

const style = useStyleStore();

watch(
	() => style.isDark,
	(isDark) => document.body.classList.toggle('dark', isDark)
);
</script>

<template>
	<MainHeader />
	<FractalRenderer />

	<footer>
		<div>
			<DebugInformation />
			<GlobalKeyBinding />
		</div>
	</footer>
</template>

<style>
@import '@/assets/styles/main.css';
footer {
	position: fixed;
	display: flex;
	width: 100%;
	padding: 20px;
	left: 0;
	align-items: center;
	justify-content: space-between;
	bottom: 0;
}
</style>
