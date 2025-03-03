/**
 * Calculates a line between two points and returns the pixel array
 *
 * @param {Numver} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns {Number[][]}
 * */
export function calculateLine(x1, y1, x2, y2) {
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
export function calculateRectangle(x1, y1, x2, y2) {
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
