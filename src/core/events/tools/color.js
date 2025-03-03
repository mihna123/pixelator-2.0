import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

/**
 * Take the color under the mouse
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const [x, y] = getPixelXY(e);
	if (x >= PIXELS_X || y >= PIXELS_Y) return;

	const state = getState();
	const workingLayer = getWorkingLayer();

	const color = workingLayer[x][y].color;
	const colorPicker = document.getElementById("color-picker");
	colorPicker.value = color;
	state.selectedColor = color;
}

/**
 * NOOP
 * */
export function handleMouseMove() {
	return;
}

/**
 * NOOP
 * */
export function handleMouseUp() {
	return;
}
