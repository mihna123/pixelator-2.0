import {
	PIXELS_X,
	PIXELS_Y,
	PIXEL_HEIGHT,
	PIXEL_WIDTH,
} from "../state/config.js";
import { getState } from "../state/shared-state.js";

/**
 * Get a renderer object
 * @param {HTMLCanvasElement} canvas
 * */
export function initialiseRenderer(canvas) {
	const ctx = canvas.getContext("2d");

	return {
		draw: (layers) => {
			const state = getState();
			if (state.shouldClear) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				state.shouldClear = false;
			}

			if (state.shouldDraw) {
				for (const layer of [...layers, state.highlightLayer]) {
					for (let i = 0; i < PIXELS_X; ++i) {
						for (let j = 0; j < PIXELS_Y; ++j) {
							const color = layer[i][j].color;
							const fillX = i * PIXEL_WIDTH;
							const fillY = j * PIXEL_HEIGHT;

							ctx.fillStyle = color;
							ctx.fillRect(fillX, fillY, PIXEL_WIDTH, PIXEL_HEIGHT);
						}
					}
				}
				state.shouldDraw = false;
			}
		},
	};
}
