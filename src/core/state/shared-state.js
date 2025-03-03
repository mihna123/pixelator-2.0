import { createNewLayer } from "../utils/helpers.js";

const layer = createNewLayer();

const state = {
	/**
	 * Main canvas where the pixels reside
	 * @type {HTMLCanvasElement}
	 * */
	canvas: document.getElementById("canvasElement"),
	/**
	 * Tool we are editing the selected layer with currently.
	 * @type {("pen"|"line"|"square"|"move"|"bucket"|"color")}
	 * */
	selectedTool: "pen",
	/**
	 * Color we are currently using to edit with
	 * @type {String}
	 * */
	selectedColor: document.getElementById("color-picker").value,
	/**
	 * Point to memorise where the user clicked. For example when moving we need
	 * to know where user clicked befre the move started
	 * @type {[number, number]}
	 * */
	pastClick: [0, 0],

	/** To know if the mouse is pressed for mousemove events */
	mousePressed: false,
	/** Index of the layer that we are currently editing */
	layerIndex: 0,
	/** All available layers */
	layers: [layer],
	/**
	 * Buffer where the last line is stored when using the line tool.
	 * This way we can remove line from selected layer on the next frame.
	 * @type {number[]}
	 * */
	pastTempLine: [],
	/**
	 * Buffer where the last square is stored when using the square tool.
	 * This way we can remove square from selected layer on the next frame.
	 * @type {number[]}
	 * */
	pastTempSquare: [],
	/** The buffer to remember state before changes */
	originalBuffer: [],
	/** To know if we are moving already. Mostly used for the moving tool */
	isMoving: false,
};

export function getState() {
	return state;
}

/**
 * Helper to retreive working layer
 * */
export function getWorkingLayer() {
	return state.layers[state.layerIndex];
}
