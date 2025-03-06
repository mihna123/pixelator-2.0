import { getFramesState, getState } from "../core/state/shared-state.js";
import { createNewLayer } from "../core/utils/helpers.js";

/** @type {HTMLDivElement}*/
const framesContainer = document.getElementById("frames-container");

/** @type {HTMLButtonElement} */
const addFrameBtn = document.getElementById("add-frame-btn");

// For now this is just showing one frame, main layer TODO: upgrade state to hold multiple frames, containing layers

/**
 * Adds a new frame canvas to the canvas container
 * */
function addNewFrameCanvas() {
	const state = getState();
	const framesState = getFramesState();

	for (let c of framesContainer.children) {
		c.classList.remove("border-amber-300");
	}

	const canvas = document.createElement("canvas");
	canvas.classList.add("border-2", "border-amber-300");
	canvas.width = 70;
	canvas.height = 70;
	framesContainer.insertBefore(canvas, addFrameBtn);

	canvas.onclick = (e) => {
		for (let c of framesContainer.children) {
			c.classList.remove("border-amber-300");
		}

		const c = e.currentTarget;
		c.classList.add("border-amber-300");

		for (let [index, node] of framesContainer.childNodes.entries()) {
			if (!node.isSameNode(c)) continue;
			index--;
			state.frameIndex = index;
			state.shouldClear = true;
			state.shouldDraw = true;
			framesState.canvas = c;
		}
	};

	return canvas;
}

export function settupFrames() {
	const framesState = getFramesState();

	const canvas = addNewFrameCanvas();
	framesState.canvas = canvas;

	addFrameBtn.onclick = () => {
		const state = getState();
		const newLayer = createNewLayer();
		state.frames.push([newLayer]);
		state.frameIndex++;
		state.shouldClear = true;
		const c = addNewFrameCanvas();
		framesState.canvas = c;
		framesContainer.scrollTop = framesContainer.scrollHeight;
	};
}
