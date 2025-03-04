import {
	getPixelXY,
	clearLayer,
	getWorkingLayer,
} from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

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

	state.shouldDraw = true;

	const [col, row] = getPixelXY(e);
	if (col >= PIXELS_X || row >= PIXELS_Y) return;

	const workingLayer = getWorkingLayer();

	if (!state.isMoving) {
		// If first move, just capture state before moving
		state.isMoving = true;
		state.originalBuffer = workingLayer.map((row) =>
			row.map((pixel) => ({ ...pixel })),
		);
		return;
	}

	// Calculate movement delta from initial click position
	const [dx, dy] = [col - state.pastClick[0], row - state.pastClick[1]];

	// Clear selected layer
	clearLayer(workingLayer);

	// Copy moved layer to working layer
	for (let x = 0; x < PIXELS_X; ++x) {
		for (let y = 0; y < PIXELS_Y; ++y) {
			const newX = x + dx;
			const newY = y + dy;

			if (
				newX >= 0 &&
				newX < PIXELS_X &&
				newY >= 0 &&
				newY < PIXELS_Y &&
				state.originalBuffer[x][y].color !== "#0000"
			) {
				workingLayer[newX][newY] = { ...state.originalBuffer[x][y] };
			}
		}
	}
}

/**
 * Remove original buffer and set mousePressed and isMoving to false
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
	state.isMoving = false;
	state.originalBuffer = [];
}
