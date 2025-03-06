import { getFramesState, getState } from "../core/state/shared-state.js";
import { createNewLayer } from "../core/utils/helpers.js";
import copyIcon from "../icons/copy-icon.js";
import thrashIcon from "../icons/thrash-icon.js";

/** @type {HTMLDivElement}*/
const framesContainer = document.getElementById("frames-container");

/** @type {HTMLButtonElement} */
const addFrameBtn = document.getElementById("add-frame-btn");

/** @param {MouseEvent} e */
function copyFrame(e) {
	const state = getState();
	const framesState = getFramesState();
	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget;

	/** @type {HTMLDivElement} */
	const divContainer = btn.parentElement;

	// Skip the button as it is the last element
	for (let i = 0; i < framesContainer.children.length - 1; ++i) {
		if (!framesContainer.children[i].isSameNode(divContainer)) continue;
		const leftPart = state.frames.slice(0, i + 1);
		const rightPart = state.frames.slice(i + 1, undefined);
		const frameCopy = JSON.parse(JSON.stringify(state.frames[i]));
		leftPart.push(frameCopy, ...rightPart);
		state.frames = leftPart;

		state.frameIndex = i + 1;
		state.shouldClear = true;
		state.shouldDraw = true;

		const newCanvas = addNewFrameCanvas({
			nodeToInsertBeforeOf: framesContainer.children[i + 1],
		});
		framesState.canvas = newCanvas;
		break;
	}
}

/** @param {MouseEvent} e */
function removeFrame(e) {
	const state = getState();
	const framesState = getFramesState();

	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget;

	/** @type {HTMLDivElement} */
	const divContainer = btn.parentElement;

	// Skip the button as it is the last element
	for (let i = 0; i < framesContainer.children.length - 1; ++i) {
		if (!framesContainer.children[i].isSameNode(divContainer)) continue;
		const leftPart = state.frames.slice(0, i);
		const rightPart = state.frames.slice(i + 1, undefined);
		leftPart.push(...rightPart);
		state.frames = leftPart;

		state.frameIndex = i;
		state.shouldClear = true;
		state.shouldDraw = true;

		framesContainer.removeChild(divContainer);
		framesState.canvas = framesContainer.children[i].firstChild;
		break;
	}
}

/**
 * Adds a new frame canvas to the canvas container
 * @param {Object} options
 * @param {HTMLElement | null} options.nodeToInsertBeforeOf
 * */
function addNewFrameCanvas({ nodeToInsertBeforeOf }) {
	const state = getState();
	const framesState = getFramesState();

	for (let c of framesContainer.children) {
		c.children[0].classList.remove("border-amber-300");
	}

	const canvasDiv = document.createElement("div");
	const canvas = document.createElement("canvas");
	const copyFrameBtn = document.createElement("button");
	const removeFrameBtn = document.createElement("button");

	canvasDiv.className = "w-full max-h-20";
	canvasDiv.appendChild(canvas);
	canvasDiv.appendChild(copyFrameBtn);
	canvasDiv.appendChild(removeFrameBtn);

	copyFrameBtn.innerHTML = copyIcon;
	copyFrameBtn.className =
		"relative left-[48px] -top-[70px] flex justify-center items-center bg-gray-900/65 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	removeFrameBtn.innerHTML = thrashIcon;
	removeFrameBtn.className =
		"relative left-[48px] -top-[52px] flex justify-center items-center bg-gray-900/50 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	copyFrameBtn.onclick = copyFrame;
	removeFrameBtn.onclick = removeFrame;

	canvas.classList.add("border-2", "border-amber-300");
	canvas.width = 70;
	canvas.height = 70;

	framesContainer.insertBefore(canvasDiv, nodeToInsertBeforeOf ?? addFrameBtn);

	canvas.onclick = (e) => {
		for (let div of framesContainer.children) {
			div.children[0].classList.remove("border-amber-300");
		}

		const c = e.currentTarget;
		c.classList.add("border-amber-300");

		for (let i = 0; i < framesContainer.children.length - 1; ++i) {
			const node = framesContainer.children[i];
			if (!node.firstChild || !node.firstChild.isSameNode(c)) continue;
			state.frameIndex = i;
			state.shouldClear = true;
			state.shouldDraw = true;
			framesState.canvas = c;
			break;
		}
	};

	return canvas;
}

export function settupFrames() {
	const framesState = getFramesState();

	const canvas = addNewFrameCanvas({ nodeToInsertBeforeOf: null });
	framesState.canvas = canvas;

	addFrameBtn.onclick = () => {
		const state = getState();
		const newLayer = createNewLayer();
		state.frames.push([newLayer]);
		state.frameIndex++;
		state.shouldClear = true;
		const c = addNewFrameCanvas({ nodeToInsertBeforeOf: null });
		framesState.canvas = c;
		framesContainer.scrollTop = framesContainer.scrollHeight;
	};
}
