<script lang="ts">
	import EvaluationItem from '$lib/components/EvaluationItem.svelte';
	import type { Evaluation } from '$lib/types';
	import { mungeChecklistSectionTier } from '$lib/utils';

	export let evaluation: Evaluation;
</script>

<dl class="flex justify-start pb-1">
	<dt>Checklist Version:</dt>
	<dd class="pl-2">{evaluation.checklistVersion}</dd>
</dl>

<dl class="flex justify-start pb-1">
	<dt>Evaluator:</dt>
	<dd class="pl-2">{evaluation.evaluatorEmail}</dd>
</dl>

<dl class="flex justify-start pb-1">
	<dt>Date:</dt>
	<dd class="pl-2">{evaluation.date}</dd>
</dl>

<div class="mt-6 py-3">
	<h3 class="text-lg lg:text-xl xl:text-2xl">Testing</h3>
	<h4 class="font-semibold mt-6">Bronze Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.testing.bronze, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Silver Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.testing.silver, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Gold Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.testing.gold, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}

	<h3 class="text-lg lg:text-xl xl:text-2xl mt-12">Infrastructure</h3>
	<h4 class="font-semibold mt-6">Bronze Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.infrastructure.bronze, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Silver Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.infrastructure.silver, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Gold Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.infrastructure.gold, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}

	<h3 class="text-lg lg:text-xl xl:text-2xl mt-12">Documentation</h3>
	<h4 class="font-semibold mt-6">Bronze Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.documentation.bronze, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Silver Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.documentation.silver, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
	<h4 class="font-semibold mt-8">Gold Tier</h4>
	{#each mungeChecklistSectionTier(evaluation.checklist.documentation.gold, Number(evaluation.checklistVersion)) as evaluationItem (evaluationItem.prompt)}
		<EvaluationItem prompt={evaluationItem.prompt} value={evaluationItem.value} />
	{/each}
</div>
