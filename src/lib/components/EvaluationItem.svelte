<script lang="ts">
	export let prompt: string;
	export let value: boolean;
</script>

<dl class="flex my-4">
	{#if value}
		<p aria-hidden="true" role="presentation">✅</p>
	{:else}
		<p aria-hidden="true" role="presentation">❌</p>
	{/if}

	<dt class="pl-2">{prompt}</dt>
	<dd class="sr-only">{String(value)}</dd>
</dl>
