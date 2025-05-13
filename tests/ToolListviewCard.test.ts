import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import ToolListviewCard from '../src/lib/components/ToolListviewCard.svelte';
import data from '../tests/fixtures/evaluatedTools/amira.json';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';

describe('ToolListviewCard', () => {
	afterEach(cleanup);

	it('should render tool name', () => {
		render(ToolListviewCard, {
			props: {
				tool: data,
				schemas: [schemaData]
			}
		});
		expect(screen.getByText('Amira')).toBeDefined();
	});

	it('should render tool URL', () => {
		render(ToolListviewCard, {
			props: {
				tool: data,
				schemas: [schemaData]
			}
		});
		expect(screen.getByText('github.com/amira')).toBeDefined();
	});
});
