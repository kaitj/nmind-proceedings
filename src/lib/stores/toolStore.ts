import type { Tool } from '$lib/types';
import { writable } from 'svelte/store';

export const toolStore = writable<Tool[]>([]);