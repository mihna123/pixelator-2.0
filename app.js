/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvasElement");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {HTMLButtonElement} */
const blueBrush = document.getElementById("blue-brush");

/** @type {HTMLButtonElement} */
const redBrush = document.getElementById("red-brush");

/** @type {HTMLButtonElement} */
const whiteBrush = document.getElementById("white-brush");

/** @type {HTMLButtonElement} */
const blackBrush = document.getElementById("black-brush");

/** @type {HTMLButtonElement} */
const penTool = document.getElementById("pen-tool");

/** @type {HTMLButtonElement} */
const lineTool = document.getElementById("line-tool");

/** @type {HTMLButtonElement} */
const squareTool = document.getElementById("square-tool");

/**
 * Number of pixels is the x axis
 * */
const PIXELS_X = 30;
/**
 * Number of pixels in the y axis
 * */
const PIXELS_Y = 30;

/**
 * Actual width of each pixel
 * */
const PIXEL_WIDTH = Number(canvas.width) / PIXELS_X;
/**
 * Actual height of each pixel
 * */
const PIXELS_HEIGHT = Number(canvas.height) / PIXELS_Y;

const layer = createNewLayer();
setInterval(() => {
	draw([layer]);
}, 50);

// Utility functions and variables

let mousePressed = false;
let selectedLayer = layer;
let selectedColor = "#000000";
let selectedTool = "pen";
const pastClick = [0, 0];
let pastTempLine = [];
let pastTempSquare = [];

/**
 * @param {any[][][]} layers
 * */
function draw(layers) {
	for (const layer of layers) {
		for (let i = 0; i < PIXELS_X; ++i) {
			for (let j = 0; j < PIXELS_Y; ++j) {
				const fillX = i * PIXEL_WIDTH;
				const fillY = j * PIXELS_HEIGHT;
				ctx.fillStyle = layer[i][j].color;
				ctx.fillRect(fillX, fillY, PIXEL_WIDTH, PIXELS_HEIGHT);
			}
		}
	}
}

function createNewLayer() {
	const layer = [];
	for (let i = 0; i < PIXELS_X; ++i) {
		layer.push([]);
		for (let j = 0; j < PIXELS_Y; ++j) {
			layer[i][j] = {};
			layer[i][j].color = "#ffffff";
		}
	}
	return layer;
}

// Mouse event helpers

/**
 * @param {MouseEvent} e
 * */
function onMouseDown(e) {
	mousePressed = true;
	switch (selectedTool) {
		case "pen":
			colorPixelUnderMouse(e);
			break;
		case "line":
			memorisePastClick(e);
			break;
		case "square":
			memorisePastClick(e);
			break;
	}
}

/**
 * @param {MouseEvent} e
 * */
function onMouseUp(e) {
	mousePressed = false;
	pastTempLine = [];
	pastTempSquare = [];
}

/**
 * @param {MouseEvent} e
 * */
function onMouseMove(e) {
	if (!mousePressed) {
		return;
	}
	switch (selectedTool) {
		case "pen":
			colorPixelUnderMouse(e);
			break;
		case "line":
			colorLineUnderMouse(e);
			break;
		case "square":
			colorSquareUnderMouse(e);
			break;
	}
}

/**
 * Calculates a line between two points and returns the pixel array
 *
 * @param {Numver} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {Number[][]}
 * */
function calculateLine(x1, y1, x2, y2) {
	const points = [];
	const dx = Math.abs(x2 - x1);
	const dy = Math.abs(y2 - y1);
	const sx = x1 < x2 ? 1 : -1;
	const sy = y1 < y2 ? 1 : -1;
	let err = dx - dy;

	while (true) {
		points.push([x1, y1]);
		if (x1 === x2 && y1 === y2) break;
		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x1 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y1 += sy;
		}
	}
	return points;
}

/**
 * Calculates a square between two points and returns the pixel array
 *
 * @param {Numver} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {Number[][]}
 * */
function calculateRectangle(x1, y1, x2, y2) {
	// Ensure proper ordering of coordinates
	const minX = Math.min(x1, x2);
	const maxX = Math.max(x1, x2);
	const minY = Math.min(y1, y2);
	const maxY = Math.max(y1, y2);

	// Calculate all four sides including endpoints
	const top = calculateLine(minX, maxY, maxX, maxY); // →
	const right = calculateLine(maxX, maxY, maxX, minY); // ↓
	const bottom = calculateLine(maxX, minY, minX, minY); // ←
	const left = calculateLine(minX, minY, minX, maxY); // ↑

	// Remove duplicate points at corners
	return [...top, ...right.slice(1), ...bottom.slice(1), ...left.slice(1)];
}
/**
 * @param {MouseEvent} e
 * */
function colorPixelUnderMouse(e) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXELS_HEIGHT);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;
	selectedLayer[pixelX][pixelY].color = selectedColor;
}

/**
 * @param {MouseEvent} e
 * */
function memorisePastClick(e) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXELS_HEIGHT);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;
	pastClick[0] = pixelX;
	pastClick[1] = pixelY;
}

/**
 * @param {MouseEvent} e
 * */
function colorLineUnderMouse(e) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXELS_HEIGHT);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	// Generate a new line
	const line = calculateLine(...pastClick, pixelX, pixelY);

	// Remove the old line
	if (pastTempLine.length > 0) {
		for (const { x, y, color } of pastTempLine) {
			selectedLayer[x][y].color = color;
		}
	}
	pastTempLine = [];

	// Draw the new line and memorise it for removal
	for (const [x, y] of line) {
		pastTempLine.push({ x, y, color: selectedLayer[x][y].color });
		selectedLayer[x][y].color = selectedColor;
	}
}

/**
 * @param {MouseEvent} e
 * */
function colorSquareUnderMouse(e) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXELS_HEIGHT);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	// Generate a new line
	const square = calculateRectangle(...pastClick, pixelX, pixelY);

	// Remove the old square
	if (pastTempSquare.length > 0) {
		for (const { x, y, color } of pastTempSquare) {
			selectedLayer[x][y].color = color;
		}
	}
	pastTempSquare = [];

	// Draw the new square and memorise it for removal
	for (const [x, y] of square) {
		pastTempSquare.push({ x, y, color: selectedLayer[x][y].color });
		selectedLayer[x][y].color = selectedColor;
	}
}

// Event listeners

document.addEventListener("mouseup", onMouseUp);
document.addEventListener("mouseout", onMouseUp);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);

function toggleToolClass() {
	for (var tool of [penTool, lineTool, squareTool]) {
		tool.classList.remove("bg-gray-400");
		tool.classList.add("bg-gray-300");
	}
}

penTool.onclick = () => {
	selectedTool = "pen";
	toggleToolClass();
	penTool.classList.add("bg-gray-400");
};

lineTool.onclick = () => {
	selectedTool = "line";
	toggleToolClass();
	lineTool.classList.add("bg-gray-400");
};
squareTool.onclick = () => {
	selectedTool = "square";
	toggleToolClass();
	squareTool.classList.add("bg-gray-400");
};

blueBrush.onclick = () => (selectedColor = "#4a7fb5");
redBrush.onclick = () => (selectedColor = "#b54a4a");
whiteBrush.onclick = () => (selectedColor = "#ffffff");
blackBrush.onclick = () => (selectedColor = "#000000");
