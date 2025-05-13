import { loadSchemas, loadTools } from '$lib/utils';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const tools = await loadTools();
	const schemas = await loadSchemas();
	return { tools, schemas };
};

export const prerender = true;
export const trailingSlash = 'always';
