import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import EvaluationItem from '../src/lib/components/EvaluationItem.svelte';

describe('EvaluationItem', () => {
	afterEach(cleanup);

	it('should render a checkmark when value is true', () => {
		const { getByText } = render(EvaluationItem, { props: { prompt: 'Test prompt', value: true } });
		expect(getByText('✅')).toBeDefined();
	});

	it('should render a cross when value is false', () => {
		const { getByText } = render(EvaluationItem, {
			props: { prompt: 'Test prompt', value: false }
		});
		expect(getByText('❌')).toBeDefined();
	});

	it('should render the prompt text', () => {
		const { getByText } = render(EvaluationItem, { props: { prompt: 'Test prompt', value: true } });
		expect(getByText('Test prompt')).toBeDefined();
	});

	it('should render the boolean value as a string in a sr-only element', () => {
		const { getByText } = render(EvaluationItem, { props: { prompt: 'Test prompt', value: true } });
		expect(getByText('true')).toBeDefined();
	});
});
