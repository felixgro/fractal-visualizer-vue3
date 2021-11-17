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
		<Form.Color label="BG" v-model="imageState.styles.bg" />
		<Form.Color label="FG" v-model="imageState.styles.fg" />
		<Form.Number
			label="LW"
			v-model="imageState.styles.lw"
			:step="0.1"
		/>

		<RouterView />
	</form>
</template>

<style scoped>
form {
	width: 250px;
	border: 1px solid #ccc;
	background: #eee;
}
.fr {
	display: flex;
	gap: 2px;
}

.fr input,
.fr button {
	height: 30px;
	width: auto;
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
