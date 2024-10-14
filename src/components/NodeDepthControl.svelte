<script lang="ts">
	import "@fortawesome/fontawesome-free/css/all.min.css";

	interface NodeDepthControlProps {
		maxDepth: number;
	};

	let {
		maxDepth = $bindable(),
	}: NodeDepthControlProps = $props();
</script>

<div id="max-depth-wrapper">
	<input type="text" inputmode="numeric" name="max-depth-input" bind:value={maxDepth}>
	<label for="max-depth-input">Max Depth</label>
</div>

<style>
	#max-depth-wrapper {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 120px;
		height: 22px;
		background-color: #1f2020;
		color: #cccccc;
		display: flex;
		justify-content: space-around;
		line-height: 22px;
	}

	input {
		width: 20px;
		background-color: #6f7070;
		border: none;
		height: 18px;
		margin-top: 1px;
	}
</style>