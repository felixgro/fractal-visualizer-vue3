<script lang="ts" setup>
import * as Form from '@/components/form';
import FormSvgColor from '@/components/Form/FormSVGColor.vue';
import ExportModal from '@/components/ExportModal.vue';
import useImageState from '@/composables/useImageState';
import FractalColorIcon from '@/components/icons/FractalColorIcon.vue';
import FractalBackgroundIcon from './icons/FractalBackgroundIcon.vue';

const imageState = useImageState();

const handleImageExport = () => {};
</script>

<template>
	<form @submit.prevent>
		<div class="fr">
			<FormSvgColor
				label="FG"
				v-model="imageState.styles.fg"
				colorSelector="rect"
			>
				<FractalColorIcon />
			</FormSvgColor>

			<button @click="handleImageExport">EXP</button>
		</div>
		<div class="r">
			<Form.Color label="BG" v-model="imageState.styles.bg" />
			<Form.Number
				label="LW"
				v-model="imageState.styles.lw"
				:step="0.1"
			/>

			<RouterView />
		</div>
	</form>
</template>

<style scoped>
form {
	width: 250px;
	max-height: 560px;
	overflow-y: scroll;
	border: 1px solid #ccc;
	background: #eee;
}
.fr {
	display: flex;
	position: sticky;
	top: 0;
	background: #eee;
	padding: 12px;
	gap: 2px;
}

.fr input,
.fr button {
	height: 30px;
	width: auto;
}

.r {
	padding: 12px;
	padding-top: 0;
}

.ci input {
	opacity: 0;
	height: 0;
}

.ci label {
	height: 100%;
	display: flex;
	background: green;
}
</style>
