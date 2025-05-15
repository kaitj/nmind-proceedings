import { loadSchemas, loadTools } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const tools = await loadTools();
	const schemas = await loadSchemas();

	// Return the tool and schemas
	return { tools, schemas };
};

/**
 * Generate list of routes for SvelteKit to prerender.
 *
 * @returns An array of objects, each containing a `slug` property corresponding
 *          to a tool's unique identifier. Example: [{ slug: 'my-tool' }, ...]
 */
export async function entries() {
	const tools = await loadTools();

	return tools.map((tool) => ({ slug: tool.slug }));
}
