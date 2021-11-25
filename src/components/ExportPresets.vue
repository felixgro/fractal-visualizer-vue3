<script lang="ts" setup>
import { ref } from 'vue';
import useUid from '@/composables/useUid';
import dimensions from '@/assets/data/device-dimensions.json';
import { useExportStore } from '@/stores/export';

const exportStore = useExportStore();
const emits = defineEmits(['update']);
const { id } = useUid();
const value = ref('custom');
const devices = ref(
	Object.entries(dimensions).map(([name, size]) => {
		return {
			name,
			size,
		};
	})
);

const emitChangeEvent = () => {
	emits('update', value.value);
};

// exportStore.$subscribe((s) => {
// 	console.log(s);
// 	if (value.value === 'custom') return;
// 	value.value = 'custom';
// });
</script>

<template>
	<select
		:id="id('select')"
		v-model="value"
		@change="emitChangeEvent"
	>
		<option value="custom">Custom</option>
		<option
			v-for="device of devices"
			:key="device.name"
			:value="device.size"
		>
			{{ device.name }}
		</option>
	</select>
</template>
