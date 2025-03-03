import { getState } from "../core/state/shared-state.js";

/** @type {HTMLButtonElement[]} */
const tools = [
	document.getElementById("color-dropper-tool"),
	document.getElementById("move-tool"),
	document.getElementById("bucket-tool"),
	document.getElementById("square-tool"),
	document.getElementById("line-tool"),
	document.getElementById("pen-tool"),
	document.getElementById("eraser-tool"),
];

/**
 * Function for toggling all the tools
 * @param {MouseEvent} e
 * */
function onClickToggleHelper(e) {
	const state = getState();
	state.selectedTool = e.currentTarget.dataset.tool;
	for (var tool of tools) {
		tool.classList.remove("bg-gray-400");
		tool.classList.add("bg-gray-300");
	}
	e.currentTarget.classList.add("bg-gray-400");
}

export function settupTools() {
	const state = getState();

	for (const tool of tools) {
		tool.onclick = onClickToggleHelper;
	}

	/** @type {HTMLInputElement} */
	const colorPicker = document.getElementById("color-picker");
	colorPicker.onchange = (e) => {
		state.selectedColor = e.target.value;
	};
}
