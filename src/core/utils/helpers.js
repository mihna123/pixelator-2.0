import {
	PIXELS_X,
	PIXELS_Y,
	PIXEL_WIDTH,
	PIXEL_HEIGHT,
} from "../state/config.js";
import { getState } from "../state/shared-state.js";

/**
 * Helper function that checks if coordinates are valid before pushing
 * */
export function safePush(array, [x, y]) {
	if (x < 0 || x >= PIXELS_X || y < 0 || y > PIXELS_Y) return;
	array.push([x, y]);
}

/**
 * Get mouse coordinates in pixels
 * @param {MouseEvent} e
 * */
export function getPixelXY(e) {
	const state = getState();
	const canvasRect = state.canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXEL_HEIGHT);
	return [pixelX, pixelY];
}

/** Helper function to clear a layer */
export function clearLayer(layer) {
	const state = getState();
	state.shouldClear = true;

	for (let i = 0; i < PIXELS_X; i++) {
		for (let j = 0; j < PIXELS_Y; j++) {
			layer[i][j] = { color: "#0000" }; // Or appropriate empty value
		}
	}
}
/** Helper function to create a new layer */
export function createNewLayer() {
	/** @type {import("../state/shared-state.js").PixelLayer} */
	const layer = [];
	for (let i = 0; i < PIXELS_X; ++i) {
		layer.push([]);
		for (let j = 0; j < PIXELS_Y; ++j) {
			layer[i][j] = {};
			layer[i][j].color = "#0000";
		}
	}
	return layer;
}

/**
 * Helper to retreive working layer
 * */
export function getWorkingLayer() {
	const state = getState();
	return state.frames[state.frameIndex][state.layerIndex];
}

/**
 * Helper function to calculate surounding pixels affected by size 1
 * */
export function getArrayForSizeOne(x, y) {
	const ret = [];
	safePush(ret, [x, y]);
	safePush(ret, [x - 1, y]);
	safePush(ret, [x - 1, y - 1]);
	safePush(ret, [x, y - 1]);
	return ret;
}

/**
 * Helper function to calculate surounding pixels affected by size 2
 * */
export function getArrayForSizeTwo(x, y) {
	const ret = [];
	for (let i = -1; i < 2; ++i) {
		for (let j = -1; j < 2; ++j) {
			safePush(ret, [x + i, y + j]);
		}
	}
	return ret;
}

/**
 * Helper function to calculate surounding pixels affected by size 3
 * */
export function getArrayForSizeThree(x, y) {
	const ret = [];
	for (let i = -2; i < 2; ++i) {
		for (let j = -2; j < 2; ++j) {
			safePush(ret, [x + i, y + j]);
		}
	}
	return ret;
}
