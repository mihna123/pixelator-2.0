import {
	getPixelXY,
	getWorkingLayer,
	safePush,
	getArrayForSizeOne,
	getArrayForSizeTwo,
	getArrayForSizeThree,
} from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

/**
 * Function that remove one pixel under mouse
 * @param {MouseEvent} e
 * */
function removePixelUnderMouse(e) {
	const [col, row] = getPixelXY(e);
	if (col >= PIXELS_X || row >= PIXELS_Y) return;

	state.shouldDraw = true;

	const state = getState();
	const workingLayer = getWorkingLayer();
	const pixelsToRemove = [];
	switch (state.selectedSize) {
		case 0:
			safePush(pixelsToRemove, [col, row]);
			break;
		case 1:
			pixelsToRemove.push(...getArrayForSizeOne(col, row));
			break;
		case 2:
			pixelsToRemove.push(...getArrayForSizeTwo(col, row));
			break;
		case 3:
			pixelsToRemove.push(...getArrayForSizeThree(col, row));
			break;
	}
	for (const [x, y] of pixelsToRemove) {
		workingLayer[x][y].color = "#0000";
	}

	state.shouldClear = true;
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	state.shouldDraw = true;
	removePixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;
	state.shouldDraw = true;
	removePixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
}
