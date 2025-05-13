import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import EvaluationShieldIcon from '../src/lib/components/EvaluationShieldIcon.svelte';
import { shieldColors } from '../src/lib/constants';
import { getCompletionFractionFromSectionTier, mungeChecklistSectionTier } from '../src/lib/utils';
import data from '../tests/fixtures/evaluatedTools/3d-slicer.json';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';

describe('EvaluationShieldIcon', () => {
	it('renders without visual regressions', () => {
		const { container } = render(EvaluationShieldIcon, {
			props: {
				fillColor: shieldColors.bronze,
				sectionTierCompletionFraction: getCompletionFractionFromSectionTier(data.testing.bronze),
				sectionTierCompletionEvidence: mungeChecklistSectionTier(
					[schemaData],
					data,
					'testing',
					'bronze',
					Number(data.checklistVersion)
				)
			}
		});

		expect(container.firstChild).toMatchSnapshot();
	});
});
