import type { EvaluationSchema, Tool } from '$lib/types';
import { writable } from 'svelte/store';

export const toolStore = writable<Tool[]>([]);
export const schemaStore = writable<EvaluationSchema[]>([]);
