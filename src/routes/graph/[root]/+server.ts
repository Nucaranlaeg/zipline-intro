import { nodes } from "$lib/server/mockedGraph";

function filterNodes(root: string | null = null){
	const root_node = nodes.find(n => n.node_name === root);
	if (!root || root_node === undefined){
		return nodes;
	}
	let rooted_nodes = [root_node];
	for (let i = 0; i < rooted_nodes.length; i++){
		rooted_nodes[i].parents.forEach(parent => {
			if (!rooted_nodes.includes(parent)){
				rooted_nodes.push(parent);
			}
		});
	}
	return rooted_nodes;
}

export function GET({params}){
	const filteredList = filterNodes(params.root);
	return new Response(JSON.stringify(filteredList.map(n => n.toString())), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}