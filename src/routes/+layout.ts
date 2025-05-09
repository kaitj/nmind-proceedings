import { loadSchemas, loadTools } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async() => {
    const tools = await loadTools();
    const schemas = await loadSchemas();
    return { tools, schemas };
}

export const prerender = true;
export const trailingSlash = 'always';