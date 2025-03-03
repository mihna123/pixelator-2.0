import {
	PIXELS_X,
	PIXELS_Y,
	PIXEL_HEIGHT,
	PIXEL_WIDTH,
} from "../state/config.js";

/**
 * Get a renderer object
 * @param {HTMLCanvasElement} canvas
 * */
export function initialiseRenderer(canvas) {
	const ctx = canvas.getContext("2d");

	return {
		draw: (layers) => {
			for (const layer of layers) {
				for (let i = 0; i < PIXELS_X; ++i) {
					for (let j = 0; j < PIXELS_Y; ++j) {
						const fillX = i * PIXEL_WIDTH;
						const fillY = j * PIXEL_HEIGHT;
						ctx.fillStyle = layer[i][j].color;
						ctx.fillRect(fillX, fillY, PIXEL_WIDTH, PIXEL_HEIGHT);
					}
				}
			}
		},
	};
}
