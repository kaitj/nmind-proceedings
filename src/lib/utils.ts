import { sortingKeys } from '$lib/constants';
import type { Tool, Url } from '$lib/types';

function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^\w\s]/gi, '')
		.replace(/ /g, '-');
}


export async function loadTools(): Promise<Tool[]> {
	const checklists = import.meta.glob('$lib/data/evaluatedTools/*.json', { eager: true });

	const tools: Tool[] = [];

	for (const path in checklists) {
		const tool = checklists[path] as Tool;
		const slug = generateSlug(tool.name)
		tools.push({ ...tool, slug });
	}

	return tools;
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
  

export function getToolUrlByTextDescriptor(
	tool: Tool,
	urlType: string
  ): Url | null {
	return tool.urls.find((entry) => entry.url_type === urlType) ?? null;
  }