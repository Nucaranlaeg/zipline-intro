<script lang="ts">
	import type { DAGNode } from "$lib/DAGNode";

	interface NodeInfoBoxProps {
		selectedNode: DAGNode | null;
	};

	let {selectedNode}: NodeInfoBoxProps = $props();
</script>

{#if selectedNode}
	<div id="node-info-box">
		<div class="name">
			{selectedNode?.node_name}
		</div>
		<div class="type">
			Node type: {selectedNode?.node_type}
		</div>
		{#if Object.entries(selectedNode.tags).length}
			Tags:
			{#each Object.entries(selectedNode.tags) as [key, value]}
				<div class="tag">
					<div class="key">{key}</div>
					<div class="value">{value}</div>
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	#node-info-box {
		width: 175px;
		height: calc(100% - 12px);
		border: 1px solid #0d1117;
		padding: 5px;
		background-color: #1f2020;
		color: #cccccc;
	}

	.name {
		width: 100%;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10px;
	}

	.type {
		margin-bottom: 10px;
	}

	.tag {
		display: flex;
		width: 100%;
		justify-content: space-between;
		border-bottom: 1px solid #00000030;
		column-gap: 10px;
	}

	.value {
		text-align: right;
	}
</style>