<script lang="ts">
    import { page } from '$app/stores';
    import { sortingKeys } from '$lib/constants';
    import type { Tool } from '$lib/types';
    import { filterToolData, sortFilteredData } from '$lib/utils';

	import ToolListviewCard from './ToolListviewCard.svelte';

    // Filter options
    const sectionTypes = ['Testing', 'Infrastructure', 'Documentation'];

    // Pagination parameters
	let toolsPerPage = 5;
	let currentPage = 1;

    // Search parameters
	let textQuery = '';
	let sortingQuery = sortingKeys[1]; // Sort by date (default)
	let sectionTierQuery: string[] = [];

	let filteredTools: Tool[] = [];
	let sortedTools: Tool[] = [];
	let paginatedTools: Tool[] = [];

    function paginateSortedData(tools: Tool[], pageNumber: number) {
        const toolStart = (pageNumber - 1) * toolsPerPage;
        paginatedTools = tools.slice(toolStart, toolStart + toolsPerPage);
    }

    $: filterToolData($page.data.tools, textQuery, sectionTierQuery).then(
        (response) => {
            filteredTools = response;
        }
    );
    $: sortedTools = sortFilteredData(filteredTools, sortingQuery);
    $: paginateSortedData(sortedTools, currentPage);

    function changePage(newPage: number): void {
        const maxPage = Math.ceil(filteredTools.length / toolsPerPage);
        currentPage = newPage >= 1 && newPage <= maxPage ? newPage : 1;
    }

	function updateSectionTierQuery(section: string, event: Event): void {
        const { value } = event.target as HTMLSelectElement;

        sectionTierQuery = [
            ...sectionTierQuery.filter((item) => !item.startsWith(section)),
            ...(value ? [`${section}-${value}`] : []),
        ];
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
			<span class="label-text text-lg">Search by name:</span>
		</label>
		<input
			type="text"
			placeholder="Enter tool name"
			bind:value={textQuery}
			on:focus={() => changePage(1)}
			class="input input-bordered input-primary w-full max-w-xs"
			id="tool-name"
		/>
	</div>

	<div id="sectionTierSelect" class="min-w-min">
         <div class="label">
			<span class="label-text text-lg">Search by minimum standard:</span>
        </div>
		<div id="tier-select" class="flex grow gap-4">
            {#each sectionTypes as section}
                <div>
                    <select
                    on:change={(changeEvent) => updateSectionTierQuery(section.toLowerCase(), changeEvent)}
                    class="select select-primary w-full min-w-min"
                    id="{section.toLowerCase()}-select"
                    >
                        <option value="">❌ None</option>
                        <option value="bronze">🥉 Bronze</option>
                        <option value="silver">🥈 Silver</option>
                        <option value="gold">🥇 Gold</option>
                    </select>
                    <label for="{section.toLowerCase()}-select" class="label justify-end">
                        <span class="label-text-alt">{section}</span>
                    </label>
                </div>
            {/each}
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
                {#each sectionTypes as section}
                    <p class="w-56 text-center text-lg">{section}</p>
                {/each}
			</div>
		</div>
	</div>

	<hr />

	{#each paginatedTools as tool (tool.slug)}
		<ToolListviewCard {tool} />
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