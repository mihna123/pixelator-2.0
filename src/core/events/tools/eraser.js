import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

/**
 * Function that remove one pixel under mouse
 * @param {MouseEvent} e
 * */
function removePixelUnderMouse(e) {
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	const state = getState();
	const workingLayer = getWorkingLayer();

	workingLayer[pixelX][pixelY].color = "#0000";
	state.shouldClear = true;
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	removePixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;
	removePixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
}
