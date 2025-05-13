<script lang="ts">
	import PaginatedTools from '$lib/components/PaginatedTools.svelte';

	export let data;
	const { tools, schemas } = data;
</script>

<svelte:head>
	<title>Evaluated Tools | NMIND</title>
</svelte:head>

<PaginatedTools {tools} {schemas} />
