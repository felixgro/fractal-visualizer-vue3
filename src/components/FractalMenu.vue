<script lang="ts" setup>
import ToggleDialog from '@/components/ToggleDialog.vue';
import FractalState from '@/components/FractalState.vue';
import ExportModal from './ExportModal.vue';
import { ref } from 'vue';

const exporting = ref(false);
</script>

<template>
	<ToggleDialog
		align="right"
		:initialState="true"
		:stayInDom="true"
	>
		State
		<template v-slot:dialog>
			<FractalState />
		</template>
	</ToggleDialog>
</template>

<style scoped></style>
