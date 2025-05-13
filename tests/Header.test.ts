import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Header from '../src/lib/components/Header.svelte';

describe('Header component', () => {
	afterEach(cleanup);

	it('should render the Home link', () => {
		const { getByRole } = render(Header);
		const homeLink = getByRole('link', { name: /home/i });
		expect(homeLink).toBeDefined();
		expect(homeLink.getAttribute('href')).toBe('https://www.nmind.org/');
	});

	it('should render the About link', () => {
		const { getByRole } = render(Header);
		const aboutLink = getByRole('link', { name: /about/i });
		expect(aboutLink.getAttribute('href')).toBe('https://www.nmind.org/about');
	});

	it('should render the Get Involved link', () => {
		const { getByRole } = render(Header);
		const getInvolvedLink = getByRole('link', { name: /get involved/i });
		expect(getInvolvedLink).toBeDefined();
		expect(getInvolvedLink.getAttribute('href')).toBe('https://www.nmind.org/engagement');
	});

	it('should render the Proceedings link', () => {
		const { getByRole } = render(Header);
		const proceedingsLink = getByRole('link', { name: /tools/i });
		expect(proceedingsLink).toBeDefined();
		expect(proceedingsLink.getAttribute('href')).toBe('https://www.nmind.org/proceedings');
	});
});
