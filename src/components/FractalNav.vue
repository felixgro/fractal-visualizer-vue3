<script lang="ts" setup>
import ToggleDialog from '@/components/ToggleDialog.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.name as string);
const otherRoutes = computed(() =>
	router
		.getRoutes()
		.filter(
			(r) =>
				r.name !== currentRoute.value &&
				r.redirect === undefined
		)
);
</script>

<template>
	<ToggleDialog align="right">
		{{ currentRoute }}

		<template v-slot:dialog>
			<nav>
				<ul>
					<li v-for="fractalRoute in otherRoutes">
						<router-link :to="fractalRoute.path">
							{{ fractalRoute.name }}
						</router-link>
					</li>
				</ul>
			</nav>
		</template>
	</ToggleDialog>
</template>

<style scoped></style>
