import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

/**
 * Function that will only color in one pixel under mouse
 * @param {MouseEvent} e
 * */
function colorPixelUnderMouse(e) {
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	const state = getState();
	const workingLayer = getWorkingLayer();

	workingLayer[pixelX][pixelY].color = state.selectedColor;
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	colorPixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;
	colorPixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
}
