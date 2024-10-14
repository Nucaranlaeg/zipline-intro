<script lang="ts">
	import type { DAGNode } from "$lib/DAGNode";
	import { onMount } from "svelte";
	import ViewControls from "./ViewControls.svelte";
	import NodeDepthControl from "./NodeDepthControl.svelte";

	interface NodesProps {
		nodeList: DAGNode[];
		height: number;
		width: number;
		selectedNode: DAGNode | null;
		isFiltered: boolean;
	};

	let {
		nodeList,
		height,
		width,
		selectedNode = $bindable(null),
		isFiltered,
	}: NodesProps = $props();

	const V_NODE_SPACING = 100;
	const V_OFFSET = 50;
	const NODE_HEIGHT = 50;
	const H_NODE_SPACING = 150;
	const H_OFFSET = 50;
	const NODE_WIDTH = 75;

	let vScroll = $state(0), hScroll = $state(0), zMult = $state(1);
	let maxDepth = $state(0);

	function selectNode(node_name: string){
		selectedNode = node_name === selectedNode?.node_name ? null : nodeList.find(n => n.node_name === node_name) || null;
	};

	let filteredNodes: DAGNode[] = $state([]);

	// Adjust node positioning, including by filtering by depth
	$effect(() => {
		let temp = nodeList.slice();

		// Reset depths
		nodeList.forEach(node => {
			node.depth = 0;
		});

		// Calculate the displayed depth of each node.
		const toProcess = temp.filter(node => node.parents.length === 0);
		while (toProcess.length) {
			toProcess[0].children.forEach(child => {
				if (toProcess[0].depth >= child.depth){
					child.depth = toProcess[0].depth + 1;
					if (!toProcess.includes(child)) toProcess.push(child);
				}
			});
			toProcess.shift();
		}

		// Move nodes to the right as far as possible
		temp.toSorted((a, b) => b.depth - a.depth)
			.forEach(node => node.depth = Math.max(node.depth + 1, ...node.children.map(child => child.depth)) - 1);

		// Filter out nodes further than maxDepth from the right.
		// Only do so if the graph has been filtered.
		if (maxDepth > 0 && isFiltered){
			const deepest = Math.max(...temp.map(node => node.depth));
			if (deepest > maxDepth){
				temp = temp.filter(node => {
					node.depth -= deepest - maxDepth;
					return node.depth >= 0;
				});
			}
		}

		// Bug: sometimes, setting a max depth separates the graph into two separate graphs when the graph
		// is not filtered to a node and its descendents.
		// This is maybe fine, but consideration should be made as to whether the graphs should be disentangled.
		// Probably worth fixing as a part of doing the below improvement.
	
		// Find node heights:
		//   For now, it's just in arbitrary order.  Worth thinking about a better order.
		//   Likely, the order is going to involve determining which nodes share children, but this isn't straightforward.
		// Once the nodes are reordered, each column is adjusted up/down so that the lines are as short as possible.
		//   An example adjustment is here, but it would likely need fixing based on the sorting of nodes.
		let nextHeight = 0, lastDepth = 0;
		let desiredAdjustment = 0, connectionCount = 0;
	
		function adjustDepthHeight(depth: number, adjustment: number){
			temp.forEach(node => {
				if (node.depth === depth){
					node.height += adjustment;
				}
			});
		}
	
		temp.toSorted((a, b) => a.depth - b.depth)
			.forEach(node => {
				if (node.depth > lastDepth){
					if (desiredAdjustment !== 0) adjustDepthHeight(lastDepth, desiredAdjustment / connectionCount);
					lastDepth = node.depth;
					nextHeight = 0;
					desiredAdjustment = 0;
					connectionCount = 0;
				}
				node.height = nextHeight;
				nextHeight++;
				desiredAdjustment += node.parents.reduce((adjustment, parent) => parent.height - node.height + adjustment, 0);
				connectionCount += node.parents.length;
			});
		if (desiredAdjustment !== 0) adjustDepthHeight(lastDepth, desiredAdjustment / connectionCount);
	
		// Align highest node with top of frame
		const minHeight = Math.min(...temp.map(node => node.height));
		if (minHeight < 0){
			temp.forEach(node => node.height -= minHeight);
		}

		filteredNodes = temp;
	});

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	function drawArrow(parent: DAGNode, child: DAGNode){
		const start = {
			x: (parent.depth * H_NODE_SPACING + H_OFFSET + NODE_WIDTH / 2 + hScroll) * zMult,
			y: (parent.height * V_NODE_SPACING + V_OFFSET + NODE_HEIGHT / 2 + vScroll) * zMult,
		};
		const end = {
			x: (child.depth * H_NODE_SPACING + H_OFFSET + NODE_WIDTH / 2 + hScroll) * zMult,
			y: (child.height * V_NODE_SPACING + V_OFFSET + NODE_HEIGHT / 2 + vScroll) * zMult,
		};
		const control = {
			x: (start.x + end.x) / 2,
			y: start.y,
		};
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
		ctx.stroke();
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#cccccc";
	});
	
	$effect(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		filteredNodes.forEach(node => node.children.forEach(child => drawArrow(node, child)));
	});
</script>

<canvas
	height="{height}"
	width="{width}"
	bind:this={canvas}
></canvas>

<div id="elements">
	<div id="elements-inner">
		{#each filteredNodes as {node_name, height, depth}}
			<button
				class="node {node_name === selectedNode?.node_name ? "selected" : ""}"
				style="
					top: {(height * V_NODE_SPACING + V_OFFSET + vScroll) * zMult}px;
					left: {(depth * H_NODE_SPACING + H_OFFSET + hScroll) * zMult}px;
					transform: scale({zMult});
					"
				onclick={() => selectNode(node_name)}
				>{node_name}</button>
		{/each}
	</div>
</div>
<ViewControls
	bind:vScroll={vScroll}
	bind:hScroll={hScroll}
	bind:zMult={zMult}
/>
<NodeDepthControl
	bind:maxDepth={maxDepth}
/>

<style>
	#elements, canvas {
		width: 100%;
		height: 100%;
	}

	#elements {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
	}

	#elements-inner {
		position: relative;
		width: 100%;
		height: 100%;
	}

	canvas {
		background-color: #0d1117;
	}

	.node {
		width: 75px;
		height: 50px;
		border: 1px solid #7a7c7e;
		background-color: #1f2020;
		color: #cccccc;
		text-align: center;
		line-height: 50px;
		position: absolute;
		cursor: pointer;
	}

	.node.selected {
		background-color: #2f3030;
	}
</style>