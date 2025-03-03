import {
	PIXELS_X,
	PIXELS_Y,
	PIXEL_WIDTH,
	PIXEL_HEIGHT,
} from "../state/config.js";
import { getState } from "../state/shared-state.js";

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
	return state.layers[state.layerIndex];
}
