import { loadTools } from '$lib/utils';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    const tools = await loadTools();
    return { tools };
}

export const prerender = true;
export const trailingSlash = 'always';
