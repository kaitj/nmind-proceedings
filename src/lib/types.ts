// types.ts

export type ChecklistTier = 'testing' | 'infrastructure' | 'documentation';

export interface Tool {
	checklistVersion: string;
	date: string;
	evaluators: Evaluator[];
	history: string;
	name: string;
	urls: Url[]
	documentation: Documentation;
	infrastructure: Infrastructure;
	testing: Testing;
	slug: string; // for web app, generated from name in checklist
}

export interface Evaluator {
	name: string;
	contact: string;
}

export interface Url {
	url: string
	url_type: string
}

export interface Testing {
	bronze: {
		1: boolean;
		2: boolean;
	};
	silver: {
		1: boolean;
		2: boolean;
	};
	gold: {
		1: boolean;
		2: boolean;
	};
}

export interface Infrastructure {
	bronze: {
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
		6: boolean;
		7: boolean;
	};
	silver: {
		1: boolean;
		2: boolean;
		3: boolean;
	};
	gold: {
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
	};
}

export interface Documentation {
	bronze: {
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
		6: boolean;
		7: boolean;
		8: boolean;
		9: boolean;
	};
	silver: {
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
		6: boolean;
	};
	gold: {
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
		6: boolean;
	};
}


// export interface EvaluationSchema {
// 	'@context': {
// 		'@version': number;
// 		reproschema: string;
// 	};
// 	tiers: { [key: string]: Tier };
// 	items: Item[];
// }

// interface Tier {
// 	intendedAudience: string[];
// 	benefits: string[];
// 	prerequisiteTiers?: string[];
// }

// interface Item {
// 	prompt: string;
// 	type: string;
// 	id?: string;
// 	tier?: string;
// 	section?: string;
// 	items?: Item[];
// 	options?: string[];
// }

// export interface EvaluationItemData {
// 	prompt: string;
// 	value: boolean;
// }
