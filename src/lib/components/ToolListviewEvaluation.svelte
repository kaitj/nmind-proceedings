<script lang="ts">
	import { checklistSections, checklistTiers, shieldColors } from '$lib/constants';
	import type { EvaluationSchema, Tool } from '$lib/types';
	import {
		getCompletionFractionFromSectionTier,
		getComplianceColor,
		getOverallCompletionRatio,
		mungeChecklistSectionTier
	} from '$lib/utils';
	import EvaluationShieldIcon from './EvaluationShieldIcon.svelte';

	export let tool: Tool;
	export let schemas: EvaluationSchema[];

	const completionRatio = getOverallCompletionRatio(tool);
	const complianceColor = getComplianceColor(completionRatio);
</script>

<div class="flex flex-row flex-grow flex-wrap justify-center">
	{#each checklistSections as section}
		<div class="h-20 w-56 pr-6 flex">
			{#each checklistTiers as tier}
				<EvaluationShieldIcon
					fillColor={shieldColors[tier]}
					sectionTierCompletionFraction={getCompletionFractionFromSectionTier(tool[section][tier])}
					sectionTierCompletionEvidence={mungeChecklistSectionTier(
						schemas,
						tool,
						section,
						tier,
						Number(tool.checklistVersion)
					)}
				/>
			{/each}
		</div>
	{/each}
	<div
		class="compliance-bar h-2 w-full lg:h-auto lg:w-2"
		style="background-color: {complianceColor};"
	></div>
</div>
