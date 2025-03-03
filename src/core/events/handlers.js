import * as pen from "./tools/pen.js";
import * as line from "./tools/line.js";
import * as square from "./tools/square.js";
import * as bucket from "./tools/bucket.js";
import * as move from "./tools/move.js";
import * as color from "./tools/color.js";
import * as eraser from "./tools/eraser.js";
import { getState } from "../state/shared-state.js";

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

	state.canvas.addEventListener("mousedown", (e) => {
		toolHandlers[state.selectedTool].handleMouseDown(e);
	});
	state.canvas.addEventListener("mousemove", (e) => {
		toolHandlers[state.selectedTool].handleMouseMove(e);
	});
	document.addEventListener("mouseup", (e) => {
		toolHandlers[state.selectedTool].handleMouseUp(e);
	});
	document.addEventListener("mouseout", (e) => {
		toolHandlers[state.selectedTool].handleMouseUp(e);
	});
}
