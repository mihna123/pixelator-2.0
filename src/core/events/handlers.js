import * as pen from "./tools/pen.js";
import * as line from "./tools/line.js";
import * as square from "./tools/square.js";
import * as bucket from "./tools/bucket.js";
import * as move from "./tools/move.js";
import * as color from "./tools/color.js";
import * as eraser from "./tools/eraser.js";
import * as highlight from "./tools/highlight.js";
import {
	getFramesState,
	getPreviewState,
	getState,
} from "../state/shared-state.js";

const toolHandlers = {
	pen,
	line,
	square,
	bucket,
	move,
	color,
	eraser,
};

export function setupEventListenets() {
	const state = getState();
	const framesState = getFramesState();
	const previewState = getPreviewState();

	state.canvas.addEventListener("mousedown", (e) => {
		toolHandlers[state.selectedTool].handleMouseDown(e);
		highlight.handleMouseDown();
	});
	state.canvas.addEventListener("mousemove", (e) => {
		toolHandlers[state.selectedTool].handleMouseMove(e);
		highlight.handleMouseMove(e);
	});
	document.addEventListener("mouseup", (e) => {
		toolHandlers[state.selectedTool].handleMouseUp(e);
		framesState.shouldClear = true;
		framesState.shouldDraw = true;
		previewState.shouldClear = true;
		previewState.shouldDraw = true;
	});
	document.addEventListener("mouseout", (e) => {
		toolHandlers[state.selectedTool].handleMouseUp(e);
	});
}
