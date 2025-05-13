import { loadSchemas, loadTools } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const tools = await loadTools();
	const schemas = await loadSchemas();

	// Return the tool and schemas
	return { tools, schemas };
};
