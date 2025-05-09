<script lang="ts">
    import { base } from '$app/paths';
    import { toolURLTextDescriptors } from '$lib/constants';
    import type { EvaluationSchema, Tool } from '$lib/types';
    import { getComplianceColor, getOverallCompletionRatio, getToolUrlByTextDescriptor } from '$lib/utils';

    import ToolListviewEvaluation from './ToolListviewEvaluation.svelte';

	export let tool: Tool;
    export let schemas: EvaluationSchema[];

    let docsUrl = getToolUrlByTextDescriptor(tool, toolURLTextDescriptors.DOCS);

	const completionRatio = getOverallCompletionRatio(tool);
	const complianceColor = getComplianceColor(completionRatio);
</script>

<div class="p-4">
	<a href={`${base}/${tool.slug}/`}>
		<div
			class="card-wrapper w-full flex flex-col justify-center lg:flex-row lg:justify-between items-center bg-base-100 shadow-xl"
		>
			<!-- Tool Icon & Details -->
			<div
				class="w-full lg:max-w-1/4 xl:max-w-1/3 2xl:max-w-1/2 flex flex-row justify-center items-center"
			>
				<div class="aspect-square object-cover h-32 p-4">
					{#if docsUrl}
						<a href={`${docsUrl.url}`} target="_blank" rel="noopener noreferrer">
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
								href={`${tool.urls[0].url}/`}
								target="_blank"
								rel="noopener noreferrer"
								class="underline text-sky-500 hover:text-sky-700 decoration-sky-500 hover:decoration-sky-700"
								>{tool.urls[0].url}</a
							>
						</div>
					{/if}

					<p class="text-sm pb-1">Evaluated on {tool.date}</p>
					<p class="text-sm pb-1">Evaluated using Checklist v{tool.checklistVersion}</p>
                </div>
            </div>

            <ToolListviewEvaluation tool={tool} schemas={schemas}/>
			<div class="compliance-bar p-1 h-32" style="background-color: {complianceColor};"></div>
        </div>
    </a>
</div>

<style>
	.card-wrapper:hover,
	.card-wrapper:focus {
		transform: scale(1.05);
		box-shadow: rgba(0, 0, 0, 0.2) 0px 25px 30px -5px, rgba(0, 0, 0, 0.15) 0px 10px 12px -6px;
		border-color: rgb(90, 92, 106);
	}
</style>