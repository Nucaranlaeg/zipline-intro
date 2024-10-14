export type node_type = "TYPE_1" | "TYPE_2" | "TYPE_3" | "TYPE_4"

export class DAGNode {
	depth: number = 0;
	height: number = 0;
	parents: DAGNode[] = [];
	children: DAGNode[] = [];

	constructor(
		public node_name: string, 
		public node_type: node_type,
		public tags: {[key:string]: string},
		public child_names: string[] = []){}

	toString(){
		return {
			node_name: this.node_name,
			node_type: this.node_type,
			tags: this.tags,
			children: this.children.map(c => c.node_name),
		}
	}
}