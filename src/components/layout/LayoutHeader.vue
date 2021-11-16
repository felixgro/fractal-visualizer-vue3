<script lang="ts" setup>
import MainLogo from '@/components/main/MainLogo.vue';
import { inject } from 'vue';

const state = inject('state') as any;
</script>

<template>
	<header>
		<MainLogo />
		{{ state.state.width }}
	</header>
</template>
