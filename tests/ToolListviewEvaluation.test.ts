import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolListviewEvaluation from '../src/lib/components/ToolListviewEvaluation.svelte';
import data from '../tests/fixtures/evaluatedTools/amira.json';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';

describe('ToolListviewEvaluation', () => {
	it('renders without visual regressions', () => {
		const { container } = render(ToolListviewEvaluation, {
			props: {
				tool: data,
				schemas: [schemaData]
			}
		});

		expect(container.firstChild).toMatchSnapshot();
	});
});
