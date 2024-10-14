import { DAGNode } from "$lib/DAGNode";

export const nodes = [
	new DAGNode("A", "TYPE_1", {}, ["B"]),
	new DAGNode("B", "TYPE_2", {}, ["E", "F"]),
	new DAGNode("C", "TYPE_1", {}, ["B"]),
	new DAGNode("D", "TYPE_3", {"tag": "value", "tag2": "This is a long placeholder value"}, ["E", "F"]),
	new DAGNode("E", "TYPE_4", {}, ["H"]),
	new DAGNode("F", "TYPE_1", {}, []),
	new DAGNode("G", "TYPE_3", {}, ["H"]),
	new DAGNode("H", "TYPE_2", {}, ["I"]),
	new DAGNode("I", "TYPE_1", {}, []),
];

// Depending on the expected size of the graph, we may want to compute these more efficiently
// or pass both parents and children to the front end (or both).
// With a small expected graph (100s of nodes) computing parents in both places is fine.
// In both places, though, we convert the names to references to the other node, so it's worth doing.
nodes.forEach(node => {
	node.children = node.child_names
		.map(child_name => nodes.find(child => child.node_name === child_name))
		.filter(node => node !== undefined);
	node.children.forEach(child => child.parents.push(node));
});