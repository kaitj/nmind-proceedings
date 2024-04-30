<script lang="ts">
	import { toolURLTextDescriptors } from '$lib/constants';
	import { getMostRecentEvaluation, getToolUrlByTextDescriptor } from '$lib/utils';
	import type { Tool, Evaluation } from '$lib/types';

	import ToolListviewEvaluation from './ToolListviewEvaluation.svelte';
	import { base } from '$app/paths';

	export let tool: Tool;
	export let setMetadataQuery: (event: MouseEvent) => void;

	let mostRecentEvaluation: Evaluation | null = getMostRecentEvaluation(tool.evaluations);
	let docsUrl = getToolUrlByTextDescriptor(tool, toolURLTextDescriptors.DOCS);
</script>

<div class="p-4">
	<a href={`${base}/${tool.slug}/`}>
		<div
			class="card-wrapper w-full flex flex-col justify-center lg:flex-row lg:justify-between items-center bg-base-100 shadow-xl"
		>
			<!-- Tool Icon && Details -->
			<div
				class="w-full lg:max-w-1/4 xl:max-w-1/3 2xl:max-w-1/2 flex flex-row justify-center items-center"
			>
				<div class="aspect-square object-cover h-32 p-4">
					{#if docsUrl}
						<a href={`https://www.${docsUrl.href}`} target="_blank" rel="noopener noreferrer">
							<img
								src={`${base}/tool_icons/${tool.image}`}
								alt={`The icon of the ${tool.name} neuroimaging tool`}
							/>
						</a>
					{:else}
						<div class="tooltip" data-tip="No online documentation available">
							<img
								src={`${base}/tool_icons/${tool.image}`}
								alt={`The icon of the ${tool.name} neuroimaging tool`}
							/>
						</div>
					{/if}
				</div>

				<div class="w-full max-w-2/3 p-4">
					<h2 class="text-lg font-semibold break-words">{tool.name}</h2>

					{#if tool?.urls?.length > 0}
						<div class="truncate pb-2">
							<a
								href={`${tool.urls[0].href}/`}
								target="_blank"
								rel="noopener noreferrer"
								class="underline text-sky-500 hover:text-sky-700 decoration-sky-500 hover:decoration-sky-700"
								>{tool.urls[0].href}</a
							>
						</div>
					{/if}

					<p class="text-sm pb-1">Evaluated on {mostRecentEvaluation?.date}</p>
					<p class="text-sm pb-1">Evaluated using Checklist v{mostRecentEvaluation?.toolVersion}</p>

					{#if tool.tags?.length > 0}
						<div class="flex flex-row flex-wrap gap-4 pt-2">
							{#each tool.tags as tag (tag)}
								<button
									type="button"
									class="btn btn-outline btn-primary btn-xs"
									on:click={setMetadataQuery}>{tag}</button
								>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Most-Recent Evaluation -->
			{#if mostRecentEvaluation}
				<ToolListviewEvaluation
					checklist={mostRecentEvaluation.checklist}
					schemaVersion={Number(mostRecentEvaluation.checklistVersion)}
				/>
			{:else}
				<div class="w-full text-center">
					<p>
						This tool has not been evaluated yet! To help do so, <a
							href="/"
							class="underline text-sky-500 hover:text-sky-700 decoration-sky-500 hover:decoration-sky-700"
							>click here</a
						>
					</p>
				</div>
			{/if}
		</div>
	</a>
</div>

<style>
	.card-wrapper:hover,
	.card-wrapper:focus {
		transform: scale(1.05);
		box-shadow:
			rgba(0, 0, 0, 0.2) 0px 25px 30px -5px,
			rgba(0, 0, 0, 0.15) 0px 10px 12px -6px;
		border-color: rgb(90, 92, 106);
	}
</style>
