import { nodes } from "$lib/server/mockedGraph";

export function GET(){
	return new Response(JSON.stringify(nodes.map(n => n.toString())), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}