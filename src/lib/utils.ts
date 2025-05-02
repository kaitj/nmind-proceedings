import { sortingKeys } from '$lib/constants';
import tippy from 'tippy.js';
import type { Props } from 'tippy.js/index.d.ts';
import type { Evaluation, EvaluationSchema, Tool } from './types';

import data from '$lib/data/concat_data.json';

export function sortEvaluationsByDate(arr: Evaluation[]) {
	return arr.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

export function getMostRecentEvaluation(evaluations: Evaluation[]): Evaluation | null {
	if (evaluations.length === 0) {
		return null;
	} else if (evaluations.length === 1) {
		return evaluations[0];
	} else {
		return evaluations.reduce((mostRecentEvaluationSoFar, currentEvaluation) => {
			// If there is no most recent evaluation so far, then the current evaluation is the most recent
			// NB: can't use optional chaining (?.) because `date` is a non-numerically-coalescable string,
			// which will silently return `false` for comparison-operators against `null` or `undefined`
			//  #WeLoveJavascript
			if (!mostRecentEvaluationSoFar || mostRecentEvaluationSoFar.date < currentEvaluation.date) {
				return currentEvaluation;
			} else {
				return mostRecentEvaluationSoFar;
			}
		});
	}
}

export function getCompletionFractionFromSectionTier(sectionTier: Record<string, boolean>) {
	const sectionTierMatrix = Object.entries(sectionTier);
	const positiveCount = sectionTierMatrix.filter(([, value]) => value).length;
	return { numerator: positiveCount, denominator: sectionTierMatrix.length };
}

export function getSectionTierPromptById(schema: EvaluationSchema, id: string) {
	const matchingItem = schema.items.find((item) => item.id === id);
	return matchingItem ? matchingItem.prompt : null;
}

export function mungeChecklistSectionTier(
	sectionTier: Record<string, boolean>,
	schemaVersion: number
) {
	const mungedData = [];
	const matchingSchema = findEvaluationSchemaByVersion(data.evaluationSchemas, schemaVersion);

	if (matchingSchema) {
		for (const [itemId, itemValue] of Object.entries(sectionTier)) {
			const prompt = getSectionTierPromptById(matchingSchema, itemId);

			if (prompt) {
				mungedData.push({
					prompt,
					value: itemValue
				});
			}
		}
	} else {
		throw new Error('No matching schema found!');
	}

	return mungedData;
}

export function findEvaluationSchemaByVersion(arr: EvaluationSchema[], version: number) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore - TS doesn't like the string-bracket-lookups here, but it works fine
	return arr.find((item) => item['@context']['@version'] === version) ?? null;
}

export function getToolUrlByTextDescriptor(tool: Tool, urlText: string) {
	return tool.urls.find((url: Record<string, string>) => url.text === urlText) ?? null;
}

function filterTagsByExactQueryMatchesOnly(tools: Tool[], tagQueries: string[]) {
	tagQueries.map((tagQuery) => {
		tools = tools.filter((item) =>
			item.tags.some((tag) => tag.toLowerCase() === tagQuery.toLowerCase())
		);
	});

	return tools;
}

function filterTagsWithFinalQueryInclusiveMatching(tools: Tool[], tagQueries: string[]) {
	const exactMatchQueries = tagQueries.slice(0, -1);
	const inclusiveMatchQuery = tagQueries[tagQueries.length - 1];

	// first filter by exact matches on all known-to-be-complete tags
	exactMatchQueries.map((tagQuery) => {
		tools = tools.filter((item) =>
			item.tags.some((tag) => tag.toLowerCase() === tagQuery.toLowerCase())
		);
	});

	// then filter by inclusive match on final tag, in case the user isn't done typing
	tools = tools.filter((item) =>
		item.tags.some((tag) => tag.toLowerCase().includes(inclusiveMatchQuery.toLowerCase()))
	);

	return tools;
}

export async function filterToolData(
	textQuery: string,
	sectionTierQuery: string[]
) {
	let ongoingFilteredTools = data.evaluatedTools;
	let tagFilterFunction = filterTagsWithFinalQueryInclusiveMatching;

	// first filter by sectionTier completion
	if (sectionTierQuery.length) {
		sectionTierQuery.map((completedSectionTier) => {
			const [completedSection, completedTier] = completedSectionTier.split('-');

			ongoingFilteredTools = ongoingFilteredTools.filter((tool) => {
				const mostRecentEvaluation = getMostRecentEvaluation(tool.evaluations);
				const currentSectionTierItems =
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore - TS doesn't like the string-bracket-lookups here, but it works fine
					mostRecentEvaluation.checklist[completedSection][completedTier];
				return Object.values(currentSectionTierItems).every((item) => item);
			});
		});
	}

	// then filter by name
	if (textQuery) {
		ongoingFilteredTools = ongoingFilteredTools.filter(
			(item) =>
				item.name.toLowerCase().includes(textQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(textQuery.toLowerCase())
		);
	}

	return ongoingFilteredTools;
}

export function sortFilteredData(filteredTools: Tool[], sortQuery: string) {
	if (sortQuery === sortingKeys[0]) {
		return filteredTools.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sortQuery === sortingKeys[1]) {
		return filteredTools.sort((a, b) => {
			// get most-recent evaluation for each tool
			const aLatestEvaluation = a.evaluations.sort((e1, e2) => e2.date.localeCompare(e1.date))[0];
			const bLatestEvaluation = b.evaluations.sort((e1, e2) => e2.date.localeCompare(e1.date))[0];

			// compare the dates of the most-recent evaluations
			return bLatestEvaluation.date.localeCompare(aLatestEvaluation.date);
		});
	} else {
		// @todo: ask NMIND team if we want to add other sort-by options
		return filteredTools;
	}
}

// Stolen with no apologies from
// https://dev.to/danawoodman/svelte-quick-tip-using-actions-to-integrate-with-javascript-libraries-tippy-tooltips-2m94
export function tooltip(node: HTMLElement, params: { content?: string; allowHTML?: boolean }) {
	// Determine the title to show
	const custom = params.content;
	const title = node.title;
	const label = node.getAttribute('aria-label');
	const finalContent = custom || title || label || '';

	// Ensure the "aria-label" attribute is set:
	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute
	if (!label) node.setAttribute('aria-label', finalContent);

	// Clear out the HTML title attribute; we don't want the default behavior showing up on hover.
	node.title = '';

	// Support any of the Tippy props by forwarding all "params":
	// https://atomiks.github.io/tippyjs/v6/all-props/
	const tip = tippy(node, { ...params, content: finalContent });

	return {
		// If the props change, update the Tippy instance:
		update: (newParams: Props) => tip.setProps({ ...newParams, content: finalContent }),

		// Clean up the Tippy instance on unmount:
		destroy: () => tip.destroy()
	};
}
