import type { Tool } from '$lib/types';

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