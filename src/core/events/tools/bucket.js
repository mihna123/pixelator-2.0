import { getPixelXY, getWorkingLayer } from "../../utils/helpers.js";
import { PIXELS_X, PIXELS_Y } from "../../state/config.js";
import { getState } from "../../state/shared-state.js";

/**
 * Fill the working layer with color using Queue linear Flood-fill alghorithm
 * @param {MouseEvent} e
 * */
export function handleMouseDown(e) {
	const [x, y] = getPixelXY(e);
	if (x >= PIXELS_X || y >= PIXELS_Y) return;

	const state = getState();
	const workingLayer = getWorkingLayer();

	// Color that we want to change into replacement color (selectedColor)
	const targetColor = workingLayer[x][y].color;
	// If the color that we want to change is the same as selected, nothing to do here then
	if (targetColor === state.selectedColor) return;

	const q = [[x, y]];

	while (q.length > 0) {
		const [col, row] = q.pop();
		// if not target, continue onto the next
		if (workingLayer[col][row].color !== targetColor) continue;
		// Color node
		workingLayer[col][row].color = state.selectedColor;
		// North node
		let n = row - 1;
		// South node
		let s = row + 1;
		if (n >= 0) {
			q.push([col, n]);
		}

		if (s < PIXELS_Y) {
			q.push([col, s]);
		}
		// West node
		let w = col - 1;
		while (workingLayer[w][row].color === targetColor) {
			workingLayer[w][row].color = state.selectedColor;
			if (row - 1 >= 0) {
				q.push([w, row - 1]);
			}
			if (row + 1 < PIXELS_Y) {
				q.push([w, row + 1]);
			}
			--w;
			if (w < 0) break;
		}
		// East node
		let e = col + 1;
		while (workingLayer[e][row].color === targetColor) {
			workingLayer[e][row].color = state.selectedColor;
			if (row - 1 >= 0) {
				q.push([e, row - 1]);
			}
			if (row + 1 < PIXELS_Y) {
				q.push([e, row + 1]);
			}
			++e;
			if (e >= PIXELS_X) break;
		}
	}
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
