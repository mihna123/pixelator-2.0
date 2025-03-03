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

	switch (state.selectedTool) {
		case "pen":
			state.canvas.style.cursor = "url(cursors/pencil.cur), auto";
			break;
		case "line":
			state.canvas.style.cursor = "url(cursors/line.cur), auto";
			break;
		case "square":
			state.canvas.style.cursor = "url(cursors/square.cur), auto";
			break;
		case "move":
			state.canvas.style.cursor = "url(cursors/move.cur), auto";
			break;
		case "bucket":
			state.canvas.style.cursor = "url(cursors/bucket.cur), auto";
			break;
		case "color":
			state.canvas.style.cursor = "url(cursors/color-picker.cur), auto";
			break;
		case "eraser":
			state.canvas.style.cursor = "url(cursors/eraser.cur), auto";
	}
	if (state.selectedTool === "pen") {
	} else if (state.selectedTool === "square") {
	} else {
	}

	for (var tool of tools) {
		tool.classList.remove("border-2");
		tool.classList.remove("border-amber-300");
	}
	e.currentTarget.classList.add("border-2");
	e.currentTarget.classList.add("border-amber-300");
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
