/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvasElement");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {HTMLInputElement} */
const colorPicker = document.getElementById("color-picker");

/** @type {HTMLButtonElement} */
const penTool = document.getElementById("pen-tool");

/** @type {HTMLButtonElement} */
const lineTool = document.getElementById("line-tool");

/** @type {HTMLButtonElement} */
const squareTool = document.getElementById("square-tool");

/** @type {HTMLButtonElement} */
const moveTool = document.getElementById("move-tool");

/** @type {HTMLButtonElement} */
const bucketTool = document.getElementById("bucket-tool");

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
const layers = [layer];
setInterval(() => {
	draw(layers);
}, 50);

// Utility functions and variables

/** To know if the mouse is pressed for mousemove events */
let mousePressed = false;

/** Layer that we are currently editing */
let selectedLayer = layer;

/** Color we are currently using to edit with */
let selectedColor = colorPicker.value;

/**
 * Tool we are editing the selected layer with currently.
 * @type {("pen"|"line"|"square"|"move"|"bucket")}
 * */
let selectedTool = "pen";

/**
 * Point to memorise where the user clicked. For example when moving we need
 * to know where user clicked befre the move started
 * @type {[number, number]}
 * */
const pastClick = [0, 0];

/**
 * Buffer where the last line is stored when using the line tool.
 * This way we can remove line from selected layer on the next frame.
 * @type {number[]}
 * */
let pastTempLine = [];

/**
 * Buffer where the last square is stored when using the square tool.
 * This way we can remove square from selected layer on the next frame.
 * @type {number[]}
 * */
let pastTempSquare = [];

/** The buffer to remember state before changes */
let originalBuffer = [];

/** To know if we are moving already. Mostly used for the moving tool */
let isMoving = false;

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
		case "move":
			memorisePastClick(e);
			break;
		case "bucket":
			paintPixelsInColorArea(e);
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
	if (selectedTool === "move") {
		isMoving = false;
		originalBuffer = [];
	}
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
		case "move":
			movePixelsUnderMouse(e);
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
	const rect = [
		...top.slice(1),
		...right.slice(1),
		...bottom.slice(1),
		...left.slice(1),
	];
	return rect;
}
/**
 * @param {MouseEvent} e
 * */
function colorPixelUnderMouse(e) {
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;
	selectedLayer[pixelX][pixelY].color = selectedColor;
}

/**
 * @param {MouseEvent} e
 * */
function memorisePastClick(e) {
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;
	pastClick[0] = pixelX;
	pastClick[1] = pixelY;
}

/**
 * @param {MouseEvent} e
 * */
function colorLineUnderMouse(e) {
	const [pixelX, pixelY] = getPixelXY(e);
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
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	// Generate a new square
	const square = calculateRectangle(...pastClick, pixelX, pixelY);

	// Remove the old square
	if (pastTempSquare.length > 0) {
		for (const { x, y, color } of pastTempSquare) {
			selectedLayer[x][y].color = color;
		}
	}

	// Draw the new square and memorise it for removal
	pastTempSquare = square.map(([x, y]) => {
		const color = selectedLayer[x][y].color;
		selectedLayer[x][y].color = selectedColor;
		return { x, y, color };
	});
}

/**
 *  Queue linear Flood-fill (node, target-color, replacement-color):
 *   1. Set Q to the empty queue.
 *   2. If the color of node is not equal to target-color, return.
 *   3. Add node to Q.
 *   4. For each element n of Q:
 *   5.     If the color of n is equal to target-color:
 *   6.         Set w and e equal to n.
 *   7.         Move w to the west until the color of the node to the west of w no longer matches target-color.
 *   8.         Move e to the east until the color of the node to the east of e no longer matches target-color.
 *   9.         Set the color of nodes between w and e to replacement-color.
 *  10.         For each node n between w and e:
 *  11.             If the color of the node to the north of n is target-color, add that node to Q.
 *  12.             If the color of the node to the south of n is target-color, add that node to Q.
 *  13. Continue looping until Q is exhausted.
 *  14. Return.
 *  @param {MouseEvent} event
 */
function paintPixelsInColorArea(event) {
	const [x, y] = getPixelXY(event);
	if (x >= PIXELS_X || y >= PIXELS_Y) return;

	// Color that we want to change into replacement color (selectedColor)
	const targetColor = selectedLayer[x][y].color;
	// If the color that we want to change is the same as selected, nothing to do here then
	if (targetColor === selectedColor) return;

	const q = [[x, y]];

	while (q.length > 0) {
		const [col, row] = q.pop();
		// if not target, continue onto the next
		if (selectedLayer[col][row].color !== targetColor) continue;
		// Color node
		selectedLayer[col][row].color = selectedColor;
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
		while (selectedLayer[w][row].color === targetColor) {
			selectedLayer[w][row].color = selectedColor;
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
		while (selectedLayer[e][row].color === targetColor) {
			selectedLayer[e][row].color = selectedColor;
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
 * Moves the selected layer's pixels based on mouse movement
 * @param {MouseEvent} e
 */
function movePixelsUnderMouse(e) {
	const [pixelX, pixelY] = getPixelXY(e);
	if (pixelX >= PIXELS_X || pixelY >= PIXELS_Y) return;

	if (!isMoving) {
		// If first move, just capture state before moving
		isMoving = true;
		originalBuffer = selectedLayer.map((row) =>
			row.map((pixel) => ({ ...pixel })),
		);
		return;
	}

	// Calculate movement delta from initial click position
	const [dx, dy] = [pixelX - pastClick[0], pixelY - pastClick[1]];

	// Clear selected layer
	clearLayer(selectedLayer);
	for (let x = 0; x < PIXELS_X; ++x) {
		for (let y = 0; y < PIXELS_Y; ++y) {
			const newX = x + dx;
			const newY = y + dy;

			if (
				newX >= 0 &&
				newX < PIXELS_X &&
				newY >= 0 &&
				newY < PIXELS_Y &&
				originalBuffer[x][y].color !== "#ffffff"
			) {
				selectedLayer[newX][newY] = { ...originalBuffer[x][y] };
			}
		}
	}
}

/** Helper function to clear a layer */
function clearLayer(layer) {
	for (let i = 0; i < PIXELS_X; i++) {
		for (let j = 0; j < PIXELS_Y; j++) {
			layer[i][j] = { color: "#ffffff" }; // Or appropriate empty value
		}
	}
}
/**
 * @param {MouseEvent} e
 * */
function getPixelXY(e) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasX = e.x - canvasRect.x;
	const canvasY = e.y - canvasRect.y;
	const pixelX = Math.floor(canvasX / PIXEL_WIDTH);
	const pixelY = Math.floor(canvasY / PIXELS_HEIGHT);
	return [pixelX, pixelY];
}

// Event listeners

document.addEventListener("mouseup", onMouseUp);
document.addEventListener("mouseout", onMouseUp);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);

function toggleToolClass() {
	for (var tool of [penTool, lineTool, squareTool, moveTool, bucketTool]) {
		tool.classList.remove("bg-gray-400");
		tool.classList.add("bg-gray-300");
	}
}

/** @param {Event} e */
colorPicker.onchange = (e) => {
	selectedColor = e.target.value;
};

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

moveTool.onclick = () => {
	selectedTool = "move";
	toggleToolClass();
	moveTool.classList.add("bg-gray-400");
};

bucketTool.onclick = () => {
	selectedTool = "bucket";
	toggleToolClass();
	bucketTool.classList.add("bg-gray-400");
};
