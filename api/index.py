# fix windows registry stuff
import mimetypes
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

from flask import Flask, send_from_directory
import json

app = Flask(__name__, static_folder="./build")

class DAGNode:
	def __init__(self, node_name, node_type, tags, children):
		self.node_name = node_name
		self.node_type = node_type
		self.tags = tags
		self.children = children
		self.parents = []

nodes = [
	DAGNode("A", "TYPE_1", {}, ["B"]),
	DAGNode("B", "TYPE_2", {}, ["E", "F"]),
	DAGNode("C", "TYPE_1", {}, ["B"]),
	DAGNode("D", "TYPE_3", {"tag": "value", "tag2": "This is a long placeholder value"}, ["E", "F"]),
	DAGNode("E", "TYPE_4", {}, ["H"]),
	DAGNode("F", "TYPE_1", {}, []),
	DAGNode("G", "TYPE_3", {}, ["H"]),
	DAGNode("H", "TYPE_2", {}, ["I"]),
	DAGNode("I", "TYPE_1", {}, []),
]

# Depending on the expected size of the graph, we may want to compute these more efficiently
# or pass both parents and children to the front end (or both).
# With a small expected graph (100s of nodes) computing parents in both places is fine.
# In both places, though, we convert the names to references to the other node, so it's worth doing.
for node in nodes:
	for (i, child) in enumerate(node.children):
		child_node = next((n for n in nodes if n.node_name == child), None)
		node.children[i] = child_node
		if child_node:
			child_node.parents.append(node)

def filter_nodes(root):
	if root is None or not any(n.node_name == root for n in nodes):
		return nodes
	rooted_nodes = [next((n for n in nodes if n.node_name == root))]
	index = 0
	while index < len(rooted_nodes):
		for parent in rooted_nodes[index].parents:
			if parent not in rooted_nodes:
				rooted_nodes.append(parent)
		index += 1
	return rooted_nodes

# Remove unneccessary information and references
def get_json(node_list):
	return json.dumps([{
		"node_name": n.node_name,
		"node_type": n.node_type,
		"tags": n.tags,
		"children": [c.node_name for c in n.children],
	} for n in node_list])

@app.route("/")
def base():
	return send_from_directory("build", "index.html")

@app.route("/graph/")
def return_whole_graph():
	return get_json(nodes)

@app.route("/graph/<root>")
def return_graph(root = None):
	node_list = filter_nodes(root)
	return get_json(node_list)

@app.route("/<path:path>")
def static_files(path):
	return send_from_directory("./build", path)
