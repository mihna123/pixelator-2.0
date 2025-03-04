import { getState } from "../core/state/shared-state.js";

/** @type {HTMLButtonElement[]} */
const tools = document.getElementsByClassName("tool-button");

/** @type {HTMLButtonElement[]} */
const sizes = document.getElementsByClassName("size-button");

/**
 * Function for toggling all the size buttons
 * @param {MouseEvent} e
 * */
function onClickSizesToggleHelper(e) {
	const state = getState();
	const sizeIndex = Number(e.currentTarget.dataset.size);
	state.selectedSize = sizeIndex;
	for (const size of sizes) {
		size.classList.remove("border-2");
		size.classList.remove("border-amber-300");
		size.children[0].classList.remove("bg-amber-300");
		size.children[0].classList.add("bg-white");
	}
	e.currentTarget.classList.add("border-2");
	e.currentTarget.classList.add("border-amber-300");
	e.currentTarget.children[0].classList.remove("bg-white");
	e.currentTarget.children[0].classList.add("bg-amber-300");
}

/**
 * Function for toggling all the tool buttons
 * @param {MouseEvent} e
 * */
function onClickToolsToggleHelper(e) {
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

	for (const tool of tools) {
		tool.classList.remove("border-2");
		tool.classList.remove("border-amber-300");
	}
	e.currentTarget.classList.add("border-2");
	e.currentTarget.classList.add("border-amber-300");
}

export function settupTools() {
	const state = getState();

	for (const tool of tools) {
		tool.onclick = onClickToolsToggleHelper;
	}
	for (const size of sizes) {
		size.onclick = onClickSizesToggleHelper;
	}

	/** @type {HTMLInputElement} */
	const colorPicker = document.getElementById("color-picker");
	colorPicker.onchange = (e) => {
		state.selectedColor = e.target.value;
	};
}
