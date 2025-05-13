import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import EvaluationDetail from '../src/lib/components/EvaluationDetail.svelte';
import data from '../tests/fixtures/evaluatedTools/3d-slicer.json';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';

describe('EvaluationDetail Component', () => {
	afterEach(cleanup);

	it('renders the evaluation overview', () => {
		const { getByText } = render(EvaluationDetail, {
			props: {
				tool: data,
				schemas: [schemaData]
			}
		});
		expect(getByText('Checklist Version:')).toBeDefined();
		expect(getByText(data.checklistVersion)).toBeDefined();

		expect(getByText('Date:')).toBeDefined();
		expect(getByText(data.date)).toBeDefined();

		expect(getByText('Evaluator(s):')).toBeDefined();
		for (const evaluator of data.evaluators) {
			expect(getByText(evaluator.name)).toBeDefined();
			if (evaluator.contact) {
				expect(getByText(evaluator.contact)).toBeDefined();
			}
		}
	});

	it('renders the evaluation checklist', () => {
		const { getAllByRole } = render(EvaluationDetail, {
			props: {
				tool: data,
				schemas: [schemaData]
			}
		});

		const mainSections = ['Testing', 'Infrastructure', 'Documentation'];
		mainSections.forEach((section) => {
			const headings = getAllByRole('heading', { name: section });
			expect(headings).toHaveLength(1);
		});

		// Each tier should appear once per section
		const tiers = ['Bronze Tier', 'Silver Tier', 'Gold Tier'];
		tiers.forEach((tier) => {
			const headings = getAllByRole('heading', { name: tier });
			expect(headings).toHaveLength(mainSections.length);
		});
	});
});
