<script lang="ts">
	import { DAGNode } from "$lib/DAGNode";
	import NodeInfoBox from "../components/NodeInfoBox.svelte";
	import Nodes from "../components/Nodes.svelte";
	import AutoComplete from "simple-svelte-autocomplete";

	let nodeList: DAGNode[] = $state([]);
	const height = 600;
	const width = 800;
	let searchSelected: string | null = $state(null);
	let selectedNode: DAGNode | null = $state(null);
	
	$effect(() => {
		fetch(`/graph/${searchSelected || ""}`).then((data) => {
			data.json().then(nodes => {
				nodeList = nodes.map((n: any) => {
					try {
						return new DAGNode(n.node_name, n.node_type, n.tags, n.children);
					} catch {
						return null;
					}
				}).filter((n: any) => n !== null);

				// Calculate the parents and children of all nodes
				nodeList.forEach(node => {
					node.children = node.child_names
						.map(child_name => nodeList.find(child => child.node_name === child_name))
						.filter(node => node !== undefined);
					node.children.forEach(child => child.parents.push(node));
				});
				selectedNode = nodeList.find(node => node.node_name === searchSelected) || null;
			});
		});
	})
</script>

<div id="dag-wrapper">
	<Nodes
		nodeList={nodeList}
		width={width}
		height={height}
		isFiltered={!!searchSelected}
		bind:selectedNode={selectedNode}
		/>
	<div id="search-box-wrapper">
		<AutoComplete
			items={nodeList.map(n => n.node_name)}
			bind:selectedItem={searchSelected}
			hideArrow="true"
			showClear="true"
			className="search-box"
		/>
	</div>
</div>
<div id="node-info-box-wrapper">
	<NodeInfoBox selectedNode={selectedNode} />
</div>

<h2>Potential improvements:</h2>
<i>Not done due to timeframe.</i>
<ul style="max-width: 750px">
	<li>The list of names in the autocomplete could be fetched once, then not updated.  This would require using the name as the selected item rather than the item itself, which is why I didn't get around to it.</li>
	<li>Calculating the tree relations could be improved using an object (which hashes properties), but that is overkill if we're not talking about a significant number of nodes.</li>
	<li>Node ordering could be improved - in the example graph, either G should be moved above E and F or E and F should be swapped (shorter lines and better grouping is preferable).</li>
	<li>Clarity is needed on maximum depth: if the graph is unfiltered, it's unclear if it should have an effect because of the potential of splitting it into multiple graphs.</li>
	<li>The infobox on the right should have a button to filter to only parents of that node.</li>
	<li>Node types should probably be indicated visually on the graph - each box could be shaped differently, for instance.  This is dependent on whether there is a hard limit on node types.</li>
	<li>Clicking and dragging on the graph / background should scroll.</li>
	<li>When filtered to a node, the children of that node should be accessible in some way (so that the graph can be navigated).</li>
	<li>Arrows could be added to lines to indicate direction of relations.  It's not clear whether this is needed (as it can only go one way) but it might be nice.</li>
	<li>Relations which span multiple columns should attempt to avoid going under other nodes.</li>
</ul>

<style>
	#dag-wrapper {
		height: 600px;
		width: 800px;
		position: relative;
		display: inline-block;
	}

	#search-box-wrapper {
		position: absolute;
		bottom: 10px;
		left: 10px;
	}

	#node-info-box-wrapper {
		display: inline-block;
		vertical-align: top;
		height: 600px;
	}

	:global(.search-box .autocomplete-clear-button) {
		/* I've made a PR for this fix. */
		height: 100%;
	}
</style>
