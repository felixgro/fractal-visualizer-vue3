<script lang="ts" setup>
import MainHeader from '@/components/MainHeader.vue';
import FractalRenderer from '@/components/FractalRenderer.vue';
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
</template>

<style>
@import '@/assets/styles/main.css';
</style>
