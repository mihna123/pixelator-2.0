import { getState } from "../../state/shared-state.js";
import {
	clearLayer,
	getPixelXY,
	safePush,
	getArrayForSizeOne,
	getArrayForSizeTwo,
	getArrayForSizeThree,
} from "../../utils/helpers.js";

/**
 * @param {MouseEvent} e
 * */
export function handleMouseDown() {
	const state = getState();
	clearLayer(state.highlightLayer);
	state.shouldDraw = true;
	return;
}

/**
 * @param {MouseEvent} e
 * NOOP
 * */
export function handleMouseUp() {
	return;
}
/**
 * @param {MouseEvent} e
 * */
export function handleMouseMove(e) {
	const state = getState();
	if (state.mousePressed) return;

	const [col, row] = getPixelXY(e);
	clearLayer(state.highlightLayer);
	// TODO: get the inverse color from working layer bc of white

	const pixelsToDraw = [];
	if (state.selectedTool === "pen" || state.selectedTool === "eraser") {
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
	} else {
		safePush(pixelsToDraw, [col, row]);
	}
	for (const [x, y] of pixelsToDraw) {
		// If already highlighted do nothing
		state.highlightLayer[x][y].color = "#ffffff77";
	}
	state.shouldDraw = true;
	return;
}
