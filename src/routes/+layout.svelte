<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { schemaStore, toolStore } from '$lib/stores';
	import type { EvaluationSchema, Tool } from '$lib/types';

	import { onMount } from 'svelte';

	export let data: { tools: Tool[], schemas: EvaluationSchema[] };
	onMount(() => {
		toolStore.set(data.tools);
		schemaStore.set(data.schemas);
	})
	
	import 'tippy.js/dist/tippy.css';
	import '../app.css';
</script>

<div>
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>
