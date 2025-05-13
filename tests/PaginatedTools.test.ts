import PaginatedTools from '$lib/components/PaginatedTools.svelte';
import type { Tool } from '$lib/types';
import { sortFilteredData } from '$lib/utils';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import schemaData from '../tests/fixtures/evaluationSchemas/v1-1.json';

const tools: Tool[] = Object.values(
	import.meta.glob('../tests/fixtures/evaluatedTools/*.json', { eager: true })
).map((module: any) => {
	const tool = module.default as Tool;
	return {
		...tool,
		slug: tool.name
			.toLowerCase()
			.replace(/[^\w\s]/gi, '')
			.replace(/ /g, '-')
	};
});

function setup(data: boolean) {
	if (data) {
		return render(PaginatedTools, {
			props: {
				tools,
				schemas: [schemaData]
			}
		});
	} else {
		return render(PaginatedTools); // no props
	}
}

describe('PaginatedTools always', () => {
	afterEach(cleanup);

	it('should render the search inputs', () => {
		setup(false);
		expect(screen.getByText('Search by name:')).toBeDefined();
	});

	it('should render the section and tier completion filter', () => {
		setup(false);
		expect(screen.getByText('Search by minimum standard:')).toBeDefined();
	});
});

describe('PaginatedTools when no data is provided', () => {
	afterEach(cleanup);

	it('should render the no-matches text', () => {
		setup(false);
		expect(screen.getByText('No matching tools found.')).toBeDefined();
	});
});

describe('PaginatedTools when data is provided', () => {
	afterEach(cleanup);

	it('should render the pagination buttons', async () => {
		setup(true);

		// async b/c the pagination buttons are only rendered
		// after the data.json manifest has been read && parsed
		await waitFor(() => {
			expect(screen.getByText('Previous')).toBeDefined();
			expect(screen.getByText('Next')).toBeDefined();
		});
	});

	it('should filter tools by search query', async () => {
		setup(true);
		await waitFor(() => {
			expect(screen.getByText('Previous')).toBeDefined();
		});

		const input = screen.getByPlaceholderText('Enter tool name');
		fireEvent.input(input, { target: { value: 'CamBA' } });
		await waitFor(() => {
			// i.e. there is now a tool-card visible with the name CamBA
			//  (it typically does not appear in the first 5 tools)
			expect(screen.getByRole('heading', { name: /CamBA/ })).toBeDefined();
		});
	});

	it('should filter tools by section and tier completion', async () => {
		setup(true);
		await waitFor(() => {
			expect(screen.getByText('Previous')).toBeDefined();
		});

		const selectElement = screen.getByLabelText('Documentation') as HTMLSelectElement;
		fireEvent.change(selectElement, { target: { value: 'gold' } });

		await waitFor(() => {
			screen.getByLabelText('Sort by:');

			// i.e. there is now a tool-card visible with the name NiPy
			//  (it typically does not appear in the first 5 tools)
			expect(screen.getByRole('heading', { name: /NiPy/ })).toBeDefined();
		});
	});

	it('should sort tools by sorting query', async () => {
		setup(true);
		await waitFor(() => {
			expect(screen.getByText('Previous')).toBeDefined();
		});

		const verifyVisibleTools = async (sortMethod: string) => {
			const sortedTools = sortFilteredData(tools, sortMethod);
			const visibleTools = sortedTools.slice(0, 5);

			await waitFor(() => {
				expect(screen.getByText(visibleTools[0].name)).toBeDefined();
			});

			visibleTools.forEach((tool) => {
				expect(screen.getByRole('heading', { name: tool.name })).toBeDefined();
			});

			return visibleTools;
		};

		await verifyVisibleTools('Most-Recent Evaluation');

		const select = screen.getByLabelText('Sort by:');
		fireEvent.change(select, { target: { value: 'Tool Name (A-Z)' } });
		await verifyVisibleTools('Tool Name (A-Z)');
	});

	it('should paginate tools', async () => {
		setup(true);
		await waitFor(() => {
			expect(screen.getByText('Previous')).toBeDefined();
			expect(screen.getByText('Next')).toBeDefined();
		});

		const sortedTools = sortFilteredData(tools, 'Most-Recent Evaluation');
		sortedTools.slice(0, 5).forEach((tool) => {
			expect(screen.getByRole('heading', { name: tool.name })).toBeDefined();
		});

		const nextButton = screen.getByText('Next');
		fireEvent.click(nextButton);

		await waitFor(() => {
			sortedTools.slice(5, 10).forEach((tool) => {
				expect(screen.getByRole('heading', { name: tool.name })).toBeDefined();
			});
		});
	});
});
