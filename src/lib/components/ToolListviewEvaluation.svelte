<script lang="ts">
	import { checklistSections, checklistTiers, shieldColors } from '$lib/constants';
	import type { EvaluationSchema, Tool } from '$lib/types';
	import { getCompletionFractionFromSectionTier, mungeChecklistSectionTier } from '$lib/utils';
	import EvaluationShieldIcon from './EvaluationShieldIcon.svelte';

	export let tool: Tool;
    export let schemas: EvaluationSchema[];
</script>

<div class="flex flex-row flex-grow flex-wrap justify-center">
	{#each checklistSections as section}
		<div class="h-20 w-56 pr-6 flex">
			{#each checklistTiers as tier}
				<EvaluationShieldIcon
					fillColor={shieldColors[tier]}
					sectionTierCompletionFraction={getCompletionFractionFromSectionTier(
						tool[section][tier]
					)}
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
</div>