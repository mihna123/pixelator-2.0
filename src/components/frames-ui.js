import { getFramesState, getState } from "../core/state/shared-state.js";
import { createNewLayer } from "../core/utils/helpers.js";
import copyIcon from "../icons/copy-icon.js";
import downArrowIcon from "../icons/down-arrow-icon.js";
import thrashIcon from "../icons/thrash-icon.js";
import upArrowIcon from "../icons/up-arrow-icon.js";

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
	if (state.frames.length === 1) {
		alert("At least one frame must exist!");
		return;
	}

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

/** @param {MouseEvent} e */
function moveFrameUp(e) {
	e.stopPropagation();
	const state = getState();
	if (state.frames.length === 1) return;

	const framesState = getFramesState();

	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget;

	/** @type {HTMLDivElement} */
	const divContainer = btn.parentElement;

	// Skip the button as it is the last element
	for (let i = 0; i < framesContainer.children.length - 1; ++i) {
		if (!framesContainer.children[i].isSameNode(divContainer)) continue;
		if (i <= 0) return;
		//const leftPart = state.frames.slice(0, i);
		const leftPart = state.frames.slice(0, i - 1);
		//	const rightPart = state.frames.slice(i + 2, undefined);
		const rightPart = state.frames.slice(i + 1, undefined);
		const leftFrameCopy = JSON.parse(JSON.stringify(state.frames[i - 1]));
		const rightFrameCopy = JSON.parse(JSON.stringify(state.frames[i]));
		leftPart.push(rightFrameCopy, leftFrameCopy, ...rightPart);

		state.frames = leftPart;
		state.shouldClear = true;
		state.shouldDraw = true;
		state.frameIndex = i - 1;

		const firstDiv = framesContainer.children[i - 1];
		const secondDiv = framesContainer.children[i];

		framesState.canvas = secondDiv.firstChild;

		framesContainer.insertBefore(secondDiv, firstDiv);

		for (let c of framesContainer.children) {
			c.children[0].classList.remove("border-amber-300");
		}
		secondDiv.firstElementChild.classList.add("border-amber-300");

		break;
	}
}
/** @param {MouseEvent} e */
function moveFrameDown(e) {
	e.stopPropagation();
	const state = getState();
	if (state.frames.length === 1) return;

	const framesState = getFramesState();

	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget;

	/** @type {HTMLDivElement} */
	const divContainer = btn.parentElement;

	// Skip the button as it is the last element
	for (let i = 0; i < framesContainer.children.length - 1; ++i) {
		if (!framesContainer.children[i].isSameNode(divContainer)) continue;

		if (i >= state.frames.length - 1) return;

		const leftPart = state.frames.slice(0, i);
		const rightPart = state.frames.slice(i + 2, undefined);
		const leftFrameCopy = JSON.parse(JSON.stringify(state.frames[i]));
		const rightFrameCopy = JSON.parse(JSON.stringify(state.frames[i + 1]));
		leftPart.push(rightFrameCopy, leftFrameCopy, ...rightPart);

		state.frames = leftPart;
		state.shouldClear = true;
		state.shouldDraw = true;
		state.frameIndex = i + 1;

		const firstDiv = framesContainer.children[i];
		const secondDiv = framesContainer.children[i + 1];

		framesState.canvas = firstDiv.firstChild;

		framesContainer.insertBefore(secondDiv, firstDiv);

		for (let c of framesContainer.children) {
			c.children[0].classList.remove("border-amber-300");
		}
		firstDiv.firstElementChild.classList.add("border-amber-300");

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
	const frameUpBtn = document.createElement("button");
	const frameDownBtn = document.createElement("button");

	canvasDiv.className = "w-full max-h-20 overflow-y-clip";
	canvasDiv.appendChild(canvas);
	canvasDiv.appendChild(copyFrameBtn);
	canvasDiv.appendChild(removeFrameBtn);
	canvasDiv.appendChild(frameUpBtn);
	canvasDiv.appendChild(frameDownBtn);

	copyFrameBtn.innerHTML = copyIcon;
	copyFrameBtn.className =
		"relative left-[48px] -top-[70px] flex justify-center items-center bg-gray-900/50 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	removeFrameBtn.innerHTML = thrashIcon;
	removeFrameBtn.className =
		"relative left-[48px] -top-[52px] flex justify-center items-center bg-gray-900/50 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	frameUpBtn.innerHTML = upArrowIcon;
	frameUpBtn.className =
		"relative left-[2px] -top-[118px] flex justify-center items-center bg-gray-900/50 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	frameDownBtn.innerHTML = downArrowIcon;
	frameDownBtn.className =
		"relative left-[2px] -top-[100px] flex justify-center items-center bg-gray-900/50 text-white/65 hover:bg-gray-800 hover:text-white p-1";

	copyFrameBtn.onclick = copyFrame;
	removeFrameBtn.onclick = removeFrame;
	frameDownBtn.onclick = moveFrameDown;
	frameUpBtn.onclick = moveFrameUp;

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
