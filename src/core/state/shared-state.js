import { createNewLayer } from "../utils/helpers.js";

/**
 * @typedef {Object} Pixel
 * @property {String} color - Color of the pixel
 *
 * @typedef {Pixel[][]} PixelLayer
 *
 * @typedef {PixelLayer[]} Frame
 *
 * @typedef {Object} BufferState
 * @property {HTMLCanvasElement | null} canvas - Canvas where the renderer draws
 * @property {Boolean} shouldDraw - Tells the renderer if it should redraw on the next frame
 * @property {Boolean} shouldClear - Tells the renderer if it should clear the canvas on the next frame
 *
 *
 * @typedef {Object} EditableBufferState
 * @property {HTMLCanvasElement} canvas - Canvas where the renderer draws
 * @property {Boolean} shouldDraw - Tells the renderer if it should redraw on the next frame
 * @property {Boolean} shouldClear - Tells the renderer if it should clear the canvas on the next frame
 * @property {("pen"|"line"|"square"|"move"|"bucket"|"color"|"eraser")} selectedTool - Tool we are editing the selected layer currently
 * @property {String} selectedColor - Color we are currently using to edit with
 * @property {Number} selectedSize - Currently selected size used for some of the tools
 * @property {[number, number]} pastClick - Last pixel that was clicked on. Usefull for tools like like or rectangle
 * @property {Boolean} mousePressed - To know if the mouse is pressed for mousemove event handling
 * @property {Number} layerIndex - Index of the layer we are currently editing
 * @property {Number} frameIndex - Index of the frame we are currently editing
 * @property {Frame[]} frames - All available frames. One frame consists of multiple layers
 * @property {PixelLayer} highlightLayer - layer used only for highlights
 * @property {{x: number, y: number, color: String}[]} pastTempLine - Buffer where the last line is stored when using the line tool. Usefull for removing it on the next frame
 * @property {{x: number, y: number, color: String}[]} pastTempSquare - Buffer where the last rectangle is stored when using the square tool. Usefull for removing it on the next frame
 * @property {number[]} originalBuffer - Buffer to remember the state before some changes were made. Used mainly for move tool
 * @property {Boolean} isMoving - To know if we are moving already. Mostly used for the moving tool
 * */

const layer = createNewLayer();
const highlightLayer = createNewLayer();

/** @type {EditableBufferState} */
const state = {
	canvas: document.getElementById("canvasElement"),
	shouldDraw: false,
	selectedTool: "pen",
	selectedColor: document.getElementById("color-picker").value,
	selectedSize: 0,
	pastClick: [0, 0],
	mousePressed: false,
	layerIndex: 0,
	frameIndex: 0,
	frames: [[layer]],
	highlightLayer,
	pastTempLine: [],
	pastTempSquare: [],
	originalBuffer: [],
	isMoving: false,
	shouldClear: false,
};

/** @type {BufferState} */
const framesState = {
	canvas: null,
	shouldDraw: false,
	shouldClear: false,
};

/** @type {BufferState} */
const previewState = {
	canvas: document.getElementById("preview-canvas"),
	shouldDraw: false,
	shouldClear: false,
};

/**
 * Function to return the buffer state used for the main drawable canvas
 * */
export function getState() {
	return state;
}

export function getFramesState() {
	return framesState;
}

export function getPreviewState() {
	return previewState;
}
