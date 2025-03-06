import { PIXELS_X, PIXELS_Y } from "../state/config.js";

/**
 * Get a renderer object
 * @param {Object} state
 * */
export function initialiseRenderer(state) {
	return {
		draw: (layers) => {
			const ctx = state.canvas.getContext("2d");
			if (state.shouldClear) {
				ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
				state.shouldClear = false;
			}

			const pixelWidth = state.canvas.width / PIXELS_X;
			const pixelHeight = state.canvas.height / PIXELS_Y;

			if (state.shouldDraw) {
				for (const layer of layers) {
					for (let i = 0; i < PIXELS_X; ++i) {
						for (let j = 0; j < PIXELS_Y; ++j) {
							const color = layer[i][j].color;
							const fillX = i * pixelWidth;
							const fillY = j * pixelHeight;

							ctx.fillStyle = color;
							ctx.fillRect(
								fillX - 0.5,
								fillY - 0.5,
								pixelWidth + 0.5,
								pixelHeight + 0.5,
							);
						}
					}
				}
				state.shouldDraw = false;
			}
		},
		/**
		 * Returns a renderer that
		 * */
		animate: (frames) => {},
	};
}
