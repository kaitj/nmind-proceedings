import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Footer from '../src/lib/components/Footer.svelte';

describe('Footer', () => {
	afterEach(cleanup);

	it('should render all links', () => {
		const { getByRole } = render(Footer);
		const linkNames = ['GitHub', 'Gather', 'Monthly Hack-a-day', 'Mailing List'];

		linkNames.forEach((linkName) => {
			expect(getByRole('link', { name: linkName })).toBeDefined();
		});
	});

	it('should render the correct year', () => {
		const { getByText } = render(Footer);

		expect(getByText('© 2025 NMIND.')).toBeDefined();
	});
});
