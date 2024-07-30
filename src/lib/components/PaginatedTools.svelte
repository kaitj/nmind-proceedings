<script lang="ts">
	import { sortingKeys } from '$lib/constants';
	import type { Tool } from '$lib/types';
	import { filterToolData, sortFilteredData, tooltip } from '$lib/utils';

	import ToolListviewCard from './ToolListviewCard.svelte';

	let toolsPerPage = 5;
	let currentPage = 1;

	let searchQuery = '';
	let metadataQuery = '';
	let sortingQuery = sortingKeys[0];
	let sectionTierQuery: string[] = [];

	let filteredTools: Tool[] = [];
	let sortedTools: Tool[] = [];
	let paginatedTools: Tool[] = [];

	$: filterToolData(searchQuery, metadataQuery, sectionTierQuery).then(
		(response) => (filteredTools = response)
	);
	$: sortedTools = sortFilteredData(filteredTools, sortingQuery);
	$: paginateSortedData(sortedTools, currentPage);

	async function paginateSortedData(tools: Tool[], pageNumber: number) {
		const toolStart = (pageNumber - 1) * toolsPerPage;
		const toolEnd = pageNumber * toolsPerPage;
		paginatedTools = tools.slice(toolStart, toolEnd);
	}

	function changePage(newPage: number) {
		const outOfRange: boolean = newPage < 1 || newPage - 1 > filteredTools.length / toolsPerPage;

		if (outOfRange) {
			currentPage = 1;
		} else {
			currentPage = newPage;
		}
	}

	function setMetadataQuery(event: MouseEvent): void {
		event.preventDefault();
		const target = event.target as HTMLButtonElement;
		const searchableQueries = metadataQuery
			.split(',')
			.flatMap((tagQuery) => (tagQuery.trim() ? [tagQuery.trim()] : []));

		if (searchableQueries.includes(target.innerHTML)) {
			metadataQuery = searchableQueries
				.filter((tagQuery) => tagQuery !== target.innerHTML)
				.join(', ');
		} else {
			metadataQuery = `${target.innerHTML}, ${metadataQuery}`;
		}
	}

	function updateSectionTierQuery(section: string, event: Event) {
		const { value } = event.target as HTMLSelectElement;

		// Remove any existing tier-value for this section
		sectionTierQuery = sectionTierQuery.filter((item) => !item.startsWith(section));

		// Add the new tier-value for this section
		if (value) {
			sectionTierQuery.push(`${section}-${value}`);
		}
	}
</script>

<div
	class="flex grow flex-wrap flex-col items-center md:flex-row md:items-stretch md:justify-around lg:justify-center mb-4 lg:gap-8 xl:gap-12"
>
	<div id="checklistButton">
		<label for="checklist" class="label">
			<span class="label-text text-lg">Checklist:</span>
		</label>
		<button
			type="button"
			class="btn btn-primary btn-md"
			style="color: #fff;"
			on:click={() => window.open('https://www.nmind.org/standards-checklist/', '_blank')}
			id="checklist">Add a tool
		</button>
	</div>
	<div id="textSearch">
		<label for="tool-name" class="label">
			<span class="label-text text-lg">Search by text:</span>
		</label>
		<input
			type="text"
			placeholder="Enter tool name/description"
			bind:value={searchQuery}
			on:focus={() => changePage(1)}
			class="input input-bordered input-primary w-full max-w-xs"
			id="tool-name"
		/>
	</div>

	<div id="tagSearch">
		<label for="tool-tags" class="label">
			<span class="label-text text-lg">Search by tag:</span>
			<span
				aria-hidden="true"
				use:tooltip={{
					content:
						'Separate multiple tags by comma: e.g. "fsl, docker, python" or "debian,tomography"'
				}}>❔</span
			>
		</label>
		<input
			type="text"
			placeholder="Enter tool metadata"
			bind:value={metadataQuery}
			on:focus={() => changePage(1)}
			class="input input-bordered input-primary w-full max-w-xs"
			id="tool-tags"
		/>
	</div>

	<div id="sectionTierSelect" class="min-w-min">
		<label for="testing-select" class="label">
			<span class="label-text text-lg">Search by minimum standard:</span>
		</label>
		<div class="flex grow gap-4">
			<div>
				<select
					on:change={(changeEvent) => updateSectionTierQuery('testing', changeEvent)}
					class="select select-primary w-full min-w-min"
					id="testing-select"
				>
					<option value="">❌ None</option>
					<option value="bronze">🥉 Bronze</option>
					<option value="silver">🥈 Silver</option>
					<option value="gold">🥇 Gold</option>
				</select>
				<label for="testing-select" class="label justify-end">
					<span class="label-text-alt">Testing</span>
				</label>
			</div>

			<div>
				<select
					on:change={(changeEvent) => updateSectionTierQuery('infrastructure', changeEvent)}
					class="select select-primary w-full min-w-min"
					id="infrastructure-select"
				>
					<option value="">❌ None</option>
					<option value="bronze">🥉 Bronze</option>
					<option value="silver">🥈 Silver</option>
					<option value="gold">🥇 Gold</option>
				</select>
				<label for="infrastructure-select" class="label justify-end">
					<span class="label-text-alt">Infrastructure</span>
				</label>
			</div>

			<div>
				<select
					on:change={(changeEvent) => {
						updateSectionTierQuery('documentation', changeEvent);
					}}
					class="select select-primary w-full min-w-min"
					id="documentation-select"
				>
					<option value="">❌ None</option>
					<option value="bronze">🥉 Bronze</option>
					<option value="silver">🥈 Silver</option>
					<option value="gold">🥇 Gold</option>
				</select>
				<label for="documentation-select" class="label justify-end">
					<span class="label-text-alt">Documentation</span>
				</label>
			</div>
		</div>
	</div>		
</div>

<hr class="mt-12" />

{#if paginatedTools?.length}
	<div
		class="sticky top-0 w-screen z-10 bg-white flex flex-col justify-center items-center lg:flex-row lg:justify-between"
	>
		<div class="flex flex-grow justify-start items-center ml-4">
			<label for="sort-by" class="label">
				<span class="label-text text-lg mr-4">Sort by:</span>
			</label>
			<select id="sort-by" bind:value={sortingQuery} class="select select-primary w-full max-w-xs">
				{#each sortingKeys as sortingKey}
					<option value={sortingKey}>
						{sortingKey}
					</option>
				{/each}
			</select>
		</div>

		<!-- The Tailwind values below are taken from the inverse of the <div> 
			underneath the `Tool Icon && Details` comment inside 
			`ToolListviewCard`, in order to maintain identical 
			vertical-spacing with the SVG shield-icons -->
		<div class="ml-auto w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2">
			<!-- Fully admit this is janky as hell, but: the "relative/right-6" offset
			compensates for the fact to that, (despite my best research) inexplicably,
			the bounding flexbox for the `ToolListviewCard` component's SVG shields
			always calculates out to a couple REM wider than the bounding flexbox below.
			It's not perfect: but looks better than without, across all breakpoints. -->
			<div
				class="h-24 flex flex-row flex-grow flex-wrap justify-center items-center relative right-2 lg:right-4 xl:right-6"
			>
				<p class="w-56 text-center text-lg">Testing</p>
				<p class="w-56 text-center text-lg">Infrastructure</p>
				<p class="w-56 text-center text-lg">Documentation</p>
			</div>
		</div>
	</div>

	<hr />

	{#each paginatedTools as tool (tool.slug)}
		<ToolListviewCard {tool} {setMetadataQuery} />
	{/each}

	<div class="join w-full flex justify-center mt-8 mb-8 ml-0 mr-0">
		<button
			disabled={currentPage === 1}
			on:click={() => changePage(currentPage - 1)}
			class="join-item btn btn-outline"
		>
			Previous
		</button>
		<div class="flex justify-center items-center mt-0 mb-0 ml-4 mr-4">
			<p>Page {currentPage} of {Math.ceil(filteredTools.length / toolsPerPage)}</p>
		</div>

		<button
			disabled={currentPage >= filteredTools.length / toolsPerPage}
			on:click={() => changePage(currentPage + 1)}
			class="join-item btn btn-outline"
		>
			Next
		</button>
	</div>
{:else}
	<p>No matching tools found.</p>
{/if}
