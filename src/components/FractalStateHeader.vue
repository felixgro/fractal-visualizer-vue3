<script lang="ts" setup>
import * as Input from '@/components/inputs';
import ExportModal from '@/components/ExportModal.vue';
import { useStyleStore } from '@/stores/style';
import { ref } from 'vue';

const styles = useStyleStore();
const exporting = ref(false);
</script>

<template>
	<header>
		<div class="styles">
			<Input.Color
				label="background color"
				v-model="styles.bg"
				colorSelector="rect"
			>
				<svg
					width="28"
					height="28"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="20"
						y="10"
						width="60"
						height="80"
						fill="black"
					></rect>
				</svg>
			</Input.Color>
			<Input.Color
				label="FG"
				v-model="styles.fg"
				colorSelector="circle"
			>
				<svg
					width="28"
					height="28"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="50"
						cy="50"
						r="30"
						fill="black"
					></circle>
				</svg>
			</Input.Color>
			<Input.Number label="stroke width" v-model="styles.lw">
				<svg
					width="28"
					height="28"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<line
						x1="50"
						y1="30"
						x2="50"
						y2="90"
						stroke="black"
						stroke-width="10"
					/>
				</svg>
			</Input.Number>
		</div>
		<Input.Button @click="exporting = !exporting">
			EXP
		</Input.Button>
	</header>

	<ExportModal v-if="exporting" />
</template>

<style scoped>
header {
	position: sticky;
	top: 0;
	padding: 6px;
	background: #eee;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.styles {
	display: flex;
	align-items: center;
}

legend {
	opacity: 0;
}
</style>
