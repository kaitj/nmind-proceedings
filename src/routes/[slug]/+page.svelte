<script lang="ts">
	import { base } from '$app/paths';
	import EvaluationDetail from '$lib/components/EvaluationDetail.svelte';
	import type { EvaluationSchema, Tool } from '$lib/types.js';
	
	export let data;
	const tool: Tool = data.tool!;
	const schemas: EvaluationSchema[] = data.schemas!;
</script>

<svelte:head>
	<title>{tool?.name ? `${tool?.name} | ` : ''}NMIND</title>
</svelte:head>

<div class="min-w-full flex justify-center mb-8">
	<div class="max-w-prose">
		<div class="flex flex-row items-center justify-evenly">
			<div class="aspect-square object-cover max-h-56 p-4">
				<img
					src={`${base}/tool_icons/${tool?.image}`}
					alt={`Icon for the ${tool?.name} neuroimaging tool`}
				/>
			</div>
			<h1 class="text-4xl lg:text-5xl xl:text-6xl break-words">{tool?.name}</h1>
		</div>

		<h2 class="text-xl lg:text-2xl xl:text-3xl pt-6 pb-2">Links</h2>
		<ul class="mb-6">
			{#each tool?.urls as url (url)}
				<li class="mb-2">
					<a
						href={`${url.url}`}
						target="_blank"
						rel="noopener noreferrer"
						class="underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit"
					>
						{url.url_type}
					</a>
				</li>
			{/each}
		</ul>

		<hr />
		<h2 class="text-xl lg:text-2xl xl:text-3xl pt-6 pb-2">NMIND Evaluation</h2>
		<EvaluationDetail schemas={schemas} tool={tool} />
	</div>
</div>
