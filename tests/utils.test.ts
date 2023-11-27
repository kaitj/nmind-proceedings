import { cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import {
	sortEvaluationsByDate,
	getMostRecentEvaluation,
	getCompletionFractionFromSectionTier,
	getSectionTierPromptById,
	mungeChecklistSectionTier,
	findEvaluationSchemaByVersion,
	getToolUrlByTextDescriptor,
	filterToolData,
	sortFilteredData,
	tooltip
} from '../src/lib/utils';
import toolData from '../tests/fixtures/evaluatedTools/3d-slicer.json';
import toolData2 from '../tests/fixtures/evaluatedTools/amira.json';
import toolData3 from '../tests/fixtures/evaluatedTools/analysis-of-dysfunctional-neuroimages-adni.json';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';
import { sortingKeys } from '../src/lib/constants';
import type { Evaluation } from '../src/lib/types';

describe('sortEvaluationsByDate', () => {
	it('should sort evaluations by date in ascending order', () => {
		const evalsDeepCopy = JSON.parse(JSON.stringify(toolData.evaluations));
		const artificiallyInverted = [evalsDeepCopy[1], evalsDeepCopy[0]];
		const sortedEvaluations = sortEvaluationsByDate(toolData.evaluations);
		expect(sortedEvaluations).toEqual(artificiallyInverted);
	});

	it('should return an empty array if evaluations is empty', () => {
		const evaluations: Evaluation[] = [];
		const sortedEvaluations = sortEvaluationsByDate(evaluations);
		expect(sortedEvaluations).toEqual([]);
	});
});

describe('getMostRecentEvaluation', () => {
	it('should return the most recent evaluation', () => {
		const mostRecentEvaluation = getMostRecentEvaluation(toolData.evaluations);
		// The more-recent of the two evaluations in the fixture is the second one
		expect(mostRecentEvaluation?.date).toEqual('2023-07-13');
	});

	it('should return null if evaluations is empty', () => {
		const evaluations: Evaluation[] = [];
		const mostRecentEvaluation = getMostRecentEvaluation(evaluations);
		expect(mostRecentEvaluation).toBeNull();
	});
});

describe('getCompletionFractionFromSectionTier', () => {
	it('should return the completion fraction for a section tier', () => {
		const completionFraction = getCompletionFractionFromSectionTier(
			toolData.evaluations[0].checklist.infrastructure.bronze
		);
		expect(completionFraction).toStrictEqual({
			numerator: 4,
			denominator: 7
		});
	});
});

describe('getSectionTierPromptById', () => {
	it('should return the prompt for a section tier by id', () => {
		const prompt = getSectionTierPromptById(schemaData, 'bronze_doc_1');
		expect(prompt).toBe(
			'Landing page (e.g., GitHub README, website) provides a link to documentation and brief description of what program does'
		);
	});

	it('should return null if section tier id is not found', () => {
		const prompt = getSectionTierPromptById(schemaData, 'nonexistent_id');
		expect(prompt).toEqual(null);
	});
});

describe('mungeChecklistSectionTier', () => {
	it('should munge the section tier for a checklist', () => {
		const referenceMungedSectionTier = [
			{
				prompt: 'Code is open source',
				value: true
			},
			{
				prompt: 'Package is under version control',
				value: true
			},
			{
				prompt: 'Readme is present',
				value: false
			},
			{
				prompt: 'License is present',
				value: false
			},
			{
				prompt: 'Issues tracking is enabled',
				value: true
			},
			{
				prompt: 'Digital Object Identifier (DOI) points to latest version',
				value: true
			},
			{
				prompt: 'All documented installation instructions can be successfully followed',
				value: false
			}
		];
		const mungedSectionTier = mungeChecklistSectionTier(
			toolData.evaluations[0].checklist.infrastructure.bronze,
			Number(toolData.evaluations[0].checklistVersion)
		);
		expect(mungedSectionTier).toEqual(referenceMungedSectionTier);
	});

	it('should throw an error if passed a nonexistent schema-version ', () => {
		const nonexistentSchemaVersion = 999;
		const callWithNonexistentSchema = () => {
			mungeChecklistSectionTier(
				toolData.evaluations[0].checklist.infrastructure.bronze,
				nonexistentSchemaVersion
			);
		};

		expect(callWithNonexistentSchema).toThrow('No matching schema found!');
	});
});

describe('findEvaluationSchemaByVersion', () => {
	it('should return the evaluation schema for a given version', () => {
		const evaluationSchema = findEvaluationSchemaByVersion([schemaData], 1.1);
		expect(evaluationSchema).toEqual(schemaData);
	});

	it('should return null if evaluation schema is not found', () => {
		const evaluationSchema = findEvaluationSchemaByVersion([schemaData], 1.2);
		expect(evaluationSchema).toBeNull();
	});
});

describe('getToolUrlByTextDescriptor', () => {
	it('should return the URL for a tool with a given text descriptor', () => {
		const url = getToolUrlByTextDescriptor(toolData, 'Source Code');
		expect(url).toStrictEqual({
			text: 'Source Code',
			href: 'uclondon.edu/3d_slicer'
		});
	});

	it('should return null if no matching URL is found', () => {
		const url = getToolUrlByTextDescriptor(toolData, 'nonexistent text');
		expect(url).toBeNull();
	});
});

describe('filterToolData', () => {
	afterEach(cleanup);
	it('should filter tool data by text query, tag query, and section tier query', async () => {
		const textQuery = 'Amira';
		const tagQuery = 'numpy,mrs';
		const sectionTierQuery = ['testing-gold'];
		const filteredTools = await filterToolData(textQuery, tagQuery, sectionTierQuery);
		expect(filteredTools).toEqual([toolData2]);
	});

	it('should filter tool data by text query', async () => {
		const textQuery = 'Analysis of Dysfunct';
		const tagQuery = '';
		const sectionTierQuery: string[] = [];

		const filteredTools = await filterToolData(textQuery, tagQuery, sectionTierQuery);
		expect(filteredTools).toEqual([toolData3]);
	});

	it('should filter tool data by tag query', async () => {
		const textQuery = '';
		const tagQuery = 'neuro';
		const sectionTierQuery: string[] = [];

		const filteredTools = await filterToolData(textQuery, tagQuery, sectionTierQuery);
		expect(filteredTools).toContainEqual(expect.objectContaining(toolData2));
		expect(filteredTools).toContainEqual(expect.objectContaining(toolData3));
	});

	it('should filter tool data by section tier query', async () => {
		const textQuery = '';
		const tagQuery = '';
		const sectionTierQuery = ['testing-bronze', 'testing-gold'];

		const filteredTools = await filterToolData(textQuery, tagQuery, sectionTierQuery);
		expect(filteredTools).toContainEqual(expect.objectContaining(toolData2));
	});

	it('should return an empty array if no tools match the query', async () => {
		const textQuery = 'nonexistent tool';
		const tagQuery = 'nonexistent tag';
		const sectionTierQuery: string[] = [];
		const filteredTools = await filterToolData(textQuery, tagQuery, sectionTierQuery);
		expect(filteredTools).toEqual([]);
	});
});

describe('sortFilteredData', () => {
	afterEach(cleanup);

	it('should sort filtered data by A-Z sort query', () => {
		const descendingAlphabeticalOrder = JSON.parse(
			JSON.stringify([toolData3, toolData2, toolData])
		);
		const ascendingAlphabeticalOrder = JSON.parse(JSON.stringify([toolData, toolData2, toolData3]));
		const sortedTools = sortFilteredData(descendingAlphabeticalOrder, sortingKeys[0]);
		expect(sortedTools).toEqual(ascendingAlphabeticalOrder);
	});

	it('should sort filtered data by most-recent-evaluation sort query', () => {
		const randomizedEvalOrder = JSON.parse(JSON.stringify([toolData2, toolData3, toolData]));
		const descendingEvalOrder = JSON.parse(JSON.stringify([toolData, toolData2, toolData3]));
		const sortedTools = sortFilteredData(randomizedEvalOrder, sortingKeys[1]);
		expect(sortedTools).toEqual(descendingEvalOrder);
	});
});

describe('tooltip', () => {
	it('should set the aria-label attribute to the given content', () => {
		const node = document.createElement('div');
		const content = 'Tooltip content';
		tooltip(node, { content });
		expect(node.getAttribute('aria-label')).toBe(content);
	});

	it('should set the aria-label attribute to the title attribute if no content is given', () => {
		const node = document.createElement('div');
		const title = 'Title attribute';
		node.title = title;
		tooltip(node, {});
		expect(node.getAttribute('aria-label')).toBe(title);
	});

	it('should set the aria-label attribute to the aria-label attribute if no content or title is given', () => {
		const node = document.createElement('div');
		const ariaLabel = 'ARIA label attribute';
		node.setAttribute('aria-label', ariaLabel);
		tooltip(node, {});

		expect(node.getAttribute('aria-label')).toBe(ariaLabel);
	});

	it('should clear out the HTML title attribute', () => {
		const node = document.createElement('div');
		node.title = 'Title attribute';
		tooltip(node, {});

		expect(node.title).toBe('');
	});

	it('should create a Tippy instance with the given content', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const node: HTMLDivElement & { _tippy?: any } = document.createElement('div');
		const content = 'Tooltip content';
		const tip = tooltip(node, { content });

		expect(tip.update).toBeDefined();
		expect(tip.destroy).toBeDefined();

		expect(node['_tippy']).toBeDefined();
		expect(node['_tippy'].props.content).toBe(content);
	});

	it('should support the allowHTML prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const node: HTMLDivElement & { _tippy?: any } = document.createElement('div');
		const content = '<strong>Tooltip content</strong>';
		tooltip(node, { content, allowHTML: true });

		expect(node['_tippy'].props.content).toBe(content);
	});

	it('should destroy the Tippy instance on unmount', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const node: HTMLDivElement & { _tippy?: any } = document.createElement('div');
		const content = 'Tooltip content';
		const tip = tooltip(node, { content });

		expect(node['_tippy']).toBeDefined();

		tip.destroy();
		expect(node['_tippy']).toBeUndefined();
	});
});
