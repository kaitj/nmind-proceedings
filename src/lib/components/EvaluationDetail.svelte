<script lang="ts">
	import EvaluationItem from '$lib/components/EvaluationItem.svelte';
	import { checklistSections, checklistTiers } from '$lib/constants';
	import type { EvaluationSchema, Tool } from '$lib/types';
	import { mungeChecklistSectionTier } from '$lib/utils';

	export let tool: Tool;
	export let schemas: EvaluationSchema[];
</script>

<dl class="flex justify-start pb-1">
	<dt>Checklist Version:</dt>
	<dd class="pl-2">{tool.checklistVersion}</dd>
</dl>

<dl class="flex justify-start pb-1">
	<dt>Evaluator(s):</dt>
	<dd class="pl-2">
		{#if tool.evaluators && tool.evaluators.length > 0}
			{@html tool.evaluators
				.map((evaluator) =>
					evaluator.contact
						? `<a href="${evaluator.contact}" target="_blank" class="text-blue-600 hover:underline">${evaluator.name}</a>`
						: evaluator.name
				)
				.join(', ')}
		{/if}
	</dd>
</dl>

<dl class="flex justify-start pb-1">
	<dt>Date:</dt>
	<dd class="pl-2">{tool.date}</dd>
</dl>

<dl class="flex justify-start pb-1">
	{#if tool.history}
		<dt>
			<a href={tool.history} target="_blank" class="text-blue-600 hover:underline"
				>Click here for history</a
			>
		</dt>
	{:else}
		<dt>History:</dt>
		<dd class="pl-2">Migrated from the old format - history is unavailable</dd>
	{/if}
</dl>

{#each checklistSections as section}
	<div class="mt-6 py-3">
		<h3 class="text-lg lg:text-xl xl:text-2xl">
			{section.charAt(0).toUpperCase() + section.slice(1)}
		</h3>
		{#each checklistTiers as tier}
			<h4 class="font-semibold mt-6">{tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</h4>
			{#each mungeChecklistSectionTier(schemas, tool, section, tier, Number(tool.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
				<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
			{/each}
		{/each}
	</div>
{/each}
