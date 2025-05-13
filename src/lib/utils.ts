import { checklistSections, checklistTiers, complianceColors, sortingKeys } from '$lib/constants';
import type { ChecklistSection, EvaluationSchema, Tool, Url } from '$lib/types';
import tippy, { type Props } from 'tippy.js';

function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^\w\s]/gi, '')
		.replace(/ /g, '-');
}

export async function loadTools(): Promise<Tool[]> {
	const checklists = import.meta.glob('$lib/data/evaluatedTools/*.json', { eager: true });

	return Object.values(checklists).map((module: any) => {
		const tool = module.default as Tool;
		return {
			...tool,
			slug: generateSlug(tool.name)
		};
	});
}

export async function loadSchemas(): Promise<EvaluationSchema[]> {
	const schemaJsons = import.meta.glob('$lib/data/evaluationSchemas/*.json', { eager: true });

	return Object.values(schemaJsons).map((module: any) => module.default as EvaluationSchema);
}

export async function filterToolData(
	tools: Tool[],
	textQuery: string,
	sectionTierQuery: string[]
): Promise<Tool[]> {
	let filteredTools = tools;
	if (sectionTierQuery.length > 0) {
		filteredTools = sectionTierQuery.reduce((result, sectionTier) => {
			const [section, tier] = sectionTier.split('-');

			return result.filter((tool) => {
				const sectionData = tool[section as keyof Tool];
				if (!sectionData || typeof sectionData !== 'object') return false;

				const tierData = (sectionData as Record<string, any>)[tier];
				if (!tierData || typeof tierData !== 'object') return false;

				return Object.values(tierData).every(Boolean);
			});
		}, filteredTools);
	}

	if (textQuery) {
		filteredTools = filteredTools.filter((tool) =>
			tool.name.toLowerCase().includes(textQuery.toLowerCase())
		);
	}

	return filteredTools;
}

export function sortFilteredData(filteredTools: Tool[], sortQuery: string): Tool[] {
	const sorters: Record<string, (a: Tool, b: Tool) => number> = {
		[sortingKeys[0]]: (a, b) => a.name.localeCompare(b.name),
		[sortingKeys[1]]: (a, b) => b.date.localeCompare(a.date)
	};

	const sorter = sorters[sortQuery];

	if (!sorter) {
		console.warn(`Unknown or unimplemented sort option: "${sortQuery}"`);
		return filteredTools;
	}

	return [...filteredTools].sort(sorter);
}

export function getToolUrlByTextDescriptor(tool: Tool, urlType: string): Url | null {
	return tool.urls.find((entry) => entry.url_type === urlType) ?? null;
}

export function findEvaluationSchemaByVersion(
	arr: EvaluationSchema[],
	version: number
): EvaluationSchema | null {
	return arr.find((item) => item['@context']['@version'] === version) ?? null;
}

export function getSectionTierPrompt(
	schema: EvaluationSchema,
	id: string,
	section: string,
	tier: string
) {
	const matchingItem = schema.items.find(
		(item) => item.id === id && item.section === section && item.tier === tier
	);
	return matchingItem ? matchingItem.prompt : null;
}

export function getCompletionFractionFromSectionTier(sectionTier: Record<string, boolean>) {
	const sectionTierMatrix = Object.entries(sectionTier);
	const positiveCount = sectionTierMatrix.filter(([, value]) => value).length;
	return { numerator: positiveCount, denominator: sectionTierMatrix.length };
}

export function mungeChecklistSectionTier(
	evaluationSchemas: EvaluationSchema[],
	tool: Tool,
	section: string,
	tier: string,
	schemaVersion: number
) {
	const mungedData = [];
	const matchingSchema = findEvaluationSchemaByVersion(evaluationSchemas, schemaVersion);

	if (matchingSchema) {
		const sectionTier = (tool[section as keyof Tool] as ChecklistSection)[
			tier as keyof ChecklistSection
		];
		for (const [itemId, itemValue] of Object.entries(sectionTier)) {
			const prompt = getSectionTierPrompt(matchingSchema, itemId, section, tier);

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

export function getOverallCompletionRatio(tool: Tool): number {
	const allItems = checklistSections.flatMap((section) =>
		checklistTiers.flatMap((tier) => Object.values(tool[section]?.[tier] ?? {}))
	);

	const completed = allItems.filter(Boolean).length;
	return allItems.length ? completed / allItems.length : 0;
	('');
}

export function getComplianceColor(ratio: number): string {
	if (ratio === 0) {
		return complianceColors.grey;
	} else if (ratio <= 0.25) {
		return complianceColors.red;
	} else if (ratio <= 0.5) {
		return complianceColors.orange;
	} else if (ratio <= 0.75) {
		return complianceColors.yellow;
	} else {
		return complianceColors.green;
	}
}

export function tooltip(node: HTMLElement, params: Partial<Props>) {
	const content = params.content || node.title || node.getAttribute('aria-label') || '';

	// Ensure accessibility
	if (!node.getAttribute('aria-label')) {
		node.setAttribute('aria-label', content as string);
	}

	// Prevent native title tooltip
	node.removeAttribute('title');

	// Initialize Tippy
	const instance = tippy(node, { ...params, content });

	return {
		update(newParams: Props) {
			const newContent = newParams.content || node.getAttribute('aria-label') || content;
			instance.setProps({ ...newParams, content: newContent });
		},
		destroy() {
			instance.destroy();
		}
	};
}
