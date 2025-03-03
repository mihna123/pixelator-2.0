import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";
import { calculateRectangle } from "../../utils/geometry.js";

/**
 * Remember the past click on mouse down
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	const [x, y] = getPixelXY(e);
	if (x >= PIXELS_X || y >= PIXELS_Y) return;
	state.pastClick = [x, y];
}

/**
 * Draw a rectangle between pastClick and current mouse coordinates
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;

	const [col, row] = getPixelXY(e);
	if (col >= PIXELS_X || row >= PIXELS_Y) return;

	const workingLayer = getWorkingLayer();

	// Generate a new square
	const square = calculateRectangle(...state.pastClick, col, row);

	// Remove the old square
	if (state.pastTempSquare.length > 0) {
		for (const { x, y, color } of state.pastTempSquare) {
			workingLayer[x][y].color = color;
		}
	}
	state.shouldClear = true;
	// Draw the new square and memorise it for removal
	state.pastTempSquare = square.map(([x, y]) => {
		const color = workingLayer[x][y].color;
		workingLayer[x][y].color = state.selectedColor;
		return { x, y, color };
	});
}

/**
 * Remove temp square and set mousePressed to false
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
	state.pastTempSquare = [];
}
