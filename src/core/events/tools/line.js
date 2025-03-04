import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";
import { calculateLine } from "../../utils/geometry.js";

/**
 * Remember the past click on mouse down
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	state.shouldDraw = true;
	const [x, y] = getPixelXY(e);
	if (x >= PIXELS_X || y >= PIXELS_Y) return;
	state.pastClick = [x, y];
}

/**
 * Draw a line between pastClick and current mouse coordinates
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;

	state.shouldDraw = true;

	const [col, row] = getPixelXY(e);
	if (col >= PIXELS_X || row >= PIXELS_Y) return;

	const workingLayer = getWorkingLayer();

	// Generate a new line
	const line = calculateLine(...state.pastClick, col, row);

	// Remove the old line
	if (state.pastTempLine.length > 0) {
		for (const { x, y, color } of state.pastTempLine) {
			workingLayer[x][y].color = color;
		}
	}
	state.pastTempLine = [];
	state.shouldClear = true;

	// Draw the new line and memorise it for removal
	for (const [x, y] of line) {
		state.pastTempLine.push({ x, y, color: workingLayer[x][y].color });
		workingLayer[x][y].color = state.selectedColor;
	}
}

/**
 * Remove temp line and set mousePressed to false
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
	state.pastTempLine = [];
}
