import { PIXELS_X, PIXELS_Y } from "../state/config.js";

/**
 * Util that takes the canvas element and downloads the blob
 * @param {{color: Stinrg}[][][]} layers
 * */
export function exportLayers(layers) {
	const exportCanvas = document.createElement("canvas");
	exportCanvas.width = PIXELS_X;
	exportCanvas.height = PIXELS_Y;
	const ctx = exportCanvas.getContext("2d");
	for (const layer of layers) {
		for (let i = 0; i < PIXELS_X; ++i) {
			for (let j = 0; j < PIXELS_Y; ++j) {
				ctx.fillStyle = layer[i][j].color;
				ctx.fillRect(i, j, 1, 1);
			}
		}
	}

	const downloadAnchor = document.createElement("a");
	exportCanvas.toBlob((blob) => {
		const blobUrl = URL.createObjectURL(blob);
		downloadAnchor.href = blobUrl;
		downloadAnchor.download = "untitled-pixelator";
		downloadAnchor.click();
		URL.revokeObjectURL(blobUrl);
	});
	exportCanvas.remove();
	downloadAnchor.remove();
}

/**
 * Util function that downloads all the frames of the animation
 * @param {import("../state/shared-state.js").Frame[]} frames
 * */
export function exportFrames(frames) {
	const exportCanvas = document.createElement("canvas");
	exportCanvas.width = PIXELS_X * frames.length;
	exportCanvas.height = PIXELS_Y;
	const ctx = exportCanvas.getContext("2d");
	for (let frameInd = 0; frameInd < frames.length; frameInd++) {
		const frame = frames[frameInd];
		for (const layer of frame) {
			for (let i = 0; i < PIXELS_X; ++i) {
				for (let j = 0; j < PIXELS_Y; ++j) {
					ctx.fillStyle = layer[i][j].color;
					ctx.fillRect(i + frameInd * PIXELS_X, j, 1, 1);
				}
			}
		}
	}
	const downloadAnchor = document.createElement("a");
	exportCanvas.toBlob((blob) => {
		const blobUrl = URL.createObjectURL(blob);
		downloadAnchor.href = blobUrl;
		downloadAnchor.download = "untitled-pixelator";
		downloadAnchor.click();
		URL.revokeObjectURL(blobUrl);
	});
	exportCanvas.remove();
	downloadAnchor.remove();
}
