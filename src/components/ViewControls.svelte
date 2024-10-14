<script lang="ts">
	import "@fortawesome/fontawesome-free/css/all.min.css";

	interface ViewControlsProps {
		vScroll: number;
		hScroll: number;
		zMult: number;
	};

	let {
		vScroll = $bindable(),
		hScroll = $bindable(),
		zMult = $bindable(),
	}: ViewControlsProps = $props();

	const scrollAmount = 10;
	const zoomAmount = 1.1;

	function scrollUp(){
		vScroll -= scrollAmount;
	}
	function scrollLeft(){
		hScroll -= scrollAmount;
	}
	function scrollDown(){
		vScroll += scrollAmount;
	}
	function scrollRight(){
		hScroll += scrollAmount;
	}
	function zoomIn(){
		zMult *= zoomAmount;
	}
	function zoomOut(){
		zMult /= zoomAmount;
	}
	function resetScroll(){
		vScroll = 0;
		hScroll = 0;
		zMult = 1;
	}
</script>

<div id="view-control-wrapper">
	<div class="control-button invisible"></div>
	<button aria-label="Scroll up" class="control-button" onclick={scrollUp}><i class="fa fa-caret-up"></i></button>
	<button aria-label="Zoom in" class="control-button" onclick={zoomIn}><i class="fa fa-magnifying-glass-plus"></i></button>
	<button aria-label="Scroll left" class="control-button" onclick={scrollLeft}><i class="fa fa-caret-left"></i></button>
	<button aria-label="Reset scroll" class="control-button" onclick={resetScroll}><i class="fa fa-circle-dot"></i></button>
	<button aria-label="Scroll right" class="control-button" onclick={scrollRight}><i class="fa fa-caret-right"></i></button>
	<div class="control-button invisible"></div>
	<button aria-label="Scroll down" class="control-button" onclick={scrollDown}><i class="fa fa-caret-down"></i></button>
	<button aria-label="Zoom out" class="control-button" onclick={zoomOut}><i class="fa fa-magnifying-glass-minus"></i></button>
</div>

<style>
	#view-control-wrapper {
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: 91px;
		height: 91px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		column-gap: 2px;
	}

	.control-button {
		height: 25px;
		width: 25px;
		border: 1px solid #cccccc;
		border-radius: 5px;
		background-color: #212830;
		color: #cccccc;
		position: relative;
		display: inline-block;
		cursor: pointer;
		box-sizing: border-box;
	}

	.control-button .fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.control-button.invisible {
		visibility: hidden;
	}

	.control-button:hover {
		background-color: #323941;
	}
</style>