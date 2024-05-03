<script lang="ts">
	import EvaluationDetail from '$lib/components/EvaluationDetail.svelte';
	import { sortEvaluationsByDate } from '$lib/utils';
	import type { Tool, Evaluation } from '$lib/types';
	import { base } from '$app/paths';

	export let data: Tool;

	let sortedEvaluations = sortEvaluationsByDate(data?.evaluations ? data.evaluations : []);
	let [mostRecentEvaluation, ...priorEvaluations] = sortedEvaluations;
	let selectedOption: Evaluation[] = [];
</script>

<svelte:head>
	<title>{data?.name ? `${data?.name} | ` : ''}NMIND</title>
</svelte:head>

<div class="min-w-full flex justify-center mb-8">
	<div class="max-w-prose">
		<div class="flex flex-row items-center justify-evenly">
			<div class="aspect-square object-cover max-h-56 p-4">
				<img
					src={`${base}/tool_icons/${data?.image}`}
					alt={`Icon for the ${data?.name} neuroimaging tool`}
				/>
			</div>
			<h1 class="text-4xl lg:text-5xl xl:text-6xl break-words">{data?.name}</h1>
		</div>

		<p class="pt-6">{data?.description}</p>

		{#if data?.tags?.length > 0}
			<h2 class="text-xl lg:text-2xl xl:text-3xl pt-6 pb-4">Tags</h2>
			<div class="flex flex-row flex-wrap gap-4">
				{#each data?.tags as tag (tag)}
					<div class="badge badge-primary badge-outline hyphens-none">{tag}</div>
				{/each}
			</div>
		{/if}

		<h2 class="text-xl lg:text-2xl xl:text-3xl pt-6 pb-2">Links</h2>
		<ul class="mb-6">
			{#each data?.urls as url (url)}
				<li class="mb-2">
					<a
						href={`${url.href}`}
						target="_blank"
						rel="noopener noreferrer"
						class="underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit"
					>
						{url.text}
					</a>
				</li>
			{/each}
		</ul>

		{#if sortedEvaluations?.length > 0}
			<hr />
			<h2 class="text-xl lg:text-2xl xl:text-3xl pt-6 pb-2">NMIND Evaluation</h2>
			<EvaluationDetail evaluation={mostRecentEvaluation} />
			{#each priorEvaluations as evaluation (evaluation)}
				<div class="collapse collapse-arrow">
					<input type="checkbox" name="my-accordion-2" bind:group={selectedOption} />
					<div class="collapse-title text-xl font-medium bg-base-300">
						Prior Evaluation: {evaluation.date}
					</div>
					<div class="collapse-content bg-base-200">
						<div class="mt-6">
							<EvaluationDetail {evaluation} />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
