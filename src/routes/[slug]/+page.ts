import type { Tool } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, params }) => {
	const { tools, schemas } = data;

	const tool = tools.find((t: Tool) => t.slug === params.slug);
	if (!tool) {
		return { status: 404 };
	}

	return { tool, schemas };
};
