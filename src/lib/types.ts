import type { checklistSections, checklistTiers } from '$lib/constants';

export interface Entry {
	checklistVersion?: string;
	date?: string;
	evaluators?: Evaluator[];
	history?: string;
	name: string;
	image?: string;
	urls?: Url[];
	documentation: ChecklistSection;
	infrastructure: ChecklistSection;
	testing: ChecklistSection;
}

export interface Tool extends Entry {
	date: string;
	image: string;
	slug: string; // for web app, generated from name in checklist
}

export interface Evaluator {
	name: string;
	contact?: string;
}

export interface Url {
	url: string;
	url_type: string;
}
export type Section = (typeof checklistSections)[number];

export type Tier = (typeof checklistTiers)[number];

export type ChecklistSection = {
	bronze: Record<string, boolean>;
	silver: Record<string, boolean>;
	gold: Record<string, boolean>;
};

export interface EvaluationSchema {
	[key: string]: any;
	'@context': {
		'@version': number;
		reproschema: string;
	};
	tiers: { [key: string]: SchemaTier };
	items: SchemaItem[];
}

interface SchemaTier {
	intendedAudience: string[];
	benefits: string[];
	prerequisiteTiers?: string[];
}

interface SchemaItem {
	prompt: string;
	type: string;
	id?: string;
	tier?: string;
	section?: string;
	items?: SchemaItem[];
	options?: string[];
}

export interface EvaluationItemData {
	prompt: string;
	value: boolean;
}
