<script lang="ts" setup>
import dimensions from '@/assets/data/device-dimensions.json';
import { useUid } from '@/composables/useUid';
import { ref } from 'vue';

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

// TODO: change to custom if client changes dimensions manually
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

<style scoped>
select {
	margin: 10px;
}
</style>
