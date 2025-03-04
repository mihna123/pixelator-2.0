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
 * Function that will only color in one pixel under mouse, or more based on
 * brush size
 * @param {MouseEvent} e
 * */
function colorPixelUnderMouse(e) {
	const [col, row] = getPixelXY(e);
	if (col >= PIXELS_X || row >= PIXELS_Y) return;

	const state = getState();
	const workingLayer = getWorkingLayer();
	const pixelsToDraw = [];
	switch (state.selectedSize) {
		case 0:
			safePush(pixelsToDraw, [col, row]);
			break;
		case 1:
			pixelsToDraw.push(...getArrayForSizeOne(col, row));
			break;
		case 2:
			pixelsToDraw.push(...getArrayForSizeTwo(col, row));
			break;
		case 3:
			pixelsToDraw.push(...getArrayForSizeThree(col, row));
			break;
	}
	for (const [x, y] of pixelsToDraw) {
		workingLayer[x][y].color = state.selectedColor;
	}
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const state = getState();
	state.mousePressed = true;
	state.shouldDraw = true;
	colorPixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (!state.mousePressed) return;

	state.shouldDraw = true;
	colorPixelUnderMouse(e);
}

/**
 * @param {MouseEvent} e
 * */
export function handleMouseUp() {
	const state = getState();
	state.mousePressed = false;
}
