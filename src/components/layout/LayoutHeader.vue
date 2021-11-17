<script lang="ts" setup>
import MainLogo from '@/components/main/MainLogo.vue';
import FractalNav from '@/components/FractalNav.vue';
import FractalMenu from '@/components/FractalMenu.vue';
</script>

<template>
	<header>
		<MainLogo />

		<div class="right">
			<FractalNav />
			<FractalMenu />
		</div>
	</header>
</template>

<style scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #ccc;
}

header .right {
	display: flex;
	align-items: center;
}

header .right > * {
	margin-left: 1em;
}
</style>
